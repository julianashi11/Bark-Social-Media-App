import { input, select } from '../ui/prompt.js';
import { searchUsers } from '../users.js';
import { follow, unfollow, isFollowing } from '../follows.js';
import { showProfile } from './profile.js';

export async function findUsers(currentUser) {
  const query = await input({ message: 'Search by username or display name:' });

  const results = searchUsers(query).filter((u) => u.id !== currentUser.id);

  if (results.length === 0) {
    console.log('\n  No users matched that query.\n');
    return;
  }

  const choices = results.map((u) => ({
    name: `@${u.username} — ${u.displayName}${
      isFollowing(currentUser.id, u.id) ? '  (following)' : ''
    }`,
    value: u.id,
  }));
  choices.push({ name: '← Back to menu', value: '__back' });

  const picked = await select({
    message: `Found ${results.length} user${results.length === 1 ? '' : 's'}:`,
    choices,
  });

  if (picked === '__back') return;

  const target = results.find((u) => u.id === picked);
  await userActions(currentUser, target);
}

async function userActions(currentUser, target) {
  while (true) {
    const following = isFollowing(currentUser.id, target.id);
    const action = await select({
      message: `${target.displayName} (@${target.username}) — ${
        following ? 'you follow them' : 'you do not follow them'
      }`,
      choices: [
        { name: 'View their profile + posts', value: 'profile' },
        { name: following ? 'Unfollow' : 'Follow', value: 'toggle' },
        { name: '← Back', value: 'back' },
      ],
    });

    if (action === 'back') return;
    if (action === 'profile') await showProfile(target);
    if (action === 'toggle') {
      if (following) unfollow(currentUser.id, target.id);
      else follow(currentUser.id, target.id);
      console.log(
        `\n  ${following ? 'Unfollowed' : 'Followed'} @${target.username}.\n`,
      );
    }
  }
}
