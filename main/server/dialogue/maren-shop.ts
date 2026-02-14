import type { RpgPlayer } from '@rpgjs/server';

export default async function (player: RpgPlayer) {
  // Khali's initial greeting, offering to browse wares
  await player.showText('Take a look! Potions, antidotes, and the odd curiosity.', {
    speaker: 'Khali',
  });

  let choice: { text: string; value: string };
  do {
    // Offer the player choices for shop interaction
    choice = await player.showChoices('What would you like to do?', [
      { text: 'Browse Wares (Buy)', value: 'browse' },
      { text: 'Sell Items', value: 'sell' },
      { text: 'Leave', value: 'leave' },
    ]);

    switch (choice.value) {
      case 'browse': {
        // Khali's line when the player chooses to browse/buy
        await player.showText("Excellent choice! That'll serve you well out there.", {
          speaker: 'Khali',
        });

        const playerGold = player.getVariable('gold');
        const itemCost = 500;

        if (playerGold < itemCost) {
          // Khali's line for insufficient gold
          await player.showText(
            "Ah, not quite enough gold for that one. Come back when your pockets are heavier — I'll hold it for you.",
            { speaker: 'Khali' },
          );
        }
        break;
      }

      case 'sell':
        // Khali's line when the player chooses to sell items
        await player.showText('I can take that off your hands. Fair price, always.', {
          speaker: 'Khali',
        });
        break;

      case 'leave':
        // Khali's farewell line
        await player.showText("Safe travels! Come back anytime — the door's always open.", {
          speaker: 'Khali',
        });
        break;
    }
  } while (choice.value !== 'leave');
}
