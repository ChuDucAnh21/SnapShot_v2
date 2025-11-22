// Rules applied: brace-style:1tbs, ts:consistent-type-definitions:type, antfu/no-top-level-await:off
'use client';

import type { DragItem, DragItemType } from '@/hooks/useDragDrop';
import { motion } from 'framer-motion';
import * as React from 'react';
import { useDropZone } from '@/hooks/useDragDrop';
import { cn } from '@/utils/cn';

export type DropZoneProps = {
  readonly id: string;
  readonly accept: DragItemType[];
  readonly children: React.ReactNode;
  readonly className?: string;
  readonly onDrop?: (item: DragItem) => void;
  readonly onHover?: (item: DragItem) => void;
  readonly canDrop?: (item: DragItem) => boolean;
  readonly showFeedback?: boolean;
  readonly feedbackClassName?: string;
  readonly style?: React.CSSProperties;
};

export default function DropZone({
  id,
  accept,
  children,
  className,
  onDrop,
  onHover,
  canDrop,
  showFeedback = true,
  feedbackClassName,
  style,
}: DropZoneProps) {
  const { isOver, hoveredItem, drop } = useDropZone({
    accept,
    onDrop: (item) => {
      onDrop?.(item);
    },
    onHover: (item) => {
      onHover?.(item);
    },
    canDrop,
  });

  const isValidDrop = React.useMemo(() => {
    if (!hoveredItem) {
      return false;
    }
    return canDrop ? canDrop(hoveredItem) : accept.includes(hoveredItem.type);
  }, [hoveredItem, canDrop, accept]);

  const setDropRef = React.useCallback(
    (node: HTMLDivElement | null) => {
      if (node) {
        drop(node);
      }
    },
    [drop],
  );

  return (
    <motion.div
      ref={setDropRef}
      id={id}
      className={cn(
        'relative transition-all duration-200',
        isOver && isValidDrop && 'ring-2 ring-blue-400 ring-opacity-50',
        isOver && !isValidDrop && 'ring-2 ring-red-400 ring-opacity-50',
        className,
      )}
      style={style}
      animate={{
        scale: isOver && isValidDrop ? 1.02 : 1,
        backgroundColor: isOver && isValidDrop ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
      }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 20,
      }}
    >
      {children}
      {showFeedback && isOver && (
        <motion.div
          className={cn(
            'absolute inset-0 flex items-center justify-center rounded-lg border-2 border-dashed',
            isValidDrop ? 'border-blue-400 bg-blue-50' : 'border-red-400 bg-red-50',
            feedbackClassName,
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <span className={cn('text-sm font-medium', isValidDrop ? 'text-blue-600' : 'text-red-600')}>
            {isValidDrop ? 'Drop here' : 'Cannot drop here'}
          </span>
        </motion.div>
      )}
    </motion.div>
  );
}
