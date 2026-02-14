import {
  ItemType,
  Quest,
  type RpgItem,
  type RpgMap,
  type RpgPlayer,
  RpgSceneMap,
} from '@rpgjs/server';
import { increaseVibrancy } from '../../systems/vibrancy';

interface Fragment {
  id: string;
  emotion: 'Joy' | 'Fury' | 'Sorrow' | 'Awe' | 'Calm' | 'Neutral';
  element: 'Light' | 'Dark' | 'Wind' | 'Earth' | 'Fire' | 'Water' | 'Neutral';
  potency: number;
}

export class RecallResonanceQuest extends Quest {
  constructor(player: RpgPlayer) {
    super(player);
  }

  id = 'GQ-01';
  name = 'Recall Resonance';
  category = 'god-recall';
  act = 'act2';
  level = [12, 16];
  giver = {
    name: 'Audiomancer Vess',
    map: 'Resonance Fields',
    position: { x: 25, y: 25 },
  };

  trigger(player: RpgPlayer): boolean {
    const mq05Complete = player.getVariable('MQ-05_COMPLETE');
    const sq09Complete = player.getVariable('SQ-09_COMPLETE');
    const playerLevel = player.level;
    const [minLevel, maxLevel] = this.level;

    if (!mq05Complete || !sq09Complete) {
      return false;
    }
    if (playerLevel < minLevel || playerLevel > maxLevel) {
      return false;
    }

    // Check if player is near Audiomancer Vess
    const map = player.map as RpgMap;
    if (map && map.id === this.giver.map) {
      const playerX = player.position.x;
      const playerY = player.position.y;
      const giverX = this.giver.position.x;
      const giverY = this.giver.position.y;
      const distance = Math.sqrt((playerX - giverX) ** 2 + (playerY - giverY) ** 2);
      if (distance <= 3) {
        // Within 3 tiles of Vess
        return true;
      }
    }
    return false;
  }

  async onStart(player: RpgPlayer) {
    await player.showText(
      'Audiomancer Vess: "The path is harmonized, Architect. The Amphitheater awaits. Step inside, and let the Choir guide your vision."',
    );
    player.setVariable('GQ-01_OBJ_0_ENTERED_AMPHITHEATER', false);
    player.setVariable('GQ-01_OBJ_1_VISION_WATCHED', false);
    player.setVariable('GQ-01_OBJ_2_PEDESTAL_CHOSEN', ''); // Stores chosen emotion: 'Joy', 'Fury', 'Sorrow', 'Awe'
    player.setVariable('GQ-01_OBJ_3_FRAGMENT_PLACED', false);
    player.setVariable('GQ-01_OBJ_4_TRANSFORMATION_WITNESSED', false);
    player.setVariable('GQ-01_RECALL_FORM', ''); // Stores the final god form: 'Cantara', 'Tempestus', 'Tacet', 'Harmonia'
    player.addQuest(this.id);
    player.updateQuest(this.id, {
      state: 'started',
      objectives: [
        { text: "Enter Resonance's Amphitheater", state: 'active' },
        { text: 'Watch the Choir recall vision', state: 'inactive' },
        { text: 'Choose an emotion pedestal (Joy/Fury/Sorrow/Awe)', state: 'inactive' },
        { text: 'Place potency 3+ fragment on pedestal', state: 'inactive' },
        { text: 'Witness Resonance transformation', state: 'inactive' },
      ],
    });
  }

