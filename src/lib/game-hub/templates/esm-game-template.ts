/**
 * ESM Game Template
 * Template cho ESM module game
 */

import type { IrukaGameInstance, IrukaHost, LaunchContext } from '../protocol';

/**
 * Game initialization function
 * Hub sẽ gọi function này khi load game
 */
export async function init(
  container: HTMLElement,
  ctx: LaunchContext,
  host: IrukaHost,
): Promise<IrukaGameInstance> {
  console.log('ESM Game initialized with context:', ctx);

  // Game state
  let running = false;
  let score = 0;
  let startTs = 0;

  // Create UI
  const root = document.createElement('div');
  root.style.cssText = `
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  `;

  const gameContainer = document.createElement('div');
  gameContainer.style.cssText = 'text-align: center; padding: 2rem;';

  const title = document.createElement('h1');
  title.textContent = '🎮 ESM Game Template';

  const instruction = document.createElement('p');
  instruction.textContent = 'Click để tăng điểm!';

  const scoreDisplay = document.createElement('div');
  scoreDisplay.style.cssText = 'font-size: 3rem; font-weight: bold; margin: 1rem 0;';
  scoreDisplay.textContent = '0';

  const button = document.createElement('button');
  button.textContent = 'Nhấn vào đây';
  button.style.cssText = `
    background: white;
    color: #667eea;
    border: none;
    padding: 1rem 2rem;
    font-size: 1.2rem;
    font-weight: bold;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: transform 0.2s;
  `;

  button.addEventListener('mouseenter', () => {
    button.style.transform = 'scale(1.05)';
  });

  button.addEventListener('mouseleave', () => {
    button.style.transform = 'scale(1)';
  });

  button.addEventListener('click', () => {
    if (!running) {
      return;
    }

    score += 10;
    scoreDisplay.textContent = score.toString();
    host.reportScore(score, 10);

    // Send telemetry every 5 clicks
    if (score % 50 === 0) {
      host.telemetry({
        event: 'milestone',
        score,
      });
    }
  });

  gameContainer.appendChild(title);
  gameContainer.appendChild(instruction);
  gameContainer.appendChild(scoreDisplay);
  gameContainer.appendChild(button);
  root.appendChild(gameContainer);

  container.replaceChildren(root);

  // Notify hub that game is ready
  host.ready();

  // Return game instance interface
  return {
    onHostCommand(cmd) {
      console.log('Received command:', cmd.type);

      if (cmd.type === 'START') {
        running = true;
        startTs = performance.now();
        console.log('Game started');
      }

      if (cmd.type === 'PAUSE') {
        running = false;
        console.log('Game paused');
      }

      if (cmd.type === 'RESUME') {
        running = true;
        console.log('Game resumed');
      }

      if (cmd.type === 'QUIT') {
        running = false;
        const timeMs = performance.now() - startTs;
        host.complete({ score, timeMs });
        console.log('Game quit, score:', score, 'time:', timeMs);
      }

      if (cmd.type === 'RESIZE') {
        console.log('Game resize:', cmd.payload);
        // Adjust UI based on size
      }

      if (cmd.type === 'SET_STATE') {
        // Restore game state
        console.log('Restore state:', cmd.payload);
      }
    },

    destroy() {
      console.log('Game destroy, cleaning up...');
      running = false;
      // Clean up event listeners, timers, etc.
      root.remove();
    },
  };
}
