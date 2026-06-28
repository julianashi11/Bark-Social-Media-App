import { describe, it, expect } from 'vitest';
import { follow, unfollow, isFollowing, getFollowing, getFollowingCount, getFollowerCount } from './follows';

describe('follows', () => {
  it('isFollowing is false by default', () => {
    expect(isFollowing('user_alice', 'user_bo')).toBe(false);
  });

  it('follow makes isFollowing return true', () => {
    follow('user_alice', 'user_bo');
    expect(isFollowing('user_alice', 'user_bo')).toBe(true);
  });

  it('follow is idempotent', () => {
    follow('user_alice', 'user_bo');
    follow('user_alice', 'user_bo');
    expect(getFollowing('user_alice')).toEqual(['user_bo']);
  });

  it('unfollow removes the follow', () => {
    follow('user_alice', 'user_bo');
    unfollow('user_alice', 'user_bo');
    expect(isFollowing('user_alice', 'user_bo')).toBe(false);
  });

  it('unfollow is a no-op if not currently following', () => {
    expect(() => unfollow('user_alice', 'user_bo')).not.toThrow();
    expect(isFollowing('user_alice', 'user_bo')).toBe(false);
  });

  it('getFollowing lists all followed user ids', () => {
    follow('user_alice', 'user_bo');
    follow('user_alice', 'user_chiara');
    expect(getFollowing('user_alice').sort()).toEqual(['user_bo', 'user_chiara']);
  });

  it('follows are per-follower (one direction)', () => {
    follow('user_alice', 'user_bo');
    expect(isFollowing('user_bo', 'user_alice')).toBe(false);
  });

  it('rejects following yourself', () => {
    expect(() => follow('user_alice', 'user_alice')).toThrow();
  });

  it('rejects missing ids', () => {
    expect(() => follow('', 'user_bo')).toThrow();
    expect(() => follow('user_alice', '')).toThrow();
  });
});

describe('follow counts', () => {
  it('followingCount starts at 0', () => {
    expect(getFollowingCount('user_alice')).toBe(0);
  });

  it('followerCount starts at 0', () => {
    expect(getFollowerCount('user_bo')).toBe(0);
  });

  it('following someone increments your followingCount by exactly 1', () => {
    const before = getFollowingCount('user_alice');
    follow('user_alice', 'user_bo');
    expect(getFollowingCount('user_alice')).toBe(before + 1);
  });

  it('following someone increments their followerCount by exactly 1', () => {
    const before = getFollowerCount('user_bo');
    follow('user_alice', 'user_bo');
    expect(getFollowerCount('user_bo')).toBe(before + 1);
  });

  it('followingCount and followerCount are always integers', () => {
    follow('user_alice', 'user_bo');
    follow('user_chiara', 'user_bo');
    expect(Number.isInteger(getFollowingCount('user_alice'))).toBe(true);
    expect(Number.isInteger(getFollowerCount('user_bo'))).toBe(true);
  });

  it('unfollowing decrements followingCount by 1', () => {
    follow('user_alice', 'user_bo');
    const before = getFollowingCount('user_alice');
    unfollow('user_alice', 'user_bo');
    expect(getFollowingCount('user_alice')).toBe(before - 1);
  });

  it('unfollowing decrements followerCount by 1', () => {
    follow('user_alice', 'user_bo');
    const before = getFollowerCount('user_bo');
    unfollow('user_alice', 'user_bo');
    expect(getFollowerCount('user_bo')).toBe(before - 1);
  });

  it('multiple followers each increment followerCount by 1', () => {
    follow('user_alice', 'user_bo');
    follow('user_chiara', 'user_bo');
    follow('user_devon', 'user_bo');
    expect(getFollowerCount('user_bo')).toBe(3);
  });
});
