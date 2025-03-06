import { 
  PlayerProfile, 
  LevelConfig, 
  Reward, 
  ActivityType, 
  ActivityRecord,
  Transaction
} from '../types/progression';

// Clave para almacenar en localStorage
const PLAYER_PROFILE_KEY = 'kellogsPlayerProfile';
const ACTIVITY_HISTORY_KEY = 'kellogsActivityHistory';
const TRANSACTION_HISTORY_KEY = 'kellogsTransactionHistory';

// Configuración por defecto para la progresión de niveles
// Fórmula: XP para nivel n = baseXP * (nivel ^ xpScalingFactor)
const DEFAULT_LEVEL_CONFIG: LevelConfig = {
  baseXP: 100,          // 100 XP para el nivel 1
  xpScalingFactor: 1.5, // Escala exponencial para hacer cada nivel más difícil
  maxLevel: 50          // Nivel máximo
};

/**
 * Servicio principal para manejar la progresión del jugador, incluyendo XP, niveles, 
 * diamantes y monedas.
 */
class ProgressionService {
  private levelConfig: LevelConfig;
  
  constructor(config: LevelConfig = DEFAULT_LEVEL_CONFIG) {
    this.levelConfig = config;
  }

  /**
   * Inicializar el perfil del jugador si no existe
   */
  public initializePlayer(username: string): PlayerProfile {
    const existingProfile = this.getPlayerProfile();
    
    if (existingProfile) {
      // Si ya existe un perfil, solo actualizamos el nombre de usuario si es diferente
      if (existingProfile.username !== username) {
        const updatedProfile = {
          ...existingProfile,
          username
        };
        this.savePlayerProfile(updatedProfile);
        return updatedProfile;
      }
      return existingProfile;
    }
    
    // Crear nuevo perfil
    const newProfile: PlayerProfile = {
      username,
      xp: 0,
      level: 1,
      diamonds: 0,
      coins: 0,
      lastUpdated: Date.now()
    };
    
    this.savePlayerProfile(newProfile);
    return newProfile;
  }

  /**
   * Obtener perfil del jugador desde localStorage
   */
  public getPlayerProfile(): PlayerProfile | null {
    const profileJson = localStorage.getItem(PLAYER_PROFILE_KEY);
    return profileJson ? JSON.parse(profileJson) : null;
  }

  /**
   * Guardar perfil del jugador en localStorage
   */
  private savePlayerProfile(profile: PlayerProfile): void {
    localStorage.setItem(PLAYER_PROFILE_KEY, JSON.stringify(profile));
  }

  /**
   * Calcular XP necesario para alcanzar un nivel específico
   */
  public getXPForLevel(level: number): number {
    if (level <= 1) return 0;
    return Math.round(this.levelConfig.baseXP * Math.pow(level - 1, this.levelConfig.xpScalingFactor));
  }

  /**
   * Calcular nivel basado en la cantidad total de XP
   */
  public getLevelFromXP(totalXP: number): number {
    if (totalXP <= 0) return 1;
    
    let level = 1;
    let xpForNextLevel = this.getXPForLevel(level + 1);
    
    while (totalXP >= xpForNextLevel && level < this.levelConfig.maxLevel) {
      level++;
      xpForNextLevel = this.getXPForLevel(level + 1);
    }
    
    return level;
  }

  /**
   * Calcular XP restante para el siguiente nivel
   */
  public getXPToNextLevel(totalXP: number): number {
    const currentLevel = this.getLevelFromXP(totalXP);
    if (currentLevel >= this.levelConfig.maxLevel) return 0;
    
    const xpForNextLevel = this.getXPForLevel(currentLevel + 1);
    return xpForNextLevel - totalXP;
  }

