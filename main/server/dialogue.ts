import type { RpgPlayer } from '@rpgjs/server';

export interface DialogueOptions {
  /** Display name of the speaker (shown in amber above text). */
  speaker?: string;
  /** Character ID for portrait lookup (e.g. 'lira', 'elder-torin', 'god-resonance'). */
  characterId?: string;
  /** Expression variant: 'neutral' | 'happy' | 'sad' | 'determined'. */
  expression?: string;
}

export interface DialogueChoice {
  text: string;
  value: string | number;
}

/**
 * Show a dialogue box with optional portrait.
 * Returns a promise that resolves when the player dismisses the dialogue.
 *
 * The client-side dialogue-box component calls rpgGuiClose('dialogue-box'),
 * which triggers player.removeGui() on the server, resolving the waitingAction promise.
 */
export async function showDialogue(
  player: RpgPlayer,
  text: string,
  options: DialogueOptions = {},
): Promise<void> {
  const gui = player.gui('dialogue-box');
  await gui.open(
    {
      text,
      speaker: options.speaker ?? '',
      characterId: options.characterId ?? '',
      expression: options.expression ?? 'neutral',
      choices: [],
    },
    {
      waitingAction: true,
      blockPlayerInput: true,
    },
  );
}

/**
 * Show a dialogue box with choices and optional portrait.
 * Returns the chosen option or null if dismissed.
 */
export async function showDialogueChoices(
  player: RpgPlayer,
  text: string,
  choices: DialogueChoice[],
  options: DialogueOptions = {},
): Promise<DialogueChoice | null> {
  const gui = player.gui('dialogue-box');
  const result = await gui.open(
    {
      text,
      speaker: options.speaker ?? '',
      characterId: options.characterId ?? '',
      expression: options.expression ?? 'neutral',
      choices,
    },
    {
      waitingAction: true,
      blockPlayerInput: true,
    },
  );
  return result ?? null;
}
