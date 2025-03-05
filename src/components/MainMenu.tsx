import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
// Importar las imágenes de los juegos
import chocoKrispiesIcon from '../assets/images/ChocoKrispies_Island.png';
import frootLoopsIcon from '../assets/images/FrootLoops_Island.png';
import frostedFlakesIcon from '../assets/images/FrostedFlakes_Island.png';
// Importar el fondo del menú y el logo
import menuBackground from '../assets/images/Menu_Background.png';
import kellogsLogo from '../assets/images/KellogsUniverse_Logo.png';
import FloatingAvatar from './FloatingAvatar';

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
      // Convertir la posición del mouse a valores entre -1 y 1
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMousePosition({ x, y });
    };

    // Función para manejar eventos touch en móviles
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        // Convertir la posición del toque a valores entre -1 y 1
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

  // Función para manejar hover de las islas
  const handleIslandHover = (buildingId: string | null) => {
    setHoveredIsland(buildingId);
  };

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Fondo con parallax */}
      <img
        src="/background.jpg"
        alt="Background"
        className="absolute w-[180%] h-[180%] object-cover -left-[40%] -top-[40%] transition-transform duration-300"
        style={{
          backgroundRepeat: 'no-repeat',
          transform: `scale(1.3)`,
        }}
      />

      {/* Overlay oscuro */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Avatar flotante */}
      <FloatingAvatar />

      {/* Contenido */}
      <div className="relative z-10 h-full flex flex-col items-center justify-between p-8">
        {/* Logo */}
        <img src="/KellogsUniverse_Logo.png" alt="Kellogs Universe" className="w-96 max-w-full" />

        {/* Islas flotantes */}
        <div className="flex-1 flex items-center justify-center w-full max-w-4xl mx-auto">
          <div className="grid grid-cols-2 gap-8 w-full">
            {/* Isla Avatar */}
            <div 
              className="animate-float cursor-pointer"
              onClick={() => navigate('/avatar')}
            >
              <div className="bg-blue-600/90 backdrop-blur-sm p-6 rounded-xl shadow-lg hover:scale-105 transition-transform">
                <h2 className="text-2xl font-bold text-white mb-2">Avatar</h2>
                <p className="text-blue-100">Personaliza tu personaje</p>
              </div>
            </div>

            {/* Isla Canjear Código */}
            <div 
              className="animate-float-delayed cursor-pointer"
              onClick={() => navigate('/redeem')}
            >
              <div className="bg-blue-600/90 backdrop-blur-sm p-6 rounded-xl shadow-lg hover:scale-105 transition-transform">
                <h2 className="text-2xl font-bold text-white mb-2">Canjear Código</h2>
                <p className="text-blue-100">Ingresa tu código promocional</p>
              </div>
            </div>
          </div>
        </div>

        {/* Botón Comenzar */}
        <button
          onClick={() => navigate('/game')}
          className="mt-8 px-8 py-4 bg-gradient-to-r from-red-500 to-red-700 text-white text-xl font-bold rounded-full shadow-lg hover:scale-105 transition-transform animate-glow-red"
        >
          Comenzar Aventura
        </button>
      </div>
    </div>
  );
};

export default MainMenu; 