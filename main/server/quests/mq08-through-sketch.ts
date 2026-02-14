import { Item } from '@rpgjs/database';
import {
  type QuestReward,
  QuestStep,
  type QuestTrigger,
  type RpgPlayer,
  RpgQuest,
} from '@rpgjs/server';

@Item({
  id: 'A-13',
  name: 'Sketchweave Cloak',
  description: '+20% evasion. In Sketch zones: +30% evasion.',
  price: 0, // Not purchasable
  atk: 0,
  def: 24,
  int: 0,
  speed: 0,
  hit: 0,
  pdef: 0,
  mdef: 0,
  str: 0,
  agi: 0,
  lck: 0,
  hp: 0,
  sp: 0,
  elements: [],
  states: [],
  common: true,
  equip: true,
  consumable: false,
  tradeable: true,
  nbStack: 1,
  weight: 1,
  type: 'armor',
  armorType: 'cloak',
})
export class SketchweaveCloak {}

export default class QuestThroughTheSketch extends RpgQuest {
  public static readonly id = 'MQ-08';
  public static readonly category = 'main';
  public static readonly act = 'act3';
  public static readonly level = '20-24';
  public static readonly giver = 'Callum';
  public static readonly trigger: QuestTrigger = {
    quest: 'MQ-07',
    state: 'completed',
  };
  public static readonly dependencies = ['MQ-07'];
  public static readonly unlocks = ['MQ-09'];

  title = 'Through the Sketch';
  description =
    'Venture into the Sketch, navigate its shifting landscapes, and reach the Crystalline Fortress.';

  objectives = [
    {
      text: "Enter the Sketch from any Frontier zone's outer boundary",
      id: 'enterSketch',
      onStart(player: RpgPlayer) {
        player.setVariable('MQ-08_enteredSketch', false);
      },
      onCheck(player: RpgPlayer) {
        return player.getVariable('MQ-08_enteredSketch') === true;
      },
    },
    {
      text: 'Navigate the Half-Drawn Forest by broadcasting memory fragments (3 broadcasts required)',
      id: 'navigateForest',
      onStart(player: RpgPlayer) {
        player.setVariable('MQ-08_forestBroadcasts', 0);
      },
      onCheck(player: RpgPlayer) {
        return player.getVariable('MQ-08_forestBroadcasts') >= 3;
      },
    },
    {
      text: 'Cross the Luminous Wastes by following the faint Resonance Stone trail (5 stones activated)',
      id: 'crossWastes',
      onStart(player: RpgPlayer) {
        player.setVariable('MQ-08_wastesStones', 0);
      },
      onCheck(player: RpgPlayer) {
        return player.getVariable('MQ-08_wastesStones') >= 5;
      },
    },
    {
      text: 'Reach the Undrawn Peaks zone boundary',
      id: 'reachPeaks',
      onStart(player: RpgPlayer) {
        player.setVariable('MQ-08_reachedPeaks', false);
      },
      onCheck(player: RpgPlayer) {
        return player.getVariable('MQ-08_reachedPeaks') === true;
      },
    },
    {
      text: 'Survive at least 2 Sketch enemy encounters',
      id: 'surviveEncounters',
      onStart(player: RpgPlayer) {
        player.setVariable('MQ-08_sketchEncounters', 0);
      },
      onCheck(player: RpgPlayer) {
        return player.getVariable('MQ-08_sketchEncounters') >= 2;
      },
    },
    {
      text: 'Broadcast a potency 3+ fragment at the Crystalline Fortress Gate',
      id: 'fortressBroadcast',
      onStart(player: RpgPlayer) {
        player.setVariable('MQ-08_fortressBroadcastDone', false);
      },
      onCheck(player: RpgPlayer) {
        return player.getVariable('MQ-08_fortressBroadcastDone') === true;
      },
    },
  ];

  rewards: QuestReward = {
    gold: 400,
    items: [{ item: SketchweaveCloak, quantity: 1 }],
  };

  onComplete(player: RpgPlayer) {
    player.showText(
      "The fortress shimmers into focus before you. Crystal walls catch light that shouldn't exist this far from the settled world. The Preservers built this place at the edge of reality itself — where the world hasn't decided what it wants to be yet. Inside, the First Memory waits. And so does the Curator.",
      {
        talkWith: 'Narrator',
      },
    );
    player.addQuest('MQ-09'); // Unlock next quest
  }

  // Example of how player variables would be updated by game events:
  //
  // // When player enters 'The Sketch' map for the first time:
  // if (player.getQuest('MQ-08')?.state === 'active' && player.getVariable('MQ-08_enteredSketch') === false) {
  //     player.setVariable('MQ-08_enteredSketch', true);
  //     player.updateQuest('MQ-08');
  // }
  //
  // // When player broadcasts a memory fragment in 'Half-Drawn Forest' zone with potency 2+:
  // if (player.getQuest('MQ-08')?.state === 'active' && player.getMap().id === 'Half-Drawn Forest' && fragmentPotency >= 2) {
  //     player.setVariable('MQ-08_forestBroadcasts', player.getVariable('MQ-08_forestBroadcasts') + 1);
  //     player.updateQuest('MQ-08');
  // }
  //
  // // When player activates a Resonance Stone in 'Luminous Wastes' zone:
  // if (player.getQuest('MQ-08')?.state === 'active' && player.getMap().id === 'Luminous Wastes') {
  //     player.setVariable('MQ-08_wastesStones', player.getVariable('MQ-08_wastesStones') + 1);
  //     player.updateQuest('MQ-08');
  // }
  //
  // // When player reaches the boundary of 'Undrawn Peaks' zone:
  // if (player.getQuest('MQ-08')?.state === 'active' && player.getMap().id === 'Undrawn Peaks' && player.getVariable('MQ-08_reachedPeaks') === false) {
  //     player.setVariable('MQ-08_reachedPeaks', true);
  //     player.updateQuest('MQ-08');
  // }
  //
  // // After surviving an encounter with a 'Sketch Phantom' or 'Wireframe Drake' in a Sketch zone:
  // if (player.getQuest('MQ-08')?.state === 'active' && player.getMap().zone === 'The Sketch') { // Assuming 'zone' property on map
  //     player.setVariable('MQ-08_sketchEncounters', player.getVariable('MQ-08_sketchEncounters') + 1);
  //     player.updateQuest('MQ-08');
  // }
  //
  // // When player broadcasts a memory fragment at 'Crystalline Fortress Gate' location with potency 3+:
  // if (player.getQuest('MQ-08')?.state === 'active' && player.getMap().id === 'Crystalline Fortress Gate' && fragmentPotency >= 3 && player.getVariable('MQ-08_fortressBroadcastDone') === false) {
  //     player.setVariable('MQ-08_fortressBroadcastDone', true);
  //     player.updateQuest('MQ-08');
  // }
}
