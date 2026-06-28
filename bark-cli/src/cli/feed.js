import { getAllPosts } from '../posts.js';
import { getUserById } from '../users.js';
import { pressEnter } from '../ui/prompt.js';

export async function showFeed() {
  const posts = getAllPosts();

  console.log('\n  ===== FEED =====\n');

  if (posts.length === 0) {
    console.log('  No posts yet. Be the first!\n');
  } else {
    for (const post of posts) {
      printPost(post);
    }
  }

  await pressEnter();
}

// Exported so profile.js can render posts the same way.
export function printPost(post) {
  const author = getUserById(post.authorId);
  const handle = author ? `@${author.username}` : 'unknown';
  const name = author ? author.displayName : 'Unknown User';
  const when = new Date(post.timestamp).toLocaleString();

  console.log(`  ${name} (${handle}) — ${when}`);
  console.log(`    ${post.content}`);
  console.log();
}
