export default async function (player: RpgPlayer) {
  const callumSpeaker = {
    name: 'Callum',
    graphic: 'callum', // Assuming 'callum' is the graphic ID for Callum
  };

  await player.showText('No. This is where the world is still beginning.', callumSpeaker);
  await player.showText(
    'If the Curator succeeds... these lines stop. The drawing ends mid-stroke.',
    callumSpeaker,
  );
}
