import { describe, it, expect } from 'vitest';
import {
  setCurrentUser,
  getCurrentUser,
  getCurrentUserId,
  clearCurrentUser,
} from './session';

describe('session', () => {
  it('returns null when no user is set', () => {
    expect(getCurrentUser()).toBeNull();
    expect(getCurrentUserId()).toBeNull();
  });

  it('setCurrentUser persists across loads', () => {
    setCurrentUser('user_alice');
    expect(getCurrentUserId()).toBe('user_alice');
    expect(getCurrentUser()).toMatchObject({ id: 'user_alice', username: 'luna' });
  });

  it('returns null if the persisted user id no longer exists', () => {
    setCurrentUser('user_does_not_exist');
    expect(getCurrentUser()).toBeNull();
  });

  it('clearCurrentUser wipes the login', () => {
    setCurrentUser('user_alice');
    clearCurrentUser();
    expect(getCurrentUserId()).toBeNull();
    expect(getCurrentUser()).toBeNull();
  });
});
