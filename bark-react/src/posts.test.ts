import { describe, it, expect } from 'vitest';
import { createPost, getAllPosts, getPostsByAuthor } from './posts';

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
    expect(post).toMatchObject({ authorId: 'user_alice', content: 'hello world' });
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

  it("getPostsByAuthor returns only that user's posts", () => {
    createPost('user_alice', 'one from alice');
    createPost('user_bo', 'one from bo');
    const alicePosts = getPostsByAuthor('user_alice');
    expect(alicePosts.every((p) => p.authorId === 'user_alice')).toBe(true);
    expect(alicePosts).toHaveLength(4); // 2 regular seed + 1 group seed + 1 created
  });

  it('createPost content must be a string — rejects other types at runtime', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(() => createPost('user_alice', 42 as any)).toThrow();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(() => createPost('user_alice', null as any)).toThrow();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(() => createPost('user_alice', { text: 'hi' } as any)).toThrow();
  });

  it('createPost with imageUrl attaches it to the post', () => {
    const post = createPost('user_alice', 'check this out', 'https://example.com/photo.jpg');
    expect(post.imageUrl).toBe('https://example.com/photo.jpg');
  });

  it('createPost without imageUrl leaves imageUrl undefined', () => {
    const post = createPost('user_alice', 'text only');
    expect(post.imageUrl).toBeUndefined();
  });

  it('createPost rejects a non-string imageUrl', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(() => createPost('user_alice', 'post', 42 as any)).toThrow();
  });

  it('createPost rejects an empty imageUrl', () => {
    expect(() => createPost('user_alice', 'post', '')).toThrow();
    expect(() => createPost('user_alice', 'post', '   ')).toThrow();
  });

  it('timestamp is a positive integer', () => {
    const post = createPost('user_alice', 'timestamp check');
    expect(Number.isInteger(post.timestamp)).toBe(true);
    expect(post.timestamp).toBeGreaterThan(0);
  });

  it('timestamp is approximately the current time', () => {
    const before = Date.now();
    const post = createPost('user_alice', 'timing check');
    const after = Date.now();
    expect(post.timestamp).toBeGreaterThanOrEqual(before);
    expect(post.timestamp).toBeLessThanOrEqual(after);
  });
});
