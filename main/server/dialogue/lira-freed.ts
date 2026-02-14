import { Move, RpgEvent, RpgMap, type RpgPlayer, RpgPlayerHooks, RpgScene } from '@rpgjs/server';

export default async function (player: RpgPlayer) {
  // Trigger conditions: Lira freed from expanded Stagnation Zone
  // Context: Player broadcasts potency 4+ fragment after all 4 god recalls.
  // This dialogue assumes these conditions have been met by the calling event/script.
  // For a real game, you might check player.getQuest('god-recalls').isCompleted()
  // and player.getVariable('broadcastPotency') >= 4, etc.

  const npcGraphic = 'lira_portrait'; // Assuming a graphic ID for Lira's portrait

  // Lira: "I... how long?"
  await player.showText('I... how long?', { speaker: 'Lira', portrait: npcGraphic });

  // Lira: "I remember the crystal closing. I remember reaching for the anchor stone. And then... nothing. A perfect, silent nothing."
  await player.showText(
    'I remember the crystal closing. I remember reaching for the anchor stone. And then... nothing. A perfect, silent nothing.',
    { speaker: 'Lira', portrait: npcGraphic },
  );

  // Lira: "It wasn't terrible. That's the worst part. If it had hurt, I could hate them for it. But it was just... still. And I\'m not built for still."
  await player.showText(
    "It wasn't terrible. That's the worst part. If it had hurt, I could hate them for it. But it was just... still. And I'm not built for still.",
    { speaker: 'Lira', portrait: npcGraphic },
  );

  // Lira: "Thank you. Now tell me everything I missed — and then let's go finish what we started."
  await player.showText(
    "Thank you. Now tell me everything I missed — and then let's go finish what we started.",
    { speaker: 'Lira', portrait: npcGraphic },
  );

  // After this dialogue, Lira would typically rejoin the party or trigger a new quest.
  // Example:
  // player.addPartyMember('lira');
  // player.setQuest('act2-lira-rejoined', 'completed');
}
