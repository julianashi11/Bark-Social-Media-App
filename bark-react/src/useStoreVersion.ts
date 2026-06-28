// Re-render the calling component whenever storage changes.
// Call this in any component that reads from storage (via the lib
// modules) and needs to reflect changes — without it, a post you
// create or a user you follow won't show up until you navigate away
// and back.

import { useEffect, useState } from 'react';
import { subscribe } from './storage';

export function useStoreVersion(): number {
  const [version, setVersion] = useState(0);
  useEffect(() => subscribe(() => setVersion((v) => v + 1)), []);
  return version;
}
