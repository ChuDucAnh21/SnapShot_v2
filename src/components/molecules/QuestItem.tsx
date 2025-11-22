import React from 'react';
import BasicProgressBar from '../atoms/BasicProgressBar';
import CardSurface from '../atoms/CardSurface';
import Text from '../atoms/Text';

export type QuestItemProps = {
  title: string;
  description?: string;
  progress?: number;
  ctaLabel?: string;
  onCtaClick?: () => void;
};

const QuestItem: React.FC<QuestItemProps> = ({ title, description, progress = 0, ctaLabel = 'Do it', onCtaClick }) => (
  <CardSurface className="p-4">
    <div className="flex items-center justify-between">
      <div>
        <Text variant="title" weight="semibold">
          {title}
        </Text>
        {description && <p className="text-sm text-slate-600">{description}</p>}
      </div>
      {ctaLabel && (
        <button type="button" className="text-sky-700 underline" onClick={onCtaClick}>
          {ctaLabel}
        </button>
      )}
    </div>
    <div className="mt-3">
      <BasicProgressBar value={progress} />
    </div>
  </CardSurface>
);

export default QuestItem;
