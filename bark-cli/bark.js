#!/usr/bin/env node
// Bark CLI — entry point.
// Flow:
//   1. If --reset was passed, wipe the store and exit.
//   2. Print the ASCII dog and banner.
//   3. If no user is currently "logged in", ask which user to be.
//   4. Run the main menu loop.

import { printBanner } from './src/ascii.js';
import { reset } from './src/storage.js';
import { pickUser } from './src/cli/pickUser.js';
import { mainMenu } from './src/cli/menu.js';
import { getCurrentUser } from './src/session.js';

async function main() {
  if (process.argv.includes('--reset')) {
    reset();
    console.log('Bark has been reset. Run `npm start` to begin again.');
    return;
  }

  printBanner();

  let user = getCurrentUser();
  if (!user) {
    user = await pickUser();
  } else {
    console.log(`  Logged in as @${user.username}. (Reset Bark in the menu to switch.)\n`);
  }

  await mainMenu(user);
}

main().catch((err) => {
  // Inquirer throws ExitPromptError when the user hits Ctrl+C — treat
  // it as a graceful exit rather than a crash.
  if (err && (err.name === 'ExitPromptError' || err.code === 'ERR_USE_AFTER_CLOSE')) {
    console.log('\n  Goodbye.\n');
    process.exit(0);
  }
  console.error(err);
  process.exit(1);
});
