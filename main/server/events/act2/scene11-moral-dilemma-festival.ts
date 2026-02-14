import { EventData, Move, RpgEvent, RpgMap, type RpgPlayer } from '@rpgjs/server';

// --- Dynamic NPC Event Definitions ---

// Generic event for frozen festival-goers, allowing examination
@EventData({
  name: 'frozen_festival_goer_event',
  hitbox: { width: 1, height: 1 },
  graphic: 'npc_frozen_festival_goer', // Placeholder graphic
})
class FrozenFestivalGoerEvent extends RpgEvent {
  private description: string = 'A frozen festival-goer.';

  onInit() {
    this.event.setGraphic(this.event.getGraphic() + '_' + Math.floor(Math.random() * 4 + 1)); // Randomize graphic variant
  }

  onAction(player: RpgPlayer) {
    player.showText(this.description, {
      type: 'text',
      speaker: 'SYSTEM',
      position: 'top',
    });
  }

  setDescription(desc: string) {
    this.description = desc;
  }
}

// Callum's dynamic event (no specific interaction here, just presence)
@EventData({
  name: 'callum_frozen_festival_event',
  hitbox: { width: 1, height: 1 },
  graphic: 'npc_callum',
})
class CallumFrozenFestivalEvent extends RpgEvent {}

// Preserver Scout Miel's dynamic event
@EventData({
  name: 'miel_frozen_festival_event',
  hitbox: { width: 1, height: 1 },
  graphic: 'npc_preserver_scout_f1', // Assuming a generic female scout graphic
})
class MielFrozenFestivalEvent extends RpgEvent {}

// --- Main Scene Event ---

@EventData({
  name: 'act2-scene11-moral-dilemma-festival',
  hitbox: { width: 1, height: 1 }, // Trigger on a single tile
  position: { x: 35, y: 35 },
  map: 'resonance-fields',
  trigger: 'playerTouch',
  priority: 100, // Ensure it triggers over other events
  graphic: '', // Invisible trigger
})
export default class Act2Scene11MoralDilemmaFestivalEvent extends RpgEvent {
  private frozenNpcIds: string[] = [];
  private callumEventId: string | null = null;
  private mielEventId: string | null = null;

