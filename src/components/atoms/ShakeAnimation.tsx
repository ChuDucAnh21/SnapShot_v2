// Rules applied: brace-style:1tbs, ts:consistent-type-definitions:type, antfu/no-top-level-await:off
'use client';

import type { Variants } from 'framer-motion';
import { motion } from 'framer-motion';
import * as React from 'react';
import { cn } from '@/utils/cn';

export type ShakeDirection = 'horizontal' | 'vertical' | 'diagonal' | 'circular';

export type ShakeIntensity = 'subtle' | 'moderate' | 'strong' | 'extreme';

export type ShakeAnimationProps = {
  readonly children: React.ReactNode;
  readonly trigger: boolean;
  readonly direction?: ShakeDirection;
  readonly intensity?: ShakeIntensity;
  readonly duration?: number;
  readonly delay?: number;
  readonly repeat?: number;
  readonly className?: string;
  readonly onAnimationComplete?: () => void;
};

const intensityConfig = {
  subtle: { amplitude: 2, frequency: 0.1 },
  moderate: { amplitude: 5, frequency: 0.15 },
  strong: { amplitude: 10, frequency: 0.2 },
  extreme: { amplitude: 20, frequency: 0.3 },
};

const createShakeVariants = (direction: ShakeDirection, intensity: ShakeIntensity, duration: number): Variants => {
  const { amplitude } = intensityConfig[intensity];

  const baseVariants = {
    initial: { x: 0, y: 0, rotate: 0 },
    animate: {
      transition: {
        duration: duration / 1000,
        repeat: 3,
        repeatType: 'reverse' as const,
      },
    },
  };

  switch (direction) {
    case 'horizontal':
      return {
        ...baseVariants,
        animate: {
          ...baseVariants.animate,
          x: [0, -amplitude, amplitude, -amplitude, 0],
        },
      };
    case 'vertical':
      return {
        ...baseVariants,
        animate: {
          ...baseVariants.animate,
          y: [0, -amplitude, amplitude, -amplitude, 0],
        },
      };
    case 'diagonal':
      return {
        ...baseVariants,
        animate: {
          ...baseVariants.animate,
          x: [0, -amplitude, amplitude, -amplitude, 0],
          y: [0, -amplitude, amplitude, -amplitude, 0],
        },
      };
    case 'circular':
      return {
        ...baseVariants,
        animate: {
          ...baseVariants.animate,
          rotate: [0, -amplitude, amplitude, -amplitude, 0],
          scale: [1, 1.05, 0.95, 1.05, 1],
        },
      };
    default:
      return baseVariants;
  }
};

export default function ShakeAnimation({
  children,
  trigger,
  direction = 'horizontal',
  intensity = 'moderate',
  duration = 500,
  delay = 0,
  repeat = 1,
  className,
  onAnimationComplete,
}: ShakeAnimationProps) {
  const [isAnimating, setIsAnimating] = React.useState(false);
  const variants = React.useMemo(
    () => createShakeVariants(direction, intensity, duration),
    [direction, intensity, duration],
  );

  React.useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    if (trigger) {
      timer = setTimeout(() => {
        setIsAnimating(true);
      }, delay);
    } else {
      // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
      setIsAnimating(false);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [trigger, delay]);

  const handleAnimationComplete = React.useCallback(() => {
    setIsAnimating(false);
    onAnimationComplete?.();
  }, [onAnimationComplete]);

  return (
    <motion.div
      className={cn(className)}
      variants={variants}
      initial="initial"
      animate={isAnimating ? 'animate' : 'initial'}
      onAnimationComplete={handleAnimationComplete}
      transition={{
        delay: delay / 1000,
        repeat: repeat - 1,
      }}
    >
      {children}
    </motion.div>
  );
}