  async onUpdate(player: RpgPlayer) {
    const currentMap = player.map as RpgMap;

    // Objective 0: Enter Resonance's Amphitheater
    if (
      !player.getVariable('GQ-01_OBJ_0_ENTERED_AMPHITHEATER') &&
      currentMap &&
      currentMap.id === 'Resonance Fields_Amphitheater'
    ) {
      player.setVariable('GQ-01_OBJ_0_ENTERED_AMPHITHEATER', true);
      player.updateQuest(this.id, {
        objectives: [
          { text: "Enter Resonance's Amphitheater", state: 'completed' },
          { text: 'Watch the Choir recall vision', state: 'active' },
          { text: 'Choose an emotion pedestal (Joy/Fury/Sorrow/Awe)', state: 'inactive' },
          { text: 'Place potency 3+ fragment on pedestal', state: 'inactive' },
          { text: 'Witness Resonance transformation', state: 'inactive' },
        ],
      });
      await player.showText('The air hums with ancient song. A vision begins to coalesce...');
      // Trigger the vision event (e.g., a scene or cutscene)
      await this.triggerVision(player);
    }

    // Objective 1: Watch the Choir recall vision (completed by triggerVision)
    if (
      player.getVariable('GQ-01_OBJ_1_VISION_WATCHED') &&
      player.getQuest(this.id).objectives[1].state === 'active'
    ) {
      player.updateQuest(this.id, {
        objectives: [
          { text: "Enter Resonance's Amphitheater", state: 'completed' },
          { text: 'Watch the Choir recall vision', state: 'completed' },
          { text: 'Choose an emotion pedestal (Joy/Fury/Sorrow/Awe)', state: 'active' },
          { text: 'Place potency 3+ fragment on pedestal', state: 'inactive' },
          { text: 'Witness Resonance transformation', state: 'inactive' },
        ],
      });
      await player.showText(
        'The vision fades, leaving a profound echo. Four pedestals glow, each resonating with a distinct emotion.',
      );
      // Player needs to interact with a pedestal. This interaction will set GQ-01_OBJ_2_PEDESTAL_CHOSEN
    }

    // Objective 2: Choose an emotion pedestal
    const chosenPedestal = player.getVariable('GQ-01_OBJ_2_PEDESTAL_CHOSEN');
    if (chosenPedestal && player.getQuest(this.id).objectives[2].state === 'active') {
      player.updateQuest(this.id, {
        objectives: [
          { text: "Enter Resonance's Amphitheater", state: 'completed' },
          { text: 'Watch the Choir recall vision', state: 'completed' },
          { text: `Choose an emotion pedestal (${chosenPedestal})`, state: 'completed' },
          { text: 'Place potency 3+ fragment on pedestal', state: 'active' },
          { text: 'Witness Resonance transformation', state: 'inactive' },
        ],
      });
      await player.showText(
        `You have chosen the pedestal of ${chosenPedestal}. Now, offer a potent memory fragment.`,
      );
      // Player needs to use an item on the pedestal. This interaction will set GQ-01_OBJ_3_FRAGMENT_PLACED
    }

    // Objective 3: Place potency 3+ fragment on pedestal
    if (
      player.getVariable('GQ-01_OBJ_3_FRAGMENT_PLACED') &&
      player.getQuest(this.id).objectives[3].state === 'active'
    ) {
      player.updateQuest(this.id, {
        objectives: [
          { text: "Enter Resonance's Amphitheater", state: 'completed' },
          { text: 'Watch the Choir recall vision', state: 'completed' },
          { text: `Choose an emotion pedestal (${chosenPedestal})`, state: 'completed' },
          { text: 'Place potency 3+ fragment on pedestal', state: 'completed' },
          { text: 'Witness Resonance transformation', state: 'active' },
        ],
      });
      await player.showText(
        'The fragment dissolves into the pedestal, and the Amphitheater begins to pulse with raw energy. Resonance stirs...',
      );
      // Trigger transformation event (e.g., a scene or cutscene)
      await this.triggerTransformation(player);
    }

    // Objective 4: Witness Resonance transformation (completed by triggerTransformation)
    if (
      player.getVariable('GQ-01_OBJ_4_TRANSFORMATION_WITNESSED') &&
      player.getQuest(this.id).objectives[4].state === 'active'
    ) {
      player.updateQuest(this.id, {
        objectives: [
          { text: "Enter Resonance's Amphitheater", state: 'completed' },
          { text: 'Watch the Choir recall vision', state: 'completed' },
          { text: `Choose an emotion pedestal (${chosenPedestal})`, state: 'completed' },
          { text: 'Place potency 3+ fragment on pedestal', state: 'completed' },
          { text: 'Witness Resonance transformation', state: 'completed' },
        ],
      });
      await this.onComplete(player);
    }
  }

  async triggerVision(player: RpgPlayer) {
    // Simulate a vision cutscene
    await player.showText(
      'A shimmering vision unfolds: The Choir of the First Dawn, singing a melody that weaves the very fabric of reality. Their final, resonant note hangs in the air, a memory of pure Awe.',
    );
    // Award MF-05: Choir's Final Note
    const choirNote: Fragment = { id: 'MF-05', emotion: 'Awe', element: 'Wind', potency: 4 };
    player.addItem(choirNote as RpgItem); // Cast to RpgItem for addItem, assuming Fragment is compatible or a wrapper exists
    await player.showText(
      'You feel a new fragment coalesce in your mind: "Choir\'s Final Note" (Awe, Wind, Potency 4).',
    );
    player.setVariable('GQ-01_OBJ_1_VISION_WATCHED', true);
    this.onUpdate(player); // Re-evaluate quest state
  }

