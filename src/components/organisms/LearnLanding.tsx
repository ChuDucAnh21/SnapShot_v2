'use client';

import type { PathProgressSection } from '@organisms/PathProgressMap';
import type { PathLessonKind, PathNodeWithMeta, PathWithMeta } from '@/features/paths/models';
import PathProgressMap from '@organisms/PathProgressMap';
import * as React from 'react';
import { useNodeSessionGenerator } from '@/hooks/useNodeSessionGenerator';
import LessonToast from '../LessonToast';
import PathMascot from '../molecules/PathMascot';
import ResponsiveNavBar from '../molecules/ResponsiveNavBar';
import ScrollButton from '../ScrollButton';
import { Spinner } from '../ui/spinner';

type LessonNode = PathProgressSection['nodes'][number] & {
  readonly locked: boolean;
  readonly progress?: number;
  readonly order: number;
  readonly unitTitle: string;
  readonly kind: PathLessonKind;
  readonly icon?: string;
  readonly jumpAvailable?: boolean;
};

type SectionsResult = {
  readonly sections: PathProgressSection[];
  readonly meta: {
    readonly subjectTitle: string;
    readonly completed: number;
    readonly total: number;
  };
};

const DEFAULT_SUBJECT = 'Learning Path';

export type LearnLandingProps = {
  readonly path: PathWithMeta;
};

