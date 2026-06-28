// Post operations.
// The feed is the union of static seed posts (from data/testUsers.ts)
// and posts you've created at runtime (stored in localStorage).

import { testPosts } from './data/testUsers';
import { load, save } from './storage';
import type { Post } from './types';

let postSeq = 0;

function nextPostId(): string {
  postSeq += 1;
  return `post_user_${Date.now()}_${postSeq}`;
}

export function createPost(
  authorId: string,
  content: string,
  imageUrl?: string,
  groupId?: string,
): Post {
  if (!authorId) {
    throw new Error('createPost: authorId is required');
  }
  if (typeof content !== 'string' || content.trim().length === 0) {
    throw new Error('createPost: content cannot be empty');
  }
  if (imageUrl !== undefined) {
    if (typeof imageUrl !== 'string' || imageUrl.trim().length === 0) {
      throw new Error('createPost: imageUrl must be a non-empty string');
    }
  }
  if (groupId !== undefined) {
    if (typeof groupId !== 'string' || groupId.trim().length === 0) {
      throw new Error('createPost: groupId must be a non-empty string');
    }
  }

  const post: Post = {
    id: nextPostId(),
    authorId,
    content: content.trim(),
    ...(imageUrl !== undefined && { imageUrl: imageUrl.trim() }),
    ...(groupId !== undefined && { groupId: groupId.trim() }),
    timestamp: Date.now(),
  };

  const store = load();
  store.userPosts.push(post);
  save(store);

  return post;
}

export function getAllPosts(): Post[] {
  const store = load();
  return [...testPosts, ...store.userPosts].sort(
    (a, b) => b.timestamp - a.timestamp,
  );
}

export function getPostsByAuthor(authorId: string): Post[] {
  return getAllPosts().filter((p) => p.authorId === authorId);
}

export function getPostsByGroup(groupId: string): Post[] {
  return getAllPosts().filter((p) => p.groupId === groupId);
}