  /**
   * Añadir XP al jugador y actualizar su nivel si es necesario
   */
  public addXP(amount: number, source: string = 'general'): PlayerProfile {
    if (amount <= 0) throw new Error('La cantidad de XP debe ser positiva');
    
    const profile = this.getPlayerProfile();
    if (!profile) throw new Error('No se encontró perfil de jugador');
    
    const oldLevel = profile.level;
    const newXP = profile.xp + amount;
    const newLevel = this.getLevelFromXP(newXP);
    
    const updatedProfile: PlayerProfile = {
      ...profile,
      xp: newXP,
      level: newLevel,
      lastUpdated: Date.now()
    };
    
    this.savePlayerProfile(updatedProfile);
    
    // Registrar la transacción
    this.recordTransaction({
      id: `xp-${Date.now()}`,
      timestamp: Date.now(),
      resourceType: 'XP',
      amount: amount,
      balance: newXP,
      source: source
    });
    
    // Comprobar si subió de nivel para posibles recompensas de nivel
    if (newLevel > oldLevel) {
      console.log(`¡El jugador subió del nivel ${oldLevel} al ${newLevel}!`);
      // Aquí se podrían otorgar recompensas por subir de nivel
    }
    
    return updatedProfile;
  }

  /**
   * Añadir diamantes al jugador
   */
  public addDiamonds(amount: number, source: string = 'general'): PlayerProfile {
    if (amount <= 0) throw new Error('La cantidad de diamantes debe ser positiva');
    
    const profile = this.getPlayerProfile();
    if (!profile) throw new Error('No se encontró perfil de jugador');
    
    const newDiamonds = profile.diamonds + amount;
    
    const updatedProfile: PlayerProfile = {
      ...profile,
      diamonds: newDiamonds,
      lastUpdated: Date.now()
    };
    
    this.savePlayerProfile(updatedProfile);
    
    // Registrar la transacción
    this.recordTransaction({
      id: `diamonds-${Date.now()}`,
      timestamp: Date.now(),
      resourceType: 'DIAMONDS',
      amount: amount,
      balance: newDiamonds,
      source: source
    });
    
    return updatedProfile;
  }

  /**
   * Añadir monedas al jugador
   */
  public addCoins(amount: number, source: string = 'general'): PlayerProfile {
    if (amount <= 0) throw new Error('La cantidad de monedas debe ser positiva');
    
    const profile = this.getPlayerProfile();
    if (!profile) throw new Error('No se encontró perfil de jugador');
    
    const newCoins = profile.coins + amount;
    
    const updatedProfile: PlayerProfile = {
      ...profile,
      coins: newCoins,
      lastUpdated: Date.now()
    };
    
    this.savePlayerProfile(updatedProfile);
    
    // Registrar la transacción
    this.recordTransaction({
      id: `coins-${Date.now()}`,
      timestamp: Date.now(),
      resourceType: 'COINS',
      amount: amount,
      balance: newCoins,
      source: source
    });
    
    return updatedProfile;
  }

  /**
   * Gastar diamantes (si el jugador tiene suficientes)
   */
  public spendDiamonds(amount: number, source: string = 'general'): PlayerProfile {
    if (amount <= 0) throw new Error('La cantidad de diamantes debe ser positiva');
    
    const profile = this.getPlayerProfile();
    if (!profile) throw new Error('No se encontró perfil de jugador');
    
    if (profile.diamonds < amount) {
      throw new Error('No hay suficientes diamantes');
    }
    
    const newDiamonds = profile.diamonds - amount;
    
    const updatedProfile: PlayerProfile = {
      ...profile,
      diamonds: newDiamonds,
      lastUpdated: Date.now()
    };
    
    this.savePlayerProfile(updatedProfile);
    
    // Registrar la transacción
    this.recordTransaction({
      id: `diamonds-${Date.now()}`,
      timestamp: Date.now(),
      resourceType: 'DIAMONDS',
      amount: -amount,
      balance: newDiamonds,
      source: source
    });
    
    return updatedProfile;
  }

  /**
   * Gastar monedas (si el jugador tiene suficientes)
   */
  public spendCoins(amount: number, source: string = 'general'): PlayerProfile {
    if (amount <= 0) throw new Error('La cantidad de monedas debe ser positiva');
    
    const profile = this.getPlayerProfile();
    if (!profile) throw new Error('No se encontró perfil de jugador');
    
    if (profile.coins < amount) {
      throw new Error('No hay suficientes monedas');
    }
    
    const newCoins = profile.coins - amount;
    
    const updatedProfile: PlayerProfile = {
      ...profile,
      coins: newCoins,
      lastUpdated: Date.now()
    };
    
    this.savePlayerProfile(updatedProfile);
    
    // Registrar la transacción
    this.recordTransaction({
      id: `coins-${Date.now()}`,
      timestamp: Date.now(),
      resourceType: 'COINS',
      amount: -amount,
      balance: newCoins,
      source: source
    });
    
    return updatedProfile;
  }

