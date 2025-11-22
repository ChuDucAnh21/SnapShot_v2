// Rules applied: ts/consistent-type-definitions:type, style/brace-style:1tbs

'use client';

import type { Session, SessionItem, SessionItemType, SessionType } from '@/stores/session-store';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { bootstrapGames } from '@/games/bootstrap';
import { list as listGames } from '@/games/manager';

export default function SessionEditorPage() {
  const [session, setSession] = React.useState<Session>({
    session_id: 'editor-session',
    subject_id: 'math',
    type: 'game',
    title: 'Game Session',
    description: 'Test game session',
    items: [],
  });

  const [currentItemType, setCurrentItemType] = React.useState<SessionItemType>('game');
  const [currentGameId, setCurrentGameId] = React.useState<string>('match-pairs');
  const [preview, setPreview] = React.useState(false);

  React.useEffect(() => {
    bootstrapGames();
  }, []);

  const games = listGames();

  const handleAddItem = React.useCallback(() => {
    const newItem: SessionItem = {
      id: `item-${Date.now()}`,
      type: currentItemType,
      payload: {
        gameId: currentItemType === 'game' ? currentGameId : undefined,
      },
      difficulty: 'easy',
      timeLimitSec: null,
    };

    setSession(prev => ({
      ...prev,
      items: [...prev.items, newItem],
    }));
  }, [currentItemType, currentGameId]);

  const handleRemoveItem = React.useCallback((index: number) => {
    setSession(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  }, []);

  const handleSessionTypeChange = React.useCallback((type: SessionType) => {
    setSession(prev => ({ ...prev, type }));
  }, []);

  const handlePreview = React.useCallback(() => {
    setPreview(true);
  }, []);

  const handleClosePreview = React.useCallback(() => {
    setPreview(false);
  }, []);

  if (preview && session.items.length > 0) {
    return (
      <div className="min-h-screen bg-gray-900">
        <div className="container mx-auto p-4">
          <Button onClick={handleClosePreview} className="mb-4">
            ← Back to Editor
          </Button>
          {/* TODO: Implement session preview with ActivityHost */}
          <div className="rounded-lg border border-white/10 bg-white/5 p-6">
            <h3 className="mb-4 text-xl font-semibold text-white">Session Preview</h3>
            <p className="text-white/70">Preview functionality will be implemented soon.</p>
            <p className="mt-2 text-sm text-white/50">
              Session has
              {session.items.length}
              {' '}
              items.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="container mx-auto">
        <h1 className="mb-6 text-3xl font-bold text-white">Session Editor</h1>

        <div className="mb-6 rounded-lg border border-white/10 bg-white/5 p-6">
          <h2 className="mb-4 text-xl font-semibold text-white">Session Settings</h2>

          <div className="mb-4">
            <p className="mb-2 block text-sm text-white/70">Session Type</p>
            <select
              value={session.type}
              onChange={e => handleSessionTypeChange(e.target.value as SessionType)}
              className="w-full rounded-lg bg-white/10 px-4 py-2 text-white"
            >
              <option value="quiz">Quiz</option>
              <option value="practice">Practice</option>
              <option value="video">Video</option>
              <option value="reading">Reading</option>
              <option value="game">Game</option>
            </select>
          </div>

          <div className="mb-4">
            <p className="mb-2 block text-sm text-white/70">Title</p>
            <input
              type="text"
              value={session.title}
              onChange={e => setSession(prev => ({ ...prev, title: e.target.value }))}
              className="w-full rounded-lg bg-white/10 px-4 py-2 text-white"
            />
          </div>

          <div className="mb-4">
            <p className="mb-2 block text-sm text-white/70">Description</p>
            <textarea
              value={session.description}
              onChange={e => setSession(prev => ({ ...prev, description: e.target.value }))}
              className="w-full rounded-lg bg-white/10 px-4 py-2 text-white"
              rows={3}
            />
          </div>
        </div>

        <div className="mb-6 rounded-lg border border-white/10 bg-white/5 p-6">
          <h2 className="mb-4 text-xl font-semibold text-white">Add Item</h2>

          <div className="mb-4">
            <p className="mb-2 block text-sm text-white/70">Item Type</p>
            <select
              value={currentItemType}
              onChange={e => setCurrentItemType(e.target.value as SessionItemType)}
              className="w-full rounded-lg bg-white/10 px-4 py-2 text-white"
            >
              <option value="mcq">Multiple Choice</option>
              <option value="fill">Fill in Blank</option>
              <option value="dragdrop">Drag & Drop</option>
              <option value="step">Step by Step</option>
              <option value="content">Content</option>
              <option value="game">Game</option>
            </select>
          </div>

          {currentItemType === 'game' && (
            <div className="mb-4">
              <p className="mb-2 block text-sm text-white/70">Game Type</p>
              <select
                value={currentGameId}
                onChange={e => setCurrentGameId(e.target.value)}
                className="w-full rounded-lg bg-white/10 px-4 py-2 text-white"
              >
                {games.map(game => (
                  <option key={game.id} value={game.id}>
                    {game.title}
                    {' '}
                    (
                    {game.tags.join(', ')}
                    )
                  </option>
                ))}
              </select>
            </div>
          )}

          <Button onClick={handleAddItem} className="w-full bg-[#6ac21a] text-white hover:bg-[#5aa017]">
            Add Item
          </Button>
        </div>

        <div className="mb-6 rounded-lg border border-white/10 bg-white/5 p-6">
          <h2 className="mb-4 text-xl font-semibold text-white">
            Items (
            {session.items.length}
            )
          </h2>

          {session.items.length === 0
            ? (
              <p className="text-center text-white/50">No items yet. Add some above!</p>
            )
            : (
              <div className="space-y-2">
                {session.items.map((item, index) => (
                  <div key={item.id} className="flex items-center justify-between rounded-lg bg-white/5 p-3">
                    <div>
                      <span className="font-semibold text-white">
                        {index + 1}
                        .
                        {item.type}
                      </span>
                      {item.type === 'game' && (
                        <span className="ml-2 text-sm text-white/60">
                          (
                          {(item.payload as any)?.gameId ?? 'unknown'}
                          )
                        </span>
                      )}
                    </div>
                    <Button
                      onClick={() => handleRemoveItem(index)}
                      className="bg-red-500/20 text-red-400 hover:bg-red-500/30"
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            )}
        </div>

        <div className="flex gap-4">
          <Button
            onClick={handlePreview}
            disabled={session.items.length === 0}
            className="flex-1 bg-blue-500 text-white hover:bg-blue-600"
          >
            Preview Session
          </Button>
          <Button
            onClick={() => console.warn('Export:', JSON.stringify(session, null, 2))}
            className="flex-1 bg-green-500 text-white hover:bg-green-600"
          >
            Export JSON
          </Button>
        </div>

        <details className="mt-6 rounded-lg border border-white/10 bg-black/20 p-4">
          <summary className="cursor-pointer text-sm font-semibold text-white/70">Session JSON</summary>
          <pre className="mt-2 overflow-auto text-xs text-white/60">{JSON.stringify(session, null, 2)}</pre>
        </details>
      </div>
    </div>
  );
}
