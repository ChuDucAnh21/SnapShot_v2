'use client';

import type { PathWithMeta } from '@/features/paths/models';
import * as React from 'react';
import LearnLanding from '@/components/organisms/LearnLanding';
import { usePath } from '@/features/paths';

type LearnLandingContainerProps = {
  readonly learnerId: string;
  readonly subjectId: string;
};

export default function LearnLandingContainer({ learnerId, subjectId }: LearnLandingContainerProps) {
  const {
    data,
    isPending,
    isFetching,
  } = usePath(learnerId, subjectId, Boolean(learnerId && subjectId));

  const path = (data?.path ?? null) as PathWithMeta | null;

  const isLoading = (isPending || isFetching) && !path;

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center bg-white">
        <span className="text-sm text-gray-600">Loading learning path...</span>
      </div>
    );
  }

  if (!path) {
    return (
      <div className="flex h-full items-center justify-center bg-white">
        <span className="text-sm text-gray-700">Unable to load the learning path. Please try again later.</span>
      </div>
    );
  }

  return <LearnLanding path={path} />;
}
