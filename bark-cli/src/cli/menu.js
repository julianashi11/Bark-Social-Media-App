import { select } from '../ui/prompt.js';
import { showFeed } from './feed.js';
import { composePost } from './compose.js';
import { showMyProfile } from './profile.js';
import { findUsers } from './findFriends.js';
import { confirmReset } from './reset.js';
import { getCurrentUser } from '../session.js';

export async function mainMenu(initialUser) {
  let user = initialUser;
  while (true) {
    const choice = await select({
      message: 'What do you want to do?',
      choices: [
        { name: 'View feed', value: 'feed' },
        { name: 'Write a post', value: 'compose' },
        { name: 'My profile', value: 'profile' },
        { name: 'Find users', value: 'find' },
        { name: 'Reset Bark', value: 'reset' },
        { name: 'Quit', value: 'quit' },
      ],
    });

    if (choice === 'quit') {
      console.log('\n  See you soon.\n');
      return;
    }
    if (choice === 'feed') await showFeed();
    if (choice === 'compose') await composePost(user);
    if (choice === 'profile') await showMyProfile(user);
    if (choice === 'find') await findUsers(user);
    if (choice === 'reset') {
      const didReset = await confirmReset();
      if (didReset) {
        console.log('  Bark has been reset. Exiting — run `npm start` to log in again.\n');
        return;
      }
    }

    // Refresh in case anything changed underneath us.
    const refreshed = getCurrentUser();
    if (refreshed) user = refreshed;
  }
}
