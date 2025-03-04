import { useEffect, useRef, useState } from 'react';

interface GameCanvasProps {
  gameType: string;
  onGameEnd: (score: number) => void;
}

// Juego simplificado para fines de demostración
const GameCanvas = ({ gameType, onGameEnd }: GameCanvasProps) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30); // 30 segundos de juego
  const [gameStarted, setGameStarted] = useState(false);
  
  // Estado para elementos del juego
  const [playerPosition, setPlayerPosition] = useState({ x: 50, y: 50 });
  const [items, setItems] = useState<Array<{ x: number; y: number; type: string; }>>([]);
  
  // Configuración basada en el tipo de juego
  const gameConfig = {
    collect: {
      itemName: 'chocolate',
      itemColor: 'bg-amber-600',
      playerColor: 'bg-amber-800',
      backgroundColor: 'bg-amber-100'
    },
    catch: {
      itemName: 'ratón',
      itemColor: 'bg-gray-400',
      playerColor: 'bg-orange-500',
      backgroundColor: 'bg-green-100'
    },
    arcade: {
      itemName: 'moneda',
      itemColor: 'bg-yellow-400',
      playerColor: 'bg-purple-600',
      backgroundColor: 'bg-purple-100'
    }
  };
  
  const currentConfig = gameConfig[gameType as keyof typeof gameConfig] || gameConfig.arcade;
  
  // Iniciar el juego
  useEffect(() => {
    setGameStarted(true);
    
    // Generar elementos iniciales
    generateRandomItems();
    
    // Iniciar el temporizador
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setGameStarted(false);
          onGameEnd(score);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Generar elementos aleatorios para recolectar/atrapar
  const generateRandomItems = () => {
    const newItems = [];
    const count = Math.floor(Math.random() * 3) + 3; // 3-5 elementos
    
    for (let i = 0; i < count; i++) {
      newItems.push({
        x: Math.floor(Math.random() * 80) + 10, // 10-90%
        y: Math.floor(Math.random() * 80) + 10, // 10-90%
        type: currentConfig.itemName
      });
    }
    
    setItems(newItems);
  };
  
  // Manejar movimiento del jugador
  const handlePlayerMove = (direction: string) => {
    if (!gameStarted) return;
    
    setPlayerPosition(prev => {
      let newX = prev.x;
      let newY = prev.y;
      const step = 5;
      
      switch (direction) {
        case 'up':
          newY = Math.max(0, prev.y - step);
          break;
        case 'down':
          newY = Math.min(90, prev.y + step);
          break;
        case 'left':
          newX = Math.max(0, prev.x - step);
          break;
        case 'right':
          newX = Math.min(90, prev.x + step);
          break;
      }
      
      // Verificar colisiones con items
      checkCollisions({ x: newX, y: newY });
      
      return { x: newX, y: newY };
    });
  };
  
  // Verificar colisiones entre jugador e items
  const checkCollisions = (playerPos: { x: number; y: number }) => {
    const playerSize = 10;
    const itemSize = 8;
    const collisionDistance = playerSize / 2 + itemSize / 2;
    
    const remainingItems = items.filter(item => {
      // Calcular distancia entre jugador e item
      const dx = playerPos.x - item.x;
      const dy = playerPos.y - item.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // Si hay colisión, aumentar puntaje y eliminar el item
      if (distance < collisionDistance) {
        setScore(prev => prev + 10);
        return false;
      }
      return true;
    });
    
    // Si se recogieron todos los items, generar nuevos
    if (remainingItems.length === 0) {
      generateRandomItems();
    } else {
      setItems(remainingItems);
    }
  };
  
  return (
    <div 
      ref={canvasRef}
      className={`relative w-full h-full ${currentConfig.backgroundColor} touch-none select-none`}
      tabIndex={0}
    >
      {/* Información de juego */}
      <div className="absolute top-2 left-2 right-2 flex justify-between items-center p-2 bg-black/40 text-white rounded-lg z-10">
        <div>Puntos: {score}</div>
        <div>Tiempo: {timeLeft}s</div>
      </div>
      
      {/* Jugador */}
      <div 
        className={`absolute w-10 h-10 rounded-full ${currentConfig.playerColor}`}
        style={{ 
          left: `${playerPosition.x}%`, 
          top: `${playerPosition.y}%`,
          transform: 'translate(-50%, -50%)'
        }}
      ></div>
      
      {/* Items */}
      {items.map((item, index) => (
        <div 
          key={index}
          className={`absolute w-8 h-8 rounded-full ${currentConfig.itemColor}`}
          style={{ 
            left: `${item.x}%`, 
            top: `${item.y}%`,
            transform: 'translate(-50%, -50%)'
          }}
        ></div>
      ))}
      
      {/* Controles de juego */}
      <div className="absolute bottom-4 left-4 right-4 flex justify-center gap-2">
        <button 
          className="btn bg-gray-800/70 text-white p-3 rounded-lg"
          onClick={() => handlePlayerMove('left')}
        >
          ←
        </button>
        <div className="flex flex-col gap-2">
          <button 
            className="btn bg-gray-800/70 text-white p-3 rounded-lg"
            onClick={() => handlePlayerMove('up')}
          >
            ↑
          </button>
          <button 
            className="btn bg-gray-800/70 text-white p-3 rounded-lg"
            onClick={() => handlePlayerMove('down')}
          >
            ↓
          </button>
        </div>
        <button 
          className="btn bg-gray-800/70 text-white p-3 rounded-lg"
          onClick={() => handlePlayerMove('right')}
        >
          →
        </button>
      </div>
      
      {/* Mensaje de fin de juego */}
      {!gameStarted && timeLeft === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70">
          <div className="bg-white p-6 rounded-lg text-center">
            <h2 className="text-xl font-display text-primary mb-2">¡Juego terminado!</h2>
            <p className="text-gray-700 mb-4">Puntaje final: {score}</p>
            <button 
              className="btn btn-primary"
              onClick={() => onGameEnd(score)}
            >
              Continuar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameCanvas; 