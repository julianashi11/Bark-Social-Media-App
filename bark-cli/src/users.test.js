import { describe, it, expect } from 'vitest';
import { getAllUsers, getUserById, searchUsers } from './users.js';

describe('users', () => {
  it('returns all six test users', () => {
    expect(getAllUsers()).toHaveLength(6);
  });

  it('finds a user by id', () => {
    expect(getUserById('user_alice')).toMatchObject({ username: 'alice' });
  });

  it('returns null for an unknown id', () => {
    expect(getUserById('user_nobody')).toBeNull();
  });

  it('searches case-insensitively by username', () => {
    const hits = searchUsers('ALICE');
    expect(hits).toHaveLength(1);
    expect(hits[0].username).toBe('alice');
  });

  it('searches case-insensitively by display name', () => {
    const hits = searchUsers('chen');
    expect(hits).toHaveLength(1);
    expect(hits[0].username).toBe('alice');
  });

  it('returns an empty array for an empty query', () => {
    expect(searchUsers('')).toEqual([]);
    expect(searchUsers('   ')).toEqual([]);
  });

  it('returns an empty array when nothing matches', () => {
    expect(searchUsers('xyzz')).toEqual([]);
  });

  it('can return multiple matches', () => {
    // common substring "i" should match more than one user
    const hits = searchUsers('i');
    expect(hits.length).toBeGreaterThan(1);
  });
});
