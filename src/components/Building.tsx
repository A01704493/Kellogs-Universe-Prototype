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

      {/* Contenido - Añadir padding-bottom para evitar superposición con la barra */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center p-4 pb-16">
        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-xl max-w-md text-center">
          {buildingInfo && (
            <>
              <h1 className="text-3xl font-bold mb-2" style={{ color: buildingInfo.color }}>
                {buildingInfo.name}
              </h1>
              <p className="text-gray-700 mb-6">{buildingInfo.description}</p>
              
              <div className="flex gap-4 justify-center">
                <button 
                  onClick={handleStartGame}
                  className="px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors"
                >
                  Comenzar juego
                </button>
                <button 
                  onClick={handleGoBack}
                  className="px-6 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-colors"
                >
                  Volver
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      
      {/* Barra de economía */}
      <GameEconomyBar />
    </div>
  );
};

export default Building; 