import type { RpgEvent, RpgPlayer } from '@rpgjs/server';

export default async function (player: RpgPlayer, event: RpgEvent) {
  // Trigger conditions and quest state checks would go here if specified.
  // For a general shop interaction, no specific checks are required by the prompt.

  // Torvan's initial greeting, also serving as the [browse] line
  await player.showText(
    event.graphic,
    'Torvan',
    'Steel, leather, and honest craft. No enchantments.',
  );

  let choice;
  do {
    choice = await player.showChoices([
      { text: 'Browse Wares', value: 'browse' },
      { text: 'Sell Items', value: 'sell' },
      { text: 'Ask about prices (simulated insufficient gold)', value: 'insufficient' },
      { text: 'Leave', value: 'leave' },
    ]);

    if (choice.value === 'browse') {
      // Torvan's [buy] line, spoken before opening the shop
      await player.showText(
        event.graphic,
        'Torvan',
        "Good blade, that. Treat it right and it'll return the favor.",
      );
      await player.openShop(); // Opens the actual shop UI for buying
    } else if (choice.value === 'sell') {
      // Torvan's [sell] line
      await player.showText(
        event.graphic,
        'Torvan',
        "I'll melt it down and make something better.",
      );
      await player.openShop('sell'); // Opens the actual shop UI in sell mode
    } else if (choice.value === 'insufficient') {
      // Torvan's [insufficient] gold line
      await player.showText(event.graphic, 'Torvan', "Can't give it away, friend. Gold talks.");
      // No shop opens, this choice is purely to trigger the dialogue line.
    }
    // The loop continues until 'leave' is chosen.
  } while (choice.value !== 'leave');

  // Torvan's [farewell] line
  await player.showText(event.graphic, 'Torvan', 'Keep your guard up.');
}
