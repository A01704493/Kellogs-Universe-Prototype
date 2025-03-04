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
  // Referencias para los event listeners
  const keyDownHandlerRef = useRef<(e: KeyboardEvent) => void>();
  const keyUpHandlerRef = useRef<(e: KeyboardEvent) => void>();
  const touchStartHandlerRef = useRef<(e: TouchEvent) => void>();
  const touchMoveHandlerRef = useRef<(e: TouchEvent) => void>();
  const touchEndHandlerRef = useRef<(e: TouchEvent) => void>();
  const clickHandlerRef = useRef<(e: MouseEvent) => void>();
  
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
    
    return () => {
      // Limpiar el ciclo de animación cuando se desmonte el componente
      cancelAnimationFrame(animationRef.current);
      
      // Limpiar todos los event listeners
      if (keyDownHandlerRef.current) {
        window.removeEventListener('keydown', keyDownHandlerRef.current);
      }
      if (keyUpHandlerRef.current) {
        window.removeEventListener('keyup', keyUpHandlerRef.current);
      }
      
      const canvas = canvasRef.current;
      if (canvas) {
        if (touchStartHandlerRef.current) {
          canvas.removeEventListener('touchstart', touchStartHandlerRef.current);
        }
        if (touchMoveHandlerRef.current) {
          canvas.removeEventListener('touchmove', touchMoveHandlerRef.current);
        }
        if (touchEndHandlerRef.current) {
          canvas.removeEventListener('touchend', touchEndHandlerRef.current);
        }
        if (clickHandlerRef.current) {
          canvas.removeEventListener('click', clickHandlerRef.current);
        }
      }
    };
  }, [id, location]);
  
  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Inicialización específica según el tipo de juego
    switch (gameType) {
      case 'zucaritas':
        startZucaritasGame(canvas, ctx);
        break;
      case 'choco-krispis':
        startChocoKrispisGame(canvas, ctx);
        break;
      case 'froot-loops':
        startFrootLoopsGame(canvas, ctx);
        break;
      default:
        setGameStarted(false);
    }
  };
  
  const startZucaritasGame = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
    // Variables del juego de Zucaritas: Tony el Tigre recogiendo cereales con un bowl
    const tigerWidth = 80;
    const tigerHeight = 100;
    let tigerX = canvas.width / 2 - tigerWidth / 2;
    const tigerY = canvas.height - tigerHeight - 20;
    const bowlWidth = 100;
    const bowlHeight = 30;
    
    // Cereales cayendo
    const cerealSize = 30;
    let cereals: {x: number, y: number, speed: number}[] = [];
    
    // Generar cereales iniciales
    for (let i = 0; i < 5; i++) {
      cereals.push({
        x: Math.random() * (canvas.width - cerealSize),
        y: -cerealSize - Math.random() * canvas.height,
        speed: 2 + Math.random() * 3
      });
    }
    
    // Control de movimiento del tigre
    const keys: {[key: string]: boolean} = {};
    
    keyDownHandlerRef.current = (e: KeyboardEvent) => {
      keys[e.key] = true;
    };
    
    keyUpHandlerRef.current = (e: KeyboardEvent) => {
      keys[e.key] = false;
    };
    
    // Agregar event listeners
    window.addEventListener('keydown', keyDownHandlerRef.current);
    window.addEventListener('keyup', keyUpHandlerRef.current);
    
    // Para control táctil/móvil
    touchMoveHandlerRef.current = (e: TouchEvent) => {
      e.preventDefault();
      const touch = e.touches[0];
      const rect = canvas.getBoundingClientRect();
      tigerX = touch.clientX - rect.left - tigerWidth / 2;
      
      // Mantener dentro de los límites
      if (tigerX < 0) tigerX = 0;
      if (tigerX > canvas.width - tigerWidth) tigerX = canvas.width - tigerWidth;
    };
    
    canvas.addEventListener('touchmove', touchMoveHandlerRef.current);
    
    // Bucle principal del juego
    let lastTime = 0;
    let cerealTimer = 0;
    
    const gameLoop = (timestamp: number) => {
      if (!gameStarted || gameOver) return;
      
      const deltaTime = timestamp - lastTime;
      lastTime = timestamp;
      
      // Limpiar canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Dibujar fondo
      ctx.fillStyle = '#FF9900';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Mover tigre
      if (keys['ArrowLeft'] && tigerX > 0) {
        tigerX -= 7;
      }
      if (keys['ArrowRight'] && tigerX < canvas.width - tigerWidth) {
        tigerX += 7;
      }
      
      // Dibujar tigre (placeholder)
      ctx.fillStyle = '#FF6600';
      ctx.fillRect(tigerX, tigerY, tigerWidth, tigerHeight);
      
      // Dibujar bowl
      ctx.fillStyle = '#8B4513';
      ctx.fillRect(tigerX + (tigerWidth - bowlWidth) / 2, tigerY - bowlHeight / 2, bowlWidth, bowlHeight);
      
      // Generar nuevos cereales
      cerealTimer += deltaTime;
      if (cerealTimer > 1000) { // cada segundo
        cereals.push({
          x: Math.random() * (canvas.width - cerealSize),
          y: -cerealSize,
          speed: 2 + Math.random() * 3
        });
        cerealTimer = 0;
      }
      
      // Actualizar y dibujar cereales
      for (let i = 0; i < cereals.length; i++) {
        const cereal = cereals[i];
        cereal.y += cereal.speed;
        
        // Dibujar cereal
        ctx.fillStyle = '#FFCC00';
        ctx.beginPath();
        ctx.arc(cereal.x + cerealSize/2, cereal.y + cerealSize/2, cerealSize/2, 0, Math.PI * 2);
        ctx.fill();
        
        // Verificar colisión con bowl
        if (
          cereal.y + cerealSize > tigerY - bowlHeight/2 &&
          cereal.y < tigerY + bowlHeight/2 &&
          cereal.x + cerealSize > tigerX + (tigerWidth - bowlWidth) / 2 &&
          cereal.x < tigerX + (tigerWidth - bowlWidth) / 2 + bowlWidth
        ) {
          // Colisión detectada
          setScore(prevScore => prevScore + 10);
          cereals.splice(i, 1);
          i--;
        } 
        // Si el cereal sale de la pantalla
        else if (cereal.y > canvas.height) {
          cereals.splice(i, 1);
          i--;
          
          // Reducir vidas o terminar juego si es necesario
          if (cereals.length === 0 && !gameOver) {
            setGameOver(true);
          }
        }
      }
      
      // Mostrar puntuación
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 24px Arial';
      ctx.textAlign = 'left';
      ctx.fillText(`Puntos: ${score}`, 20, 40);
      
      // Continuar el ciclo de animación
      animationRef.current = requestAnimationFrame(gameLoop);
    };
    
    // Iniciar el ciclo del juego
    animationRef.current = requestAnimationFrame(gameLoop);
  };
  
  const startChocoKrispisGame = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
    // Variables del juego de Choco Krispis: Melvin recolectando chocolates
    const elephantWidth = 80;
    const elephantHeight = 80;
    let elephantX = canvas.width / 2 - elephantWidth / 2;
    let elephantY = canvas.height / 2 - elephantHeight / 2;
    
    // Chocolates para recolectar
    const chocolateSize = 20;
    let chocolates: {x: number, y: number}[] = [];
    
    // Generar chocolates iniciales
    for (let i = 0; i < 10; i++) {
      chocolates.push({
        x: Math.random() * (canvas.width - chocolateSize),
        y: Math.random() * (canvas.height - chocolateSize)
      });
    }
    
    // Control de movimiento del elefante
    const keys: {[key: string]: boolean} = {};
    
    keyDownHandlerRef.current = (e: KeyboardEvent) => {
      keys[e.key] = true;
    };
    
    keyUpHandlerRef.current = (e: KeyboardEvent) => {
      keys[e.key] = false;
    };
    
    // Agregar event listeners
    window.addEventListener('keydown', keyDownHandlerRef.current);
    window.addEventListener('keyup', keyUpHandlerRef.current);
    
    // Para control táctil/móvil
    let touchX: number | null = null;
    let touchY: number | null = null;
    
    touchStartHandlerRef.current = (e: TouchEvent) => {
      e.preventDefault();
      const touch = e.touches[0];
      const rect = canvas.getBoundingClientRect();
      touchX = touch.clientX - rect.left;
      touchY = touch.clientY - rect.top;
    };
    
    touchMoveHandlerRef.current = (e: TouchEvent) => {
      e.preventDefault();
      const touch = e.touches[0];
      const rect = canvas.getBoundingClientRect();
      touchX = touch.clientX - rect.left;
      touchY = touch.clientY - rect.top;
    };
    
    touchEndHandlerRef.current = () => {
      touchX = null;
      touchY = null;
    };
    
    canvas.addEventListener('touchstart', touchStartHandlerRef.current);
    canvas.addEventListener('touchmove', touchMoveHandlerRef.current);
    canvas.addEventListener('touchend', touchEndHandlerRef.current);
    
    // Tiempo límite (30 segundos)
    let timeRemaining = 30;
    let lastSecondTime = 0;
    
    // Bucle principal del juego
    let lastTime = 0;
    
    const gameLoop = (timestamp: number) => {
      if (!gameStarted || gameOver) return;
      
      const deltaTime = timestamp - lastTime;
      lastTime = timestamp;
      
      // Actualizar el tiempo
      if (timestamp - lastSecondTime > 1000) {
        timeRemaining--;
        lastSecondTime = timestamp;
        
        // Verificar si se acabó el tiempo
        if (timeRemaining <= 0) {
          setGameOver(true);
          return;
        }
      }
      
      // Limpiar canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Dibujar fondo
      ctx.fillStyle = '#663300';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Mover elefante con teclado
      const speed = 5;
      if (keys['ArrowUp'] && elephantY > 0) {
        elephantY -= speed;
      }
      if (keys['ArrowDown'] && elephantY < canvas.height - elephantHeight) {
        elephantY += speed;
      }
      if (keys['ArrowLeft'] && elephantX > 0) {
        elephantX -= speed;
      }
      if (keys['ArrowRight'] && elephantX < canvas.width - elephantWidth) {
        elephantX += speed;
      }
      
      // Mover elefante con touch
      if (touchX !== null && touchY !== null) {
        const targetX = touchX - elephantWidth / 2;
        const targetY = touchY - elephantHeight / 2;
        
        // Mover hacia el punto tocado
        const dx = targetX - elephantX;
        const dy = targetY - elephantY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > speed) {
          elephantX += (dx / distance) * speed;
          elephantY += (dy / distance) * speed;
        } else {
          elephantX = targetX;
          elephantY = targetY;
        }
        
        // Mantener dentro de los límites
        if (elephantX < 0) elephantX = 0;
        if (elephantX > canvas.width - elephantWidth) elephantX = canvas.width - elephantWidth;
        if (elephantY < 0) elephantY = 0;
        if (elephantY > canvas.height - elephantHeight) elephantY = canvas.height - elephantHeight;
      }
      
      // Dibujar elefante (placeholder)
      ctx.fillStyle = '#995500';
      ctx.beginPath();
      ctx.arc(elephantX + elephantWidth/2, elephantY + elephantHeight/2, elephantWidth/2, 0, Math.PI * 2);
      ctx.fill();
      
      // Actualizar y dibujar chocolates
      for (let i = 0; i < chocolates.length; i++) {
        const chocolate = chocolates[i];
        
        // Dibujar chocolate
        ctx.fillStyle = '#4B2D0F';
        ctx.fillRect(chocolate.x, chocolate.y, chocolateSize, chocolateSize);
        
        // Verificar colisión con elefante
        if (
          chocolate.x + chocolateSize > elephantX &&
          chocolate.x < elephantX + elephantWidth &&
          chocolate.y + chocolateSize > elephantY &&
          chocolate.y < elephantY + elephantHeight
        ) {
          // Colisión detectada
          setScore(prevScore => prevScore + 10);
          chocolates.splice(i, 1);
          i--;
          
          // Añadir un nuevo chocolate
          chocolates.push({
            x: Math.random() * (canvas.width - chocolateSize),
            y: Math.random() * (canvas.height - chocolateSize)
          });
        }
      }
      
      // Mostrar puntuación y tiempo
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 24px Arial';
      ctx.textAlign = 'left';
      ctx.fillText(`Puntos: ${score}`, 20, 40);
      ctx.textAlign = 'right';
      ctx.fillText(`Tiempo: ${timeRemaining}s`, canvas.width - 20, 40);
      
      // Continuar el ciclo de animación
      animationRef.current = requestAnimationFrame(gameLoop);
    };
    
    // Iniciar el ciclo del juego
    lastSecondTime = performance.now();
    animationRef.current = requestAnimationFrame(gameLoop);
  };
  
  const startFrootLoopsGame = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
    // Variables del juego de Froot Loops: estilo Flappy Bird con Sam el tucán
    const birdWidth = 50;
    const birdHeight = 40;
    let birdY = canvas.height / 2 - birdHeight / 2;
    const birdX = canvas.width / 4;
    let birdVelocity = 0;
    const gravity = 0.5;
    const jumpStrength = -8;
    
    // Obstáculos (aros de colores)
    const pipeWidth = 80;
    const pipeGap = 150;
    const colors = ['#FF0000', '#FF9900', '#FFFF00', '#33CC33', '#3366FF', '#9900FF'];
    let pipes: {x: number, topHeight: number, color: string, passed?: boolean}[] = [];
    
    // Generar primer par de obstáculos
    pipes.push({
      x: canvas.width,
      topHeight: Math.random() * (canvas.height - pipeGap - 100) + 50,
      color: colors[Math.floor(Math.random() * colors.length)]
    });
    
    // Control de salto
    const handleJump = () => {
      if (gameStarted && !gameOver) {
        birdVelocity = jumpStrength;
      }
    };
    
    // Eventos para PC y móviles
    keyDownHandlerRef.current = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        handleJump();
      }
    };
    
    window.addEventListener('keydown', keyDownHandlerRef.current);
    
    touchStartHandlerRef.current = (e: TouchEvent) => {
      e.preventDefault();
      handleJump();
    };
    
    clickHandlerRef.current = () => {
      handleJump();
    };
    
    canvas.addEventListener('touchstart', touchStartHandlerRef.current);
    canvas.addEventListener('click', clickHandlerRef.current);
    
    // Bucle principal del juego
    let lastTime = 0;
    let pipeTimer = 0;
    
    const gameLoop = (timestamp: number) => {
      if (!gameStarted || gameOver) return;
      
      const deltaTime = timestamp - lastTime;
      lastTime = timestamp;
      
      // Limpiar canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Dibujar fondo
      ctx.fillStyle = '#9900FF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Física del tucán
      birdVelocity += gravity;
      birdY += birdVelocity;
      
      // Dibujar tucán (placeholder)
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.ellipse(birdX + birdWidth/2, birdY + birdHeight/2, birdWidth/2, birdHeight/2, 0, 0, Math.PI * 2);
      ctx.fill();
      
      // Pico del tucán
      ctx.fillStyle = '#FF9900';
      ctx.beginPath();
      ctx.moveTo(birdX + birdWidth, birdY + birdHeight/2);
      ctx.lineTo(birdX + birdWidth + 20, birdY + birdHeight/2 - 5);
      ctx.lineTo(birdX + birdWidth + 20, birdY + birdHeight/2 + 5);
      ctx.fill();
      
      // Generar nuevos obstáculos
      pipeTimer += deltaTime;
      if (pipeTimer > 1500) { // cada 1.5 segundos
        pipes.push({
          x: canvas.width,
          topHeight: Math.random() * (canvas.height - pipeGap - 100) + 50,
          color: colors[Math.floor(Math.random() * colors.length)]
        });
        pipeTimer = 0;
      }
      
      // Actualizar y dibujar obstáculos
      for (let i = 0; i < pipes.length; i++) {
        const pipe = pipes[i];
        pipe.x -= 3; // velocidad de desplazamiento
        
        // Dibujar los aros de colores
        ctx.strokeStyle = pipe.color;
        ctx.lineWidth = 10;
        ctx.beginPath();
        ctx.ellipse(pipe.x + pipeWidth/2, pipe.topHeight + pipeGap/2, pipeWidth/2, pipeGap/2, 0, 0, Math.PI * 2);
        ctx.stroke();
        
        // Verificar colisión (si el tucán no está pasando por el aro)
        const centerX = pipe.x + pipeWidth/2;
        const centerY = pipe.topHeight + pipeGap/2;
        const ellipseA = pipeWidth/2;
        const ellipseB = pipeGap/2;
        
        // Calcular si el tucán está dentro del aro (simplificado)
        const dx = birdX + birdWidth/2 - centerX;
        const dy = birdY + birdHeight/2 - centerY;
        const distance = Math.sqrt(dx*dx + dy*dy);
        
        // Si está muy lejos del centro o muy cerca del borde
        if (
          (distance > Math.min(ellipseA, ellipseB) - 20 && 
           distance < Math.max(ellipseA, ellipseB) + 5 &&
           birdX + birdWidth > pipe.x && 
           birdX < pipe.x + pipeWidth)
        ) {
          setGameOver(true);
          return;
        }
        
        // Aumentar puntaje al pasar un aro
        if (pipe.x + pipeWidth < birdX && !pipe.passed) {
          pipe.passed = true;
          setScore(prevScore => prevScore + 10);
        }
        
        // Eliminar obstáculos fuera de pantalla
        if (pipe.x + pipeWidth < 0) {
          pipes.splice(i, 1);
          i--;
        }
      }
      
      // Verificar si el tucán toca el suelo o el techo
      if (birdY < 0 || birdY + birdHeight > canvas.height) {
        setGameOver(true);
        return;
      }
      
      // Mostrar puntuación
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 24px Arial';
      ctx.textAlign = 'left';
      ctx.fillText(`Puntos: ${score}`, 20, 40);
      
      // Continuar el ciclo de animación
      animationRef.current = requestAnimationFrame(gameLoop);
    };
    
    // Iniciar el ciclo del juego
    animationRef.current = requestAnimationFrame(gameLoop);
  };
  
  const handleGoBack = () => {
    // Limpiar el ciclo de animación antes de navegar
    cancelAnimationFrame(animationRef.current);
    
    // Limpiar listeners
    if (keyDownHandlerRef.current) {
      window.removeEventListener('keydown', keyDownHandlerRef.current);
    }
    if (keyUpHandlerRef.current) {
      window.removeEventListener('keyup', keyUpHandlerRef.current);
    }
    
    const canvas = canvasRef.current;
    if (canvas) {
      if (touchStartHandlerRef.current) {
        canvas.removeEventListener('touchstart', touchStartHandlerRef.current);
      }
      if (touchMoveHandlerRef.current) {
        canvas.removeEventListener('touchmove', touchMoveHandlerRef.current);
      }
      if (touchEndHandlerRef.current) {
        canvas.removeEventListener('touchend', touchEndHandlerRef.current);
      }
      if (clickHandlerRef.current) {
        canvas.removeEventListener('click', clickHandlerRef.current);
      }
    }
    
    navigate('/menu');
  };
  
  const handleTryAgain = () => {
    setGameOver(false);
    setGameStarted(false);
    setScore(0);
  };
  
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
        // Fondo naranja para Zucaritas
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
    
    if (!gameStarted && !gameOver) {
      // Dibujar instrucciones
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 32px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('¡Presiona Comenzar para jugar!', canvas.width / 2, canvas.height / 2);
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
    }
  }, [gameType, gameStarted, gameOver, score]);
  
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
        {!gameStarted && !gameOver && (
          <button 
            className="btn btn-primary"
            onClick={startGame}
          >
            Comenzar
          </button>
        )}
        
        {gameOver && (
          <button 
            className="btn btn-primary"
            onClick={handleTryAgain}
          >
            Intentar de nuevo
          </button>
        )}
        
        <button 
          className="btn btn-secondary"
          onClick={handleGoBack}
        >
          Volver al Menú
        </button>
      </div>
    </div>
  );
};

export default GameCanvas; 