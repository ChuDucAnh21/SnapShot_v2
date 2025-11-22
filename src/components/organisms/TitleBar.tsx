import React from 'react';
import BackButton from '../molecules/BackButton';
import ExtraActions from '../molecules/ExtraActions';
import GuidebookButton from '../molecules/GuidebookButton';
import SectionPill from '../molecules/SectionPill';

export type TitleBarProps = {
  showBack?: boolean;
  sectionText?: string;
  title?: string;
  guidebookHref?: string;
  rightSlot?: React.ReactNode;
};

const TitleBar: React.FC<TitleBarProps> = ({ showBack, sectionText, title, guidebookHref, rightSlot }) => (
  <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/50">
    <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
      <div className="flex items-center gap-3">
        {showBack && <BackButton />}
        {sectionText && <SectionPill text={sectionText} />}
        {title && <h1 className="text-lg font-bold text-slate-800 md:text-xl">{title}</h1>}
      </div>
      <div className="flex items-center gap-2">
        {guidebookHref && <GuidebookButton href={guidebookHref} />}
        {rightSlot ?? <ExtraActions />}
      </div>
    </div>
  </header>
);

export default TitleBar;
