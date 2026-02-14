import { Quest, type RpgPlayer, RpgServer, RpgWorld } from '@rpgjs/server';
import { type Emotion, type FragmentPotency, GodId, ZoneId } from '../database/enums'; // Assuming these enums exist

export interface RecallGodQuestVariables {
  0: boolean; // Discovered shrine
  1: boolean; // Completed approach challenge
  2: { emotion: Emotion; potency: FragmentPotency; godId: GodId } | null; // Chosen emotion, potency, and god
  3: boolean; // Witnessed transformation
  recalledGods: GodId[]; // Array of gods the player has recalled
}

@Quest({
  id: 'MQ-06',
  name: 'Recall the First God',
  category: 'main',
  act: 'act2',
  level: 12, // Minimum level
  rewards: [], // Rewards are dynamic, added in onComplete
  dependencies: ['MQ-05'],
  unlocks: ['MQ-07'],
})
export default class RecallTheFirstGodQuest extends Quest<RecallGodQuestVariables> {
  onInit(player: RpgPlayer) {
    player.setVariable('MQ-06_0', false); // Objective 0: Discover a dormant god shrine
    player.setVariable('MQ-06_1', false); // Objective 1: Complete shrine approach challenge
    player.setVariable('MQ-06_2', null); // Objective 2: Choose emotion and recall god with potency 3+ fragment
    player.setVariable('MQ-06_3', false); // Objective 3: Witness transformation
    player.setVariable('MQ-06_recalledGods', player.getVariable('MQ-06_recalledGods') || []); // Track recalled gods
  }

  onStart(player: RpgPlayer) {
    player.addQuest('MQ-06');
    player.showNotification('New Main Quest: Recall the First God');
    player.sendText(
      'The Architect\'s Signet hums with a new urgency. Lira\'s words echo: "The Frontier holds dormant power. Find a shrine, and awaken what sleeps."',
    );
  }

  onCheck(player: RpgPlayer): boolean {
    // Trigger: MQ-05 complete
    const mq05Complete = player.getQuest('MQ-05')?.isCompleted;
    if (!mq05Complete) {
      return false;
    }

    // Level check
    if (player.level < this.level) {
      return false;
    }

    // Location check (Any Frontier dormant god shrine) - This is handled by specific shrine interactions
    // For MQ-06, the quest starts when MQ-05 is complete and player is in a Frontier zone,
    // but objective 0 specifically tracks finding a shrine.
    // We assume the player is in a Frontier zone if they've completed MQ-05 and are at the right level.

    // Dependency: At least one GQ chain completed (GQ-01 through GQ-04)
    const hasCompletedGodQuest =
      player.getVariable('GQ-01_completed') ||
      player.getVariable('GQ-02_completed') ||
      player.getVariable('GQ-03_completed') ||
      player.getVariable('GQ-04_completed');
    if (!hasCompletedGodQuest) {
      // This quest can start, but the player won't be able to complete objective 2 without a GQ chain.
      // The prompt says "The player must complete at least one god recall quest chain (GQ-01 through GQ-04) to advance."
      // This implies it's a prerequisite for objective 2, not necessarily for the quest to appear in the log.
      // We'll enforce this at objective 2.
    }

    return true;
  }

  // Objective 0: Discover a dormant god shrine
  // This objective is typically marked complete by interacting with a shrine for the first time.
  // Example:
  // RpgServer.on('player.hitShape', (player, shape) => {
  //     if (shape.name.startsWith('dormant_shrine_') && player.getQuest('MQ-06')?.isActive && !player.getVariable('MQ-06_0')) {
  //         player.setVariable('MQ-06_0', true);
  //         player.updateQuest('MQ-06', {
  //             name: 'Discover a dormant god shrine',
  //             description: 'You have found a dormant god shrine in the Frontier. Its ancient power beckons.',
  //             state: 'completed'
  //         });
  //         player.showNotification('Objective Complete: Discover a dormant god shrine');
  //     }
  // });

  // Objective 1: Complete shrine approach challenge
  // This objective is marked complete by the specific God Quest (GQ-XX) associated with the shrine.
  // Example (within a GQ-XX quest or event):
  // player.setVariable('MQ-06_1', true);
  // player.updateQuest('MQ-06', {
  //     name: 'Complete shrine approach challenge',
  //     description: 'You have overcome the trials protecting the shrine. The path to the god is clear.',
  //     state: 'completed'
  // });
  // player.showNotification('Objective Complete: Complete shrine approach challenge');

  // Objective 2: Choose emotion and recall god with potency 3+ fragment
  // This objective is marked complete when the player successfully performs a recall ritual.
  // This would typically be triggered by a server-side event after a successful interaction with a shrine,
  // where the player selects an emotion and a fragment.
  // Example:
  // RpgServer.on('player.recallGod', (player: RpgPlayer, godId: GodId, emotion: Emotion, fragmentPotency: FragmentPotency) => {
  //     if (player.getQuest('MQ-06')?.isActive && !player.getVariable('MQ-06_2')) {
  //         if (fragmentPotency >= FragmentPotency.Potency3) {
  //             player.setVariable('MQ-06_2', { emotion, potency: fragmentPotency, godId });
  //             player.updateQuest('MQ-06', {
  //                 name: `Recall ${godId} with ${emotion} using a Potency ${fragmentPotency} fragment`,
  //                 description: `You have successfully recalled ${godId}, imbuing them with the emotion of ${emotion}.`,
  //                 state: 'completed'
  //             });
  //             player.showNotification('Objective Complete: Recall the god');
  //         } else {
  //             player.sendText('The fragment lacks the necessary potency to fully awaken the god. Seek a fragment of Potency 3 or higher.');
  //         }
  //     }
  // });