  /**
   * Otorgar una recompensa que puede incluir XP, diamantes y monedas
   */
  public grantReward(reward: Reward, activityType: ActivityType, details: string = ''): PlayerProfile {
    const profile = this.getPlayerProfile();
    if (!profile) throw new Error('No se encontró perfil de jugador');
    
    let updatedProfile = { ...profile };
    
    // Otorgar cada tipo de recompensa
    if (reward.xp && reward.xp > 0) {
      updatedProfile = this.addXP(reward.xp, activityType);
    }
    
    if (reward.diamonds && reward.diamonds > 0) {
      updatedProfile = this.addDiamonds(reward.diamonds, activityType);
    }
    
    if (reward.coins && reward.coins > 0) {
      updatedProfile = this.addCoins(reward.coins, activityType);
    }
    
    // Registrar la actividad
    this.recordActivity({
      id: `activity-${Date.now()}`,
      timestamp: Date.now(),
      activityType: activityType,
      details: details,
      reward: reward
    });
    
    return updatedProfile;
  }

  /**
   * Registrar un historial de actividad del jugador
   */
  private recordActivity(activity: ActivityRecord): void {
    const history = this.getActivityHistory();
    history.push(activity);
    // Limitar el historial a los últimos 100 registros para evitar sobrecarga
    if (history.length > 100) {
      history.shift();
    }
    localStorage.setItem(ACTIVITY_HISTORY_KEY, JSON.stringify(history));
  }

  /**
   * Obtener historial de actividad
   */
  public getActivityHistory(): ActivityRecord[] {
    const historyJson = localStorage.getItem(ACTIVITY_HISTORY_KEY);
    return historyJson ? JSON.parse(historyJson) : [];
  }

  /**
   * Registrar una transacción para seguimiento de economía
   */
  private recordTransaction(transaction: Transaction): void {
    const history = this.getTransactionHistory();
    history.push(transaction);
    // Limitar el historial a los últimos 100 registros
    if (history.length > 100) {
      history.shift();
    }
    localStorage.setItem(TRANSACTION_HISTORY_KEY, JSON.stringify(history));
  }

  /**
   * Obtener historial de transacciones
   */
  public getTransactionHistory(): Transaction[] {
    const historyJson = localStorage.getItem(TRANSACTION_HISTORY_KEY);
    return historyJson ? JSON.parse(historyJson) : [];
  }

  /**
   * Otorgar recompensas por una sesión de minijuego
   */
  public rewardMinigameCompletion(
    gameId: string, 
    score: number, 
    baseXP: number = 50, 
    baseCoins: number = 10
  ): PlayerProfile {
    // Calcular recompensas basadas en la puntuación
    // La fórmula puede ajustarse según la dificultad de cada juego
    const xpReward = Math.round(baseXP * (1 + score / 100));
    const coinsReward = Math.round(baseCoins * (1 + score / 50));
    
    const reward: Reward = {
      xp: xpReward,
      coins: coinsReward,
      description: `Completaste el minijuego ${gameId} con ${score} puntos`
    };
    
    return this.grantReward(
      reward, 
      ActivityType.MINIGAME_COMPLETION, 
      `Minijuego ${gameId} completado con ${score} puntos`
    );
  }

  /**
   * Otorgar recompensas por redimir un código
   */
  public rewardCodeRedemption(
    code: string, 
    defaultDiamonds: number = 10,
    defaultXP: number = 25
  ): PlayerProfile {
    const reward: Reward = {
      diamonds: defaultDiamonds,
      xp: defaultXP,
      description: `Canjeaste el código ${code}`
    };
    
    return this.grantReward(
      reward, 
      ActivityType.CODE_REDEMPTION, 
      `Código ${code} canjeado`
    );
  }
}

// Exportar una instancia única del servicio
export const progressionService = new ProgressionService();

// También exportamos la clase para casos donde se necesite una instancia personalizada
export default ProgressionService; 