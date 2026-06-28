import { describe, it, expect } from 'vitest';
import { getAllUsers, getUserById, searchUsers } from './users';

describe('users', () => {
  it('returns all six test users', () => {
    expect(getAllUsers()).toHaveLength(6);
  });

  it('finds a user by id', () => {
    expect(getUserById('user_alice')).toMatchObject({ username: 'luna' });
  });

  it('returns null for an unknown id', () => {
    expect(getUserById('user_nobody')).toBeNull();
  });

  it('searches case-insensitively by username', () => {
    const hits = searchUsers('LUNA');
    expect(hits).toHaveLength(1);
    expect(hits[0].username).toBe('luna');
  });

  it('searches case-insensitively by display name', () => {
    const hits = searchUsers('Bear');
    expect(hits).toHaveLength(1);
    expect(hits[0].username).toBe('bear');
  });

  it('returns an empty array for an empty query', () => {
    expect(searchUsers('')).toEqual([]);
    expect(searchUsers('   ')).toEqual([]);
  });

  it('returns an empty array when nothing matches', () => {
    expect(searchUsers('xyzz')).toEqual([]);
  });

  it('can return multiple matches', () => {
    const hits = searchUsers('i');
    expect(hits.length).toBeGreaterThan(1);
  });

  it('all usernames are unique', () => {
    const users = getAllUsers();
    const usernames = users.map((u) => u.username);
    expect(new Set(usernames).size).toBe(usernames.length);
  });

  it('all user ids are unique', () => {
    const users = getAllUsers();
    const ids = users.map((u) => u.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('usernames are non-empty strings', () => {
    const users = getAllUsers();
    expect(users.every((u) => typeof u.username === 'string' && u.username.length > 0)).toBe(true);
  });
});
