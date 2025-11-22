// Rules applied: brace-style:1tbs, ts:consistent-type-definitions:type, antfu/no-top-level-await:off
'use client';

import type { DragItem } from '@/hooks/useDragDrop';
import { motion } from 'framer-motion';
import { Apple, Circle, Square, Star, Triangle } from 'lucide-react';
import * as React from 'react';
import DraggableItem from '@/components/atoms/DraggableItem';
import DropZone from '@/components/atoms/DropZone';
import DragDropContainer from './DragDropContainer';

const shapes = [
  { id: 'apple-1', type: 'shape' as const, icon: Apple, color: 'text-red-500', label: 'Apple' },
  { id: 'star-1', type: 'shape' as const, icon: Star, color: 'text-yellow-500', label: 'Star' },
  { id: 'circle-1', type: 'shape' as const, icon: Circle, color: 'text-blue-500', label: 'Circle' },
  {
    id: 'square-1',
    type: 'shape' as const,
    icon: Square,
    color: 'text-green-500',
    label: 'Square',
  },
  {
    id: 'triangle-1',
    type: 'shape' as const,
    icon: Triangle,
    color: 'text-purple-500',
    label: 'Triangle',
  },
];

const numbers = [
  { id: 'num-1', type: 'number' as const, value: 1 },
  { id: 'num-2', type: 'number' as const, value: 2 },
  { id: 'num-3', type: 'number' as const, value: 3 },
  { id: 'num-4', type: 'number' as const, value: 4 },
  { id: 'num-5', type: 'number' as const, value: 5 },
];

export default function DragDropExample() {
  const [droppedItems, setDroppedItems] = React.useState<DragItem[]>([]);
  const [messages, setMessages] = React.useState<string[]>([]);

  const handleDrop = React.useCallback((item: DragItem) => {
    setDroppedItems(prev => [...prev, item]);
    setMessages(prev => [...prev, `Dropped ${item.type}: ${item.id}`]);
  }, []);

  const handleDragStart = React.useCallback((item: DragItem) => {
    setMessages(prev => [...prev, `Started dragging ${item.type}: ${item.id}`]);
  }, []);

  const handleDragEnd = React.useCallback((item: DragItem) => {
    setMessages(prev => [...prev, `Finished dragging ${item.type}: ${item.id}`]);
  }, []);

  const clearDroppedItems = React.useCallback(() => {
    setDroppedItems([]);
    setMessages([]);
  }, []);

  return (
    <DragDropContainer className="space-y-6 p-6">
      <div className="text-center">
        <h2 className="mb-2 text-2xl font-bold text-gray-800">Drag & Drop Example</h2>
        <p className="text-gray-600">Drag shapes and numbers to the drop zone below</p>
      </div>

      {/* Draggable Shapes */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700">Shapes</h3>
        <div className="flex flex-wrap gap-4">
          {shapes.map((shape) => {
            const IconComponent = shape.icon;
            return (
              <DraggableItem
                key={shape.id}
                id={shape.id}
                type={shape.type}
                data={{ label: shape.label, color: shape.color }}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                className="rounded-lg border-2 border-gray-200 bg-white p-4 shadow-md hover:border-blue-300"
              >
                <div className="flex flex-col items-center space-y-2">
                  <IconComponent className={`h-8 w-8 ${shape.color}`} />
                  <span className="text-sm font-medium text-gray-700">{shape.label}</span>
                </div>
              </DraggableItem>
            );
          })}
        </div>
      </div>

      {/* Draggable Numbers */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700">Numbers</h3>
        <div className="flex flex-wrap gap-4">
          {numbers.map(number => (
            <DraggableItem
              key={number.id}
              id={number.id}
              type={number.type}
              data={{ value: number.value }}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              className="rounded-lg border-2 border-gray-200 bg-white p-4 shadow-md hover:border-blue-300"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                <span className="text-xl font-bold text-blue-600">{number.value}</span>
              </div>
            </DraggableItem>
          ))}
        </div>
      </div>

      {/* Drop Zone */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700">Drop Zone</h3>
        <DropZone
          id="main-drop-zone"
          accept={['shape', 'number']}
          onDrop={handleDrop}
          className="min-h-32 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-6"
        >
          <div className="flex flex-wrap gap-4">
            {droppedItems.map(item => (
              <motion.div
                key={`${item.id}-${droppedItems.indexOf(item)}`}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm"
              >
                {item.type === 'shape' && (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">{(item.data as { label?: string } | undefined)?.label}</span>
                  </div>
                )}
                {item.type === 'number' && (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                    <span className="text-sm font-bold text-blue-600">
                      {(item.data as { value?: number } | undefined)?.value}
                    </span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </DropZone>
      </div>

      {/* Messages */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-700">Activity Log</h3>
          <button
            type="button"
            onClick={clearDroppedItems}
            className="rounded-lg bg-red-500 px-4 py-2 text-white transition-colors hover:bg-red-600"
          >
            Clear All
          </button>
        </div>
        <div className="max-h-32 space-y-1 overflow-y-auto">
          {messages.map(message => (
            <motion.div
              key={message}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="rounded bg-gray-100 p-2 text-sm text-gray-600"
            >
              {message}
            </motion.div>
          ))}
        </div>
      </div>
    </DragDropContainer>
  );
}
