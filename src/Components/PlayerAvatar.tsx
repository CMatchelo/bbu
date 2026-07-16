import { useMemo } from 'react';
import { createAvatar } from '@dicebear/core';
import { avataaars } from '@dicebear/collection';
import type { Options } from '@dicebear/avataaars';
import { AVATAR_OPTIONS } from '../utils/avatarOptions';

interface Props {
  seed: string;
  size?: number;
  className?: string;
  options?: Options;
}

export function PlayerAvatar({ seed, size = 40, className = '', options = AVATAR_OPTIONS }: Props) {
  const src = useMemo(() => {
    const svg = createAvatar(avataaars, { seed, ...options }).toString();
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  }, [seed, options]);

  return (
    <img
      src={src}
      width={size}
      height={size}
      loading="lazy"
      className={`rounded-full shrink-0 ${className}`}
      alt=""
    />
  );
}
