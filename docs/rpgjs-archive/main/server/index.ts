import { RpgModule, type RpgServer } from '@rpgjs/server';
import { database } from '../database';
// --- Region maps (DDL-generated overworld) ---
import { FrontierMap } from './maps/frontier';
import { SettledLandsMap } from './maps/settled-lands';
import { SketchRealmMap } from './maps/sketch-realm';
// --- Legacy zone maps (kept as child worlds) ---
import { AmbergroveMap } from './maps/ambergrove';
import { DepthsLevel1Map } from './maps/depths-level-1-memory-cellar';
import { DepthsLevel2Map } from './maps/depths-level-2-drowned-archive';
import { DepthsLevel3Map } from './maps/depths-level-3-resonant-caverns';
import { DepthsLevel4Map } from './maps/depths-level-4-the-songline';
import { DepthsLevel5Map } from './maps/depths-level-5-the-deepest-memory';
import { EverwickMap } from './maps/everwick';
import { FlickerveilMap } from './maps/flickerveil';
import { FortressF1Map } from './maps/fortress-floor-1-gallery-of-moments';
import { FortressF2Map } from './maps/fortress-floor-2-archive-of-perfection';
import { FortressF3Map } from './maps/fortress-floor-3-first-memory-chamber';
import { HeartfieldMap } from './maps/heartfield';
import { HollowRidgeMap } from './maps/hollow-ridge';
import { LuminousWastesMap } from './maps/luminous-wastes';
import { MillbrookMap } from './maps/millbrook';
import { ResonanceFieldsMap } from './maps/resonance-fields';
import { ShimmerMarshMap } from './maps/shimmer-marsh';
import { SunridgeMap } from './maps/sunridge';
import { HalfDrawnForestMap } from './maps/the-half-drawn-forest';
import { UndrawnPeaksMap } from './maps/the-undrawn-peaks';
import { player } from './player';

@RpgModule<RpgServer>({
  player,
  maps: [
    // Region overworlds (DDL pipeline)
    SettledLandsMap,
    FrontierMap,
    SketchRealmMap,
    // Legacy zone maps (child worlds)
    EverwickMap,
    HeartfieldMap,
    AmbergroveMap,
    MillbrookMap,
    SunridgeMap,
    ShimmerMarshMap,
    FlickerveilMap,
    HollowRidgeMap,
    ResonanceFieldsMap,
    LuminousWastesMap,
    HalfDrawnForestMap,
    UndrawnPeaksMap,
    DepthsLevel1Map,
    DepthsLevel2Map,
    DepthsLevel3Map,
    DepthsLevel4Map,
    DepthsLevel5Map,
    FortressF1Map,
    FortressF2Map,
    FortressF3Map,
  ],
  database,
})
export default class RpgServerModule {}
