import { useEffect, useRef, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';

const GameCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const [gameType, setGameType] = useState<string>('');
  
  useEffect(() => {
    // Determinar el tipo de juego basado en la URL
    if (location.pathname.includes('zucaritas')) {
      setGameType('zucaritas');
    } else if (location.pathname.includes('choco-krispis')) {
      setGameType('choco-krispis');
    } else if (location.pathname.includes('froot-loops')) {
      setGameType('froot-loops');
    } else if (id) {
      setGameType(id);
    }
  }, [id, location]);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Limpiar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Dibujar fondo según el tipo de juego
    switch (gameType) {
      case 'zucaritas':
        // Fondo naranjo para Zucaritas
        ctx.fillStyle = '#FF9900';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Minijuego de Zucaritas', canvas.width / 2, 50);
        ctx.fillText('¡Aventuras con Tony el Tigre!', canvas.width / 2, 90);
        break;
        
      case 'choco-krispis':
        // Fondo marrón para Choco Krispis
        ctx.fillStyle = '#663300';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Minijuego de Choco Krispis', canvas.width / 2, 50);
        ctx.fillText('¡Aventuras con Melvin el elefante!', canvas.width / 2, 90);
        break;
        
      case 'froot-loops':
        // Fondo violeta para Froot Loops
        ctx.fillStyle = '#9900FF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Minijuego de Froot Loops', canvas.width / 2, 50);
        ctx.fillText('¡Diversión colorida con Sam el tucán!', canvas.width / 2, 90);
        break;
        
      default:
        // Fondo genérico 
        ctx.fillStyle = '#ef0e44';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Kellogs Universe', canvas.width / 2, 50);
        ctx.fillText('¡Selecciona un minijuego!', canvas.width / 2, 90);
    }
    
    // Dibujar mensaje de próximamente
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 32px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('¡Próximamente!', canvas.width / 2, canvas.height / 2);
    ctx.font = '20px Arial';
    ctx.fillText('Este minijuego está en desarrollo', canvas.width / 2, canvas.height / 2 + 40);
    
  }, [gameType]);
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <h1 className="text-3xl font-display text-primary mb-6">
        {gameType === 'zucaritas' && 'Zucaritas: Aventura con Tony'}
        {gameType === 'choco-krispis' && 'Choco Krispis: Aventura con Melvin'}
        {gameType === 'froot-loops' && 'Froot Loops: Aventura con Sam'}
        {!gameType && 'Kellogs Universe: Minijuegos'}
      </h1>
      
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg overflow-hidden">
        <canvas 
          ref={canvasRef} 
          width={800} 
          height={600}
          className="w-full h-auto"
        ></canvas>
      </div>
      
      <div className="mt-6 flex gap-4">
        <button 
          className="btn btn-primary"
          onClick={() => window.history.back()}
        >
          Volver al Menú
        </button>
      </div>
    </div>
  );
};

export default GameCanvas; 