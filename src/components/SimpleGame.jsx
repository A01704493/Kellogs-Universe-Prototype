import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Importar las imágenes de fondos
import chocoKrispiesBackground from '../assets/images/ChocoKrispies_Island.png';
import frootLoopsBackground from '../assets/images/FrootLoops_Island.png';
import frostedFlakesBackground from '../assets/images/FrostedFlakes_Island.png';

const SimpleGame = ({ gameType }) => {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const navigate = useNavigate();
  
  // Referencias a las imágenes
  const backgroundImages = {
    'zucaritas': frostedFlakesBackground,
    'choco-krispis': chocoKrispiesBackground,
    'froot-loops': frootLoopsBackground
  };
  
  // Iniciar juego
  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
  };
  
  // Volver al menú
  const goToMenu = () => {
    navigate('/menu');
  };
  
  // Reintentar
  const tryAgain = () => {
    setGameStarted(false);
    setGameOver(false);
    setScore(0);
  };
  
  // Efecto para ajustar el tamaño del canvas al viewport
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        const canvas = canvasRef.current;
        const container = canvas.parentElement;
        if (container) {
          canvas.width = container.clientWidth;
          canvas.height = Math.min(container.clientWidth * 0.75, window.innerHeight * 0.6);
        }
      }
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  // Efecto para el juego
  useEffect(() => {
    if (!gameStarted || gameOver) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Variables del juego
    let playerX = canvas.width / 2;
    let playerY = canvas.height - 50;
    const playerSize = 40;
    
    // Color según el juego
    let playerColor = '#f00';
    
    if (gameType === 'zucaritas') {
      playerColor = '#FF6600';
    } else if (gameType === 'choco-krispis') {
      playerColor = '#8B4513';
    } else if (gameType === 'froot-loops') {
      playerColor = '#6600CC';
    }
    
    // Cargar la imagen de fondo
    const backgroundImage = new Image();
    backgroundImage.src = backgroundImages[gameType] || '';
    
    // Controles
    let rightPressed = false;
    let leftPressed = false;
    
    const keyDownHandler = (e) => {
      if (e.key === 'Right' || e.key === 'ArrowRight') {
        rightPressed = true;
      } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        leftPressed = true;
      }
    };
    
    const keyUpHandler = (e) => {
      if (e.key === 'Right' || e.key === 'ArrowRight') {
        rightPressed = false;
      } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        leftPressed = false;
      }
    };
    
    // Toques para móviles
    const touchHandler = (e) => {
      const touch = e.touches[0];
      const rect = canvas.getBoundingClientRect();
      const touchX = touch.clientX - rect.left;
      
      if (touchX < playerX) {
        leftPressed = true;
        rightPressed = false;
      } else {
        rightPressed = true;
        leftPressed = false;
      }
    };
    
    const touchEndHandler = () => {
      rightPressed = false;
      leftPressed = false;
    };
    
    // Items para recoger
    let items = [];
    for (let i = 0; i < 5; i++) {
      items.push({
        x: Math.random() * (canvas.width - 20),
        y: Math.random() * canvas.height / 2,
        size: 20,
        speed: 2 + Math.random() * 3
      });
    }
    
    // Event listeners
    document.addEventListener('keydown', keyDownHandler);
    document.addEventListener('keyup', keyUpHandler);
    canvas.addEventListener('touchmove', touchHandler);
    canvas.addEventListener('touchend', touchEndHandler);
    
    // Loop principal
    let animationId;
    
    function draw() {
      // Limpiar canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Dibujar fondo con imagen
      if (backgroundImage.complete) {
        // Oscurecer un poco la imagen para que se vea mejor el juego
        ctx.globalAlpha = 0.3;
        ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
        ctx.globalAlpha = 1.0;
      } else {
        // Fondo de respaldo si la imagen no está cargada
        ctx.fillStyle = '#333';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      
      // Mover jugador
      if (rightPressed && playerX < canvas.width - playerSize) {
        playerX += 7;
      } else if (leftPressed && playerX > 0) {
        playerX -= 7;
      }
      
      // Dibujar jugador
      ctx.fillStyle = playerColor;
      ctx.fillRect(playerX, playerY, playerSize, playerSize);
      
      // Mover y dibujar items
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        item.y += item.speed;
        
        // Dibujar item
        ctx.fillStyle = '#FFF';
        ctx.beginPath();
        ctx.arc(item.x + item.size/2, item.y + item.size/2, item.size/2, 0, Math.PI * 2);
        ctx.fill();
        
        // Revisar colisiones
        if (
          playerX < item.x + item.size &&
          playerX + playerSize > item.x &&
          playerY < item.y + item.size &&
          playerY + playerSize > item.y
        ) {
          // Colisión, sumar puntos
          setScore(prevScore => prevScore + 10);
          
          // Reiniciar item
          items[i] = {
            x: Math.random() * (canvas.width - 20),
            y: 0,
            size: 20,
            speed: 2 + Math.random() * 3
          };
        }
        
        // Si el item sale de la pantalla
        if (item.y > canvas.height) {
          // Reiniciar item
          items[i] = {
            x: Math.random() * (canvas.width - 20),
            y: 0,
            size: 20,
            speed: 2 + Math.random() * 3
          };
        }
      }
      
      // Dibujar puntuación
      ctx.fillStyle = '#FFF';
      ctx.font = '24px Arial';
      ctx.textAlign = 'left';
      ctx.fillText(`Puntos: ${score}`, 10, 30);
      
      // Continuar animación
      animationId = requestAnimationFrame(draw);
    }
    
    // Iniciar el loop
    draw();
    
    // Limpiar al desmontar
    return () => {
      document.removeEventListener('keydown', keyDownHandler);
      document.removeEventListener('keyup', keyUpHandler);
      canvas.removeEventListener('touchmove', touchHandler);
      canvas.removeEventListener('touchend', touchEndHandler);
      cancelAnimationFrame(animationId);
    };
  }, [gameStarted, gameOver, gameType, backgroundImages]);
  
  return (
    <div className="h-full w-full flex flex-col bg-gray-100">
      <h1 className="text-3xl font-bold text-center py-4">
        {gameType === 'zucaritas' && 'Zucaritas: Aventura con Tony'}
        {gameType === 'choco-krispis' && 'Choco Krispis: Aventura con Melvin'}
        {gameType === 'froot-loops' && 'Froot Loops: Aventura con Sam'}
        {!gameType && 'Minijuego Kelloggs'}
      </h1>
      
      <div className="flex-grow flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-[800px] bg-white rounded-xl shadow-lg overflow-hidden">
          <canvas 
            ref={canvasRef} 
            className="w-full"
          ></canvas>
        </div>
        
        <div className="mt-6 flex gap-4 justify-center">
          {!gameStarted && !gameOver && (
            <button 
              className="px-6 py-3 bg-blue-500 text-white rounded-lg text-lg hover:bg-blue-600"
              onClick={startGame}
            >
              Comenzar
            </button>
          )}
          
          {gameOver && (
            <button 
              className="px-6 py-3 bg-blue-500 text-white rounded-lg text-lg hover:bg-blue-600"
              onClick={tryAgain}
            >
              Intentar de nuevo
            </button>
          )}
          
          <button 
            className="px-6 py-3 bg-gray-500 text-white rounded-lg text-lg hover:bg-gray-600"
            onClick={goToMenu}
          >
            Volver al Menú
          </button>
        </div>
      </div>
    </div>
  );
};

export default SimpleGame; 