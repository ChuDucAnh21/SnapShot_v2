/**
 * SDK for iframe-html games
 * Game chạy trong iframe sử dụng SDK này để giao tiếp với Hub qua postMessage
 */

import type { GameEvent, HostCommand, MsgEnvelope } from '../protocol';
import { SDK_VERSION } from '../protocol';

export type CommandHandler = (cmd: HostCommand) => void;

export type IframeBridgeOptions = {
  onCommand: CommandHandler;
  targetOrigin?: string;
};

export type IframeBridge = {
  dispose: () => void;
  ready: () => void;
  loading: (progress: number) => void;
  reportScore: (score: number, delta?: number) => void;
  reportProgress: (data: any) => void;
  complete: (data: { score: number; timeMs: number; extras?: any }) => void;
  error: (message: string, detail?: any) => void;
  requestSave: (data: any) => void;
  requestLoad: () => void;
  telemetry: (data: any) => void;
};

/**
 * Create iframe bridge for game
 */
export function createIframeBridge(opts: IframeBridgeOptions): IframeBridge {
  const origin = opts.targetOrigin ?? '*'; // PROD: nên truyền exact origin của Hub

  /**
   * Post event to parent (Hub)
   */
  function post(evt: GameEvent): void {
    const msg: MsgEnvelope = {
      sdkVersion: SDK_VERSION,
      source: 'game',
      type: evt.type,
      payload: (evt as any).payload,
    };
    window.parent?.postMessage(msg, origin);
  }

  /**
   * Handle message from parent (Hub)
   */
  function onMessage(e: MessageEvent): void {
    const data = e.data as MsgEnvelope;
    if (!data || data.source !== 'hub' || !data.type) {
      return;
    }

    // Validate origin
    // In development, allow all origins
    if (process.env.NODE_ENV === 'development') {
      // Allow all in dev mode
    } else {
      // In production, validate origin
      let isAllowed = false;

      if (origin === '*') {
        // If targetOrigin is '*', try to get parent origin as fallback
        // This allows same-origin setups to work even if targetOrigin not specified
        try {
          const parentOrigin = window.parent?.location?.origin;
          if (parentOrigin) {
            isAllowed = e.origin === parentOrigin;
          } else {
            // Cannot access parent origin (cross-origin), allow all when origin is '*'
            // This maintains backward compatibility
            isAllowed = true;
          }
        } catch {
          // Cannot access parent.location (CORS), allow when origin is '*'
          isAllowed = true;
        }
      } else {
        // Exact match required when targetOrigin is specified
        isAllowed = e.origin === origin;
      }

      if (!isAllowed) {
        console.warn('Message from unauthorized origin:', {
          received: e.origin,
          expected: origin === '*'
            ? (window.parent?.location?.origin || 'any (targetOrigin="*")')
            : origin,
          targetOrigin: origin,
          parentOrigin: (() => {
            try {
              return window.parent?.location?.origin;
            } catch {
              return 'cross-origin (not accessible)';
            }
          })(),
        });
        return;
      }
    }

    const cmd = { type: data.type, payload: data.payload } as HostCommand;
    opts.onCommand(cmd);
  }

  // Register message listener
  window.addEventListener('message', onMessage);

  // Return bridge API
  return {
    dispose() {
      window.removeEventListener('message', onMessage);
    },

    ready() {
      post({ type: 'READY' });
    },

    loading(progress: number) {
      post({ type: 'LOADING', payload: { progress } });
    },

    reportScore(score: number, delta?: number) {
      post({ type: 'SCORE_UPDATE', payload: { score, delta } });
    },

    reportProgress(data: any) {
      post({ type: 'PROGRESS', payload: data });
    },

    complete(data: { score: number; timeMs: number; extras?: any }) {
      post({ type: 'COMPLETE', payload: data });
    },

    error(message: string, detail?: any) {
      post({ type: 'ERROR', payload: { message, detail } });
    },

    requestSave(data: any) {
      post({ type: 'REQUEST_SAVE', payload: data });
    },

    requestLoad() {
      post({ type: 'REQUEST_LOAD' });
    },

    telemetry(data: any) {
      post({ type: 'TELEMETRY', payload: data });
    },
  };
}
