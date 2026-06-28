import { input } from '../ui/prompt.js';
import { createPost } from '../posts.js';

export async function composePost(user) {
  console.log(`\n  Writing as @${user.username}.`);
  const content = await input({
    message: 'What do you want to say?',
    validate: (v) => v.trim().length > 0 || 'A bark cannot be empty.',
  });
  createPost(user.id, content);
  console.log('\n  Posted!\n');
}
