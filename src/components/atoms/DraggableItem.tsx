// Rules applied: brace-style:1tbs, ts:consistent-type-definitions:type, antfu/no-top-level-await:off
'use client';

import type { DragItem, DragItemType } from '@/hooks/useDragDrop';
import { motion } from 'framer-motion';
import * as React from 'react';
import { useDragDrop } from '@/hooks/useDragDrop';
import { cn } from '@/utils/cn';

export type DraggableItemProps = {
  readonly id: string;
  readonly type: DragItemType;
  readonly data?: unknown;
  readonly children: React.ReactNode;
  readonly className?: string;
  readonly disabled?: boolean;
  readonly onDragStart?: (item: DragItem) => void;
  readonly onDragEnd?: (item: DragItem) => void;
  readonly dragPreview?: React.ReactNode;
  readonly style?: React.CSSProperties;
};

export default function DraggableItem({
  id,
  type,
  data,
  children,
  className,
  disabled = false,
  onDragStart,
  onDragEnd,
  dragPreview,
  style,
}: DraggableItemProps) {
  const item: DragItem = React.useMemo(
    () => ({
      id,
      type,
      data,
    }),
    [id, type, data],
  );

  const {
    isDragging,
    canDrag,
    drag,
    dragPreview: previewRef,
  } = useDragDrop({
    type,
    item,
    canDrag: !disabled,
    end: (draggedItem) => {
      onDragEnd?.(draggedItem);
    },
  });

  const setDragRef = React.useCallback(
    (node: HTMLDivElement | null) => {
      if (node) {
        drag(node);
      }
    },
    [drag],
  );

  const setPreviewRef = React.useCallback(
    (node: HTMLDivElement | null) => {
      if (node) {
        previewRef(node);
      }
    },
    [previewRef],
  );

  React.useEffect(() => {
    if (isDragging) {
      onDragStart?.(item);
    }
  }, [isDragging, item, onDragStart]);

  return (
    <>
      <motion.div
        ref={setDragRef}
        className={cn(
          'cursor-grab active:cursor-grabbing',
          isDragging && 'opacity-50',
          !canDrag && 'cursor-not-allowed opacity-50',
          disabled && 'pointer-events-none',
          className,
        )}
        style={style}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={{
          scale: isDragging ? 1.1 : 1,
          rotate: isDragging ? 5 : 0,
        }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 20,
        }}
      >
        {children}
      </motion.div>
      {dragPreview && (
        <div ref={setPreviewRef} className="hidden">
          {dragPreview}
        </div>
      )}
    </>
  );
}
