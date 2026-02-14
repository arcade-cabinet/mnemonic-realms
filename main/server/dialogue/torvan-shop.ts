import type { RpgPlayer } from '@rpgjs/server';

export default async function (player: RpgPlayer) {
  // Hark's initial greeting, also serving as the [browse] line
  await player.showText('Steel, leather, and honest craft. No enchantments.', {
    speaker: 'Hark',
  });

  let choice: { text: string; value: string };
  do {
    choice = await player.showChoices([
      { text: 'Browse Wares', value: 'browse' },
      { text: 'Sell Items', value: 'sell' },
      { text: 'Ask about prices (simulated insufficient gold)', value: 'insufficient' },
      { text: 'Leave', value: 'leave' },
    ]);

    if (choice.value === 'browse') {
      // Hark's [buy] line, spoken before opening the shop
      await player.showText("Good blade, that. Treat it right and it'll return the favor.", {
        speaker: 'Hark',
      });
      await player.openShop(); // Opens the actual shop UI for buying
    } else if (choice.value === 'sell') {
      // Hark's [sell] line
      await player.showText("I'll melt it down and make something better.", {
        speaker: 'Hark',
      });
      await player.openShop('sell'); // Opens the actual shop UI in sell mode
    } else if (choice.value === 'insufficient') {
      // Hark's [insufficient] gold line
      await player.showText("Can't give it away, friend. Gold talks.", { speaker: 'Hark' });
    }
    // The loop continues until 'leave' is chosen.
  } while (choice.value !== 'leave');

  // Hark's [farewell] line
  await player.showText('Keep your guard up.', { speaker: 'Hark' });
}
