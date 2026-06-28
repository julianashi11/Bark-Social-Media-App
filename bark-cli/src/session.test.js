import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { setStorePath } from './storage.js';
import {
  setCurrentUser,
  getCurrentUser,
  getCurrentUserId,
  clearCurrentUser,
} from './session.js';

let tmpPath;

beforeEach(() => {
  tmpPath = path.join(os.tmpdir(), `bark-test-session-${Date.now()}-${Math.random()}.json`);
  setStorePath(tmpPath);
});

afterEach(() => {
  if (fs.existsSync(tmpPath)) fs.unlinkSync(tmpPath);
});

describe('session', () => {
  it('returns null when no user is set', () => {
    expect(getCurrentUser()).toBeNull();
    expect(getCurrentUserId()).toBeNull();
  });

  it('setCurrentUser persists across loads', () => {
    setCurrentUser('user_alice');
    expect(getCurrentUserId()).toBe('user_alice');
    expect(getCurrentUser()).toMatchObject({ id: 'user_alice', username: 'alice' });
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
