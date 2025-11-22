// Rules applied: brace-style:1tbs, ts:consistent-type-definitions:type, antfu/no-top-level-await:off
'use client';

import type { PathNodeColumnProps, PathNodeDescriptor } from '@molecules/PathNodeColumn';
import PathNodeButton from '@atoms/PathNodeButton';
import PathNodeColumn from '@molecules/PathNodeColumn';
import * as React from 'react';
import JumpCTA from '../molecules/JumpCTA';

export type PathProgressSection = PathNodeColumnProps & { readonly level: number };

export type PathProgressMapProps = {
  readonly sections: PathProgressSection[];
  readonly onSelectSession?: (id: string) => void;
  readonly renderNode?: (node: PathNodeDescriptor) => React.ReactNode;
  readonly onJumpToSession?: (id: string) => void;
};

export default function PathProgressMap({
  sections,
  onSelectSession,
  renderNode,
  onJumpToSession,
}: PathProgressMapProps) {
  return (
    <section className="flex w-full flex-col items-stretch gap-12 pt-[48px]">
      {sections
        .sort((a, b) => a.level - b.level)
        .map((section, index) => (
          <div key={section.level} className="relative flex w-full flex-col items-center gap-6">
            <PathNodeColumn
              {...section}
              nodes={section.nodes}
              renderNode={(node) => {
                const enhanced: PathNodeDescriptor = {
                  ...node,
                  onSelect: () => onSelectSession?.(node.id),
                };
                return renderNode ? renderNode(enhanced) : <DefaultNode {...enhanced} />;
              }}
              curveUpwards={section.curveUpwards}
            />

            {section.nodes.some(node => (node as PathNodeDescriptor & { jumpAvailable?: boolean }).jumpAvailable)
              ? (
                <div className="mt-4">
                  <JumpCTA
                    onClick={() => {
                      const target = section.nodes.find(
                        node => (node as PathNodeDescriptor & { jumpAvailable?: boolean }).jumpAvailable,
                      );
                      if (target) {
                        onJumpToSession?.(target.id);
                      }
                    }}
                  />
                </div>
              )
              : null}

            <ProgressConnector level={section.level} hasNext={index < sections.length - 1} />
          </div>
        ))}
    </section>
  );
}

function DefaultNode(props: PathNodeDescriptor) {
  return <PathNodeButton {...props} />;
}

function ProgressConnector({ level, hasNext }: { readonly level: number; readonly hasNext: boolean }) {
  if (!hasNext) {
    return null;
  }

  return (
    <div className="flex w-full items-center justify-center gap-2" aria-hidden>
      <div className="h-px w-full rounded-full bg-gray-300" />
      <div className="text-lg text-nowrap text-gray-600">
        Next • Level
        {level + 1}
      </div>
      <div className="h-px w-full rounded-full bg-gray-300" />
    </div>
  );
}
