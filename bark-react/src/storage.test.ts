import { describe, it, expect } from 'vitest';
import { load, save, reset, subscribe } from './storage';

describe('storage', () => {
  it('returns an empty store when localStorage is empty', () => {
    expect(load()).toEqual({ currentUserId: null, follows: {}, userPosts: [], groups: [], groupMembers: {}, userLocations: {} });
  });

  it('saves and loads state round-trip', () => {
    const state = {
      currentUserId: 'user_alice',
      follows: { user_alice: ['user_bo'] },
      userPosts: [{ id: 'p1', authorId: 'user_alice', content: 'hi', timestamp: 1 }],
      groups: [],
      groupMembers: {},
      userLocations: {},
    };
    save(state);
    expect(load()).toEqual(state);
  });

  it('fills in missing fields if localStorage has a partial store', () => {
    localStorage.setItem('bark-store', JSON.stringify({ currentUserId: 'user_bo' }));
    expect(load()).toEqual({ currentUserId: 'user_bo', follows: {}, userPosts: [], groups: [], groupMembers: {}, userLocations: {} });
  });

  it('reset() wipes back to empty', () => {
    save({
      currentUserId: 'user_alice',
      follows: { user_alice: ['user_bo'] },
      userPosts: [{ id: 'p1', authorId: 'user_alice', content: 'hi', timestamp: 1 }],
      groups: [],
      groupMembers: {},
      userLocations: {},
    });
    reset();
    expect(load()).toEqual({ currentUserId: null, follows: {}, userPosts: [], groups: [], groupMembers: {}, userLocations: {} });
  });

  it('returns an empty store if localStorage has malformed JSON', () => {
    localStorage.setItem('bark-store', 'not json');
    expect(load()).toEqual({ currentUserId: null, follows: {}, userPosts: [], groups: [], groupMembers: {}, userLocations: {} });
  });

  it('save() notifies subscribers; unsubscribe stops the notifications', () => {
    let calls = 0;
    const unsub = subscribe(() => {
      calls += 1;
    });
    save({ currentUserId: null, follows: {}, userPosts: [], groups: [], groupMembers: {}, userLocations: {} });
    save({ currentUserId: 'user_alice', follows: {}, userPosts: [], groups: [], groupMembers: {}, userLocations: {} });
    expect(calls).toBe(2);
    unsub();
    save({ currentUserId: null, follows: {}, userPosts: [], groups: [], groupMembers: {}, userLocations: {} });
    expect(calls).toBe(2);
  });
});
