import { RpgCommonPlayer, type RpgPlayer } from '@rpgjs/server';

export default async function (player: RpgPlayer, engine: any) {
  // Define Lira as a speaker with her graphic ID
  const Lira = {
    name: 'Lira',
    graphic: 'lira_portrait', // Replace with the actual graphic ID for Lira's portrait
  };

  // --- Trigger Conditions ---
  // Check if the main quest 'MQ-01' is completed
  const mq01Completed = player.getVariable('quest:MQ-01') === 'completed';
  // Check if this specific introductory dialogue has already been played
  const introPlayed = player.getVariable('dlg:lira-workshop-intro');

  // This dialogue should only play if MQ-01 is completed AND it hasn't played before.
  if (!mq01Completed || introPlayed) {
    return; // Exit if conditions are not met or dialogue already played
  }

  // --- Dialogue Sequence ---

  await player.showText(
    "You must be the one Callum keeps talking about. I'm Lira — Mnemonic Architect, freelance, currently between assignments.",
    { speaker: Lira },
  );

  await player.showText(
    "He told me you can see the shimmer around Resonance Stones. Most people can't. That's the first sign of the talent.",
    { speaker: Lira },
  );

  await player.showText("Show me what you've collected.", { speaker: Lira });

  await player.showText(
    "Four fragments already? From the garden stones? Good instincts. You didn't force them — you just... noticed. That's exactly right.",
    { speaker: Lira },
  );

  await player.showText(
    "I want to travel with you for a while, if that's all right. Callum tells me you're curious about the world beyond the village, and there are things I can teach you better in the field than in a workshop.",
    { speaker: Lira },
  );

  // --- Post-Dialogue Actions ---
  // Set a flag to indicate this dialogue has been played, preventing it from re-triggering.
  player.setVariable('dlg:lira-workshop-intro', true);

  // Optionally, update quest state or add Lira to the party here if this is the point she joins.
  // Example: player.addPartyMember('lira_character_id');
  // Example: player.setVariable('quest:MQ-02', 'started');
}
