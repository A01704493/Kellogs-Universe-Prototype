import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addCoins, addXp } from '../services/ProgressService';
// Importar las imágenes de fondos
import chocoKrispiesBackground from '../assets/images/ChocoKrispies_Island.png';
import frootLoopsBackground from '../assets/images/FrootLoops_Island.png';
import frostedFlakesBackground from '../assets/images/FrostedFlakes_Island.png';

const SimpleGame = ({ gameType }) => {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [coinsCollected, setCoinsCollected] = useState(0);
  const navigate = useNavigate();
  
  // Estados para player, items y monedas
  const [player, setPlayer] = useState({ x: 50, y: 50, width: 20, height: 20 });
  const [items, setItems] = useState([]);
  const [coins, setCoins] = useState([]);
  const [gameTime, setGameTime] = useState(0);
  
  // Referencias a las imágenes
  const backgroundImages = {
    'zucaritas': frostedFlakesBackground,
    'choco-krispis': chocoKrispiesBackground,
    'froot-loops': frootLoopsBackground
  };
  
  // Colores por tipo de juego
  const gameColors = {
    'zucaritas': {
      background: '#FFD700',
      player: '#FF8C00',
      item: '#FFA500'
    },
    'choco-krispis': {
      background: '#8B4513',
      player: '#A0522D',
      item: '#D2691E'
    },
    'froot-loops': {
      background: '#FF69B4',
      player: '#DA70D6',
      item: '#EE82EE'
    }
  };
  
  const currentColors = gameColors[gameType] || gameColors['zucaritas'];
  
  // Lógica de inicio del juego
  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setCoinsCollected(0);
    setGameTime(0);
    
    // Inicializar player
    setPlayer({ x: 50, y: 50, width: 20, height: 20 });
    
    // Inicializar items
    const newItems = [];
    for (let i = 0; i < 5; i++) {
      newItems.push({
        x: Math.random() * (window.innerWidth - 30),
        y: Math.random() * (window.innerHeight - 30),
        width: 15,
        height: 15
      });
    }
    setItems(newItems);
    
    // Inicializar monedas
    const newCoins = [];
    for (let i = 0; i < 3; i++) {
      newCoins.push({
        x: Math.random() * (window.innerWidth - 20),
        y: Math.random() * (window.innerHeight - 20),
        width: 10,
        height: 10,
        value: Math.random() > 0.7 ? 5 : 1 // 30% de probabilidad de que valga 5 monedas
      });
    }
    setCoins(newCoins);
  };
  
  // Finalizar juego y guardar progreso
  const endGame = () => {
    setGameStarted(false);
    setGameOver(true);
    
    // Calcular XP ganada (basada en tiempo jugado y puntuación)
    const xpEarned = Math.floor(score * 5 + gameTime / 2);
    
    // Guardar monedas y XP ganadas
    if (coinsCollected > 0) {
      addCoins(coinsCollected);
    }
    
    if (xpEarned > 0) {
      addXp(xpEarned);
    }
  };
  
  // Control del jugador con teclas
  useEffect(() => {
    if (!gameStarted) return;
    
    const handleKeyDown = (e) => {
      const speed = 15;
      setPlayer(prev => {
        let newX = prev.x;
        let newY = prev.y;
        
        // Movimiento con flechas o WASD
        if (e.key === 'ArrowUp' || e.key === 'w') newY = Math.max(0, prev.y - speed);
        if (e.key === 'ArrowDown' || e.key === 's') newY = Math.min(window.innerHeight - prev.height, prev.y + speed);
        if (e.key === 'ArrowLeft' || e.key === 'a') newX = Math.max(0, prev.x - speed);
        if (e.key === 'ArrowRight' || e.key === 'd') newX = Math.min(window.innerWidth - prev.width, prev.x + speed);
        
        return { ...prev, x: newX, y: newY };
      });
    };
    
    // Control con pantalla táctil
    const handleTouchMove = (e) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        setPlayer(prev => ({
          ...prev,
          x: Math.min(Math.max(0, touch.clientX - prev.width / 2), window.innerWidth - prev.width),
          y: Math.min(Math.max(0, touch.clientY - prev.height / 2), window.innerHeight - prev.height)
        }));
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('touchmove', handleTouchMove);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [gameStarted]);
  
  // Actualización del juego (colisiones, puntuación, etc.)
  useEffect(() => {
    if (!gameStarted) return;
    
    const gameLoop = setInterval(() => {
      // Aumentar el tiempo de juego (en segundos)
      setGameTime(prev => prev + 0.1);
      
      // Comprobar colisiones con items
      setItems(prevItems => {
        const newItems = [...prevItems];
        let updatedScore = score;
        
        for (let i = newItems.length - 1; i >= 0; i--) {
          const item = newItems[i];
          
          // Comprobar colisión con el jugador
          if (
            player.x < item.x + item.width &&
            player.x + player.width > item.x &&
            player.y < item.y + item.height &&
            player.y + player.height > item.y
          ) {
            // Eliminar el item y sumar puntos
            newItems.splice(i, 1);
            updatedScore++;
            
            // Añadir un nuevo item en una posición aleatoria
            newItems.push({
              x: Math.random() * (window.innerWidth - 30),
              y: Math.random() * (window.innerHeight - 30),
              width: 15,
              height: 15
            });
          }
        }
        
        // Actualizar puntuación si ha cambiado
        if (updatedScore !== score) {
          setScore(updatedScore);
        }
        
        return newItems;
      });
      
      // Comprobar colisiones con monedas
      setCoins(prevCoins => {
        const newCoins = [...prevCoins];
        let updatedCoinsCollected = coinsCollected;
        
        for (let i = newCoins.length - 1; i >= 0; i--) {
          const coin = newCoins[i];
          
          // Comprobar colisión con el jugador
          if (
            player.x < coin.x + coin.width &&
            player.x + player.width > coin.x &&
            player.y < coin.y + coin.height &&
            player.y + player.height > coin.y
          ) {
            // Eliminar la moneda y sumar al contador
            updatedCoinsCollected += coin.value;
            newCoins.splice(i, 1);
            
            // Añadir una nueva moneda en una posición aleatoria después de un tiempo
            setTimeout(() => {
              setCoins(current => [
                ...current,
                {
                  x: Math.random() * (window.innerWidth - 20),
                  y: Math.random() * (window.innerHeight - 20),
                  width: 10,
                  height: 10,
                  value: Math.random() > 0.7 ? 5 : 1
                }
              ]);
            }, 3000); // Esperar 3 segundos antes de añadir una nueva moneda
          }
        }
        
        // Actualizar monedas recogidas si ha cambiado
        if (updatedCoinsCollected !== coinsCollected) {
          setCoinsCollected(updatedCoinsCollected);
        }
        
        return newCoins;
      });
      
      // Finalizar el juego después de 60 segundos
      if (gameTime >= 60) {
        endGame();
        clearInterval(gameLoop);
      }
    }, 100);
    
    return () => {
      clearInterval(gameLoop);
    };
  }, [gameStarted, player, score, coinsCollected, gameTime]);
  
  // Renderizado del juego en el canvas
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Ajustar dimensiones del canvas
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Limpiar el canvas
    ctx.fillStyle = currentColors.background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    if (gameStarted) {
      // Dibujar al jugador
      ctx.fillStyle = currentColors.player;
      ctx.fillRect(player.x, player.y, player.width, player.height);
      
      // Dibujar items
      ctx.fillStyle = currentColors.item;
      items.forEach(item => {
        ctx.fillRect(item.x, item.y, item.width, item.height);
      });
      
      // Dibujar monedas
      coins.forEach(coin => {
        // Las monedas especiales (valor 5) son doradas, las normales plateadas
        ctx.fillStyle = coin.value > 1 ? '#FFD700' : '#C0C0C0';
        ctx.beginPath();
        ctx.arc(coin.x + coin.width/2, coin.y + coin.height/2, coin.width/2, 0, Math.PI * 2);
        ctx.fill();
      });
      
      // Mostrar puntuación y tiempo
      ctx.fillStyle = 'white';
      ctx.font = '16px Arial';
      ctx.fillText(`Puntuación: ${score}`, 10, 20);
      ctx.fillText(`Tiempo: ${Math.floor(gameTime)}s`, 10, 40);
      ctx.fillText(`Monedas: ${coinsCollected}`, 10, 60);
    } else {
      // Pantalla de inicio o fin de juego
      ctx.fillStyle = 'white';
      ctx.font = '24px Arial';
      ctx.textAlign = 'center';
      
      if (gameOver) {
        ctx.fillText(`¡Juego terminado!`, canvas.width / 2, canvas.height / 2 - 50);
        ctx.fillText(`Puntuación final: ${score}`, canvas.width / 2, canvas.height / 2);
        ctx.fillText(`Monedas recolectadas: ${coinsCollected}`, canvas.width / 2, canvas.height / 2 + 30);
        ctx.fillText(`Presiona para volver a jugar`, canvas.width / 2, canvas.height / 2 + 80);
      } else {
        ctx.fillText(`¡Toca para empezar!`, canvas.width / 2, canvas.height / 2);
        ctx.font = '18px Arial';
        ctx.fillText(`Muévete con WASD o las flechas (o toca la pantalla)`, canvas.width / 2, canvas.height / 2 + 40);
        ctx.fillText(`Recolecta objetos y monedas`, canvas.width / 2, canvas.height / 2 + 70);
      }
    }
  }, [gameStarted, gameOver, player, items, coins, score, gameTime, coinsCollected, currentColors]);
  
  const handleCanvasClick = () => {
    if (!gameStarted) {
      startGame();
    }
  };
  
  const handleBackClick = () => {
    navigate('/menu');
  };
  
  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden' }}>
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        style={{ display: 'block' }}
      />
      <div style={{
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 10
      }}>
        <button
          onClick={handleBackClick}
          style={{
            padding: '8px 16px',
            backgroundColor: '#ef0e44',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Volver al Menú
        </button>
      </div>
      
      {/* Información de monedas recolectadas */}
      {gameStarted && (
        <div style={{
          position: 'absolute',
          bottom: 10,
          right: 10,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          color: 'white',
          padding: '5px 10px',
          borderRadius: '15px',
          fontSize: '14px',
          display: 'flex',
          alignItems: 'center',
          gap: '5px'
        }}>
          <span style={{ color: '#FFD700' }}>●</span>
          <span>{coinsCollected}</span>
        </div>
      )}
    </div>
  );
};

export default SimpleGame; 