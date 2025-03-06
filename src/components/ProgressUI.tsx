import React, { useEffect, useState } from 'react';
import { progressionService, gameIntegrator, minigameService } from '../services';
import { PlayerProfile } from '../types/progression';

/**
 * Componente para mostrar la progresión del jugador
 */
const ProgressUI: React.FC = () => {
  const [profile, setProfile] = useState<PlayerProfile | null>(null);
  const [progressPercent, setProgressPercent] = useState(0);
  const [xpToNextLevel, setXpToNextLevel] = useState(0);
  const [activityHistory, setActivityHistory] = useState<any[]>([]);
  const [highScores, setHighScores] = useState<Record<string, number>>({});

  // Cargar datos del perfil
  useEffect(() => {
    // Asegurarse de que existe un perfil
    const currentProfile = progressionService.getPlayerProfile();
    if (!currentProfile) {
      // Si no hay perfil, crear uno nuevo
      const newProfile = progressionService.resetPlayerProfile();
      setProfile(newProfile);
      
      // Registrar inicio de sesión
      progressionService.recordLogin();
    } else {
      setProfile(currentProfile);
    }
    
    // Cargar datos adicionales
    updateProfileData();
    
    // Recargar datos cada 5 segundos (opcional)
    const interval = setInterval(updateProfileData, 5000);
    return () => clearInterval(interval);
  }, []);
  
  // Actualizar todos los datos del perfil
  const updateProfileData = () => {
    const currentProfile = progressionService.getPlayerProfile();
    if (currentProfile) {
      setProfile(currentProfile);
      
      // Calcular progreso hacia el siguiente nivel
      if (currentProfile.xp > 0) {
        setProgressPercent(progressionService.getLevelProgress(currentProfile.xp));
        
        const nextLevelXp = progressionService.getXpForNextLevel(currentProfile.level);
        if (nextLevelXp !== -1) {
          setXpToNextLevel(nextLevelXp - currentProfile.xp);
        }
      }
      
      // Obtener historial de actividades (últimas 5)
      if (currentProfile.activityHistory) {
        const recentActivities = [...currentProfile.activityHistory]
          .sort((a, b) => b.timestamp - a.timestamp)
          .slice(0, 5);
        setActivityHistory(recentActivities);
      }
      
      // Obtener puntuaciones máximas
      if (currentProfile.gameStats?.highScores) {
        setHighScores(currentProfile.gameStats.highScores);
      }
    }
  };
  
  // Simular completar un minijuego para pruebas
  const simulateGameCompletion = (gameId: string) => {
    // Generar una puntuación aleatoria
    const randomScore = Math.floor(Math.random() * 800) + 200; // Entre 200 y 1000
    
    // Obtener config del juego
    const gameConfig = minigameService.getMinigameConfig(gameId);
    if (!gameConfig) return;
    
    // Llamar al servicio de minijuegos
    minigameService.submitScore(gameId, randomScore);
    
    // Actualizar datos
    updateProfileData();
    
    alert(`¡Has completado ${gameConfig.name} con una puntuación de ${randomScore}!`);
  };
  
  if (!profile) {
    return <div className="loading">Cargando perfil...</div>;
  }
  
  return (
    <div className="progress-ui">
      <div className="player-info">
        <h2>Perfil de Jugador</h2>
        <div className="avatar">
          {/* Placeholder para avatar */}
          <div className="avatar-image">👤</div>
        </div>
        
        <div className="player-details">
          <h3>{profile.username}</h3>
          <div className="level-badge">Nivel {profile.level}</div>
          
          <div className="progress-bar-container">
            <div 
              className="progress-bar" 
              style={{ width: `${progressPercent}%` }}
            />
            <span className="progress-text">
              {progressPercent}% - {xpToNextLevel} XP para nivel {profile.level + 1}
            </span>
          </div>
          
          <div className="stats">
            <div className="stat">
              <span className="stat-icon">⭐</span>
              <span className="stat-value">{profile.xp} XP</span>
            </div>
            <div className="stat">
              <span className="stat-icon">💎</span>
              <span className="stat-value">{profile.diamonds} Diamantes</span>
            </div>
            <div className="stat">
              <span className="stat-icon">🪙</span>
              <span className="stat-value">{profile.coins} Monedas</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="game-buttons">
        <h3>Probar Minijuegos</h3>
        <div className="buttons-container">
          <button 
            className="game-button zucaritas"
            onClick={() => simulateGameCompletion('zucaritas')}
          >
            Jugar Zucaritas
          </button>
          <button 
            className="game-button choco-krispis"
            onClick={() => simulateGameCompletion('choco-krispis')}
          >
            Jugar Choco Krispis
          </button>
          <button 
            className="game-button froot-loops"
            onClick={() => simulateGameCompletion('froot-loops')}
          >
            Jugar Froot Loops
          </button>
        </div>
      </div>
      
      <div className="activity-section">
        <h3>Actividades Recientes</h3>
        <ul className="activity-list">
          {activityHistory.length > 0 ? (
            activityHistory.map((activity, index) => (
              <li key={index} className="activity-item">
                <div className="activity-type">
                  {activity.type === 'game_played' && '🎮 Juego'}
                  {activity.type === 'code_redeemed' && '🎁 Código'}
                  {activity.type === 'level_up' && '⬆️ Subida de nivel'}
                  {activity.type === 'login' && '🔑 Inicio de sesión'}
                  {activity.type === 'avatar_customized' && '👤 Avatar personalizado'}
                  {activity.type === 'daily_bonus' && '📅 Bono diario'}
                </div>
                <div className="activity-info">
                  {activity.xpEarned > 0 && <span>+{activity.xpEarned} XP</span>}
                  <span className="activity-time">
                    {new Date(activity.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </li>
            ))
          ) : (
            <li className="no-activity">No hay actividades recientes</li>
          )}
        </ul>
      </div>
      
      <div className="high-scores">
        <h3>Mejores Puntuaciones</h3>
        <div className="scores-container">
          {Object.keys(highScores).length > 0 ? (
            Object.entries(highScores).map(([gameId, score]) => {
              const game = minigameService.getMinigameConfig(gameId);
              return (
                <div key={gameId} className="score-item">
                  <div className="game-name">{game?.name || gameId}</div>
                  <div className="score-value">{score} pts</div>
                </div>
              );
            })
          ) : (
            <div className="no-scores">No hay puntuaciones registradas</div>
          )}
        </div>
      </div>
      
      <style jsx>{`
        .progress-ui {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          font-family: Arial, sans-serif;
        }
        
        .player-info {
          display: flex;
          align-items: center;
          margin-bottom: 30px;
          background: #f5f5f5;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        
        .avatar {
          width: 80px;
          height: 80px;
          background: #e0e0e0;
          border-radius: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 20px;
          font-size: 40px;
        }
        
        .player-details {
          flex: 1;
        }
        
        .level-badge {
          display: inline-block;
          background: #4a90e2;
          color: white;
          padding: 5px 10px;
          border-radius: 15px;
          font-size: 14px;
          margin-bottom: 10px;
        }
        
        .progress-bar-container {
          height: 20px;
          background: #e0e0e0;
          border-radius: 10px;
          overflow: hidden;
          margin-bottom: 15px;
          position: relative;
        }
        
        .progress-bar {
          height: 100%;
          background: linear-gradient(90deg, #4a90e2, #8e44ad);
          border-radius: 10px;
          transition: width 0.3s ease;
        }
        
        .progress-text {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #333;
          font-size: 12px;
          font-weight: bold;
        }
        
        .stats {
          display: flex;
          gap: 20px;
        }
        
        .stat {
          display: flex;
          align-items: center;
          gap: 5px;
        }
        
        .stat-icon {
          font-size: 20px;
        }
        
        .game-buttons, .activity-section, .high-scores {
          background: #f5f5f5;
          padding: 20px;
          border-radius: 10px;
          margin-bottom: 20px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        
        .buttons-container {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }
        
        .game-button {
          padding: 10px 20px;
          border: none;
          border-radius: 5px;
          color: white;
          font-weight: bold;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        
        .game-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        }
        
        .zucaritas {
          background: #f39c12;
        }
        
        .choco-krispis {
          background: #8e44ad;
        }
        
        .froot-loops {
          background: #2ecc71;
        }
        
        .activity-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        
        .activity-item {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
          border-bottom: 1px solid #e0e0e0;
        }
        
        .activity-time {
          font-size: 12px;
          color: #777;
          margin-left: 10px;
        }
        
        .scores-container {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 10px;
        }
        
        .score-item {
          background: white;
          padding: 10px;
          border-radius: 5px;
          box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        
        .game-name {
          font-weight: bold;
          margin-bottom: 5px;
        }
        
        .score-value {
          font-size: 18px;
          color: #4a90e2;
        }
        
        .no-activity, .no-scores {
          color: #777;
          font-style: italic;
        }
      `}</style>
    </div>
  );
};

export default ProgressUI; 