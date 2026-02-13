import { RpgModule, type RpgServer } from '@rpgjs/server';
import database from '../database';
import { DungeonMap } from './maps/dungeon';
import { OverworldMap } from './maps/overworld';
import { player } from './player';

@RpgModule<RpgServer>({
  player,
  maps: [OverworldMap, DungeonMap],
  database,
})
export default class RpgServerModule {}
