import { progressionService } from './ProgressionService';
import { Reward, ActivityType } from '../types/progression';

/**
 * Servicio para integrar el sistema de progresión con los componentes de juego existentes
 */
class GameIntegrator {
  /**
   * Inicializa el perfil del jugador cuando inicia sesión
   */
  public initializePlayerOnLogin(username: string): void {
    // Inicializar el perfil de progresión con el mismo nombre de usuario
    progressionService.initializePlayer(username);
    
    // También podemos dar recompensas por iniciar sesión diaria
    this.checkAndRewardDailyLogin(username);
  }
  
  /**
   * Verifica si es una nueva sesión diaria y otorga recompensas si corresponde
   */
  private checkAndRewardDailyLogin(username: string): void {
    const lastLoginKey = 'kellogsLastLogin';
    const lastLoginStr = localStorage.getItem(lastLoginKey);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    
    // Si no hay registro o es de un día anterior, dar recompensa diaria
    if (!lastLoginStr || parseInt(lastLoginStr) < today) {
      const dailyReward: Reward = {
        coins: 5,
        diamonds: 0,
        items: []
      };
      
      progressionService.grantReward(
        dailyReward,
        ActivityType.LOGIN,
        `Inicio de sesión diario - ${now.toLocaleDateString()}`
      );
      
      // Actualizar la fecha del último inicio de sesión
      localStorage.setItem(lastLoginKey, today.toString());
    }
  }
  
  /**
   * Conecta con el sistema de redención de códigos existente
   */
  public handleCodeRedemption(code: string): void {
    // Asumimos que la validación del código se realiza en el componente Redeem
    // Aquí solo manejamos la recompensa por un código válido
    
    // Personalizar recompensas según el código
    let diamondsReward = 10;
    let xpReward = 25;
    
    // Podríamos personalizar las recompensas según el código
    if (code === 'ZUCARITAS') {
      diamondsReward = 15;
      xpReward = 30;
    } else if (code === 'CHOCOKRISPIS') {
      diamondsReward = 12;
      xpReward = 35;
    } else if (code === 'FROOTLOOPS') {
      diamondsReward = 20;
      xpReward = 20;
    } else if (code === 'KELLOGS2023') {
      diamondsReward = 50;
      xpReward = 100;
    }
    
    progressionService.rewardCodeRedemption(code, diamondsReward, xpReward);
  }
  
  /**
   * Registra la finalización de un minijuego y otorga recompensas
   */
  public handleMinigameCompletion(gameId: string, score: number): void {
    // Ajustar valores base según el tipo de juego
    let baseXP = 50;
    let baseCoins = 10;
    
    // Personalizar según el tipo de juego
    if (gameId === 'zucaritas') {
      // Juego de fuerza, más monedas
      baseXP = 40;
      baseCoins = 15;
    } else if (gameId === 'choco-krispis') {
      // Juego de colectar pelotas, más XP
      baseXP = 60;
      baseCoins = 8;
    } else if (gameId === 'froot-loops') {
      // Juego estilo Flappy Bird, balance
      baseXP = 50;
      baseCoins = 12;
    }
    
    progressionService.rewardMinigameCompletion(gameId, score, baseXP, baseCoins);
  }
  
  /**
   * Obtiene datos del progreso del jugador para mostrar en la interfaz
   */
  public getPlayerProgressData() {
    const profile = progressionService.getPlayerProfile();
    
    if (!profile) {
      return null;
    }
    
    // Calcular XP para el nivel actual y siguiente
    const currentLevel = profile.level;
    const nextLevel = currentLevel < 50 ? currentLevel + 1 : currentLevel;
    
    const xpForCurrentLevel = progressionService.getXPForLevel(currentLevel);
    const xpForNextLevel = progressionService.getXPForLevel(nextLevel);
    const xpProgress = currentLevel < 50
      ? ((profile.xp - xpForCurrentLevel) / (xpForNextLevel - xpForCurrentLevel)) * 100
      : 100;
    
    return {
      username: profile.username,
      level: profile.level,
      xp: profile.xp,
      diamonds: profile.diamonds,
      coins: profile.coins,
      xpForNextLevel: xpForNextLevel - profile.xp,
      xpProgressPercent: Math.round(xpProgress),
      isMaxLevel: currentLevel >= 50
    };
  }
  
  /**
   * Obtiene el historial reciente de actividades del jugador
   */
  public getRecentActivityHistory(limit: number = 10) {
    const history = progressionService.getActivityHistory();
    return history.slice(-limit).reverse(); // Últimas actividades primero
  }
}

// Exportar una instancia única del integrador
export const gameIntegrator = new GameIntegrator();

// También exportamos la clase para casos donde se necesite una instancia personalizada
export default GameIntegrator; 