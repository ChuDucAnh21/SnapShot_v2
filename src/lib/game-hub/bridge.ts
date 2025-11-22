/**
 * GameBridge - Core class để mount và giao tiếp với game
 * Hỗ trợ 2 runtimes: iframe-html và esm-module
 */

import type {
  GameEvent,
  GameManifest,
  HostCommand,
  IrukaGameInstance,
  IrukaHost,
  LaunchContext,
  MsgEnvelope,
} from './protocol';
import { loadProgress, saveProgress } from './progress';
import { SDK_VERSION } from './protocol';
import { getAllowAttributes, getAllowedOrigins, getSandboxAttributes, isOriginAllowed } from './security';
import { pushTelemetry } from './telemetry';

export type GameEventHandler = (event: GameEvent) => void;

export type GameBridgeOptions = {
  manifest: GameManifest;
  context: LaunchContext;
  onEvent?: GameEventHandler;
  container?: HTMLElement;
};

/**
 * GameBridge - Quản lý lifecycle và communication với game
 */
export class GameBridge {
  private iframe?: HTMLIFrameElement;
  private moduleApi?: IrukaGameInstance;
  private disposeFns: Array<() => void> = [];
  private messageHandler?: (e: MessageEvent) => void;
  private isReady = false;
  private isStarted = false;

  constructor(private options: GameBridgeOptions) {}

  /**
   * Resolve a possibly relative URL to an absolute URL using current origin
   */
  private resolveToAbsoluteUrl(url: string): string {
    try {
      // If url is absolute, this returns as-is; if relative, it is resolved against current origin
      return new URL(url, window.location.origin).href;
    } catch {
      return url;
    }
  }

  /**
   * Mount game vào container
   */
  async mount(container: HTMLElement): Promise<void> {
    const { manifest } = this.options;

    if (manifest.runtime === 'iframe-html') {
      await this.mountIframe(container);
    } else if (manifest.runtime === 'esm-module') {
      await this.mountEsm(container);
    } else {
      throw new Error(`Unsupported runtime: ${manifest.runtime}`);
    }
  }

  /**
   * Dispose game và cleanup resources
   */
  dispose(): void {
    // Call all cleanup functions
    this.disposeFns.forEach(fn => fn());
    this.disposeFns = [];

    // Remove iframe
    if (this.iframe) {
      this.iframe.remove();
      this.iframe = undefined;
    }

    // Destroy ESM module
    if (this.moduleApi?.destroy) {
      try {
        this.moduleApi.destroy();
      } catch (error) {
        console.error('Error destroying game module:', error);
      }
      this.moduleApi = undefined;
    }

    this.isReady = false;
    this.isStarted = false;
  }

  /**
   * Gửi command đến game
   */
  post(cmd: HostCommand): void {
    if (this.iframe?.contentWindow) {
      const msg: MsgEnvelope = {
        sdkVersion: SDK_VERSION,
        source: 'hub',
        type: cmd.type,
        payload: (cmd as any).payload,
      };
      this.iframe.contentWindow.postMessage(msg, '*');
    } else if (this.moduleApi?.onHostCommand) {
      this.moduleApi.onHostCommand(cmd);
    }
  }

  /**
   * Start game (gửi START command)
   */
  start(): void {
    if (!this.isReady) {
      console.warn('Game not ready yet, queuing START command');
    }
    this.post({ type: 'START' });
    this.isStarted = true;
  }

  /**
   * Pause game
   */
  pause(): void {
    this.post({ type: 'PAUSE' });
  }

  /**
   * Resume game
   */
  resume(): void {
    this.post({ type: 'RESUME' });
  }

  /**
   * Quit game
   */
  quit(): void {
    this.post({ type: 'QUIT' });
  }

  /**
   * Resize game
   */
  resize(width: number, height: number, dpr?: number): void {
    this.post({ type: 'RESIZE', payload: { width, height, dpr } });
  }

  /**
   * Check if game is ready
   */
  getIsReady(): boolean {
    return this.isReady;
  }

  /**
   * Check if game is started
   */
  getIsStarted(): boolean {
    return this.isStarted;
  }

  // —— Private methods ——

  /**
   * Mount iframe-html game
   */
  private async mountIframe(container: HTMLElement): Promise<void> {
    const { manifest, context } = this.options;

    // Create iframe
    const iframe = document.createElement('iframe');
    const entryUrl = this.resolveToAbsoluteUrl(manifest.entryUrl);
    iframe.src = entryUrl;
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = '0';
    iframe.style.maxWidth = '100%';
    iframe.style.maxHeight = '100%';
    iframe.style.overflow = 'hidden';
    iframe.style.display = 'block';
    iframe.title = manifest.title;

    // Set sandbox attributes
    const sandboxAttrs = getSandboxAttributes(manifest.capabilities);
    sandboxAttrs.forEach(attr => iframe.sandbox.add(attr));

    // Set allow attributes
    iframe.allow = getAllowAttributes(manifest.capabilities);

    // Message handler
    this.messageHandler = (e: MessageEvent) => {
      const data = e.data as MsgEnvelope;
      if (!data || data.source !== 'game' || !data.type) {
        return;
      }

      // Validate origin
      const gameOrigin = this.resolveToAbsoluteUrl(manifest.entryUrl);
      let gameOriginParsed: string;
      try {
        gameOriginParsed = new URL(gameOrigin).origin;
      } catch {
        gameOriginParsed = '';
      }

      const hubOrigin = window.location.origin;
      const isSameOriginGame = gameOriginParsed === hubOrigin
        || manifest.entryUrl.startsWith('/')
        || manifest.entryUrl.startsWith('./');

      // Handle 'null' origin (happens with same-origin iframes, blob URLs, or sandboxed contexts)
      const isNullOrigin = e.origin === 'null' || e.origin === null;

      const isAllowed
        // Development mode: allow all
        = process.env.NODE_ENV === 'development'
        // Allow null origin for same-origin games (public folder, blob URLs, etc.)
          || (isNullOrigin && isSameOriginGame)
        // Allow hub origin (same-origin games)
          || e.origin === hubOrigin
        // Allow game origin
          || e.origin === gameOriginParsed
        // Allow whitelisted origins
          || isOriginAllowed(e.origin);

      if (!isAllowed) {
        console.warn('Message from unauthorized origin:', {
          received: e.origin,
          expected: {
            hub: hubOrigin,
            game: gameOriginParsed,
            whitelisted: getAllowedOrigins(),
            isSameOriginGame,
          },
        });
        return;
      }

      const event = { type: data.type, payload: data.payload } as GameEvent;
      this.handleGameEvent(event);
    };

    window.addEventListener('message', this.messageHandler);
    this.disposeFns.push(() => {
      if (this.messageHandler) {
        window.removeEventListener('message', this.messageHandler);
      }
    });

    // Load handler - send INIT after iframe loads
    const onLoad = () => {
      this.post({ type: 'INIT', payload: context });
    };

    iframe.addEventListener('load', onLoad);
    this.disposeFns.push(() => iframe.removeEventListener('load', onLoad));

    // Mount iframe
    container.replaceChildren(iframe);
    this.iframe = iframe;

    // Wait for READY event with timeout
    await this.waitForReady(3000);
  }