  async triggerTransformation(player: RpgPlayer) {
    const chosenEmotion = player.getVariable('GQ-01_OBJ_2_PEDESTAL_CHOSEN');
    let godForm: string;
    let completionDialogue: string;

    switch (chosenEmotion) {
      case 'Joy':
        godForm = 'Cantara';
        completionDialogue =
          'Cantara: "The symphony begins anew, Architect. Your joy has awakened my song. Let us compose a future of harmony."';
        break;
      case 'Fury':
        godForm = 'Tempestus';
        completionDialogue =
          'Tempestus: "A storm rises, Architect. Your fury has ignited my wrath. Together, we shall shatter the silence of stagnation."';
        break;
      case 'Sorrow':
        godForm = 'Tacet';
        completionDialogue =
          'Tacet: "The quiet echoes, Architect. Your sorrow has deepened my understanding. We will walk the silent paths and find peace in the void."';
        break;
      case 'Awe':
        godForm = 'Harmonia';
        completionDialogue =
          'Harmonia: "The world resonates, Architect. Your awe has attuned my purpose. Let us weave the threads of existence into a grand accord."';
        break;
      default:
        godForm = 'Unknown';
        completionDialogue =
          'Resonance: "Something profound has shifted. The world feels... different."';
        break;
    }

    player.setVariable('GQ-01_RECALL_FORM', godForm);
    await player.showText(
      `Resonance transforms! The dormant god ${godForm} awakens, imbued with the essence of ${chosenEmotion}.`,
    );
    await player.showText(completionDialogue);
    player.setVariable('GQ-01_OBJ_4_TRANSFORMATION_WITNESSED', true);
    this.onUpdate(player); // Re-evaluate quest state
  }

  async onComplete(player: RpgPlayer) {
    increaseVibrancy(player, 'resonance-fields', 15);
    await player.showText('Resonance Fields vibrancy increased by 15!');

    // Check if this is the first god recall to unlock subclass branch
    const recalledGods = player.getVariable('RECALLED_GODS') || [];
    if (recalledGods.length === 0) {
      player.setVariable('SUBCLASS_BRANCH_UNLOCKED', true);
      await player.showText('A new path opens within you! Subclass branches are now available.');
    }
    recalledGods.push(player.getVariable('GQ-01_RECALL_FORM'));
    player.setVariable('RECALLED_GODS', recalledGods);

    player.setVariable('MQ-06_UNLOCKED', true); // Unlock MQ-06
    player.setVariable('GQ-01_COMPLETE', true);
    player.updateQuest(this.id, { state: 'completed' });
    await player.showText('Quest "Recall Resonance" completed!');
  }

  async onAbandon(player: RpgPlayer) {
    await player.showText('You have abandoned the quest "Recall Resonance".');
    player.removeQuest(this.id);
    // Reset quest-specific variables if needed, or handle partial progress
    player.setVariable('GQ-01_OBJ_0_ENTERED_AMPHITHEATER', false);
    player.setVariable('GQ-01_OBJ_1_VISION_WATCHED', false);
    player.setVariable('GQ-01_OBJ_2_PEDESTAL_CHOSEN', '');
    player.setVariable('GQ-01_OBJ_3_FRAGMENT_PLACED', false);
    player.setVariable('GQ-01_OBJ_4_TRANSFORMATION_WITNESSED', false);
    player.setVariable('GQ-01_RECALL_FORM', '');
  }
}

// Example of how to interact with pedestals and fragments (these would be in map events or player actions)
// This is illustrative and not part of the Quest class itself.

/*
// In a map event for a pedestal:
async onAction(player: RpgPlayer, event: RpgEvent) {
    if (player.getQuest('GQ-01')?.state === 'started' && player.getVariable('GQ-01_OBJ_1_VISION_WATCHED')) {
        const chosen = await player.showChoices('Choose an emotion for Resonance:', [
            { text: 'Joy', value: 'Joy' },
            { text: 'Fury', value: 'Fury' },
            { text: 'Sorrow', value: 'Sorrow' },
            { text: 'Awe', value: 'Awe' }
        ]);
        if (chosen.value) {
            player.setVariable('GQ-01_OBJ_2_PEDESTAL_CHOSEN', chosen.value);
            player.callQuestUpdate('GQ-01'); // Manually trigger quest update check
        }
    }
}

// In a player inventory action for a fragment:
async onUse(player: RpgPlayer, item: RpgItem) {
    if (player.getQuest('GQ-01')?.state === 'started' && player.getVariable('GQ-01_OBJ_2_PEDESTAL_CHOSEN')) {
        const fragment = item as Fragment; // Assuming RpgItem can be cast to Fragment
        if (fragment && fragment.potency >= 3 && fragment.emotion === player.getVariable('GQ-01_OBJ_2_PEDESTAL_CHOSEN')) {
            await player.showText(`You place the ${fragment.name} fragment onto the ${fragment.emotion} pedestal.`);
            player.removeItem(item.id, 1); // Remove the fragment
            player.setVariable('GQ-01_OBJ_3_FRAGMENT_PLACED', true);
            player.callQuestUpdate('GQ-01');
        } else {
            await player.showText('This fragment is not potent enough, or its emotion does not match the chosen pedestal.');
        }
    }
}
*/

export default RecallResonanceQuest;
