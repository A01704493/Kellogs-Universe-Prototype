import { useEffect, useRef, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';

const GameCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const [gameType, setGameType] = useState<string>('');
  const [score, setScore] = useState<number>(0);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [debugMsg, setDebugMsg] = useState<string>('');
  
  // Referencias para los event listeners
  const keyDownHandlerRef = useRef<(e: KeyboardEvent) => void>(() => {});
  const keyUpHandlerRef = useRef<(e: KeyboardEvent) => void>(() => {});
  const touchStartHandlerRef = useRef<(e: TouchEvent) => void>(() => {});
  const touchMoveHandlerRef = useRef<(e: TouchEvent) => void>(() => {});
  const touchEndHandlerRef = useRef<(e: TouchEvent) => void>(() => {});
  const clickHandlerRef = useRef<(e: MouseEvent) => void>(() => {});
  
  // Efecto para configurar el canvas al cargar
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Hacer que el canvas ocupe más espacio
    const updateCanvasSize = () => {
      const container = canvas.parentElement;
      if (container) {
        // Ajustar a un tamaño más grande pero manteniendo la proporción 4:3
        const containerWidth = Math.min(window.innerWidth * 0.9, 1200);
        canvas.width = containerWidth;
        canvas.height = containerWidth * 0.75; // Proporción 4:3
        
        // Dibujar mensaje en el canvas para verificar que funciona
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          
          // Fondo
          ctx.fillStyle = '#f8f8f8';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          // Texto
          ctx.fillStyle = '#333333';
          ctx.font = '24px Arial';
          ctx.textAlign = 'center';
          ctx.fillText('Canvas inicializado correctamente', canvas.width/2, canvas.height/2);
          ctx.fillText('Presiona "Comenzar" para jugar', canvas.width/2, canvas.height/2 + 40);
        }
      }
    };
    
    // Ajustar tamaño inicialmente
    updateCanvasSize();
    
    // Ajustar tamaño al cambiar la ventana
    window.addEventListener('resize', updateCanvasSize);
    
    return () => {
      window.removeEventListener('resize', updateCanvasSize);
    };
  }, []);
  
  useEffect(() => {
    // Determinar el tipo de juego basado en la URL
    let detectedGameType = '';
    
    if (location.pathname.includes('zucaritas')) {
      detectedGameType = 'zucaritas';
    } else if (location.pathname.includes('choco-krispis')) {
      detectedGameType = 'choco-krispis';
    } else if (location.pathname.includes('froot-loops')) {
      detectedGameType = 'froot-loops';
    } else if (id) {
      detectedGameType = id;
    }
    
    console.log('Tipo de juego detectado:', detectedGameType);
    setGameType(detectedGameType);
    setDebugMsg(`Juego: ${detectedGameType}`);
    
    return () => {
      // Limpiar el ciclo de animación cuando se desmonte el componente
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      
      // Limpiar todos los event listeners
      window.removeEventListener('keydown', keyDownHandlerRef.current);
      window.removeEventListener('keyup', keyUpHandlerRef.current);
      
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.removeEventListener('touchstart', touchStartHandlerRef.current);
        canvas.removeEventListener('touchmove', touchMoveHandlerRef.current);
        canvas.removeEventListener('touchend', touchEndHandlerRef.current);
        canvas.removeEventListener('click', clickHandlerRef.current);
      }
    };
  }, [id, location]);
  
  useEffect(() => {
    // Función para iniciar juegos después de presionar "comenzar"
    if (gameStarted && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        console.error("No se pudo obtener el contexto 2D");
        setDebugMsg("Error: No se pudo obtener el contexto 2D");
        return;
      }
      
      // Variables del juego
      let boxSize = 50;
      let boxX = canvas.width / 2 - boxSize / 2;
      const boxY = canvas.height - boxSize - 20;
      let boxColor = '#FF0000'; // Color por defecto
      
      // Basado en el tipo de juego
      if (gameType === 'zucaritas') {
        boxColor = '#FF6600'; // Color naranja para Tony
      } else if (gameType === 'choco-krispis') {
        boxColor = '#663300'; // Color marrón para Melvin
      } else if (gameType === 'froot-loops') {
        boxColor = '#9900FF'; // Color morado para Sam
      }
      
      // Control de movimiento
      let leftPressed = false;
      let rightPressed = false;
      
      const handleKeyDown = (e) => {
        if (e.key === 'ArrowLeft') leftPressed = true;
        if (e.key === 'ArrowRight') rightPressed = true;
      };
      
      const handleKeyUp = (e) => {
        if (e.key === 'ArrowLeft') leftPressed = false;
        if (e.key === 'ArrowRight') rightPressed = false;
      };
      
      // Asignar handlers
      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);
      
      // Dots para recolectar
      const dots = [];
      for (let i = 0; i < 5; i++) {
        dots.push({
          x: Math.random() * (canvas.width - 20),
          y: Math.random() * canvas.height / 2,
          speed: 2 + Math.random() * 2
        });
      }
      
      // Loop del juego
      function gameLoop() {
        if (!gameStarted || gameOver) return;
        
        // Limpiar canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Fondo
        if (gameType === 'zucaritas') {
          ctx.fillStyle = '#FF9900';
        } else if (gameType === 'choco-krispis') {
          ctx.fillStyle = '#663300';
        } else if (gameType === 'froot-loops') {
          ctx.fillStyle = '#9900FF';
        } else {
          ctx.fillStyle = '#CCCCCC';
        }
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Mover caja
        if (leftPressed && boxX > 0) boxX -= 5;
        if (rightPressed && boxX < canvas.width - boxSize) boxX += 5;
        
        // Dibujar caja
        ctx.fillStyle = boxColor;
        ctx.fillRect(boxX, boxY, boxSize, boxSize);
        
        // Mover y dibujar dots
        for (let i = 0; i < dots.length; i++) {
          const dot = dots[i];
          dot.y += dot.speed;
          
          // Dibujar dot
          ctx.fillStyle = '#FFCC00';
          ctx.beginPath();
          ctx.arc(dot.x + 10, dot.y + 10, 10, 0, Math.PI * 2);
          ctx.fill();
          
          // Colisión con caja
          if (
            dot.x < boxX + boxSize &&
            dot.x + 20 > boxX &&
            dot.y < boxY + boxSize &&
            dot.y + 20 > boxY
          ) {
            // Colisión!
            dots.splice(i, 1);
            i--;
            setScore(score + 10);
            
            // Generar nuevo dot
            dots.push({
              x: Math.random() * (canvas.width - 20),
              y: 0,
              speed: 2 + Math.random() * 2
            });
          }
          
          // Dot sale de pantalla
          if (dot.y > canvas.height) {
            dots.splice(i, 1);
            i--;
            
            // Generar nuevo dot
            dots.push({
              x: Math.random() * (canvas.width - 20),
              y: 0,
              speed: 2 + Math.random() * 2
            });
          }
        }
        
        // Mostrar puntuación
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(`Puntos: ${score}`, 20, 40);
        
        // Actualizar mensaje de debug
        setDebugMsg(`${gameType}: Jugando - Puntos: ${score}`);
        
        // Continuar el loop
        animationRef.current = requestAnimationFrame(gameLoop);
      }
      
      // Iniciar el juego
      setDebugMsg(`${gameType}: Juego iniciado!`);
      animationRef.current = requestAnimationFrame(gameLoop);
      
      // Cleanup
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }
  }, [gameStarted, gameType, gameOver, score]);
  
  const startGame = () => {
    console.log("Iniciando juego:", gameType);
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setDebugMsg(`Iniciando ${gameType}...`);
  };
  
  const handleGoBack = () => {
    // Limpiar el ciclo de animación antes de navegar
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    // Limpiar listeners
    window.removeEventListener('keydown', keyDownHandlerRef.current);
    window.removeEventListener('keyup', keyUpHandlerRef.current);
    
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.removeEventListener('touchstart', touchStartHandlerRef.current);
      canvas.removeEventListener('touchmove', touchMoveHandlerRef.current);
      canvas.removeEventListener('touchend', touchEndHandlerRef.current);
      canvas.removeEventListener('click', clickHandlerRef.current);
    }
    
    navigate('/menu');
  };
  
  const handleTryAgain = () => {
    setGameOver(false);
    setGameStarted(false);
    setScore(0);
    
    // Reiniciar el canvas
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Fondo
        ctx.fillStyle = '#f8f8f8';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Texto
        ctx.fillStyle = '#333333';
        ctx.font = '24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('¡Intentémoslo de nuevo!', canvas.width/2, canvas.height/2);
        ctx.fillText('Presiona "Comenzar" para jugar', canvas.width/2, canvas.height/2 + 40);
      }
    }
  };
  
  // Este efecto renderiza el canvas basado en el estado del juego
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Solo dibujar la pantalla inicial si el juego no ha comenzado o ha terminado
    if (!gameStarted && !gameOver) {
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
          ctx.fillText('¡Ayuda a Tony el Tigre a recoger cereal!', canvas.width / 2, 90);
          break;
          
        case 'choco-krispis':
          // Fondo marrón para Choco Krispis
          ctx.fillStyle = '#663300';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.fillStyle = '#FFFFFF';
          ctx.font = 'bold 24px Arial';
          ctx.textAlign = 'center';
          ctx.fillText('Minijuego de Choco Krispis', canvas.width / 2, 50);
          ctx.fillText('¡Ayuda a Melvin a recolectar chocolates!', canvas.width / 2, 90);
          break;
          
        case 'froot-loops':
          // Fondo violeta para Froot Loops
          ctx.fillStyle = '#9900FF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.fillStyle = '#FFFFFF';
          ctx.font = 'bold 24px Arial';
          ctx.textAlign = 'center';
          ctx.fillText('Minijuego de Froot Loops', canvas.width / 2, 50);
          ctx.fillText('¡Vuela con Sam a través de los aros!', canvas.width / 2, 90);
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
      
      // Dibujar instrucciones
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 32px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('¡Presiona Comenzar para jugar!', canvas.width / 2, canvas.height / 2);
      
      // Mostrar mensaje de debug si existe
      if (debugMsg) {
        ctx.font = '16px Arial';
        ctx.fillText(debugMsg, canvas.width / 2, canvas.height - 20);
      }
    }
    
    if (gameOver) {
      // Mostrar pantalla de Game Over
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 40px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('¡Juego Terminado!', canvas.width / 2, canvas.height / 2 - 40);
      
      ctx.font = 'bold 32px Arial';
      ctx.fillText(`Puntuación: ${score}`, canvas.width / 2, canvas.height / 2 + 20);
      
      // Mostrar mensaje de debug si existe
      if (debugMsg) {
        ctx.font = '16px Arial';
        ctx.fillText(debugMsg, canvas.width / 2, canvas.height - 20);
      }
    }
  }, [gameType, gameStarted, gameOver, score, debugMsg]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <h1 className="text-3xl font-display text-primary mb-6">
        {gameType === 'zucaritas' && 'Zucaritas: Aventura con Tony'}
        {gameType === 'choco-krispis' && 'Choco Krispis: Aventura con Melvin'}
        {gameType === 'froot-loops' && 'Froot Loops: Aventura con Sam'}
        {!gameType && 'Kellogs Universe: Minijuegos'}
      </h1>
      
      <div className="w-full max-w-[1200px] bg-white rounded-xl shadow-lg overflow-hidden relative">
        <canvas 
          ref={canvasRef} 
          width={1200} 
          height={900}
          className="w-full h-auto"
        ></canvas>
        
        {/* Capa de debug */}
        {debugMsg && (
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 text-sm">
            Debug: {debugMsg}
          </div>
        )}
      </div>
      
      <div className="mt-6 flex gap-4">
        {!gameStarted && !gameOver && (
          <button 
            className="btn btn-primary px-6 py-3 text-lg"
            onClick={startGame}
          >
            Comenzar
          </button>
        )}
        
        {gameOver && (
          <button 
            className="btn btn-primary px-6 py-3 text-lg"
            onClick={handleTryAgain}
          >
            Intentar de nuevo
          </button>
        )}
        
        <button 
          className="btn btn-secondary px-6 py-3 text-lg"
          onClick={handleGoBack}
        >
          Volver al Menú
        </button>
      </div>
    </div>
  );
};

export default GameCanvas; 