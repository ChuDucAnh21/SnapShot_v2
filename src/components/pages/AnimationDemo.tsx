// Rules applied: brace-style:1tbs, ts:consistent-type-definitions:type, antfu/no-top-level-await:off
'use client';

import { motion } from 'framer-motion';
import * as React from 'react';
import Confetti from '@/components/atoms/Confetti';
import MathIcon from '@/components/atoms/MathIcon';
import ShakeAnimation from '@/components/atoms/ShakeAnimation';
import DragDropExample from '@/components/molecules/DragDropExample';

export default function AnimationDemo() {
  const [shakeTrigger, setShakeTrigger] = React.useState(false);
  const [confettiTrigger, setConfettiTrigger] = React.useState(false);
  const [shakeDirection, setShakeDirection] = React.useState<'horizontal' | 'vertical' | 'diagonal' | 'circular'>(
    'horizontal',
  );
  const [shakeIntensity, setShakeIntensity] = React.useState<'subtle' | 'moderate' | 'strong' | 'extreme'>('moderate');

  const triggerShake = React.useCallback(() => {
    setShakeTrigger(prev => !prev);
  }, []);

  const triggerConfetti = React.useCallback(() => {
    setConfettiTrigger(prev => !prev);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <h1 className="mb-4 text-4xl font-bold text-gray-800">Animation & Drag Drop Demo</h1>
          <p className="text-lg text-gray-600">Test các component animation và drag & drop mới</p>
        </motion.div>

        {/* MathIcon Demo */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-xl bg-white p-6 shadow-lg"
        >
          <h2 className="mb-4 text-2xl font-semibold text-gray-800">MathIcon với Lucide Icons</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
            {['apple', 'star', 'circle', 'square', 'triangle'].map(type => (
              <div key={type} className="flex flex-col items-center space-y-2">
                <MathIcon value={Math.floor(Math.random() * 10) + 1} type={type as any} size="lg" animated />
                <span className="text-sm font-medium text-gray-600 capitalize">{type}</span>
              </div>
            ))}
          </div>
        </motion.section>

        {/* ShakeAnimation Demo */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-xl bg-white p-6 shadow-lg"
        >
          <h2 className="mb-4 text-2xl font-semibold text-gray-800">ShakeAnimation Customizable</h2>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Controls */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-700">Controls</h3>

              <div>
                <label htmlFor="shakeDirection" className="mb-2 block text-sm font-medium text-gray-600">
                  Direction
                </label>
                <select
                  value={shakeDirection}
                  onChange={e => setShakeDirection(e.target.value as any)}
                  className="w-full rounded-lg border border-gray-300 p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="horizontal">Horizontal</option>
                  <option value="vertical">Vertical</option>
                  <option value="diagonal">Diagonal</option>
                  <option value="circular">Circular</option>
                </select>
              </div>

              <div>
                <label htmlFor="shakeIntensity" className="mb-2 block text-sm font-medium text-gray-600">
                  Intensity
                </label>
                <select
                  value={shakeIntensity}
                  onChange={e => setShakeIntensity(e.target.value as any)}
                  className="w-full rounded-lg border border-gray-300 p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="subtle">Subtle</option>
                  <option value="moderate">Moderate</option>
                  <option value="strong">Strong</option>
                  <option value="extreme">Extreme</option>
                </select>
              </div>

              <button
                type="button"
                onClick={triggerShake}
                className="w-full rounded-lg bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
              >
                Trigger Shake
              </button>
            </div>

            {/* Demo */}
            <div className="flex items-center justify-center">
              <ShakeAnimation
                trigger={shakeTrigger}
                direction={shakeDirection}
                intensity={shakeIntensity}
                duration={800}
                className="rounded-xl bg-gradient-to-r from-purple-400 to-pink-400 p-8"
              >
                <div className="text-center text-white">
                  <div className="mb-2 text-4xl">🎯</div>
                  <div className="text-lg font-semibold">Shake Me!</div>
                  <div className="text-sm opacity-80">
                    {shakeDirection}
                    {' '}
                    •
                    {shakeIntensity}
                  </div>
                </div>
              </ShakeAnimation>
            </div>
          </div>
        </motion.section>

        {/* Confetti Demo */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-xl bg-white p-6 shadow-lg"
        >
          <h2 className="mb-4 text-2xl font-semibold text-gray-800">Confetti Animation</h2>

          <div className="relative">
            <button
              type="button"
              onClick={triggerConfetti}
              className="transform rounded-lg bg-gradient-to-r from-yellow-400 to-orange-500 px-6 py-3 font-semibold text-white transition-all hover:scale-105 hover:from-yellow-500 hover:to-orange-600"
            >
              🎉 Trigger Confetti 🎉
            </button>

            <Confetti
              trigger={confettiTrigger}
              duration={3000}
              particleCount={100}
              shapes={['circle', 'square', 'triangle', 'star']}
              colors={['yellow', 'red', 'blue', 'green', 'purple', 'pink', 'orange']}
              gravity={0.8}
              wind={0.2}
              size="lg"
              onComplete={() => {}}
            />
          </div>
        </motion.section>

        {/* Drag & Drop Demo */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-xl bg-white p-6 shadow-lg"
        >
          <h2 className="mb-4 text-2xl font-semibold text-gray-800">Drag & Drop System</h2>
          <DragDropExample />
        </motion.section>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-gray-500"
        >
          <p>Built with Framer Motion, React DnD, and Lucide React</p>
        </motion.div>
      </div>
    </div>
  );
}
