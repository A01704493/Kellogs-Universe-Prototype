import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import universalBackground from '../assets/images/UniversalBackground.png';
import GameEconomyBar from './GameEconomyBar';

interface BuildingInfo {
  id: string;
  name: string;
  description: string;
  gameType: string;
  color: string;
  route: string;
}

const buildingData: Record<string, BuildingInfo> = {
  'choco-krispis': {
    id: 'choco-krispis',
    name: 'Choco Krispis',
    description: 'Ayuda a Melvin el elefante a recolectar chocolates en este desafío cronometrado',
    gameType: 'choco-krispis',
    color: '#663300',
    route: '/minigames/choco-krispis'
  },
  'zucaritas': {
    id: 'zucaritas',
    name: 'Zucaritas',
    description: 'Únete a Tony el Tigre y recoge los cereales en este desafío de habilidad',
    gameType: 'zucaritas',
    color: '#FF9900',
    route: '/minigames/zucaritas'
  },
  'froot-loops': {
    id: 'froot-loops',
    name: 'Froot Loops',
    description: 'Vuela con Sam el tucán a través de los aros de colores',
    gameType: 'froot-loops',
    color: '#9900FF',
    route: '/minigames/froot-loops'
  }
};

const Building = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [buildingInfo, setBuildingInfo] = useState<BuildingInfo | null>(null);

  useEffect(() => {
    if (id && buildingData[id]) {
      setBuildingInfo(buildingData[id]);
    } else {
      // Si no se encuentra, regresar al menú
      navigate('/menu');
    }
  }, [id, navigate]);

  const handleStartGame = () => {
    if (buildingInfo) {
      navigate(buildingInfo.route);
    }
  };

  const handleGoBack = () => {
    navigate('/menu');
  };

  if (!buildingInfo) {
    return <div className="h-full w-full flex items-center justify-center bg-gray-100">Cargando...</div>;
  }

  return (
    <div className="h-full w-full relative overflow-hidden">
      {/* Fondo universal con opacidad */}
      <div 
        className="absolute inset-0 z-0" 
        style={{ 
          backgroundImage: `url(${universalBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.6 
        }}
      />
      
      {/* Barra de economía */}
      <GameEconomyBar />

      {/* Contenido */}
      <div className="relative z-10 h-full w-full flex flex-col items-center justify-center p-6">
        <div 
          className="w-full max-w-2xl bg-white/80 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden" 
          style={{ borderTop: `8px solid ${buildingInfo.color}` }}
        >
          <div className="p-6">
            <h2 className="text-3xl font-display text-gray-800 mb-4">{buildingInfo.name}</h2>
            <p className="text-gray-700 mb-6">{buildingInfo.description}</p>
            
            <div className="flex justify-between items-center">
              <button
                className="btn bg-gray-500 hover:bg-gray-600 text-white"
                onClick={handleGoBack}
              >
                Volver al Menú
              </button>
              <button
                className="btn bg-blue-500 hover:bg-blue-600 text-white"
                onClick={handleStartGame}
              >
                Comenzar Juego
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Building; 