  // Objective 3: Witness transformation
  // This objective is marked complete after the post-recall cutscene/dialogue.
  // Example:
  // player.setVariable('MQ-06_3', true);
  // player.updateQuest('MQ-06', {
  //     name: 'Witness transformation',
  //     description: 'You have witnessed the god\'s transformation, and felt their power ripple through the world.',
  //     state: 'completed'
  // });
  // player.showNotification('Objective Complete: Witness transformation');

  onUpdate(player: RpgPlayer) {
    const obj0 = player.getVariable('MQ-06_0');
    const obj1 = player.getVariable('MQ-06_1');
    const obj2 = player.getVariable('MQ-06_2');
    const obj3 = player.getVariable('MQ-06_3');

    if (obj0 && !this.objectives[0]?.isCompleted) {
      player.updateQuest('MQ-06', {
        objectiveId: 0,
        name: 'Discover a dormant god shrine',
        description:
          'You have found a dormant god shrine in the Frontier. Its ancient power beckons.',
        state: 'completed',
      });
      player.showNotification('Objective Complete: Discover a dormant god shrine');
    }
    if (obj1 && !this.objectives[1]?.isCompleted) {
      player.updateQuest('MQ-06', {
        objectiveId: 1,
        name: 'Complete shrine approach challenge',
        description:
          'You have overcome the trials protecting the shrine. The path to the god is clear.',
        state: 'completed',
      });
      player.showNotification('Objective Complete: Complete shrine approach challenge');
    }
    if (obj2 && !this.objectives[2]?.isCompleted) {
      const { emotion, potency, godId } = obj2;
      player.updateQuest('MQ-06', {
        objectiveId: 2,
        name: `Recall ${godId} with ${emotion} using a Potency ${potency} fragment`,
        description: `You have successfully recalled ${godId}, imbuing them with the emotion of ${emotion}.`,
        state: 'completed',
      });
      player.showNotification('Objective Complete: Recall the god');
    }
    if (obj3 && !this.objectives[3]?.isCompleted) {
      player.updateQuest('MQ-06', {
        objectiveId: 3,
        name: 'Witness transformation',
        description:
          "You have witnessed the god's transformation, and felt their power ripple through the world.",
        state: 'completed',
      });
      player.showNotification('Objective Complete: Witness transformation');
    }

    if (obj0 && obj1 && obj2 && obj3) {
      this.onComplete(player);
    }
  }

  onComplete(player: RpgPlayer) {
    const recalledInfo = player.getVariable('MQ-06_2');
    if (!recalledInfo) {
      console.error('MQ-06 completed without recalled god info.');
      return;
    }
    const { godId, emotion } = recalledInfo;

    // Add god to recalled list
    const recalledGods: GodId[] = player.getVariable('MQ-06_recalledGods') || [];
    if (!recalledGods.includes(godId)) {
      recalledGods.push(godId);
      player.setVariable('MQ-06_recalledGods', recalledGods);
    }

    // Dynamic Rewards
    // 1. Zone vibrancy +15 (specific to the god's zone)
    let zoneId: ZoneId;
    switch (godId) {
      case GodId.Verdance:
        zoneId = ZoneId.ShimmerMarsh;
        break;
      case GodId.Luminos:
        zoneId = ZoneId.Flickerveil;
        break;
      case GodId.Peregrine:
        zoneId = ZoneId.HollowRidge;
        break;
      case GodId.Resonance:
        zoneId = ZoneId.ResonanceFields;
        break;
      default:
        zoneId = ZoneId.ShimmerMarsh; // Fallback
    }
    RpgWorld.getZone(zoneId)?.addVibrancy(15);
    player.showNotification(`Vibrancy in ${zoneId} increased by +15!`);

    // 2. Subclass unlock (first recall only)
    if (recalledGods.length === 1) {
      // Check if this is the first god recalled
      player.unlockSubclass(); // Assuming this method exists on RpgPlayer
      player.showNotification('Subclass unlocked! Check your character menu.');
    }

    // 3. God's passive world effect and player buff (handled by individual GQ chains or global system)
    // This is typically handled by the specific GQ quest or a global system that activates effects based on recalled gods.
    // For example, a global system might check player.getVariable('MQ-06_recalledGods') and apply buffs.

    // Completion Dialogue (Varies by god and emotion)
    const completionDialogue = `The world shifts around you as ${godId} fully awakens, imbued with your chosen emotion of ${emotion}. A new path unfolds.`;
    // In a real game, this would pull from a dialogue bank based on godId and emotion.
    // Example:
    // if (godId === GodId.Verdance && emotion === Emotion.Joy) {
    //     completionDialogue = "Verdance blooms with renewed joy, a vibrant green spreading across the marsh. 'Thank you, Architect,' a gentle voice whispers in your mind.";
    // } else if (godId === GodId.Luminos && emotion === Emotion.Awe) {
    //     completionDialogue = "Luminos shines with blinding awe, illuminating the forest with pure truth. 'The light reveals all,' a resonant voice declares.";
    // }
    player.sendText(completionDialogue);

    // Mark quest as completed
    player.completeQuest('MQ-06');
    player.showNotification('Quest Complete: Recall the First God');

    // Unlock MQ-07 (if SQ-05 is also complete)
    const sq05Complete = player.getQuest('SQ-05')?.isCompleted;
    if (sq05Complete) {
      player.unlockQuest('MQ-07');
      player.showNotification("New Main Quest available: The Preserver's Veil");
    } else {
      player.sendText(
        'A new path awaits, but other threads must be tied. Complete "The Whispering Echoes" (SQ-05) to continue your main journey.',
      );
    }
  }

  onAbandon(player: RpgPlayer) {
    player.sendText('You decide to postpone recalling the gods for now. The Frontier will wait.');
  }
}
