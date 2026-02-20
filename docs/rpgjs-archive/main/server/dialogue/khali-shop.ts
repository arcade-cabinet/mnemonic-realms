import type { RpgPlayer } from '@rpgjs/server';
import { buyItem, getShopInventory } from '../systems/shop';

export default async function (player: RpgPlayer) {
  const shopId = 'village-general';

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
        const inventory = getShopInventory(shopId);
        if (!inventory || inventory.length === 0) {
          await player.showText("Sorry, I'm all out of stock at the moment!", {
            speaker: 'Khali',
          });
          break;
        }

        // Build shop menu choices
        const shopChoices = inventory.map((item) => ({
          text: `${item.name} - ${item.price}g`,
          value: item.itemId,
        }));
        shopChoices.push({ text: 'Back', value: 'back' });

        const itemChoice = await player.showChoices('What would you like to buy?', shopChoices);

        if (itemChoice.value !== 'back') {
          const result = buyItem(player, shopId, itemChoice.value, 1);
          if (result.success) {
            await player.showText("Excellent choice! That'll serve you well out there.", {
              speaker: 'Khali',
            });
          } else {
            await player.showText(
              "Ah, not quite enough gold for that one. Come back when your pockets are heavier — I'll hold it for you.",
              { speaker: 'Khali' },
            );
          }
        }
        break;
      }

      case 'sell':
        // Khali's line when the player chooses to sell items
        await player.showText('I can take that off your hands. Fair price, always.', {
          speaker: 'Khali',
        });
        // TODO: Build sell menu from player inventory
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