  async onPlayerTouch(player: RpgPlayer) {
    const globalQuestState = player.getVariable('GLOBAL_QUEST_STATE') || {};
    const sceneCompleted = player.getVariable('ACT2_SCENE11_COMPLETED');

    // Condition: Player explores Resonance Fields after 2-3 recalls (post-second-recall)
    // And the scene hasn't been completed yet
    if (!globalQuestState.postSecondRecall || sceneCompleted) {
      return;
    }

    player.setVariable('ACT2_SCENE11_COMPLETED', true); // Mark scene as started/completed to prevent re-trigger

    // --- Scene Setup ---
    player.setPlayerControl(false); // Disable player movement
    player.setCamera(this.event.position.x, this.event.position.y, { smooth: true, speed: 0.01 }); // Focus camera

    // --- Spawn NPCs ---
    const map = player.map;

    // Callum
    const callumEvent = await map.createDynamicEvent({
      x: 33,
      y: 36,
      event: CallumFrozenFestivalEvent,
      direction: Move.up,
    });
    this.callumEventId = callumEvent.id;

    // Preserver Scout Miel
    const mielEvent = await map.createDynamicEvent({
      x: 37,
      y: 36,
      event: MielFrozenFestivalEvent,
      direction: Move.up,
    });
    this.mielEventId = mielEvent.id;

    // Frozen Festival NPCs (8 of them in a 6x6 zone)
    const frozenNpcDescriptions = [
      'The dancers: Hands clasped, eyes locked, the world forgotten around them.',
      "The laughing man: Whatever joke was told, it was the funniest thing he'd ever heard.",
      'The leaping child: The lantern was just out of reach. She was about to catch it.',
      'The musician: She set her fiddle down mid-song to join the dance.',
      'A reveler, mid-cheer, a cup raised high.',
      'A couple, frozen mid-embrace, a silent testament to joy.',
      'A vendor, caught mid-transaction, wares perfectly preserved.',
      'An elder, smiling serenely, watching the festivities.',
    ];

    const frozenNpcPositions = [
      { x: 32, y: 32 },
      { x: 33, y: 32 },
      { x: 34, y: 32 },
      { x: 35, y: 32 },
      { x: 32, y: 33 },
      { x: 33, y: 33 },
      { x: 34, y: 33 },
      { x: 35, y: 33 },
      { x: 32, y: 34 },
      { x: 33, y: 34 },
      { x: 34, y: 34 },
      { x: 35, y: 34 },
      { x: 32, y: 35 },
      { x: 33, y: 35 },
      { x: 34, y: 35 },
      { x: 35, y: 35 },
      { x: 36, y: 32 },
      { x: 37, y: 32 },
      { x: 36, y: 33 },
      { x: 37, y: 33 },
      { x: 36, y: 34 },
      { x: 37, y: 34 },
      { x: 36, y: 35 },
      { x: 37, y: 35 },
    ];

    // Pick 8 random unique positions for the frozen NPCs
    const selectedPositions = [];
    while (selectedPositions.length < 8) {
      const randomIndex = Math.floor(Math.random() * frozenNpcPositions.length);
      const pos = frozenNpcPositions[randomIndex];
      if (!selectedPositions.some((p) => p.x === pos.x && p.y === pos.y)) {
        selectedPositions.push(pos);
      }
    }

    for (let i = 0; i < 8; i++) {
      const pos = selectedPositions[i];
      const desc = frozenNpcDescriptions[i % frozenNpcDescriptions.length]; // Cycle through descriptions
      const frozenNpcEvent = await map.createDynamicEvent({
        x: pos.x,
        y: pos.y,
        event: FrozenFestivalGoerEvent,
        direction: Move.down, // Or a random direction
      });
      (frozenNpcEvent.event as FrozenFestivalGoerEvent).setDescription(desc);
      this.frozenNpcIds.push(frozenNpcEvent.id);
    }

    // --- Dialogue Sequence ---
    await player.showText(
      'The crystallized festival pulses gently. You can broadcast a fragment to break the stagnation, or leave it preserved.',
      {
        type: 'text',
        speaker: 'SYSTEM',
        position: 'top',
      },
    );

    await player.showText("Beautiful, isn't it?", {
      speaker: 'Miel',
      graphic: 'npc_preserver_scout_f1',
    });

    await player.showText("It's a cage.", {
      speaker: 'Callum',
      graphic: 'npc_callum',
    });

    await player.showText(
      "Is it? Look at their faces. Every single one of them is happy. Not pretending, not performing — genuinely, completely happy. That moment was perfect. I've never seen anything like it.",
      {
        speaker: 'Miel',
        graphic: 'npc_preserver_scout_f1',
      },
    );

    await player.showText(
      "Do you know when this happened? Twelve years ago. That child — she's frozen at age six. If I break this crystal, she'll wake up eighteen. She won't recognize her parents' faces — they'll have aged a decade in what feels to her like a blink.",
      {
        speaker: 'Miel',
        graphic: 'npc_preserver_scout_f1',
      },
    );

    await player.showText(
      "The dancers — they're a couple who met that night. Their first dance. If they wake up, they'll be strangers who shared a single dance twelve years ago. The magic of that moment? Gone.",
      {
        speaker: 'Miel',
        graphic: 'npc_preserver_scout_f1',
      },
    );

    await player.showText(
      "I didn't freeze this. One of our seniors did, years before I joined. But I've guarded it ever since. Because every time I look at them, I remember that perfect moments exist. That happiness isn't just a theory.",
      {
        speaker: 'Miel',
        graphic: 'npc_preserver_scout_f1',
      },
    );

    await player.showText(
      "You can break it. I won't stop you. But I want you to look at their faces first. Really look.",
      {
        speaker: 'Miel',
        graphic: 'npc_preserver_scout_f1',
      },
    );

    await player.showText(
      'Twelve years. That child is eighteen now — or would be, if time had passed for her. Twelve years of growing up, lost. Her parents have aged. Her friends have moved on.',
      {
        speaker: 'Callum',
        graphic: 'npc_callum',
      },
    );

    await player.showText(
      "But she doesn't know that. Right now, in her frozen moment, she's reaching for a lantern and her whole life is joy.",
      {
        speaker: 'Callum',
        graphic: 'npc_callum',
      },
    );

    // --- Moral Choice GUI ---
    await player.showText(
      'The crystallized festival pulses gently. You can broadcast a fragment to break the stagnation, or leave it preserved.',
      {
        type: 'text',
        speaker: 'SYSTEM',
        position: 'top',
      },
    );

    const choice = await player.gui('moral-choice').open({
      choices: [
        { id: 'break-festival', text: 'Break the crystal' },
        { id: 'preserve-festival', text: 'Leave it preserved' },
      ],
    });

    // --- Process Choice ---
    if (choice.res === 'break-festival') {
      // Break the crystal
      player.addVibrancy('resonance-fields', 8); // Vibrancy +8
      await player.showText(
        'The crystal shatters! The festival-goers wake, confused and disoriented. The child cries, the dancers are strangers, but they are alive and free.',
        {
          type: 'text',
          speaker: 'SYSTEM',
          position: 'top',
        },
      );

      // Remove frozen NPCs and potentially replace with 'waking' versions (simplified here)
      for (const id of this.frozenNpcIds) {
        map.removeEvent(id);
      }
      this.frozenNpcIds = []; // Clear the list

      await player.showText(
        'That was hard to watch. But they have a chance now. A chance to make new moments.',
        {
          speaker: 'Callum',
          graphic: 'npc_callum',
        },
      );

      await player.showText('Miel walks away without a word.', {
        type: 'text',
        speaker: 'SYSTEM',
        position: 'top',
      });
    } else if (choice.res === 'preserve-festival') {
      // Leave it preserved
      // No vibrancy gain
      player.addItem('MF-07: The Perfect Moment', 1); // Player receives unique fragment
      await player.showText(
        "The festival remains frozen, a perfect moment preserved. A unique sorrow-type fragment appears at the zone's edge.",
        {
          type: 'text',
          speaker: 'SYSTEM',
          position: 'top',
        },
      );

      await player.showText('Thank you. I know what it cost you to walk away.', {
        speaker: 'Miel',
        graphic: 'npc_preserver_scout_f1',
      });

      await player.showText(
        "I'm not sure we made the right choice. But I'm not sure we would have, either way.",
        {
          speaker: 'Callum',
          graphic: 'npc_callum',
        },
      );
    }

    // --- Cleanup ---
    player.setPlayerControl(true); // Re-enable player movement
    player.setCamera(player.position.x, player.position.y, { smooth: true, speed: 0.05 }); // Reset camera

    // Remove dynamic NPCs
    if (this.callumEventId) map.removeEvent(this.callumEventId);
    if (this.mielEventId) map.removeEvent(this.mielEventId);
    for (const id of this.frozenNpcIds) {
      map.removeEvent(id); // Ensure any remaining frozen NPCs are removed
    }

    // Remove this trigger event itself
    this.event.remove();
  }
}
