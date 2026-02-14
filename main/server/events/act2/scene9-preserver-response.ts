import {
  EventData,
  MapData,
  RpgCommonPlayer,
  RpgEvent,
  RpgMap,
  type RpgPlayer,
  RpgScene,
} from '@rpgjs/server';
// --- Inline NPC event classes (no database module) ---

@EventData({
  id: 'npc-preserver-captain-janik',
  name: 'Preserver Captain Janik',
  hitbox: { width: 32, height: 32 },
})
class PreserverCaptainJanik extends RpgEvent {
  onInit() {
    this.setGraphic('npc_janik');
  }
}

@EventData({
  id: 'npc-artun-scene9',
  name: 'Artun',
  hitbox: { width: 32, height: 32 },
})
class ArtunEvent extends RpgEvent {
  onInit() {
    this.setGraphic('npc_artun');
  }
}

@EventData({
  id: 'act2-scene9-preserver-response',
  name: 'The Preserver Response',
  hitbox: { width: 32, height: 32 },
  autoAnimation: true,
  graphic: '', // Invisible event graphic
})
export class PreserverResponseEvent extends RpgEvent {
  onInit() {
    this.set({
      name: 'The Preserver Response',
      graphic: '',
      width: 32,
      height: 32,
      collision: false,
    });
  }

  async onChanges(player: RpgPlayer) {
    // Trigger condition: Player has completed 2 god recalls AND is on hollow-ridge map
    const godsRecalled = player.getVariable('gods_recalled_count') || 0;
    const sceneTriggered = player.getVariable('act2_scene9_triggered');

    if (godsRecalled >= 2 && player.map.id === 'hollow-ridge' && !sceneTriggered) {
      player.setVariable('act2_scene9_triggered', true);
      await this.triggerScene(player);
    }
  }

  private async triggerScene(player: RpgPlayer) {
    // Prevent player movement during cutscene
    player.canMove = false;

    // 1. Screen effect: Crystal Wall Appear
    await player.screenEffect({
      effect: 'crystal-wall-appear',
      duration: 2000,
      animation: true,
    });

    // 2. Spawn NPCs
    // Janik appears from behind the crystal wall
    const aricX = player.position.x + 64; // Janik appears a bit ahead of the player
    const aricY = player.position.y;
    const aricEvent = await player.map.createDynamicEvent({
      x: aricX,
      y: aricY,
      event: PreserverCaptainJanik,
      properties: {
        name: 'Preserver Captain Janik',
        graphic: 'npc_janik',
        direction: 4, // Facing left, towards player
      },
    });

    // Artun steps forward protectively
    const callumX = player.position.x - 32; // Artun steps slightly behind/to the side of player
    const callumY = player.position.y;
    const callumEvent = await player.map.createDynamicEvent({
      x: callumX,
      y: callumY,
      event: ArtunEvent,
      properties: {
        name: 'Artun',
        graphic: 'npc_artun',
        direction: 6, // Facing right, towards Janik
      },
    });

    // Ensure NPCs are visible and have their graphics set
    if (aricEvent) aricEvent.setGraphic('npc_janik');
    if (callumEvent) callumEvent.setGraphic('npc_artun');

    // 3. Dialogue sequences
    await player.showText(
      'The path ahead crystallizes. A wall of blue-white crystal erupts across the trail — not attacking, but blocking. A figure steps from behind the crystal: Preserver Captain Janik, armored in crystalline plate, stern but not hostile.',
    );

    if (aricEvent) await aricEvent.showText('Architect. Stop.', player);

    if (callumEvent)
      await callumEvent.moveRoutes([
        {
          direction: 6, // Face right
          time: 0,
        },
        {
          direction: 6,
          time: 500,
        },
      ]);
    await player.showText('Artun steps forward protectively. Janik raises a hand.');

    if (aricEvent)
      await aricEvent.showText(
        "I'm not here to fight. I'm here to talk. The Curator sent me because words matter more than force.",
        player,
      );
    if (aricEvent)
      await aricEvent.showText(
        "You've recalled two gods. Two dormant prototypes that the Dissolved left unfinished — and you've forced them into permanent forms based on single emotions. Joy, fury, sorrow, awe — whichever you chose, you chose for the entire world. Forever.",
        player,
      );
    if (aricEvent)
      await aricEvent.showText(
        "Did you ask the world what it wanted? Did you consult the people who live in those zones? The Frontier settlers who've built their lives around the gods being dormant?",
        player,
      );

    if (callumEvent)
      await callumEvent.showText(
        'The gods were meant to be recalled. The Dissolved left them as gifts —',
        player,
      );

    if (aricEvent)
      await aricEvent.showText(
        "The Dissolved dissolved. They left. Their intentions are irrelevant — they're not here to live with the consequences. You are. And so are we.",
        player,
      );

    if (aricEvent)
      await aricEvent.moveRoutes([
        {
          direction: 2, // Face down, towards player
          time: 0,
        },
        {
          direction: 2,
          time: 500,
        },
      ]);
    await player.showText('Janik turns to the player.');

    if (aricEvent)
      await aricEvent.showText(
        "I've seen what your first recall did. The zone changed. The people changed. Their behavior shifted — not because they chose to, but because a god's passive influence rewrote their personalities. Is that growth? Or is it just a different kind of control?",
        player,
      );
    if (aricEvent)
      await aricEvent.showText(
        "The Curator doesn't want to destroy you. The Curator wants you to stop. To think. To consider that some things are worth keeping exactly as they are.",
        player,
      );
    if (aricEvent)
      await aricEvent.showText(
        "Two gods remain dormant. I'm asking you — not ordering, asking — to leave them be.",
        player,
      );

    // Janik drops crystal wall and walks away
    await player.screenEffect({
      effect: 'crystal-wall-disappear',
      duration: 1500,
      animation: true,
    });

    if (aricEvent)
      await aricEvent.moveRoutes([
        {
          direction: 8, // Face up
          time: 0,
        },
        {
          direction: 8,
          time: 500,
        },
        {
          direction: 8, // Walk away
          speed: 0.1,
          distance: 100,
        },
      ]);
    if (aricEvent) await aricEvent.remove(); // Remove Janik after he walks off screen

    await player.showText(
      'Janik drops the crystal wall and walks away. No combat. No threat. Just a question that lingers.',
    );

    if (callumEvent) await callumEvent.showText("He's not entirely wrong, you know.", player);
    if (callumEvent)
      await callumEvent.showText(
        "The gods' passive effects do change NPC behavior. I noticed it too — people in Resonance Fields act differently now. Not unhappily. Just... differently than they chose to be.",
        player,
      );
    if (callumEvent)
      await callumEvent.showText(
        'But a world that never changes is worse. I believe that. I just... wish I could be more certain.',
        player,
      );

    // Remove Artun after his dialogue
    if (callumEvent) await callumEvent.remove();

    // Re-enable player movement
    player.canMove = true;

    // Update game state for Preserver escalation (e.g., increase encounter rates)
    player.setVariable(
      'preserver_escalation_level',
      (player.getVariable('preserver_escalation_level') || 0) + 1,
    );
    // This variable can be checked by other events to increase Preserver patrol frequency.
  }
}

export default PreserverResponseEvent;
