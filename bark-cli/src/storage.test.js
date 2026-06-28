import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { load, save, reset, setStorePath } from './storage.js';

let tmpPath;

beforeEach(() => {
  tmpPath = path.join(os.tmpdir(), `bark-test-storage-${Date.now()}-${Math.random()}.json`);
  setStorePath(tmpPath);
});

afterEach(() => {
  if (fs.existsSync(tmpPath)) fs.unlinkSync(tmpPath);
});

describe('storage', () => {
  it('returns an empty store when no file exists', () => {
    expect(load()).toEqual({ currentUserId: null, follows: {}, userPosts: [] });
  });

  it('saves and loads state round-trip', () => {
    const state = {
      currentUserId: 'user_alice',
      follows: { user_alice: ['user_bo'] },
      userPosts: [{ id: 'p1', authorId: 'user_alice', content: 'hi', timestamp: 1 }],
    };
    save(state);
    expect(load()).toEqual(state);
  });

  it('fills in missing fields if the file on disk is partial', () => {
    fs.writeFileSync(tmpPath, JSON.stringify({ currentUserId: 'user_bo' }));
    expect(load()).toEqual({ currentUserId: 'user_bo', follows: {}, userPosts: [] });
  });

  it('reset() wipes the store back to empty', () => {
    save({
      currentUserId: 'user_alice',
      follows: { user_alice: ['user_bo'] },
      userPosts: [{ id: 'p1', authorId: 'user_alice', content: 'hi', timestamp: 1 }],
    });
    reset();
    expect(load()).toEqual({ currentUserId: null, follows: {}, userPosts: [] });
  });

  it('returns an empty store if the file is malformed', () => {
    fs.writeFileSync(tmpPath, 'not json');
    expect(load()).toEqual({ currentUserId: null, follows: {}, userPosts: [] });
  });
});
