import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
// Importar las imágenes de los juegos
import chocoKrispiesIcon from '../assets/images/ChocoKrispies_Island.png';
import frootLoopsIcon from '../assets/images/FrootLoops_Island.png';
import frostedFlakesIcon from '../assets/images/FrostedFlakes_Island.png';
// Importar el fondo del menú y el logo
import menuBackground from '../assets/images/Menu_Background.png';
import kellogsLogo from '../assets/images/KellogsUniverse_Logo.png';

interface Building {
  id: string;
  name: string;
  description: string;
  position: { x: number; y: number };
  image: string;
  scale: number;
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
  const [deviceOrientation, setDeviceOrientation] = useState({ beta: 0, gamma: 0 });
  const [isMobile, setIsMobile] = useState(false);
  
  // Lista de edificios/islas en la plaza
  const buildings: Building[] = [
    {
      id: 'choco-krispis',
      name: 'Choco Krispis',
      description: 'Aventuras con Melvin el elefante',
      position: { x: 25, y: 40 },
      image: chocoKrispiesIcon,
      scale: 1.2
    },
    {
      id: 'zucaritas',
      name: 'Zucaritas',
      description: 'Desafíos con Tony el Tigre',
      position: { x: 70, y: 35 },
      image: frostedFlakesIcon,
      scale: 1.3
    },
    {
      id: 'froot-loops',
      name: 'Froot Loops',
      description: 'Diversión colorida con Sam el tucán',
      position: { x: 45, y: 55 },
      image: frootLoopsIcon,
      scale: 1.1
    }
  ];

  // Detectar si es dispositivo móvil
  useEffect(() => {
    const checkMobile = () => {
      const userAgent = typeof window.navigator === 'undefined' ? '' : navigator.userAgent;
      const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Windows Phone/i;
      setIsMobile(mobileRegex.test(userAgent));
    };
    
    checkMobile();
  }, []);

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

  // Efecto para el parallax con mouse
  useEffect(() => {
    if (isMobile) return; // No aplicar en móviles

    const handleMouseMove = (e: MouseEvent) => {
      // Convertir la posición del mouse a valores entre -1 y 1
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isMobile]);

  // Efecto para el parallax con giroscopio en móviles
  useEffect(() => {
    if (!isMobile) return; // Solo aplicar en móviles

    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.beta !== null && e.gamma !== null) {
        // Limitar los valores para un movimiento sutil
        const beta = Math.max(-10, Math.min(10, e.beta)) / 10; // -1 a 1
        const gamma = Math.max(-10, Math.min(10, e.gamma)) / 10; // -1 a 1
        setDeviceOrientation({ beta, gamma });
      }
    };

    window.addEventListener('deviceorientation', handleOrientation as EventListener);
    return () => {
      window.removeEventListener('deviceorientation', handleOrientation as EventListener);
    };
  }, [isMobile]);

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

  // Función para manejar hover de las islas
  const handleIslandHover = (buildingId: string | null) => {
    setHoveredIsland(buildingId);
  };

  // Calcular la transformación para el efecto parallax
  const getParallaxStyle = () => {
    // Usar los valores del giroscopio si es móvil, de lo contrario usar posición del mouse
    const x = isMobile ? deviceOrientation.gamma * 15 : mousePosition.x * 15; // 15px de movimiento máximo
    const y = isMobile ? deviceOrientation.beta * 15 : mousePosition.y * 15;
    
    return {
      transform: `translate(${x}px, ${y}px)`,
      transition: 'transform 0.2s ease-out'
    };
  };

  return (
    <div className="h-full w-full relative overflow-hidden">
      {/* Fondo del menú con efecto parallax */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ 
          backgroundImage: `url(${menuBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          ...getParallaxStyle()
        }}
      ></div>
      
      {/* Capa de oscurecimiento para mejorar contraste */}
      <div className="absolute inset-0 z-0 bg-black opacity-30"></div>
      
      {/* Encabezado */}
      <header className="relative z-20 p-4 flex justify-between items-center">
        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-2 shadow-md flex flex-col items-start">
          <img src={kellogsLogo} alt="Kellogs Universe" className="h-12 object-contain" />
          <p className="text-sm text-gray-600 mt-1">Hola, {username}!</p>
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={handleAvatarClick}
            className="btn btn-secondary text-sm"
          >
            Avatar
          </button>
          <button 
            onClick={handleRedeemClick}
            className="btn btn-accent text-sm"
          >
            Canjear Código
          </button>
        </div>
      </header>
      
      {/* Contenedor de islas */}
      <div ref={islandContainerRef} className="relative z-10 h-full w-full">
        {buildings.map((building) => {
          const isHovered = hoveredIsland === building.id;
          
          // Calcular el tamaño basado en el viewport y la escala de la isla
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
                transform: isHovered ? 'translate(-50%, -50%) scale(1.15)' : 'translate(-50%, -50%)'
              }}
              onClick={() => handleBuildingClick(building.id)}
              onMouseEnter={() => handleIslandHover(building.id)}
              onMouseLeave={() => handleIslandHover(null)}
            >
              {/* Efecto de brillo - ahora detrás de la imagen */}
              <div className="island-glow absolute inset-0 z-0"></div>
              
              {/* Imagen de la isla */}
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
              
              {/* Nombre de la isla */}
              <div 
                className={`absolute left-1/2 -bottom-6 transform -translate-x-1/2 transition-all duration-300 z-20 ${
                  isHovered ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <div className="text-white text-lg font-bold drop-shadow-lg bg-primary/80 px-4 py-1.5 rounded-lg backdrop-blur-sm">
                  {building.name}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MainMenu; 