import { EventData, RpgEvent, type RpgPlayer } from '@rpgjs/server';

const DLG_ARTUN_KINESIS_RECALL = [
  "The Peregrine Road — eternal travelers. They carved the world's first mountain passes and bridged its first rivers. They believed stillness was death.",
  "When they'd mapped every route, they dissolved into the kinetic forces of the world — wind, water, tectonic shifts.",
  'This Spire is their final monument. A single vibrating moment, sustained for centuries.',
];

const DLG_NEL_KINESIS = [
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
  private artunEventId: string | null = null;
  private nelEventId: string | null = null;

  async onInit(player: RpgPlayer) {
    if (
      player.getVariable('GQ-04') === 'active' &&
      player.hasItem('K-05') && // K-05 is Kinetic Boots
      !player.getVariable('kinesis_recall_vision_seen')
    ) {
      player.setVariable('kinesis_recall_vision_seen', true);

      this.artunEventId = await player.createDynamicEvent({
        x: 23,
        y: 11,
        graphic: 'npc_artun',
        name: 'npc_artun_kinesis_recall',
        properties: {
          isTemporary: true,
        },
      });
      this.nelEventId = await player.createDynamicEvent({
        x: 25,
        y: 11,
        graphic: 'npc_nel',
        name: 'npc_nel_kinesis_recall',
        properties: {
          isTemporary: true,
        },
      });

      await player.showText(DLG_ARTUN_KINESIS_RECALL);
      await player.showText(DLG_NEL_KINESIS);

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

        if (this.artunEventId) {
          player.map.removeEvent(this.artunEventId);
          this.artunEventId = null;
        }
        if (this.nelEventId) {
          player.map.removeEvent(this.nelEventId);
          this.nelEventId = null;
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
