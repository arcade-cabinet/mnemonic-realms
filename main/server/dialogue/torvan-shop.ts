import type { RpgPlayer } from '@rpgjs/server';
import { buyItem, getShopInventory } from '../systems/shop';

export default async function (player: RpgPlayer) {
  const shopId = 'village-weapons';

  // Hark's initial greeting, also serving as the [browse] line
  await player.showText('Steel, leather, and honest craft. No enchantments.', {
    speaker: 'Hark',
  });

  let choice: { text: string; value: string };
  do {
    choice = await player.showChoices('What would you like?', [
      { text: 'Browse Wares', value: 'browse' },
      { text: 'Sell Items', value: 'sell' },
      { text: 'Leave', value: 'leave' },
    ]);

    if (choice.value === 'browse') {
      const inventory = getShopInventory(shopId);
      if (!inventory || inventory.length === 0) {
        await player.showText('Fresh out at the moment. Check back later.', {
          speaker: 'Hark',
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
          // Hark's [buy] line, spoken after successful purchase
          await player.showText("Good blade, that. Treat it right and it'll return the favor.", {
            speaker: 'Hark',
          });
        } else {
          // Hark's [insufficient] gold line
          await player.showText("Can't give it away, friend. Gold talks.", { speaker: 'Hark' });
        }
      }
    } else if (choice.value === 'sell') {
      // Hark's [sell] line
      await player.showText("I'll melt it down and make something better.", {
        speaker: 'Hark',
      });
      // TODO: Build sell menu from player inventory
    }
    // The loop continues until 'leave' is chosen.
  } while (choice.value !== 'leave');

  // Hark's [farewell] line
  await player.showText('Keep your guard up.', { speaker: 'Hark' });
}
