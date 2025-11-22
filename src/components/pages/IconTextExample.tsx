// Rules applied: brace-style:1tbs, ts:consistent-type-definitions:type, antfu/no-top-level-await:off
'use client';

import { Heart, Star, Zap } from 'lucide-react';
import * as React from 'react';
import IconText from '@/components/atoms/IconText';
import HeartCounter from '@/components/molecules/HeartCounter';

export default function IconTextExample() {
  return (
    <div className="space-y-4 p-4">
      <h2 className="text-lg font-semibold">IconText Examples</h2>

      {/* Basic usage */}
      <IconText icon={<Star className="h-4 w-4 text-yellow-500" />} text="Rating: 4.5" />

      {/* Vertical layout */}
      <IconText icon={<Zap className="h-4 w-4 text-blue-500" />} text="Energy" direction="vertical" align="center" />

      {/* Custom styling */}
      <IconText icon={<Heart className="h-4 w-4 text-red-500" />} text="Likes" className="text-red-600" gap="lg" />

      <h2 className="mt-6 text-lg font-semibold">HeartCounter Examples</h2>

      {/* Different sizes */}
      <div className="space-y-2">
        <HeartCounter count={5} size="sm" />
        <HeartCounter count={12} size="md" />
        <HeartCounter count={99} size="lg" />
      </div>

      {/* Filled vs outline */}
      <div className="space-y-2">
        <HeartCounter count={3} filled={true} />
        <HeartCounter count={3} filled={false} />
      </div>
    </div>
  );
}
