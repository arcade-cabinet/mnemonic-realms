import { EventData, RpgEvent, RpgMap, type RpgPlayer } from '@rpgjs/server';

const DLG_CALLUM_KINESIS_RECALL = [
  "The Peregrine Road — eternal travelers. They carved the world's first mountain passes and bridged its first rivers. They believed stillness was death.",
  "When they'd mapped every route, they dissolved into the kinetic forces of the world — wind, water, tectonic shifts.",
  'This Spire is their final monument. A single vibrating moment, sustained for centuries.',
];

const DLG_PETRA_KINESIS = [
  "The Spire pulses with raw motion. It's beautiful, but dangerous without the Kinetic Boots.",
  'Are you ready to face Kinesis? The final god awaits your choice.',
];

@EventData({
  name: 'act2-scene13-kinesis-recall',
  map: 'hollow-ridge',
  x: 24,
  y: 10,
  hitbox: { width: 1, height: 1 },
  auto: true,
  action: true,
})
export class KinesisRecallEvent extends RpgEvent {
  private callumEventId: string | null = null;
  private petraEventId: string | null = null;

  async onInit(player: RpgPlayer) {
    if (
      player.getVariable('GQ-04') === 'active' &&
      player.hasItem('K-05') && // K-05 is Kinetic Boots
      !player.getVariable('kinesis_recall_vision_seen')
    ) {
      player.setVariable('kinesis_recall_vision_seen', true);

      this.callumEventId = await player.createDynamicEvent({
        x: 23,
        y: 11,
        graphic: 'npc_callum',
        name: 'npc_callum_kinesis_recall',
        properties: {
          isTemporary: true,
        },
      });
      this.petraEventId = await player.createDynamicEvent({
        x: 25,
        y: 11,
        graphic: 'npc_petra',
        name: 'npc_petra_kinesis_recall',
        properties: {
          isTemporary: true,
        },
      });

      await player.showText(DLG_CALLUM_KINESIS_RECALL);
      await player.showText(DLG_PETRA_KINESIS);

      await player.callScene('cutscene-play', { cutsceneId: 'kinesis-recall-vision' });
    }
  }

  async onAction(player: RpgPlayer) {
    if (
      player.getVariable('GQ-04') === 'active' &&
      player.getVariable('kinesis_recall_vision_seen') &&
      !player.getVariable('kinesis_recall_completed')
    ) {
      // The GUI will handle the emotion choice and fragment consumption.
      // We assume player.callGui is blocking and returns a result upon completion.
      const recallSuccessful = await player.callGui('god-recall-pedestal', { god: 'kinesis' });

      if (recallSuccessful) {
        player.setVariable('GQ-04', 'complete');
        player.setVariable('kinesis_recall_completed', true);

        await player.callEffect('vibrancy-change', { zone: 'hollow-ridge', delta: 15 });

        await player.showText(
          'The Kinesis Spire pulses with new energy. Hollow Ridge feels more vibrant!',
        );

        if (this.callumEventId) {
          await player.removeDynamicEvent(this.callumEventId);
          this.callumEventId = null;
        }
        if (this.petraEventId) {
          await player.removeDynamicEvent(this.petraEventId);
          this.petraEventId = null;
        }
      } else {
        await player.showText('You decided not to recall Kinesis yet, or the ritual failed.');
      }
    } else if (player.getVariable('kinesis_recall_completed')) {
      await player.showText("The Kinesis Spire hums with the god's recalled power.");
    } else {
      await player.showText(
        'The Kinesis Spire vibrates intensely. You need the Kinetic Boots to approach safely, and the time must be right.',
      );
    }
  }
}

export default function kinesisRecallEvent() {
  return KinesisRecallEvent;
}
