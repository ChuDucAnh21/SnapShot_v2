// Rules applied: brace-style:1tbs, ts:consistent-type-definitions:type, antfu/no-top-level-await:off
'use client';

import * as React from 'react';
import { useDrag, useDrop } from 'react-dnd';

export type DragItemType = 'number' | 'shape' | 'card' | 'answer' | 'custom';

export type DragItem = {
  id: string;
  type: DragItemType;
  data?: unknown;
};

export type DropResult = {
  dropEffect: 'move' | 'copy' | 'link' | 'none';
  item: DragItem;
};

export type UseDragOptions = {
  type: DragItemType;
  item: DragItem;
  collect?: (monitor: any) => unknown;
  end?: (item: DragItem, monitor: any) => void;
  canDrag?: boolean;
};

export type UseDropOptions = {
  accept: DragItemType[];
  onDrop?: (item: DragItem, monitor: any) => void;
  onHover?: (item: DragItem, monitor: any) => void;
  collect?: (monitor: any) => unknown;
  canDrop?: (item: DragItem, monitor: any) => boolean;
};

export function useDragDrop(options: UseDragOptions) {
  const [{ isDragging, canDrag }, drag, dragPreview] = useDrag({
    type: options.type,
    item: options.item,
    collect: monitor => ({
      isDragging: monitor.isDragging(),
      canDrag: monitor.canDrag(),
    }),
    end: options.end,
    canDrag: options.canDrag,
  });

  return {
    isDragging,
    canDrag,
    drag,
    dragPreview,
  };
}

export function useDropZone(options: UseDropOptions) {
  const [{ isOver, canDrop, hoveredItem }, drop] = useDrop({
    accept: options.accept,
    drop: options.onDrop,
    hover: options.onHover,
    collect: monitor => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
      hoveredItem: monitor.getItem(),
    }),
    canDrop: options.canDrop,
  });

  return {
    isOver,
    canDrop,
    hoveredItem,
    drop,
  };
}

export type DragDropContextType = {
  draggedItem: DragItem | null;
  setDraggedItem: (item: DragItem | null) => void;
  dropZones: Set<string>;
  registerDropZone: (id: string) => void;
  unregisterDropZone: (id: string) => void;
};

const DragDropContext = React.createContext<DragDropContextType | null>(null);

export function DragDropProvider({ children }: { children: React.ReactNode }) {
  const [draggedItem, setDraggedItem] = React.useState<DragItem | null>(null);
  const [dropZones, setDropZones] = React.useState<Set<string>>(() => new Set());

  const registerDropZone = React.useCallback((id: string) => {
    setDropZones(prev => new Set(prev).add(id));
  }, []);

  const unregisterDropZone = React.useCallback((id: string) => {
    setDropZones((prev) => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  }, []);

  const value = React.useMemo(
    () => ({
      draggedItem,
      setDraggedItem,
      dropZones,
      registerDropZone,
      unregisterDropZone,
    }),
    [draggedItem, dropZones, registerDropZone, unregisterDropZone],
  );

  return React.createElement(DragDropContext.Provider, { value }, children);
}

export function useDragDropContext() {
  const context = React.use(DragDropContext);
  if (!context) {
    throw new Error('useDragDropContext must be used within DragDropProvider');
  }
  return context;
}