function coerceSubjectTitle(path: PathWithMeta): string {
  const raw = typeof path.subject === 'string' && path.subject.trim().length > 0 ? path.subject : path.subject_id;
  if (typeof raw === 'string' && raw.trim().length > 0) {
    return raw.trim();
  }
  return DEFAULT_SUBJECT;
}
function coerceOrder(node: PathNodeWithMeta, fallbackIndex: number): number {
  return typeof node.order === 'number' && Number.isFinite(node.order) ? node.order : fallbackIndex + 1;
}
function coerceKind(node: PathNodeWithMeta, order: number): PathLessonKind {
  const raw = typeof node.type === 'string' ? node.type.toLowerCase() : undefined;
  if (raw === 'checkpoint' || raw === 'badge') {
    return raw;
  }
  return order === 1 ? 'start' : 'lesson';
}
function coerceStatus(node: PathNodeWithMeta): 'locked' | 'available' | 'completed' {
  const rawStatus = node.status ?? (node.unlocked === false ? 'locked' : undefined);
  if (rawStatus === 'locked' || rawStatus === 'completed') {
    return rawStatus;
  }
  if (rawStatus === 'available') {
    return 'available';
  }
  return 'available';
}
function coerceProgress(node: PathNodeWithMeta, status: 'locked' | 'available' | 'completed'): number | undefined {
  if (typeof node.progress === 'number') {
    const value = Math.max(0, Math.min(100, node.progress));
    return Number.isFinite(value) ? value : undefined;
  }
  if (status === 'completed') {
    return 100;
  }
  return undefined;
}
function coerceLabel(node: PathNodeWithMeta, order: number) {
  if (typeof node.skill_name === 'string' && node.skill_name.trim().length > 0) {
    return node.skill_name.trim();
  }
  if (typeof node.title === 'string' && node.title.trim().length > 0) {
    return node.title.trim();
  }
  return `Lesson ${order}`;
}
function coerceDescription(node: PathNodeWithMeta, progress: number | undefined) {
  if (typeof node.description === 'string' && node.description.trim().length > 0) {
    return node.description.trim();
  }
  if (typeof progress === 'number') {
    return `${progress}% complete`;
  }
  return undefined;
}
function coerceUnitTitle(node: PathNodeWithMeta, fallback: string) {
  if (typeof node.unitTitle === 'string' && node.unitTitle.trim().length > 0) {
    return node.unitTitle.trim();
  }
  if (typeof node.unit_title === 'string' && node.unit_title.trim().length > 0) {
    return node.unit_title.trim();
  }
  return fallback;
}
function buildSections(path: PathWithMeta): SectionsResult {
  const subjectTitle = coerceSubjectTitle(path);
  const nodes = Array.isArray(path.nodes) ? [...path.nodes] : [];

  const lessons = nodes
    .map((node, index) => {
      const order = coerceOrder(node, index);
      const kind = coerceKind(node, order);
      const status = coerceStatus(node);
      const progress = coerceProgress(node, status);
      const unitTitle = coerceUnitTitle(node, subjectTitle);
      const description = coerceDescription(node, progress);
      const jumpAvailable = node.jumpAvailable ?? node.jump_available ?? (status !== 'locked' && order > 1);

      return {
        id: node.node_id ?? `node-${order}`,
        label: coerceLabel(node, order),
        level: 0,
        status,
        description,
        locked: status === 'locked',
        progress,
        unitTitle,
        order,
        kind,
        icon: node.icon,
        jumpAvailable,
      } satisfies LessonNode;
    })
    .sort((a, b) => a.order - b.order);

  const grouped = lessons.reduce<Map<string, LessonNode[]>>((acc, lesson) => {
    const list = acc.get(lesson.unitTitle);
    if (list) {
      list.push(lesson);
    } else {
      acc.set(lesson.unitTitle, [lesson]);
    }
    return acc;
  }, new Map());

  const sections: PathProgressSection[] = Array.from(grouped.entries()).map(([unitTitle, unitLessons], idx) => {
    const level = idx + 1;
    const nodesForSection = unitLessons
      .sort((a, b) => a.order - b.order)
      .map(lesson => ({
        ...lesson,
        level,
      }));

    const totalLessons = nodesForSection.length;
    const description = `${unitTitle} - ${totalLessons} lesson${totalLessons === 1 ? '' : 's'}`;

    return {
      level,
      title: unitTitle,
      description,
      curveUpwards: idx % 2 !== 0,
      nodes: nodesForSection,
    } satisfies PathProgressSection;
  });

  const completed = path.progress?.completed_nodes ?? lessons.filter(lesson => lesson.status === 'completed').length;
  const total = path.progress?.total_nodes ?? lessons.length;

  return {
    sections,
    meta: {
      subjectTitle,
      completed,
      total,
    },
  };
}
export default function LearnLanding({ path }: LearnLandingProps) {
  const { generateAndNavigate, isGenerating, error } = useNodeSessionGenerator();

  const { sections, meta } = React.useMemo(() => buildSections(path), [path]);

  // Handle node selection - generate session from node and navigate to it
  const handleNodeSelect = React.useCallback(
    async (nodeId: string) => {
      await generateAndNavigate(nodeId);
    },
    [generateAndNavigate],
  );

  return (
    <div className="h-full overflow-auto p-3 sm:p-4 lg:p-6 relative">
      {/* Responsive nav for mobile + laptop */}
      <ResponsiveNavBar title={meta.subjectTitle} />

      <LessonToast
        className="hidden sticky top-4 right-0 left-0 z-[50] sm:top-6"
        title={meta.subjectTitle}
        description={
          meta.total > 0 ? `Completed ${meta.completed}/${meta.total} lessons` : 'No lessons available in this path yet'
        }
      />

      {sections.length > 0 && (
        <PathProgressMap
          sections={sections}
          onJumpToSession={handleNodeSelect}
          onSelectSession={handleNodeSelect}
        />
      )}
      {sections.length === 0 && (
        <div className="flex flex-1 items-center justify-center py-10 text-sm text-gray-600">
          The learning path is empty for now.
        </div>
      )}

      {/* Loading overlay when generating session */}
      {isGenerating && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50">
          <div className="rounded-2xl bg-white border border-gray-200 p-6 text-center shadow-lg">
            <Spinner className="mx-auto mb-4 h-12 w-12 text-blue-500" />
            <p className="text-gray-800">Generating your lesson...</p>
          </div>
        </div>
      )}

      {/* Error toast */}
      {error && (
        <div className="fixed bottom-6 left-1/2 z-[100] -translate-x-1/2 rounded-lg bg-red-500 px-6 py-3 text-sm text-white shadow-lg">
          {error.message}
        </div>
      )}

      <PathMascot className="top-1/2 left-1/4 -translate-y-1/2" />
      <div className="sticky right-0 bottom-3 left-0 z-[50] flex w-full justify-end sm:bottom-4">
        <ScrollButton />
      </div>
    </div>
  );
}
