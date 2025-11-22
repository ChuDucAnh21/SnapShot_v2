'use client';

import type { Path } from '@/features/paths/types';
import Badge from '@atoms/Badge';
import Link from 'next/link';
import * as React from 'react';

type PathRailProps = {
  readonly data: Path;
  readonly onSelect?: (lessonId: string) => void;
};

const GROUP_SIZE = 4;

export default function PathRail({ data, onSelect }: PathRailProps) {
  const groups = React.useMemo(() => {
    const nodes = data.nodes ?? [];
    if (nodes.length === 0) {
      return [];
    }

    return nodes.reduce<Array<{ id: string; title: string; nodes: Path['nodes'] }>>((acc, node, index) => {
      const groupIndex = Math.floor(index / GROUP_SIZE);
      if (!acc[groupIndex]) {
        acc[groupIndex] = {
          id: `group-${groupIndex}`,
          title: `Milestone ${groupIndex + 1}`,
          nodes: [] as Path['nodes'],
        };
      }
      acc[groupIndex]!.nodes.push(node);
      return acc;
    }, []);
  }, [data.nodes]);

  return (
    <div className="flex snap-x gap-4 overflow-x-auto py-2">
      {groups.map(group => (
        <div key={group.id} className="min-w-64 snap-center rounded-[--radius-md] border border-[--border] p-3">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-sm font-semibold">{group.title}</h3>
            <Badge variant="outline">
              {group.nodes.length}
              {' '}
              lessons
            </Badge>
          </div>
          <ul className="grid gap-2">
            {group.nodes.map((node) => {
              const locked = node.status === 'locked';
              return (
                <li key={node.node_id}>
                  <Link
                    className="block w-full rounded-[--radius-sm] border border-[--border] px-3 py-2 hover:bg-white/5 aria-disabled:opacity-50"
                    aria-disabled={locked}
                    href={locked ? '#' : `/learn/session/${node.node_id}`}
                    onClick={(event) => {
                      if (locked) {
                        event.preventDefault();
                      }
                      onSelect?.(node.node_id);
                    }}
                  >
                    <div className="flex items-center justify-between text-sm">
                      <span>{node.skill_name}</span>
                      {/* TODO: Add progress percentage when available */}
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}
