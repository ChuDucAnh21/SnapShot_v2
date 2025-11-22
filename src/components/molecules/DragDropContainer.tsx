// Rules applied: brace-style:1tbs, ts:consistent-type-definitions:type, antfu/no-top-level-await:off
'use client';

import * as React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DragDropProvider } from '@/hooks/useDragDrop';

export type DragDropContainerProps = {
  readonly children: React.ReactNode;
  readonly className?: string;
};

export default function DragDropContainer({ children, className }: DragDropContainerProps) {
  return (
    <DndProvider backend={HTML5Backend}>
      <DragDropProvider>
        <div className={className}>{children}</div>
      </DragDropProvider>
    </DndProvider>
  );
}
