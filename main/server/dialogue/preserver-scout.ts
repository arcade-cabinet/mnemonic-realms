import type { RpgPlayer } from '@rpgjs/server';

export default async function dialogue(player: RpgPlayer) {
  // Trigger conditions can be checked here, e.g., quest state, flags, player level.
  // For this dialogue, we assume it's triggered directly by the event interaction.

  // Preserver Scout's initial greeting
  await player.showText('Halt. This area is under preservation protocol.', {
    speaker: 'Preserver Scout',
  });

  // Hana's question
  await player.showText('Who are you?', { speaker: 'Hana' });

  // Preserver Scout explains their purpose
  await player.showText(
    "We've preserved it. This tower was built by a civilization that chose to dissolve. Now it will endure forever.",
    { speaker: 'Preserver Scout' },
  );

  // Hana's response to the preservation explanation
  await player.showText("You call this safe? You've frozen an entire watchtower.", {
    speaker: 'Hana',
  });

  // Preserver Scout's final statement
  await player.showText('That is the point.', { speaker: 'Preserver Scout' });

  // Implicit: The Preserver Scout leaves or the immediate interaction ends.
  // Hana's internal monologue/summary after the encounter.
  await player.showText(
    "The Preservers. That's who made the clearing in Heartfield. That's who's doing this.",
    { speaker: 'Hana' },
  );
  await player.showText(
    'They\'re not monsters. That scout was polite, even reasonable. But they want to freeze the whole world. Every stone, every river, every person — "exactly as it was."',
    { speaker: 'Hana' },
  );

  // Hana's call to action
  await player.showText(
    "We need to go back to Heartfield. I think it's time you learned to break a stagnation zone.",
    { speaker: 'Hana' },
  );

  // You might want to set a quest flag or update quest state here
  // player.setQuest('act1-scene9-preserver-scout-met', 'completed');
}
