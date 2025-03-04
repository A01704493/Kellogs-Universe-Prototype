import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import GameCanvas from './GameCanvas';

interface BuildingInfo {
  id: string;
  name: string;
  description: string;
  gameType: string;
  color: string;
}

const buildingData: Record<string, BuildingInfo> = {
  'chococrisps': {
    id: 'chococrisps',
    name: 'ChocoCrisps',
    description: 'Recolecta piezas de chocolate para obtener puntaje.',
    gameType: 'collect',
    color: 'bg-amber-800'
  },
  'suscaritas': {
    id: 'suscaritas',
    name: 'Sus Caritas',
    description: 'Ayuda al gato a atrapar los ratones.',
    gameType: 'catch',
    color: 'bg-orange-500'
  },
  'arcade': {
    id: 'arcade',
    name: 'Arcade',
    description: 'Juegos clásicos para todos.',
    gameType: 'arcade',
    color: 'bg-purple-700'
  }
};

const Building = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [buildingInfo, setBuildingInfo] = useState<BuildingInfo | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    // Obtener información del edificio basado en el ID
    if (id && buildingData[id]) {
      setBuildingInfo(buildingData[id]);
    } else {
      // Si no se encuentra el edificio, redirigir al menú principal
      navigate('/menu');
    }
  }, [id, navigate]);

  const handleStartGame = () => {
    setIsPlaying(true);
    setScore(0);
  };

  const handleEndGame = (finalScore: number) => {
    setIsPlaying(false);
    setScore(finalScore);
  };

  const handleGoBack = () => {
    navigate('/menu');
  };

  if (!buildingInfo) {
    return (
      <div className="min-h-screen bg-background flex justify-center items-center">
        <p>Cargando...</p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${buildingInfo.color} text-white`}>
      {/* Encabezado */}
      <header className="p-4 flex justify-between items-center bg-black/30">
        <div>
          <h1 className="text-2xl font-display">{buildingInfo.name}</h1>
          <p className="text-sm opacity-80">{buildingInfo.description}</p>
        </div>
        <button 
          onClick={handleGoBack}
          className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg"
        >
          Salir
        </button>
      </header>

      {/* Contenido principal */}
      <div className="p-4 flex flex-col items-center justify-center">
        {isPlaying ? (
          <div className="w-full max-w-lg aspect-square bg-black/40 rounded-xl overflow-hidden shadow-lg">
            <GameCanvas 
              gameType={buildingInfo.gameType} 
              onGameEnd={handleEndGame} 
            />
          </div>
        ) : (
          <div className="card max-w-md w-full text-black">
            <div className="text-center mb-6">
              <h2 className="text-xl font-display text-primary mb-2">
                Bienvenido a {buildingInfo.name}
              </h2>
              <p className="text-gray-600">
                {buildingInfo.description}
              </p>
            </div>

            {score > 0 && (
              <div className="mb-6 bg-primary/10 p-4 rounded-lg text-center">
                <p className="text-sm text-gray-700">Tu último puntaje</p>
                <p className="text-2xl font-display text-primary">{score} pts</p>
              </div>
            )}

            <button 
              onClick={handleStartGame}
              className="btn btn-primary w-full"
            >
              {score > 0 ? 'Jugar de nuevo' : 'Comenzar juego'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Building; 