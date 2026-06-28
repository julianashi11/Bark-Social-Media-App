// React context that exposes the currently "logged-in" test user.
// Wraps the session module and keeps in sync with storage changes
// (e.g. so Reset Bark elsewhere correctly clears the user here too).

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { User } from '../types';
import {
  getCurrentUser,
  setCurrentUser as persistUserId,
  clearCurrentUser,
} from '../session';
import { subscribe } from '../storage';

type CurrentUserContextValue = {
  user: User | null;
  setUser: (userId: string) => void;
  signOut: () => void;
};

const CurrentUserContext = createContext<CurrentUserContextValue | null>(null);

export function CurrentUserProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(() => getCurrentUser());

  // Keep context in sync with storage so external resets propagate.
  useEffect(() => subscribe(() => setUserState(getCurrentUser())), []);

  const setUser = useCallback((userId: string) => {
    persistUserId(userId);
    setUserState(getCurrentUser());
  }, []);

  const signOut = useCallback(() => {
    clearCurrentUser();
    setUserState(null);
  }, []);

  return (
    <CurrentUserContext.Provider value={{ user, setUser, signOut }}>
      {children}
    </CurrentUserContext.Provider>
  );
}

export function useCurrentUser(): CurrentUserContextValue {
  const ctx = useContext(CurrentUserContext);
  if (!ctx) {
    throw new Error('useCurrentUser must be used inside <CurrentUserProvider>');
  }
  return ctx;
}