  /**
   * Mount esm-module game
   */
  private async mountEsm(container: HTMLElement): Promise<void> {
    const { manifest, context } = this.options;

    try {
      // Dynamic import game module
      const entryUrl = this.resolveToAbsoluteUrl(manifest.entryUrl);
      const mod = await import(/* webpackIgnore: true */ entryUrl);

      if (!mod.init || typeof mod.init !== 'function') {
        throw new Error('ESM module must export init function');
      }

      // Create host API
      const host = this.createHostApi();

      // Initialize game
      this.moduleApi = await mod.init(container, context, host);

      if (!this.moduleApi || !this.moduleApi.onHostCommand || !this.moduleApi.destroy) {
        throw new Error('ESM module init must return { onHostCommand, destroy }');
      }

      // Wait for READY event with timeout
      await this.waitForReady(3000);
    } catch (error) {
      console.error('Failed to mount ESM game:', error);
      throw error;
    }
  }

  /**
   * Wait for READY event from game
   */
  private waitForReady(timeoutMs: number): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.isReady) {
        resolve();
        return;
      }

      const timeout = setTimeout(() => {
        reject(new Error(`Game did not send READY within ${timeoutMs}ms`));
      }, timeoutMs);

      const checkReady = () => {
        if (this.isReady) {
          clearTimeout(timeout);
          resolve();
        }
      };

      // Check every 100ms
      const interval = setInterval(checkReady, 100);

      this.disposeFns.push(() => {
        clearTimeout(timeout);
        clearInterval(interval);
      });
    });
  }

  /**
   * Handle events from game
   */
  private handleGameEvent(event: GameEvent): void {
    const { manifest, context, onEvent } = this.options;

    // Mark as ready
    if (event.type === 'READY') {
      this.isReady = true;
    }

    // Handle telemetry
    if (event.type === 'TELEMETRY' && event.payload) {
      pushTelemetry({
        t: Date.now(),
        sid: context.sessionId,
        gid: manifest.id,
        ver: manifest.version,
        evt: 'custom',
        payload: event.payload,
      });
    }

    // Call custom handler
    if (onEvent) {
      onEvent(event);
    }
  }

  /**
   * Create host API for ESM games
   */
  private createHostApi(): IrukaHost {
    const { context, manifest } = this.options;

    return {
      send: (cmd: HostCommand) => {
        this.post(cmd);
      },

      ready: () => {
        const event: GameEvent = { type: 'READY' };
        this.handleGameEvent(event);
      },

      loading: (progress: number) => {
        const event: GameEvent = { type: 'LOADING', payload: { progress } };
        this.handleGameEvent(event);
      },

      reportScore: (score: number, delta?: number) => {
        const event: GameEvent = {
          type: 'SCORE_UPDATE',
          payload: { score, delta },
        };
        this.handleGameEvent(event);
      },

      reportProgress: (data: any) => {
        const event: GameEvent = { type: 'PROGRESS', payload: data };
        this.handleGameEvent(event);
      },

      complete: (data: { score: number; timeMs: number; extras?: any }) => {
        const event: GameEvent = { type: 'COMPLETE', payload: data };
        this.handleGameEvent(event);
      },

      error: (message: string, detail?: any) => {
        const event: GameEvent = { type: 'ERROR', payload: { message, detail } };
        this.handleGameEvent(event);
      },

      requestSave: async (data: any) => {
        try {
          await saveProgress(manifest.id, context.sessionId, data);
          const event: GameEvent = { type: 'REQUEST_SAVE', payload: data };
          this.handleGameEvent(event);
        } catch (error) {
          console.error('Failed to save progress:', error);
          throw error;
        }
      },

      requestLoad: async () => {
        try {
          const data = await loadProgress(manifest.id, context.sessionId);
          const event: GameEvent = { type: 'REQUEST_LOAD' };
          this.handleGameEvent(event);
          return data;
        } catch (error) {
          console.error('Failed to load progress:', error);
          throw error;
        }
      },

      telemetry: (data: any) => {
        pushTelemetry({
          t: Date.now(),
          sid: context.sessionId,
          gid: manifest.id,
          ver: manifest.version,
          evt: 'custom',
          payload: data,
        });
      },
    };
  }
}
