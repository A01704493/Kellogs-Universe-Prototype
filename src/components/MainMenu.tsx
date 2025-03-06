import { useEffect, useState, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
// Importar las imágenes de los juegos
import chocoKrispiesIcon from '../assets/images/ChocoKrispies_Island.png';
import frootLoopsIcon from '../assets/images/FrootLoops_Island.png';
import frostedFlakesIcon from '../assets/images/FrostedFlakes_Island.png';
// Importar el fondo del menú y el logo
import menuBackground from '../assets/images/Menu_Background.png';
import kellogsLogo from '../assets/images/KellogsUniverse_Logo.png';
// Importar imágenes del avatar
import body1 from '../assets/character/body1.png';
import body2 from '../assets/character/body2.png';
import body3 from '../assets/character/body3.png';
import head1 from '../assets/character/head1.png';
import head2 from '../assets/character/head2.png';
import head3 from '../assets/character/head3.png';
import acc1 from '../assets/character/acc1.png';
import acc2 from '../assets/character/acc2.png';
import acc3 from '../assets/character/acc3.png';
// Importamos el servicio de progresión para obtener los datos del perfil
import { progressionService } from '../services';
import { PlayerProfile } from '../types/progression';

// Definir las opciones disponibles para cada capa
const bodyOptions = [body1, body2, body3];
const headOptions = [head1, head2, head3];
const accOptions = [null, acc1, acc2, acc3];

interface Building {
  id: string;
  name: string;
  description: string;
  position: { x: number; y: number };
  image: string;
  scale: number;
  floatSpeed: number;
}

// Definición de una estrella para la animación de fondo
interface Star {
  id: number;
  size: number;
  left: number;
  duration: number;
  delay: number;
  opacity: number;
}

const MainMenu = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('Aventurero');
  const [hoveredIsland, setHoveredIsland] = useState<string | null>(null);
  const [viewportSize, setViewportSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });
  const islandContainerRef = useRef<HTMLDivElement>(null);
  
  // Estado para el efecto parallax
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // Estado para la posición del avatar flotante
  const [avatarPosition, setAvatarPosition] = useState({ x: 50, y: 30 });
  const [avatarDirection, setAvatarDirection] = useState({ x: 1, y: 1 });
  const [avatarConfig, setAvatarConfig] = useState<any>(null);
  
  // Estado para el perfil del jugador
  const [playerProfile, setPlayerProfile] = useState<PlayerProfile | null>(null);

  // Lista de edificios/islas en la plaza
  const buildings: Building[] = [
    {
      id: 'choco-krispies',
      name: 'Choco Krispis',
      description: 'Juego de Choco Krispis',
      position: { x: 25, y: 40 },
      image: chocoKrispiesIcon,
      scale: 1.2,
      floatSpeed: 5
    },
    {
      id: 'froot-loops',
      name: 'Froot Loops',
      description: 'Juego de Froot Loops',
      position: { x: 50, y: 35 },
      image: frootLoopsIcon,
      scale: 1.3,
      floatSpeed: 6
    },
    {
      id: 'zucaritas',
      name: 'Zucaritas',
      description: 'Juego de Zucaritas',
      position: { x: 75, y: 40 },
      image: frostedFlakesIcon,
      scale: 1.2,
      floatSpeed: 5.5
    }
  ];

  // Generar estrellas para el fondo
  const stars = useMemo(() => {
    const count = 35; // Cantidad de estrellas
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      size: Math.random() * 1.5 + 0.5, // Tamaño entre 0.5px y 2px
      left: Math.random() * 100, // Posición horizontal
      duration: Math.random() * 15 + 15, // Duración entre 15 y 30 segundos
      delay: Math.random() * 10, // Retraso para que no empiecen todas a la vez
      opacity: Math.random() * 0.5 + 0.3 // Opacidad entre 0.3 y 0.8
    }));
  }, []);

  useEffect(() => {
    // Cargar la configuración del avatar al montar el componente
    const avatarConfig = localStorage.getItem('avatarConfig');
    if (avatarConfig) {
      setAvatarConfig(JSON.parse(avatarConfig));
    } else {
      // Configuración por defecto
      setAvatarConfig({
        body: 0,
        head: 0,
        acc: 0
      });
    }
    
    // Cargar el perfil del jugador
    const profile = progressionService.getPlayerProfile();
    if (profile) {
      setPlayerProfile(profile);
      setUsername(profile.username);
    }
    
    // Efecto para animar el avatar flotante
    const moveAvatar = () => {
      setAvatarPosition(prev => {
        const newX = prev.x + avatarDirection.x * 0.1;
        const newY = prev.y + avatarDirection.y * 0.1;

        // Cambiar dirección si llega a los límites
        if (newX > 70 || newX < 30) {
          setAvatarDirection(prev => ({ ...prev, x: -prev.x }));
        }
        if (newY > 40 || newY < 20) {
          setAvatarDirection(prev => ({ ...prev, y: -prev.y }));
        }

        return {
          x: Math.max(30, Math.min(70, newX)),
          y: Math.max(20, Math.min(40, newY))
        };
      });
    };

    const intervalId = setInterval(moveAvatar, 50);
    return () => clearInterval(intervalId);
  }, [avatarDirection]);

  // Efecto para manejar el cambio de tamaño de la ventana
  useEffect(() => {
    const handleResize = () => {
      setViewportSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Efecto para el parallax con mouse y touch
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 0.5,
        y: (e.clientY / window.innerHeight - 0.5) * 0.5
      });
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches && e.touches[0]) {
        setMousePosition({
          x: (e.touches[0].clientX / window.innerWidth - 0.5) * 0.3,
          y: (e.touches[0].clientY / window.innerHeight - 0.5) * 0.3
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  const handleBuildingClick = (buildingId: string) => {
    navigate(`/games/${buildingId}`);
  };

  const handleAvatarClick = () => {
    navigate('/avatar');
  };

  const handleRedeemClick = () => {
    navigate('/redeem');
  };

  const handleStoreClick = () => {
    // Por ahora solo mostramos un mensaje, cuando la tienda esté implementada
    alert('¡Tienda en construcción! Estará disponible pronto.');
  };

  const handleAchievementsClick = () => {
    // Por ahora solo mostramos un mensaje, cuando los logros estén implementados
    alert('¡Logros en construcción! Estarán disponibles pronto.');
  };

  const handleInventoryClick = () => {
    // Por ahora solo mostramos un mensaje, cuando el inventario esté implementado
    alert('¡Inventario en construcción! Estará disponible pronto.');
  };

  const handleIslandHover = (buildingId: string | null) => {
    setHoveredIsland(buildingId);
  };

  return (
    <div className="h-full w-full relative overflow-hidden">
      {/* Implementación del fondo con parallax usando una imagen con posicionamiento absoluto */}
      <div 
        className="absolute inset-0 z-0 overflow-hidden"
        style={{ backgroundColor: '#1a1a1a' }}
      >
        <img 
          src={menuBackground} 
          alt="Background" 
          className="absolute object-cover"
          style={{
            width: '140%',
            height: '140%',
            left: '-20%',
            top: '-20%',
            maxWidth: 'none',
            transform: `translate(${mousePosition.x * 8}px, ${mousePosition.y * 8}px)`,
            transition: 'transform 0.3s ease-out'
          }}
        />
      </div>
      
      {/* Capa de oscurecimiento para mejorar contraste */}
      <div className="absolute inset-0 z-0 bg-black opacity-30"></div>
      
      {/* Capa de estrellas flotantes */}
      <div className="stars absolute inset-0 overflow-hidden z-5">
        {stars.map((star) => (
          <div
            key={star.id}
            className="star"
            style={{
              width: `${star.size}px`,
              height: `${star.size}px`,
              left: `${star.left}%`,
              opacity: star.opacity,
              animationDuration: `${star.duration}s`,
              animationDelay: `${star.delay}s`
            }}
          />
        ))}
      </div>
      
      {/* Avatar flotante */}
      {avatarConfig && (
        <div 
          className="absolute z-20 w-24 h-24 md:w-32 md:h-32 cursor-pointer transition-transform hover:scale-110"
          style={{
            left: `${avatarPosition.x}%`,
            top: `${avatarPosition.y}%`,
            transform: 'translate(-50%, -50%)',
            animation: 'float 6s ease-in-out infinite'
          }}
          onClick={handleAvatarClick}
        >
          <div className="relative w-full h-full">
            <img
              src={bodyOptions[avatarConfig.body]}
              alt="Cuerpo"
              className="absolute inset-0 w-full h-full object-contain"
            />
            <img
              src={headOptions[avatarConfig.head]}
              alt="Cabeza"
              className="absolute inset-0 w-full h-full object-contain"
            />
            {avatarConfig.acc !== 0 && (
              <img
                src={accOptions[avatarConfig.acc]}
                alt="Accesorio"
                className="absolute inset-0 w-full h-full object-contain"
              />
            )}
          </div>
        </div>
      )}
      
      {/* Encabezado */}
      <header className="relative z-20 p-4 flex justify-between items-center">
        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-2 shadow-md flex flex-col items-start">
          <img 
            src={kellogsLogo} 
            alt="Kellogs Universe" 
            className="h-12 md:h-16 lg:h-20 object-contain" 
          />
          <p className="text-sm md:text-base text-gray-600 mt-1">Hola, {username}!</p>
        </div>
      </header>
      
      {/* Contenedor de islas */}
      <div ref={islandContainerRef} className="relative z-10 h-3/4 w-full pt-8">
        {buildings.map((building) => {
          const isHovered = hoveredIsland === building.id;
          const baseSize = Math.min(viewportSize.width, viewportSize.height) * 0.28;
          const size = building.scale * baseSize;
          
          return (
            <div
              key={building.id}
              className={`absolute cursor-pointer island-hover ${isHovered ? 'z-20' : 'z-10'}`}
              style={{
                left: `${building.position.x}%`,
                top: `${building.position.y}%`,
                width: size,
                height: size,
                transform: `translate(-50%, -50%) ${isHovered ? 'scale(1.1)' : 'scale(1)'}`,
                animation: `float ${building.floatSpeed}s ease-in-out infinite`
              }}
              onClick={() => handleBuildingClick(building.id)}
              onMouseEnter={() => handleIslandHover(building.id)}
              onMouseLeave={() => handleIslandHover(null)}
            >
              <div className="island-glow absolute inset-0 z-0"></div>
              <div className="relative h-full w-full z-10">
                <img 
                  src={building.image} 
                  alt={building.name} 
                  className="w-full h-full object-contain relative z-10"
                  style={{ 
                    filter: `drop-shadow(0 8px 12px rgba(0, 0, 0, 0.4))`,
                  }}
                />
              </div>
              
              <div 
                className={`absolute left-1/2 -bottom-6 transform -translate-x-1/2 transition-all duration-300 z-20 w-max ${
                  isHovered ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <div className="text-white text-lg font-bold drop-shadow-lg bg-primary/80 px-4 py-1.5 rounded-lg backdrop-blur-sm whitespace-nowrap text-center">
                  {building.name}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Barra de Menú en la parte inferior con nueva estructura */}
      <div className="fixed bottom-0 left-0 right-0 z-50 flex flex-col items-center mb-2">
        {/* Stats Bar - Now positioned above the menu buttons */}
        <div className="bg-black/60 backdrop-blur-md px-3 py-2 rounded-xl mb-2 border border-white/20 flex justify-center flex-wrap gap-3 max-w-md">
          <div className="flex items-center text-white">
            <div className="menu-icon-container bg-gradient-to-br from-yellow-300 to-yellow-600 flex items-center justify-center rounded-full w-7 h-7 mr-1 shadow-glow-yellow">
              <span className="text-xs font-bold">{playerProfile?.level || 1}</span>
            </div>
            <span className="text-xs font-bold ml-1">NIVEL</span>
          </div>
          
          <div className="flex items-center text-white">
            <div className="menu-icon-container bg-gradient-to-br from-blue-300 to-blue-600 flex items-center justify-center rounded-full w-7 h-7 mr-1 shadow-glow-blue">
              <span className="text-xs">⭐</span>
            </div>
            <span className="text-xs font-bold">{playerProfile?.xp || 0}</span>
          </div>
          
          <div className="flex items-center text-white">
            <div className="menu-icon-container bg-gradient-to-br from-purple-300 to-purple-600 flex items-center justify-center rounded-full w-7 h-7 mr-1 shadow-glow-purple">
              <span className="text-xs">💎</span>
            </div>
            <span className="text-xs font-bold">{playerProfile?.diamonds || 0}</span>
          </div>
          
          <div className="flex items-center text-white">
            <div className="menu-icon-container bg-gradient-to-br from-yellow-400 to-yellow-700 flex items-center justify-center rounded-full w-7 h-7 mr-1 shadow-glow-gold">
              <span className="text-xs">🪙</span>
            </div>
            <span className="text-xs font-bold">{playerProfile?.coins || 0}</span>
          </div>
        </div>
        
        {/* Main Menu Buttons - Now square with emoji on top, text below */}
        <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-2 rounded-2xl shadow-xl mx-auto flex justify-center flex-wrap gap-2 max-w-md border-2 border-white/30">
          <button 
            onClick={handleAvatarClick}
            className="menu-button bg-gradient-to-br from-blue-400 to-blue-600"
          >
            <span className="emoji">👤</span>
            <span className="text">AVATAR</span>
          </button>
          
          <button 
            onClick={handleRedeemClick}
            className="menu-button bg-gradient-to-br from-purple-400 to-purple-600"
          >
            <span className="emoji">🎁</span>
            <span className="text">CANJEAR</span>
          </button>
          
          <button 
            onClick={handleStoreClick}
            className="menu-button bg-gradient-to-br from-green-400 to-green-600"
          >
            <span className="emoji">🛒</span>
            <span className="text">TIENDA</span>
          </button>
          
          <button 
            onClick={handleAchievementsClick}
            className="menu-button bg-gradient-to-br from-yellow-400 to-yellow-600"
          >
            <span className="emoji">🏆</span>
            <span className="text">LOGROS</span>
          </button>
          
          <button 
            onClick={handleInventoryClick}
            className="menu-button bg-gradient-to-br from-red-400 to-red-600"
          >
            <span className="emoji">🎒</span>
            <span className="text">INVENTARIO</span>
          </button>
        </div>
      </div>
      
      {/* Estilos específicos para los botones del menú */}
      <style jsx>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
          100% { transform: translateY(0px); }
        }

        .stars {
          position: absolute;
          width: 100%;
          height: 100%;
          z-index: 5;
        }

        .star {
          position: absolute;
          background-color: white;
          border-radius: 50%;
          opacity: 0.7;
          animation: twinkle 5s infinite;
        }

        @keyframes twinkle {
          0% { opacity: 0.2; }
          50% { opacity: 0.7; }
          100% { opacity: 0.2; }
        }
        
        .island-hover {
          transition: transform 0.3s ease-out;
        }
        
        .island-hover:hover {
          transform: translateY(-5px) scale(1.05);
        }
        
        .menu-button {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          padding: 8px;
          width: 70px;
          height: 70px;
          border-radius: 12px;
          font-size: 0.7rem;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
          cursor: pointer;
          border: 2px solid rgba(255, 255, 255, 0.5);
          transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
          position: relative;
          overflow: hidden;
          z-index: 1;
        }
        
        .menu-button .emoji {
          font-size: 1.5rem;
          margin-bottom: 4px;
        }
        
        .menu-button .text {
          font-size: 0.7rem;
          letter-spacing: 0;
        }
        
        .menu-button:hover {
          transform: scale(1.05);
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
        }
        
        .menu-button:active {
          transform: scale(0.95);
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
        }
        
        .menu-icon-container {
          transition: all 0.3s ease;
          animation: pulse 3s infinite;
          box-shadow: 0 0 8px rgba(255, 255, 255, 0.5);
        }
        
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        
        .shadow-glow-yellow {
          box-shadow: 0 0 8px 2px rgba(250, 204, 21, 0.6);
        }
        
        .shadow-glow-blue {
          box-shadow: 0 0 8px 2px rgba(59, 130, 246, 0.6);
        }
        
        .shadow-glow-purple {
          box-shadow: 0 0 8px 2px rgba(168, 85, 247, 0.6);
        }
        
        .shadow-glow-gold {
          box-shadow: 0 0 8px 2px rgba(217, 119, 6, 0.6);
        }
        
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        
        .menu-button:hover {
          animation: bounce 1s ease infinite;
        }
        
        @media (max-width: 640px) {
          .menu-button {
            width: 60px;
            height: 60px;
            font-size: 0.65rem;
            padding: 6px;
          }
          
          .menu-button .emoji {
            font-size: 1.2rem;
          }
          
          .menu-button .text {
            font-size: 0.6rem;
          }
        }
      `}</style>
    </div>
  );
};

export default MainMenu; 