import type { ArenaType, ArenaConfig } from '../types/arena';
import { arenaConfigArena } from './arenaConfigArena';
import { arenaConfigTrial } from './arenaConfigTrial';
import { arenaConfigMemory } from './arenaConfigMemory';

export const arenaConfigs: Record<ArenaType, ArenaConfig> = {
  arena: arenaConfigArena,
  trial: arenaConfigTrial,
  memory: arenaConfigMemory,
};