import type { RpgPlayer } from '@rpgjs/server';

export default async function (player: RpgPlayer) {
  // Dialogue ID: dlg-aric-ambush
  // Trigger Condition: After 3 recalls (assuming a variable 'godRecallsComplete' tracks this)
  if (player.getVariable('godRecallsComplete') < 3) {
    // This dialogue should only trigger after 3 god recalls.
    // If it's called prematurely, it should not proceed.
    return;
  }

  // Assuming 'aric' is the graphic ID for Serek.
  await player.showText('Architect. I need to talk to you. Not fight — talk.', aricPortrait);
  await player.showText('I was given orders to stop you. These are those orders.', aricPortrait);

  // NARRATION line - no speaker or portrait
  await player.showText('Serek sets his crystal gauntlet on the ground.');

  await player.showText("I'm choosing not to follow them.", aricPortrait);

  // Optional: Set a flag so this specific ambush dialogue doesn't repeat
  player.setVariable('aricAmbushDialogueComplete', true);
}
