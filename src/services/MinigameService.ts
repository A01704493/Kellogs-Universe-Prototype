import { gameIntegrator } from './GameIntegrator';

// Estructura de datos para almacenar la configuración de un minijuego
export interface MinigameConfig {
  id: string;
  name: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  baseXpReward: number;
  baseCoinReward: number;
  maxScore: number;
  timeLimit?: number; // En segundos
}

// Estructura para almacenar puntuaciones
export interface ScoreEntry {
  username: string;
  score: number;
  timestamp: number;
}

/**
 * Servicio para gestionar los minijuegos
 */
class MinigameService {
  // Configuración para cada minijuego
  private minigames: Record<string, MinigameConfig> = {
    'zucaritas': {
      id: 'zucaritas',
      name: 'Desafío de Tony el Tigre',
      description: 'Desafía tu fuerza atrapando cereales en el tazón',
      difficulty: 'medium',
      baseXpReward: 40,
      baseCoinReward: 15,
      maxScore: 1000
    },
    'choco-krispis': {
      id: 'choco-krispis',
      name: 'Aventura con Melvin',
      description: 'Recolecta pelotas y evita obstáculos',
      difficulty: 'easy',
      baseXpReward: 60,
      baseCoinReward: 8,
      maxScore: 1000,
      timeLimit: 60
    },
    'froot-loops': {
      id: 'froot-loops',
      name: 'Vuelo de Sam el tucán',
      description: 'Ayuda a Sam a volar y recolectar anillos de colores',
      difficulty: 'hard',
      baseXpReward: 50,
      baseCoinReward: 12,
      maxScore: 1000
    }
  };

  private HIGHSCORES_KEY_PREFIX = 'kellogs_highscores_';
  private USER_SCORES_KEY = 'kellogsUserScores';

  /**
   * Obtener configuración de un minijuego específico
   */
  public getMinigameConfig(gameId: string): MinigameConfig | null {
    return this.minigames[gameId] || null;
  }

  /**
   * Obtener todos los minijuegos disponibles
   */
  public getAllMinigames(): MinigameConfig[] {
    return Object.values(this.minigames);
  }

  /**
   * Registrar una puntuación para un minijuego
   */
  public submitScore(gameId: string, score: number): void {
    const gameConfig = this.getMinigameConfig(gameId);
    if (!gameConfig) {
      throw new Error(`Minijuego no encontrado: ${gameId}`);
    }
    
    // Limitar score al máximo definido
    const validScore = Math.min(score, gameConfig.maxScore);
    
    // Registrar la puntuación
    const username = localStorage.getItem('kellogsUsername') || 'Usuario';
    const scoreEntry: ScoreEntry = {
      username,
      score: validScore,
      timestamp: Date.now()
    };
    
    // Registrar en el historial de puntuaciones del usuario
    this.addToUserScoreHistory(gameId, scoreEntry);
    
    // Comprobar y actualizar highscores
    this.updateHighscores(gameId, scoreEntry);
    
    // Otorgar recompensas basadas en la puntuación
    gameIntegrator.handleMinigameCompletion(gameId, validScore);
  }

  /**
   * Añadir puntuación al historial del usuario
   */
  private addToUserScoreHistory(gameId: string, scoreEntry: ScoreEntry): void {
    const userScoresJson = localStorage.getItem(this.USER_SCORES_KEY);
    const userScores: Record<string, ScoreEntry[]> = userScoresJson 
      ? JSON.parse(userScoresJson) 
      : {};
    
    if (!userScores[gameId]) {
      userScores[gameId] = [];
    }
    
    userScores[gameId].push(scoreEntry);
    
    // Limitar a las 10 últimas puntuaciones por juego
    if (userScores[gameId].length > 10) {
      userScores[gameId] = userScores[gameId].slice(-10);
    }
    
    localStorage.setItem(this.USER_SCORES_KEY, JSON.stringify(userScores));
  }

  /**
   * Actualizar tabla de puntuaciones altas
   */
  private updateHighscores(gameId: string, scoreEntry: ScoreEntry): void {
    const highscoresKey = `${this.HIGHSCORES_KEY_PREFIX}${gameId}`;
    const highscoresJson = localStorage.getItem(highscoresKey);
    const highscores: ScoreEntry[] = highscoresJson 
      ? JSON.parse(highscoresJson) 
      : [];
    
    // Añadir nueva puntuación
    highscores.push(scoreEntry);
    
    // Ordenar por puntuación descendente
    highscores.sort((a, b) => b.score - a.score);
    
    // Limitar a las 10 mejores puntuaciones
    const topScores = highscores.slice(0, 10);
    
    localStorage.setItem(highscoresKey, JSON.stringify(topScores));
  }

  /**
   * Obtener las mejores puntuaciones para un minijuego
   */
  public getHighscores(gameId: string, limit: number = 10): ScoreEntry[] {
    const highscoresKey = `${this.HIGHSCORES_KEY_PREFIX}${gameId}`;
    const highscoresJson = localStorage.getItem(highscoresKey);
    const highscores: ScoreEntry[] = highscoresJson 
      ? JSON.parse(highscoresJson) 
      : [];
    
    return highscores.slice(0, limit);
  }

  /**
   * Obtener el historial de puntuaciones de un usuario para un juego específico
   */
  public getUserScoreHistory(gameId: string): ScoreEntry[] {
    const userScoresJson = localStorage.getItem(this.USER_SCORES_KEY);
    const userScores: Record<string, ScoreEntry[]> = userScoresJson 
      ? JSON.parse(userScoresJson) 
      : {};
    
    return userScores[gameId] || [];
  }

  /**
   * Obtener la mejor puntuación del usuario para un juego específico
   */
  public getUserBestScore(gameId: string): number {
    const scores = this.getUserScoreHistory(gameId);
    
    if (scores.length === 0) {
      return 0;
    }
    
    // Encontrar la puntuación más alta
    return Math.max(...scores.map(s => s.score));
  }

  /**
   * Calcular recompensas proyectadas basadas en una puntuación
   * (útil para mostrar antes de completar un juego)
   */
  public calculateProjectedRewards(gameId: string, score: number): { xp: number; coins: number } {
    const gameConfig = this.getMinigameConfig(gameId);
    if (!gameConfig) {
      return { xp: 0, coins: 0 };
    }
    
    // Limitar score al máximo definido
    const validScore = Math.min(score, gameConfig.maxScore);
    
    // Calcular recompensas basadas en la puntuación
    const xpReward = Math.round(gameConfig.baseXpReward * (1 + validScore / 100));
    const coinsReward = Math.round(gameConfig.baseCoinReward * (1 + validScore / 50));
    
    return {
      xp: xpReward,
      coins: coinsReward
    };
  }
}

// Exportar una instancia única del servicio
export const minigameService = new MinigameService();

// También exportamos la clase para casos donde se necesite una instancia personalizada
export default MinigameService; 