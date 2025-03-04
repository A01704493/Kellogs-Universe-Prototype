import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Importar las imágenes de los juegos
import chocoKrispiesIcon from '../assets/images/ChocoKrispies_Island.png';
import frootLoopsIcon from '../assets/images/FrootLoops_Island.png';
import frostedFlakesIcon from '../assets/images/FrostedFlakes_Island.png';

interface Building {
  id: string;
  name: string;
  description: string;
  position: { x: number; y: number };
  image: string;
}

const MainMenu = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('Aventurero');
  
  // Lista de edificios/islas en la plaza
  const buildings: Building[] = [
    {
      id: 'choco-krispis',
      name: 'Choco Krispis',
      description: 'Aventuras con Melvin el elefante',
      position: { x: 20, y: 30 },
      image: chocoKrispiesIcon
    },
    {
      id: 'zucaritas',
      name: 'Zucaritas',
      description: 'Desafíos con Tony el Tigre',
      position: { x: 60, y: 40 },
      image: frostedFlakesIcon
    },
    {
      id: 'froot-loops',
      name: 'Froot Loops',
      description: 'Diversión colorida con Sam el tucán',
      position: { x: 40, y: 70 },
      image: frootLoopsIcon
    }
  ];

  useEffect(() => {
    // Recuperar nombre de usuario del localStorage
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

  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      {/* Cielo y fondo */}
      <div className="absolute inset-0 bg-gradient-to-b from-red-300 to-red-400 z-0"></div>
      
      {/* Tierra/isla */}
      <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-yellow-800 to-yellow-600 rounded-t-full z-10"></div>
      
      {/* Encabezado */}
      <header className="relative z-20 p-4 flex justify-between items-center">
        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-2 shadow-md">
          <h1 className="text-xl font-display text-primary">Kellogs Universe</h1>
          <p className="text-sm text-gray-600">Hola, {username}!</p>
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
      
      {/* Contenedor de edificios */}
      <div className="relative z-20 h-screen w-full">
        {buildings.map((building) => (
          <div
            key={building.id}
            className="absolute cursor-pointer transform hover:scale-110 transition-transform"
            style={{
              left: `${building.position.x}%`,
              top: `${building.position.y}%`,
            }}
            onClick={() => handleBuildingClick(building.id)}
          >
            {/* Imagen del edificio/minijuego */}
            <div className="w-32 h-32 rounded-lg shadow-lg flex items-center justify-center overflow-hidden">
              <img 
                src={building.image} 
                alt={building.name} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-center mt-2 text-white text-sm font-medium drop-shadow-md">
              {building.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MainMenu; 