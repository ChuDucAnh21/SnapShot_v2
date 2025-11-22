// Rules applied: ts/consistent-type-definitions:type, style/brace-style:1tbs

import { dragMatchAdapter } from './drag-match/adapter';
import DragMatchGame from './drag-match/DragMatchGame';
import { dragNumberAdapter } from './drag-number/adapter';
import DragNumberGame from './drag-number/DragNumberGame';
import { matchPairsAdapter } from './match-pairs/adapter';
import MatchPairsGame from './match-pairs/MatchPairsGame';
import { mazeAdapter } from './maze/adapter';
import MazeGame from './maze/MazeGame';
import { register } from './registry';
import { roadCycleAdapter } from './road-cycle/adapter';
import RoadCycleGame from './road-cycle/RoadCycleGame';
import { tapAdapter } from './tap/adapter';
import TapGame from './tap/TapGame';

export function bootstrapGames(): void {
  register({
    id: 'match-pairs',
    title: 'Match Pairs',
    component: MatchPairsGame,
    adapters: matchPairsAdapter,
    defaultConfig: {
      rows: 2,
      cols: 4,
      pairs: ['1', '1', '2', '2', '3', '3', '4', '4'],
      colors: {},
      shuffleSeed: '',
    },
    tags: ['memory', 'matching'],
    description: 'Match pairs of cards',
  });

  register({
    id: 'maze',
    title: 'Maze Runner',
    component: MazeGame,
    adapters: mazeAdapter,
    defaultConfig: {
      rows: 10,
      cols: 10,
      obstacles: 0.1,
    },
    tags: ['spatial', 'pathfinding'],
    description: 'Navigate through a maze',
  });

  register({
    id: 'drag-number',
    title: 'Drag & Drop Numbers',
    component: DragNumberGame,
    adapters: dragNumberAdapter,
    defaultConfig: {
      range: [1, 20],
      count: 6,
      mode: 'asc',
    },
    tags: ['math', 'ordering'],
    description: 'Arrange numbers in order',
  });

  register({
    id: 'road-cycle',
    title: 'Road Cycle Car',
    component: RoadCycleGame,
    adapters: roadCycleAdapter,
    defaultConfig: {
      speed: 1,
      traffic: 'medium',
      laps: 3,
    },
    tags: ['timing', 'reaction'],
    description: 'Avoid obstacles on the road',
  });

  register({
    id: 'drag_match',
    title: 'Drag & Match Numbers',
    component: DragMatchGame,
    adapters: dragMatchAdapter,
    defaultConfig: {
      goal: 'Kéo số khớp với số lượng đồ vật',
      items: [],
      rules: [],
      scoring: { per_correct: 1, target: 6, bonus_perfect: 2 },
    },
    tags: ['math', 'matching', 'counting'],
    description: 'Match numbers with object quantities',
  });

  register({
    id: 'tap',
    title: 'Tap Game',
    component: TapGame,
    adapters: tapAdapter,
    defaultConfig: {
      game_type: 'tap',
      instructions: 'Chọn đáp án đúng cho mỗi câu hỏi',
      problems: [
        { question: 'Câu hỏi mẫu 1?', answer: 'Đáp án A' },
        { question: 'Câu hỏi mẫu 2?', answer: 'Đáp án B' },
      ],
    },
    tags: ['quiz', 'tap', 'multiple-choice'],
    description: 'Tap to select the correct answer',
  });
}
