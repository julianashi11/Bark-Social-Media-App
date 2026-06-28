import { useState } from 'react';
import type { User } from '../types';

function initials(user: User): string {
  const parts = user.displayName.trim().split(/\s+/);
  return parts
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('');
}

type Props = { user: User; size?: number };

export default function Avatar({ user, size = 40 }: Props) {
  const [imgFailed, setImgFailed] = useState(false);

  if (user.avatarUrl && !imgFailed) {
    return (
      <img
        className="avatar"
        src={user.avatarUrl}
        alt={user.displayName}
        style={{ width: size, height: size, backgroundColor: user.avatarColor }}
        onError={() => setImgFailed(true)}
      />
    );
  }

  return (
    <div
      className="avatar"
      style={{
        backgroundColor: user.avatarColor,
        width: size,
        height: size,
        fontSize: size * 0.4,
      }}
      aria-label={`Avatar for ${user.displayName}`}
    >
      {initials(user)}
    </div>
  );
}
