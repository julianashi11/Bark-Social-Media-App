import { select } from '../ui/prompt.js';
import { getAllUsers, getUserById } from '../users.js';
import { setCurrentUser } from '../session.js';

export async function pickUser() {
  const users = getAllUsers();
  const userId = await select({
    message: 'Who would you like to be?',
    choices: users.map((u) => ({
      name: `@${u.username} — ${u.displayName}`,
      description: u.bio,
      value: u.id,
    })),
  });
  setCurrentUser(userId);
  const me = getUserById(userId);
  console.log(`\n  Welcome, ${me.displayName}!\n`);
  return me;
}
