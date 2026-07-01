import { useMemo } from 'react';
import { createAvatar } from '@dicebear/core';
import { avataaars } from '@dicebear/collection';
import { AVATAR_OPTIONS } from '../utils/avatarOptions';

interface Props {
  seed: string;
  size?: number;
  className?: string;
}

export function PlayerAvatar({ seed, size = 40, className = '' }: Props) {
  const src = useMemo(() => {
    const svg = createAvatar(avataaars, { seed, ...AVATAR_OPTIONS }).toString();
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  }, [seed]);

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
