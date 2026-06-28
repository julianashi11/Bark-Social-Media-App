import { getPostsByAuthor } from '../posts.js';
import { getFollowing } from '../follows.js';
import { getUserById } from '../users.js';
import { pressEnter } from '../ui/prompt.js';
import { printPost } from './feed.js';

export async function showMyProfile(user) {
  await showProfile(user);
}

export async function showProfile(user) {
  const posts = getPostsByAuthor(user.id);
  const followingIds = getFollowing(user.id);

  console.log('\n  ===== PROFILE =====\n');
  console.log(`  ${user.displayName} (@${user.username})`);
  console.log(`  ${user.bio}`);
  console.log();
  console.log(`  Following: ${followingIds.length}`);
  if (followingIds.length > 0) {
    const followingHandles = followingIds
      .map((id) => getUserById(id))
      .filter(Boolean)
      .map((u) => `@${u.username}`)
      .join(', ');
    console.log(`     ${followingHandles}`);
  }
  console.log(`  Posts:     ${posts.length}`);
  console.log();
  console.log('  -- Posts --');
  if (posts.length === 0) {
    console.log('    (nothing yet)\n');
  } else {
    for (const p of posts) printPost(p);
  }
  await pressEnter();
}
