// Rules applied: brace-style:1tbs, ts:consistent-type-definitions:type, antfu/no-top-level-await:off
'use client';

import Avatar from '@atoms/Avatar';
import { Edit2, Plus } from 'lucide-react';
import Image from 'next/image';
import * as React from 'react';
import { cn } from '@/utils/cn';

export type ProfileHeaderCardProps = {
  readonly name: string;
  readonly handle: string;
  readonly joinedAt: string;
  readonly avatarUrl?: string;
  readonly coverUrl?: string;
  readonly primaryFlag?: string;
  readonly following: number;
  readonly followers: number;
  readonly onEditCover?: () => void;
  readonly onEditAvatar?: () => void;
};

/**
 * ProfileHeaderCard — Organism
 * Complex component with cover, avatar, name, social stats
 * Handles user profile header display
 */
export default function ProfileHeaderCard({
  name,
  handle,
  joinedAt,
  avatarUrl,
  coverUrl,
  primaryFlag,
  following,
  followers,
  onEditCover,
  onEditAvatar,
}: ProfileHeaderCardProps) {
  const joinedDate = React.useMemo(() => {
    const date = new Date(joinedAt);
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      year: 'numeric',
    }).format(date);
  }, [joinedAt]);

  return (
    <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5">
      {/* Cover */}
      <div
        className={cn('relative h-36 md:h-44', coverUrl ? '' : 'bg-black/30')}
        style={
          coverUrl
            ? {
              backgroundImage: `url(${coverUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }
            : undefined
        }
      >
        {onEditCover && (
          <button
            type="button"
            onClick={onEditCover}
            className="absolute top-3 right-3 grid h-9 w-9 place-content-center rounded-full bg-black/40 transition-colors hover:bg-black/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-[--ring]"
            aria-label="Edit cover"
          >
            <Edit2 size={16} className="text-white" />
          </button>
        )}
      </div>

      <div className="relative px-4 pb-4 sm:px-6 sm:pb-6">
        {/* Avatar */}
        <div className="relative -mt-10 inline-block">
          {avatarUrl
            ? (
              <Avatar src={avatarUrl} alt={name} size={96} className="border-4 border-white/10" />
            )
            : (
              <button
                type="button"
                onClick={onEditAvatar}
                className="grid h-24 w-24 place-content-center rounded-full border-2 border-dashed border-[#4b6b84] bg-[#15212b] transition-colors hover:bg-[#1a2833] focus:outline-none focus-visible:ring-2 focus-visible:ring-[--ring]"
                aria-label="Add avatar"
              >
                <Plus size={32} className="text-[--muted]" />
              </button>
            )}
        </div>

        {/* Flag Badge */}
        {primaryFlag && (
          <div className="absolute top-[-40px] right-4 h-8 w-8 overflow-hidden rounded-md ring-1 ring-[--border]">
            <Image
              src={primaryFlag}
              alt="Primary language"
              width={32}
              height={32}
              className="h-full w-full object-cover"
            />
          </div>
        )}

        {/* Name & Handle */}
        <div className="mt-2">
          <h1 className="text-xl font-semibold text-white sm:text-2xl md:text-3xl">{name}</h1>
          <div className="mt-1 text-sm text-white/70 sm:text-base">
            @
            {handle}
          </div>
          <div className="mt-1 text-xs text-white/70 sm:text-sm">
            Joined
            {joinedDate}
          </div>
        </div>

        {/* Social Counts */}
        <div className="mt-3 flex gap-4 text-sm sm:gap-6">
          <button
            type="button"
            className="text-sky-300 transition-colors hover:text-sky-200 focus:outline-none focus-visible:rounded focus-visible:ring-2 focus-visible:ring-sky-400/60"
          >
            <span className="font-semibold">{following}</span>
            {' '}
            Following
          </button>
          <button
            type="button"
            className="text-sky-300 transition-colors hover:text-sky-200 focus:outline-none focus-visible:rounded focus-visible:ring-2 focus-visible:ring-sky-400/60"
          >
            <span className="font-semibold">{followers}</span>
            {' '}
            Followers
          </button>
        </div>

        {/* Divider */}
        <div className="mt-4 border-t border-white/10" />
      </div>
    </section>
  );
}
