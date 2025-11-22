/* eslint-disable react/no-unstable-default-props */
/* eslint-disable react-refresh/only-export-components */
// src/context/right-rail.tsx
'use client';

import type { RightRailSection } from '@organisms/RightRail';
import type { ReactNode } from 'react';
import React, { createContext, use, useState } from 'react';

type Ctx = {
  sections: RightRailSection[];
  setSections: (s: RightRailSection[]) => void;
};

const RightRailCtx = createContext<Ctx | null>(null);

export function RightRailProvider({
  children,
  initialSections = [],
}: {
  children: ReactNode;
  initialSections?: RightRailSection[];
}) {
  const [sections, setSections] = useState<RightRailSection[]>(initialSections);
  return <RightRailCtx value={{ sections, setSections }}>{children}</RightRailCtx>;
}

export function useRightRail() {
  const ctx = use(RightRailCtx);
  if (!ctx) {
    throw new Error('useRightRail must be used within RightRailProvider');
  }
  return ctx;
}

/** Component tiện lợi: set sections khi mount (per page) */
export function UseRightRail({ sections }: { sections: RightRailSection[] }) {
  const { setSections } = useRightRail();
  React.useEffect(() => {
    setSections(sections);
  }, [sections, setSections]);
  return null;
}
