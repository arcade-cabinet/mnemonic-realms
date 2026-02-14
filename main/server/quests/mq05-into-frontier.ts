import { QuestStep, RewardType, type RpgPlayer, RpgQuest } from '@rpgjs/server';

export interface QuestVariables {
  'MQ-05_objective_0_completed'?: boolean;
  'MQ-05_objective_1_completed'?: boolean;
  'MQ-05_objective_2_completed'?: boolean;
  'MQ-05_objective_3_completed'?: boolean;
  'MQ-05_objective_4_completed'?: boolean;
  'MQ-05_has_spoken_to_callum'?: boolean;
  'MQ-05_has_crossed_pass'?: boolean;
  'MQ-05_has_spoken_to_petra'?: boolean;
  'MQ-05_has_learned_gods'?: boolean;
  'MQ-05_visited_frontier_zones'?: string[]; // Array to track visited zones
}

@RpgQuest<QuestVariables>({
  id: 'MQ-05',
  name: 'Into the Frontier',
  category: 'main',
  act: 'act2',
  level: '10-12',
  giver: 'Callum',
  trigger: (player: RpgPlayer) => {
    // Trigger: MQ-04 complete
    const mq04Status = player.getVariable('MQ-04_status');
    return mq04Status === 'completed' && player.getVariable('MQ-05_status') === undefined;
  },
  dependencies: ['MQ-04'],
  rewards: [
    { type: RewardType.GOLD, value: 300 },
    { type: RewardType.ITEM, itemId: 'C-SC-04', value: 3 }, // Stasis Breaker x3
  ],
  completionDialogue: [
    {
      speaker: 'Petra',
      text: "You're the Architect Callum wrote about. Good — we've been waiting. There are four places in the Frontier where the land itself is... dreaming. Old gods, unfinished, waiting for someone who can remember them into being. The Preservers want them to stay asleep forever. I think you should wake them up.",
    },
  ],
  unlocks: ['MQ-06', 'GQ-01', 'GQ-02', 'GQ-03', 'GQ-04', 'SQ-06', 'SQ-07', 'SQ-08', 'SQ-09'],
  steps: [
    {
      name: 'Speak with Callum at Lookout Hill',
      description:
        'Callum at Lookout Hill (Village Hub) has a briefing for you about the Frontier.',
      onStart(player: RpgPlayer) {
        player.setVariable('MQ-05_objective_0_completed', false);
        player.setVariable('MQ-05_has_spoken_to_callum', false);
      },
      onComplete(player: RpgPlayer) {
        player.setVariable('MQ-05_objective_0_completed', true);
      },
      completionCondition(player: RpgPlayer) {
        return player.getVariable('MQ-05_has_spoken_to_callum') === true;
      },
    },
    {
      name: 'Cross mountain pass into Hollow Ridge',
      description:
        'Head north from the Village Hub and cross the newly opened mountain pass into Hollow Ridge.',
      onStart(player: RpgPlayer) {
        player.setVariable('MQ-05_objective_1_completed', false);
        player.setVariable('MQ-05_has_crossed_pass', false);
      },
      onComplete(player: RpgPlayer) {
        player.setVariable('MQ-05_objective_1_completed', true);
      },
      completionCondition(player: RpgPlayer) {
        // Assuming a map change or specific coordinates trigger this
        // For now, we'll rely on a variable set by an event in the game world
        return player.getVariable('MQ-05_has_crossed_pass') === true;
      },
    },
    {
      name: 'Reach Ridgewalker Camp and speak with Petra',
      description:
        'Find the Ridgewalker Camp in Hollow Ridge (15, 25) and introduce yourself to Petra.',
      onStart(player: RpgPlayer) {
        player.setVariable('MQ-05_objective_2_completed', false);
        player.setVariable('MQ-05_has_spoken_to_petra', false);
      },
      onComplete(player: RpgPlayer) {
        player.setVariable('MQ-05_objective_2_completed', true);
      },
      completionCondition(player: RpgPlayer) {
        return player.getVariable('MQ-05_has_spoken_to_petra') === true;
      },
    },
    {
      name: 'Learn about dormant gods',
      description:
        'Petra will brief you on the dormant gods and their significance in the Frontier.',
      onStart(player: RpgPlayer) {
        player.setVariable('MQ-05_objective_3_completed', false);
        player.setVariable('MQ-05_has_learned_gods', false);
      },
      onComplete(player: RpgPlayer) {
        player.setVariable('MQ-05_objective_3_completed', true);
      },
      completionCondition(player: RpgPlayer) {
        return player.getVariable('MQ-05_has_learned_gods') === true;
      },
    },
    {
      name: 'Visit another Frontier zone',
      description:
        'Explore beyond Hollow Ridge and visit at least one other Frontier zone (Shimmer Marsh, Flickerveil, or Resonance Fields).',
      onStart(player: RpgPlayer) {
        player.setVariable('MQ-05_objective_4_completed', false);
        player.setVariable('MQ-05_visited_frontier_zones', []);
      },
      onComplete(player: RpgPlayer) {
        player.setVariable('MQ-05_objective_4_completed', true);
      },
      completionCondition(player: RpgPlayer) {
        const visitedZones = player.getVariable('MQ-05_visited_frontier_zones') || [];
        return visitedZones.length > 0;
      },
    },
  ],
})
export default class IntoTheFrontier {
  // This class can contain methods for quest-specific logic,
  // but for simple variable-based tracking, the @RpgQuest decorator is sufficient.
  // Example of how you might update a variable from an event:
  // In an event on Callum:
  // player.setVariable('MQ-05_has_spoken_to_callum', true);
  // player.updateQuest('MQ-05'); // To re-evaluate completion conditions
  // In an event when entering Hollow Ridge map:
  // player.setVariable('MQ-05_has_crossed_pass', true);
  // player.updateQuest('MQ-05');
  // In an event on Petra after dialogue:
  // player.setVariable('MQ-05_has_spoken_to_petra', true);
  // player.setVariable('MQ-05_has_learned_gods', true);
  // player.updateQuest('MQ-05');
  // In an event when entering Shimmer Marsh, Flickerveil, or Resonance Fields:
  // const visitedZones = player.getVariable('MQ-05_visited_frontier_zones') || [];
  // const currentZone = player.map.id; // Or a more specific zone identifier
  // if (!visitedZones.includes(currentZone)) {
  //     visitedZones.push(currentZone);
  //     player.setVariable('MQ-05_visited_frontier_zones', visitedZones);
  //     player.updateQuest('MQ-05');
  // }
}
