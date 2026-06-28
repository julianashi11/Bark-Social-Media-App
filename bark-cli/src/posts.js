// Post operations.
// The feed is the union of static seed posts (from testUsers.js) and
// posts you've created at runtime (stored in bark-store.json).

import { testPosts } from './data/testUsers.js';
import { load, save } from './storage.js';

let postSeq = 0;

function nextPostId() {
  postSeq += 1;
  return `post_user_${Date.now()}_${postSeq}`;
}

export function createPost(authorId, content) {
  if (!authorId) {
    throw new Error('createPost: authorId is required');
  }
  if (typeof content !== 'string' || content.trim().length === 0) {
    throw new Error('createPost: content cannot be empty');
  }

  const post = {
    id: nextPostId(),
    authorId,
    content: content.trim(),
    timestamp: Date.now(),
  };

  const store = load();
  store.userPosts.push(post);
  save(store);

  return post;
}

export function getAllPosts() {
  const store = load();
  return [...testPosts, ...store.userPosts].sort(
    (a, b) => b.timestamp - a.timestamp,
  );
}

export function getPostsByAuthor(authorId) {
  return getAllPosts().filter((p) => p.authorId === authorId);
}
