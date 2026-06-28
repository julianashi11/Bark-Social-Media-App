import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { setStorePath } from './storage.js';
import { createPost, getAllPosts, getPostsByAuthor } from './posts.js';

let tmpPath;

beforeEach(() => {
  tmpPath = path.join(os.tmpdir(), `bark-test-posts-${Date.now()}-${Math.random()}.json`);
  setStorePath(tmpPath);
});

afterEach(() => {
  if (fs.existsSync(tmpPath)) fs.unlinkSync(tmpPath);
});

describe('posts', () => {
  it('returns at least the seed posts when no user posts exist', () => {
    const all = getAllPosts();
    expect(all.length).toBeGreaterThan(0);
    expect(all.every((p) => p.id && p.authorId && p.content && p.timestamp)).toBe(true);
  });

  it('feed is sorted newest-first', () => {
    const all = getAllPosts();
    for (let i = 1; i < all.length; i++) {
      expect(all[i - 1].timestamp).toBeGreaterThanOrEqual(all[i].timestamp);
    }
  });

  it('createPost adds a post with the right shape', () => {
    const post = createPost('user_alice', 'hello world');
    expect(post).toMatchObject({
      authorId: 'user_alice',
      content: 'hello world',
    });
    expect(typeof post.id).toBe('string');
    expect(typeof post.timestamp).toBe('number');
  });

  it('createPost trims whitespace', () => {
    const post = createPost('user_alice', '   hello   ');
    expect(post.content).toBe('hello');
  });

  it('createPost rejects empty content', () => {
    expect(() => createPost('user_alice', '')).toThrow();
    expect(() => createPost('user_alice', '   ')).toThrow();
  });

  it('createPost rejects a missing authorId', () => {
    expect(() => createPost('', 'hello')).toThrow();
  });

  it('newly created post appears at the top of the feed', () => {
    const post = createPost('user_alice', 'brand new');
    const all = getAllPosts();
    expect(all[0].id).toBe(post.id);
  });

  it('getPostsByAuthor returns only that user\'s posts', () => {
    createPost('user_alice', 'one from alice');
    createPost('user_bo', 'one from bo');
    const alicePosts = getPostsByAuthor('user_alice');
    expect(alicePosts.every((p) => p.authorId === 'user_alice')).toBe(true);
    // Alice has 2 seeded posts + 1 just-created = 3
    expect(alicePosts).toHaveLength(3);
  });

});
