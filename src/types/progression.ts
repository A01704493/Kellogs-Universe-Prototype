/**
 * Interfaces y tipos para el sistema de progresión
 */

// Perfil del jugador
export interface PlayerProfile {
  userId: string;          // Identificador único del jugador
  username: string;        // Nombre mostrado del jugador
  xp: number;              // Experiencia total acumulada
  level: number;           // Nivel actual del jugador
  coins: number;           // Monedas acumuladas (ganadas en minijuegos)
  diamonds: number;        // Diamantes K (obtenidos al redimir códigos)
  createdAt: number;       // Timestamp de creación del perfil
  lastActivityAt: number;  // Timestamp de la última actividad
  activityHistory: ActivityRecord[]; // Historial de actividades
  transactionHistory: Transaction[]; // Historial de transacciones
  avatarConfig: {          // Configuración del avatar
    body: number;
    head: number;
    accessory: number | null;
  };
  gameStats: {             // Estadísticas de juego
    gamesPlayed: number;
    highScores: Record<string, number>; // Mejores puntuaciones por juego
  };
}

// Configuración de niveles
export interface LevelConfig {
  level: number;           // Número de nivel
  xpRequired: number;      // XP requerida para este nivel
  unlocks?: string[];      // Elementos desbloqueados al alcanzar este nivel
  reward?: Reward;         // Recompensa por alcanzar este nivel
}

// Recompensa
export interface Reward {
  coins?: number;          // Monedas otorgadas
  diamonds?: number;       // Diamantes K otorgados
  items?: string[];        // Elementos otorgados
}

// Tipos de actividad
export type ActivityType = 
  | 'game_played'
  | 'code_redeemed'
  | 'level_up'
  | 'login'
  | 'avatar_customized'
  | 'daily_bonus';

// Registro de actividad
export interface ActivityRecord {
  type: ActivityType;      // Tipo de actividad
  timestamp: number;       // Timestamp cuando ocurrió
  data: any;               // Datos asociados a la actividad
  xpEarned: number;        // XP ganada por esta actividad
}

// Transacción de moneda
export interface Transaction {
  type: 'credit' | 'debit'; // Crédito (ganancia) o débito (gasto)
  currency: 'coins' | 'diamonds'; // Tipo de moneda
  amount: number;          // Cantidad
  reason: string;          // Razón de la transacción
  timestamp: number;       // Timestamp cuando ocurrió
} 