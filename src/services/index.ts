// Exportar todos los servicios
export { progressionService } from './ProgressionService';
export { gameIntegrator } from './GameIntegrator';
export { codesService } from './CodesService';
export { minigameService } from './MinigameService';

// Exportar también interfaces y tipos
export type { PlayerProfile, LevelConfig, Reward, ActivityType, ActivityRecord, Transaction } from '../types/progression';
export type { RedeemableCode } from './CodesService';
export type { MinigameConfig, ScoreEntry } from './MinigameService'; 