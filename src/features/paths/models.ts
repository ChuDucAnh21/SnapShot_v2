import type { Path, PathNode } from './types';

export type PathProgressMeta = Partial<{
  completed_nodes: number;
  total_nodes: number;
  completion_percentage: number;
}>;

export type PathNodeMeta = Partial<{
  title: string;
  description: string;
  type: 'lesson' | 'checkpoint' | 'badge';
  icon: string;
  jumpAvailable: boolean;
  jump_available: boolean;
  unlocked: boolean;
  progress: number;
  unit_title: string;
  unitTitle: string;
}>;

export type PathNodeWithMeta = PathNode & PathNodeMeta;

export type PathWithMeta = Path
  & Partial<{
    subject_id: string;
    path_id: string;
    progress: PathProgressMeta;
    generated_at: string;
  }> & {
    nodes: PathNodeWithMeta[];
  };

export type PathLessonKind = 'start' | 'lesson' | 'checkpoint' | 'badge';
