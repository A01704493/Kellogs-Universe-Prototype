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

  // Lista de edificios/islas en la plaza
  const buildings: Building[] = [
    {
      id: 'choco-krispis',
      name: 'Choco Krispis',
      description: 'Aventuras con Melvin el elefante',
      position: { x: 25, y: 25 },
      image: chocoKrispiesIcon,
      scale: 1.2,
      floatSpeed: 3 // Velocidad de flotación personalizada
    },
    {
      id: 'zucaritas',
      name: 'Zucaritas',
      description: 'Desafíos con Tony el Tigre',
      position: { x: 70, y: 25 },
      image: frostedFlakesIcon,
      scale: 1.3,
      floatSpeed: 5 // Velocidad más lenta
    },
    {
      id: 'froot-loops',
      name: 'Froot Loops',
      description: 'Diversión colorida con Sam el tucán',
      position: { x: 45, y: 35 },
      image: frootLoopsIcon,
      scale: 1.1,
      floatSpeed: 4 // Velocidad intermedia
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

  // Efecto para cargar la configuración del avatar
  useEffect(() => {
    const savedAvatar = localStorage.getItem('kellogsAvatar');
    if (savedAvatar) {
      setAvatarConfig(JSON.parse(savedAvatar));
    }
  }, []);

  // Efecto para animar el avatar flotante
  useEffect(() => {
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
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMousePosition({ x, y });
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const x = (touch.clientX / window.innerWidth - 0.5) * 2;
        const y = (touch.clientY / window.innerHeight - 0.5) * 2;
        setMousePosition({ x, y });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  // Efecto para recuperar el nombre de usuario
  useEffect(() => {
    const savedUsername = localStorage.getItem('kellogsUsername');
    if (savedUsername) {
      setUsername(savedUsername);
    }
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
            width: '180%',
            height: '180%',
            left: '-40%',
            top: '-40%',
            maxWidth: 'none',
            transform: `translate(${mousePosition.x * 15}px, ${mousePosition.y * 15}px)`,
            transition: 'transform 0.3s ease-out'
          }}
        />
      </div>
      
      {/* Capa de oscurecimiento para mejorar contraste */}
      <div className="absolute inset-0 z-0 bg-black opacity-30"></div>
      
      {/* Capa de estrellas flotantes */}
      <div className="stars">
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
          className="absolute z-20 w-32 h-32 cursor-pointer transition-transform hover:scale-110"
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
      
      {/* Botones de navegación centrados y abajo */}
      <div className="absolute bottom-8 left-0 right-0 z-30 flex justify-center items-center gap-6">
        <button 
          onClick={handleAvatarClick}
          className="flex flex-col items-center justify-center w-20 h-20 rounded-lg bg-blue-500 hover:bg-blue-600 text-white shadow-lg transform hover:scale-105 transition-all"
        >
          <span className="text-2xl mb-1">👤</span>
          <span className="text-xs">Avatar</span>
        </button>
        <button 
          onClick={handleRedeemClick}
          className="flex flex-col items-center justify-center w-20 h-20 rounded-lg bg-purple-500 hover:bg-purple-600 text-white shadow-lg transform hover:scale-105 transition-all"
        >
          <span className="text-2xl mb-1">🎁</span>
          <span className="text-xs">Canjear</span>
        </button>
        <button 
          onClick={() => {/* Función de tienda pendiente */}}
          className="flex flex-col items-center justify-center w-20 h-20 rounded-lg bg-orange-500 hover:bg-orange-600 text-white shadow-lg transform hover:scale-105 transition-all"
        >
          <span className="text-2xl mb-1">🛍️</span>
          <span className="text-xs">Tienda</span>
        </button>
        <button 
          onClick={() => {/* Función de inventario pendiente */}}
          className="flex flex-col items-center justify-center w-20 h-20 rounded-lg bg-teal-500 hover:bg-teal-600 text-white shadow-lg transform hover:scale-105 transition-all"
        >
          <span className="text-2xl mb-1">🎒</span>
          <span className="text-xs">Inventario</span>
        </button>
      </div>
      
      {/* Contenedor de islas */}
      <div ref={islandContainerRef} className="relative z-10 h-full w-full">
        {buildings.map((building) => {
          const isHovered = hoveredIsland === building.id;
          const baseSize = Math.min(viewportSize.width, viewportSize.height) * 0.32;
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
                transform: `translate(-50%, -50%) ${isHovered ? 'scale(1.15)' : 'scale(1)'}`,
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

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translate(-50%, -50%) translateY(0px);
          }
          50% {
            transform: translate(-50%, -50%) translateY(-10px);
          }
        }
      `}</style>
    </div>
  );
};

export default MainMenu;