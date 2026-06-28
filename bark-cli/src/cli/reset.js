import { confirm } from '../ui/prompt.js';
import { reset } from '../storage.js';

export async function confirmReset() {
  console.log('\n  Reset clears your follows, your posts, AND your current login.');
  console.log('  You will pick a user again the next time you run Bark.\n');
  const yes = await confirm({ message: 'Are you sure?', default: false });
  if (yes) {
    reset();
    return true;
  }
  console.log('\n  Cancelled.\n');
  return false;
}
