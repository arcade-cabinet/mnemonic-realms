import { Dialogue } from '@rpgjs/server';

export default async function dlgMarenShop(player: any, event: any) {
  // Assuming 'maren' is the graphic ID for Maren's portrait
  const marenGraphic = 'maren';

  // Maren's initial greeting, offering to browse wares
  await player.showText('Take a look! Potions, antidotes, and the odd curiosity.', {
    speaker: marenGraphic,
  });

  let choice;
  do {
    // Offer the player choices for shop interaction
    choice = await player.showChoices('What would you like to do?', [
      { text: 'Browse Wares (Buy)', value: 'browse' },
      { text: 'Sell Items', value: 'sell' },
      { text: 'Leave', value: 'leave' },
    ]);

    switch (choice.value) {
      case 'browse': {
        // Maren's line when the player chooses to browse/buy
        await player.showText("Excellent choice! That'll serve you well out there.", {
          speaker: marenGraphic,
        });

        // In a real RPG-JS game, player.openShop() would be called here.
        // For this dialogue file, we simulate a potential outcome (e.g., trying to buy something expensive).
        // This is where actual game logic for opening the shop UI would reside.
        // For demonstration, we'll simulate an "insufficient gold" scenario.
        const playerGold = player.get('gold'); // Get player's current gold
        const itemCost = 500; // Simulate the cost of an item

        if (playerGold < itemCost) {
          // Maren's line for insufficient gold
          await player.showText(
            "Ah, not quite enough gold for that one. Come back when your pockets are heavier — I'll hold it for you.",
            { speaker: marenGraphic },
          );
        } else {
          // If player has enough gold, we assume a successful browsing/purchase happened.
          // No specific line for successful purchase is provided, so we just continue.
          // A real implementation might show a confirmation or simply close the shop UI.
        }
        break;
      }

      case 'sell':
        // Maren's line when the player chooses to sell items
        await player.showText('I can take that off your hands. Fair price, always.', {
          speaker: marenGraphic,
        });

        // In a real RPG-JS game, player.openShop(null, { sell: true }) would be called here.
        // For this dialogue file, we just play the line.
        break;

      case 'leave':
        // Maren's farewell line
        await player.showText("Safe travels! Come back anytime — the door's always open.", {
          speaker: marenGraphic,
        });
        break;
    }
    // The loop continues until the player explicitly chooses to 'leave'
  } while (choice.value !== 'leave');
}
