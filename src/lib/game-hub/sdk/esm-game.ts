/**
 * SDK for esm-module games
 * Game export init() function và sử dụng host API được truyền vào
 */

import type { HostCommand, IrukaHost, MsgEnvelope } from '../protocol';
import { SDK_VERSION } from '../protocol';

/**
 * Create host bridge (chủ yếu cho demo/testing)
 * Trong thực tế, Hub sẽ truyền host object trực tiếp vào init()
 */
export function createHost(channel: MessagePort | Window): IrukaHost {
  function post(type: string, payload?: any): void {
    const msg: MsgEnvelope = {
      sdkVersion: SDK_VERSION,
      source: 'game',
      type,
      payload,
    };

    if ('postMessage' in channel) {
      if (channel === window) {
        window.parent?.postMessage(msg, '*');
      } else {
        (channel as MessagePort).postMessage(msg);
      }
    }
  }

  return {
    send(cmd: HostCommand) {
      post(cmd.type, (cmd as any).payload);
    },

    ready() {
      post('READY');
    },

    loading(p: number) {
      post('LOADING', { progress: p });
    },

    reportScore(score: number, delta?: number) {
      post('SCORE_UPDATE', { score, delta });
    },

    reportProgress(data: any) {
      post('PROGRESS', data);
    },

    complete(data: { score: number; timeMs: number; extras?: any }) {
      post('COMPLETE', data);
    },

    error(message: string, detail?: any) {
      post('ERROR', { message, detail });
    },

    async requestSave(data: any) {
      post('REQUEST_SAVE', data);
      // Hub sẽ xử lý và không cần response
    },

    async requestLoad() {
      post('REQUEST_LOAD');
      // Hub sẽ xử lý và trả data qua SET_STATE command
      return null;
    },

    telemetry(data: any) {
      post('TELEMETRY', data);
    },
  };
}
