// Rules applied: brace-style:1tbs, ts:consistent-type-definitions:type, antfu/no-top-level-await:off
'use client';

import { motion } from 'framer-motion';
import * as React from 'react';

export type ConfettiShape = 'circle' | 'square' | 'triangle' | 'star';

export type ConfettiColor = 'yellow' | 'red' | 'blue' | 'green' | 'purple' | 'pink' | 'orange';

export type ConfettiProps = {
  readonly trigger: boolean;
  readonly duration?: number;
  readonly particleCount?: number;
  readonly shapes?: ConfettiShape[];
  readonly colors?: ConfettiColor[];
  readonly gravity?: number;
  readonly wind?: number;
  readonly size?: 'sm' | 'md' | 'lg';
  readonly className?: string;
  readonly onComplete?: () => void;
};

const colorMap = {
  yellow: 'bg-yellow-400',
  red: 'bg-red-400',
  blue: 'bg-blue-400',
  green: 'bg-green-400',
  purple: 'bg-purple-400',
  pink: 'bg-pink-400',
  orange: 'bg-orange-400',
};

const sizeMap = {
  sm: 'h-1 w-1',
  md: 'h-2 w-2',
  lg: 'h-3 w-3',
};

// removed variants; using per-particle animate values instead

type Particle = {
  id: number;
  x: number;
  y: number;
  shape: ConfettiShape;
  color: ConfettiColor;
  delay: number;
  duration: number;
  gravity: number;
  wind: number;
};

export default function Confetti({
  trigger,
  duration = 2000,
  particleCount = 50,
  // eslint-disable-next-line react/no-unstable-default-props
  shapes = ['circle', 'square', 'triangle'] as ConfettiShape[],
  // eslint-disable-next-line react/no-unstable-default-props
  colors = ['yellow', 'red', 'blue', 'green', 'purple'] as ConfettiColor[],
  gravity = 0.5,
  wind = 0.1,
  size = 'md',
  className,
  onComplete,
}: ConfettiProps) {
  const [particles, setParticles] = React.useState<Particle[]>([]);

  React.useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;

    if (trigger) {
      const newParticles: Particle[] = Array.from({ length: particleCount }, (_, i) => {
        const shapeIndex = Math.floor(Math.random() * shapes.length);
        const colorIndex = Math.floor(Math.random() * colors.length);
        return {
          id: i,
          x: Math.random() * 100,
          y: -10,
          shape: shapes[shapeIndex]!,
          color: colors[colorIndex]!,
          delay: Math.random() * 0.5,
          duration: duration / 1000 + Math.random() * 0.5,
          gravity: gravity + Math.random() * 0.2,
          wind: wind + Math.random() * 0.1 - 0.05,
        };
      });
      // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
      setParticles(newParticles);

      timer = setTimeout(() => {
        setParticles([]);
        onComplete?.();
      }, duration);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [trigger, duration, particleCount, shapes, colors, gravity, wind, onComplete]);

  if (!trigger || particles.length === 0) {
    return null;
  }

  return (
    <div className={className || 'pointer-events-none absolute inset-0 overflow-hidden'}>
      {particles.map(particle => (
        <motion.div
          key={particle.id}
          className={`absolute ${sizeMap[size]} ${colorMap[particle.color]} ${
            particle.shape === 'circle' ? 'rounded-full' : ''
          }`}
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          transition={{
            delay: particle.delay,
            duration: particle.duration,
            ease: [0.4, 0, 0.2, 1],
          }}
          animate={{
            y: [particle.y, particle.y + 100 + particle.gravity * 50],
            x: [particle.x, particle.x + particle.wind * 30],
            opacity: [1, 1, 0],
            scale: [0, 1, 0.8, 0],
          }}
        />
      ))}
    </div>
  );
}
