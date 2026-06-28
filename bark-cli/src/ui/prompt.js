// Thin wrapper around @inquirer/prompts so all interactive prompts can be
// customised in one place (add colors, sound, logging, etc. without
// touching every menu file).

import { select, input, confirm } from '@inquirer/prompts';

export { select, input, confirm };

export async function pressEnter() {
  await input({ message: '(press Enter to continue)' });
}
