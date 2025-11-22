'use client';

import type { PathNodeButtonProps } from '@atoms/PathNodeButton';
import PathNodeButton from '@atoms/PathNodeButton';
import * as React from 'react';
import { useMemo } from 'react';
import { cn } from '@/utils/cn';

export type PathNodeDescriptor = PathNodeButtonProps & { readonly id: string };

export type PathNodeColumnProps = {
  readonly title?: string;
  readonly description?: string;
  readonly nodes: PathNodeDescriptor[];
  readonly renderNode?: (node: PathNodeDescriptor) => React.ReactNode;
  readonly curveUpwards?: boolean;
};

const getOffset = (index: number) => {
  // Calculate the offset for each node in a "mountain" pattern: 0, 30, 60, 30, 0, then repeat with sign flip
  const group = Math.floor(index / 5);
  const pos = index % 5;
  const baseOffsets = [0, 30, 60, 30, 0];
  const sign = group % 2 === 0 ? 1 : -1;
  return baseOffsets[pos]! * sign;
};

export default function PathNodeColumn({ title, nodes, renderNode, curveUpwards }: PathNodeColumnProps) {
  const sign = useMemo(() => {
    return curveUpwards ? '-' : '';
  }, [curveUpwards]);

  return (
    <div className="flex flex-col items-center">
      <ol className="flex flex-col items-center gap-4" aria-label={`${title} lessons`}>
        {nodes.map((node, index) => (
          <li
            key={node.id}
            className={cn('flex flex-col items-center gap-2')}
            style={{ transform: `translateX(${sign}${getOffset(index)}px)` }}
          >
            {renderNode ? renderNode(node) : <PathNodeButton {...node} />}
          </li>
        ))}
      </ol>
    </div>
  );
}
