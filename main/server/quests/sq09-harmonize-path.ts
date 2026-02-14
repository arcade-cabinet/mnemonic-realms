import { RpgMap, type RpgPlayer, RpgQuest } from '@rpgjs/server';
import { QuestStep } from '@rpgjs/server/lib/quests/quest';

export interface QuestVariables {
  'SQ-09_VessSpoken': boolean;
  'SQ-09_StonesBroadcasted': number;
  'SQ-09_AmphitheaterPathOpen': boolean;
}

@RpgQuest<QuestVariables>({
  id: 'SQ-09',
  name: 'Harmonize the Path',
  category: 'side',
  act: 'act2',
  level: '12-14',
  dependencies: ['MQ-05'],
  unlocks: ['GQ-01'],
  rewards: {
    gold: 200,
    items: [
      { item: 'fragment:Joy/Wind Fragment', quantity: 1 }, // Assuming a generic fragment type for now
    ],
  },
  completionDialogue: [
    {
      message: 'Vess: The dissonance resolved! The amphitheater is open.',
      speaker: 'Audiomancer Vess',
    },
  ],
  onStart(player: RpgPlayer) {
    player.setVariable('SQ-09_VessSpoken', false);
    player.setVariable('SQ-09_StonesBroadcasted', 0);
    player.setVariable('SQ-09_AmphitheaterPathOpen', false);
  },
  onComplete(player: RpgPlayer) {
    // Additional logic if needed, e.g., triggering a map change or event
    // For now, rewards are handled by the framework
  },
})
export default class HarmonizeThePathQuest {
  @QuestStep(0, {
    name: 'Speak with Vess',
    description:
      "Find Audiomancer Vess at the Listener's Camp in Resonance Fields and learn about the dissonant stones.",
    onCheck(player: RpgPlayer) {
      return player.getVariable('SQ-09_VessSpoken') === true;
    },
  })
  step0(player: RpgPlayer) {
    // This step is completed when player.setVariable('SQ-09_VessSpoken', true) is called,
    // typically from an event interaction with Vess.
  }

  @QuestStep(1, {
    name: 'Broadcast into 3 dissonant Resonance Stones',
    description:
      'Locate and broadcast a memory into three dissonant Resonance Stones within the Resonance Fields to stabilize their frequencies.',
    onCheck(player: RpgPlayer) {
      return player.getVariable('SQ-09_StonesBroadcasted') >= 3;
    },
  })
  step1(player: RpgPlayer) {
    // This step is progressed by calling player.setVariable('SQ-09_StonesBroadcasted', player.getVariable('SQ-09_StonesBroadcasted') + 1)
    // when the player successfully broadcasts into a dissonant stone.
  }

  @QuestStep(2, {
    name: 'Open path to amphitheater',
    description:
      'With the Resonance Stones harmonized, the path to the ancient amphitheater should now be accessible. Find and enter it.',
    onCheck(player: RpgPlayer) {
      return player.getVariable('SQ-09_AmphitheaterPathOpen') === true;
    },
  })
  step2(player: RpgPlayer) {
    // This step is completed when player.setVariable('SQ-09_AmphitheaterPathOpen', true) is called,
    // likely triggered by an event that opens the path or when the player enters the amphitheater map.
  }

  // Trigger condition check
  static canStart(player: RpgPlayer): boolean {
    const mq05Complete = player.getQuest('MQ-05')?.isCompleted();
    const playerLevel = player.level;
    const isInResonanceFields =
      player.map.id === 'Resonance Fields' && player.position.x === 10 && player.position.y === 35; // Specific giver location

    return mq05Complete && playerLevel >= 12 && playerLevel <= 14 && isInResonanceFields;
  }
}
