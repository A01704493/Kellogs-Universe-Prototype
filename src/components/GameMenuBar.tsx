import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { progressionService } from '../services';

interface GameMenuBarProps {
  className?: string;
}

interface PlayerStats {
  level: number;
  xp: number;
  diamonds: number;
  coins: number;
}

const GameMenuBar: React.FC<GameMenuBarProps> = ({ className = '' }) => {
  const navigate = useNavigate();
  const [playerStats, setPlayerStats] = useState<PlayerStats>({
    level: 1,
    xp: 0,
    diamonds: 0,
    coins: 0
  });

  // Cargar datos del jugador
  useEffect(() => {
    const loadPlayerData = () => {
      const profile = progressionService.getPlayerProfile();
      if (profile) {
        setPlayerStats({
          level: profile.level || 1,
          xp: profile.xp || 0,
          diamonds: profile.diamonds || 0,
          coins: profile.coins || 0
        });
      }
    };

    // Cargar datos iniciales
    loadPlayerData();

    // Actualizar cada 3 segundos por si hay cambios en otra parte de la app
    const interval = setInterval(loadPlayerData, 3000);
    return () => clearInterval(interval);
  }, []);

  const menuItems = [
    { name: 'AVATAR', icon: '👤', action: () => navigate('/avatar') },
    { name: 'CANJEAR CÓDIGO', icon: '🎁', action: () => navigate('/redeem') },
    { name: 'TIENDA', icon: '🛒', action: () => alert('Próximamente: Tienda') },
    { name: 'LOGROS', icon: '🏆', action: () => alert('Próximamente: Logros') },
    { name: 'INVENTARIO', icon: '🎒', action: () => alert('Próximamente: Inventario') },
  ];

  return (
    <div className={`fixed bottom-0 left-0 right-0 z-50 mb-safe game-menu-bar ${className}`}>
      <div className="flex flex-col items-center max-w-screen-lg mx-auto">
        {/* Contadores */}
        <div className="bg-black/80 backdrop-blur-sm rounded-t-lg px-3 py-2 flex items-center gap-3 md:gap-6 shadow-lg w-full justify-center flex-wrap stats-counter">
          <div className="flex items-center gap-1 text-yellow-400 counter-badge">
            <span className="text-xs md:text-sm font-bold">Nivel:</span>
            <span className="px-2 py-1 rounded-md text-xs md:text-sm font-bold level-badge">
              {playerStats.level}
            </span>
          </div>
          
          <div className="flex items-center gap-1 text-blue-400 counter-badge">
            <span className="text-xs md:text-sm font-bold">XP:</span>
            <span className="px-2 py-1 rounded-md text-xs md:text-sm font-bold xp-badge">
              {playerStats.xp}
            </span>
          </div>
          
          <div className="flex items-center gap-1 text-purple-400 counter-badge">
            <span className="text-xs md:text-sm font-bold">💎</span>
            <span className="px-2 py-1 rounded-md text-xs md:text-sm font-bold diamond-badge">
              {playerStats.diamonds}
            </span>
          </div>
          
          <div className="flex items-center gap-1 text-amber-400 counter-badge">
            <span className="text-xs md:text-sm font-bold">🪙</span>
            <span className="px-2 py-1 rounded-md text-xs md:text-sm font-bold coin-badge">
              {playerStats.coins}
            </span>
          </div>
        </div>
        
        {/* Botones */}
        <div className="w-full backdrop-blur-md p-2 md:p-3 flex justify-center gap-2 md:gap-4 shadow-lg overflow-x-auto">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={item.action}
              className="px-2 md:px-4 py-2 rounded-md transition-all flex flex-col items-center text-white min-w-[65px] md:min-w-[85px] menu-button"
            >
              <span className="text-xl md:text-2xl mb-1">{item.icon}</span>
              <span className="text-[10px] md:text-xs whitespace-nowrap font-bold">{item.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GameMenuBar; 