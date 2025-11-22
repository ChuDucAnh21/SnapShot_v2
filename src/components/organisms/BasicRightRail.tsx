/* eslint-disable react/no-array-index-key */
import type { RightRailCardProps } from '../molecules/RightRailCard';
import React from 'react';
import RightRailCard from '../molecules/RightRailCard';

export type BasicRightRailProps = {
  cards: RightRailCardProps[];
};

const BasicRightRail: React.FC<BasicRightRailProps> = ({ cards }) => (
  <aside className="sticky top-0 hidden h-screen w-[360px] shrink-0 space-y-4 p-4 xl:block">
    {cards.map((c, i) => (
      <RightRailCard key={i} {...c} />
    ))}
  </aside>
);

export default BasicRightRail;
