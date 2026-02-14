import type { RpgPlayer } from '@rpgjs/server';

export default async function (player: RpgPlayer) {
  const questMQ09 = player.getQuest('MQ-09');
  const isCorrectLocation = player.map.id === 'preserver-fortress-floor3';

  if (questMQ09 && questMQ09.state === 'active' && isCorrectLocation) {
    const speakerPortrait = 'curator'; // Assuming 'curator' is the ID for The Curator's portrait

    await player.showText("I was hoping you'd come.", {
      speaker: 'The Curator',
      portrait: speakerPortrait,
    });
    await player.showText(
      "That is the world's first thought. The question that started everything: 'Why do things change?'",
      { speaker: 'The Curator', portrait: speakerPortrait },
    );
    await player.showText(
      "I've watched it happen. The pattern: ask, answer, dissolve. An endless cycle.",
      { speaker: 'The Curator', portrait: speakerPortrait },
    );
    await player.showText('I want it to stop. Not the beauty — the loss.', {
      speaker: 'The Curator',
      portrait: speakerPortrait,
    });
    await player.showText('Were you suffering?', {
      speaker: 'The Curator',
      portrait: speakerPortrait,
    });
    await player.showText('Choice is what leads to dissolution.', {
      speaker: 'The Curator',
      portrait: speakerPortrait,
    });
    await player.showText('Why? What makes your vision of the world better than mine?', {
      speaker: 'The Curator',
      portrait: speakerPortrait,
    });
  }
}
