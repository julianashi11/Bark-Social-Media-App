import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { setStorePath } from './storage.js';
import { follow, unfollow, isFollowing, getFollowing } from './follows.js';

let tmpPath;

beforeEach(() => {
  tmpPath = path.join(os.tmpdir(), `bark-test-follows-${Date.now()}-${Math.random()}.json`);
  setStorePath(tmpPath);
});

afterEach(() => {
  if (fs.existsSync(tmpPath)) fs.unlinkSync(tmpPath);
});

describe('follows', () => {
  it('isFollowing is false by default', () => {
    expect(isFollowing('user_alice', 'user_bo')).toBe(false);
  });

  it('follow makes isFollowing return true', () => {
    follow('user_alice', 'user_bo');
    expect(isFollowing('user_alice', 'user_bo')).toBe(true);
  });

  it('follow is idempotent (following twice does not duplicate)', () => {
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

  it('follows are per-follower (alice following bo does not mean bo follows alice)', () => {
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
