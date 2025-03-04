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
    console.log("Iniciando juego:", gameType);
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    
    const canvas = canvasRef.current;
    if (!canvas) {
      console.error("Canvas no encontrado");
      return;
    }
    
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error("Contexto del canvas no disponible");
      return;
    }
    
    // Debug
    console.log("Canvas size:", canvas.width, "x", canvas.height);
    
    // Inicialización específica según el tipo de juego
    switch (gameType) {
      case 'zucaritas':
        console.log("Iniciando juego de Zucaritas");
        startZucaritasGame(canvas, ctx);
        break;
      case 'choco-krispis':
        console.log("Iniciando juego de Choco Krispis");
        startChocoKrispisGame(canvas, ctx);
        break;
      case 'froot-loops':
        console.log("Iniciando juego de Froot Loops");
        startFrootLoopsGame(canvas, ctx);
        break;
      default:
        console.error("Tipo de juego no reconocido:", gameType);
        setGameStarted(false);
    }
  };
  
  const startZucaritasGame = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
    // Variables del juego de Zucaritas: Tony el Tigre recogiendo cereales con un bowl
    const tigerWidth = canvas.width * 0.1;
    const tigerHeight = canvas.height * 0.15;
    let tigerX = canvas.width / 2 - tigerWidth / 2;
    const tigerY = canvas.height - tigerHeight - 20;
    const bowlWidth = tigerWidth * 1.5;
    const bowlHeight = tigerHeight * 0.3;
    
    // Cereales cayendo
    const cerealSize = canvas.width * 0.04;
    let cereals: {x: number, y: number, speed: number, rotation: number}[] = [];
    
    // Generar cereales iniciales
    for (let i = 0; i < 8; i++) {
      cereals.push({
        x: Math.random() * (canvas.width - cerealSize),
        y: -cerealSize - Math.random() * canvas.height,
        speed: 2 + Math.random() * 5,
        rotation: Math.random() * Math.PI * 2
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
      tigerX = (touch.clientX - rect.left) * (canvas.width / rect.width) - tigerWidth / 2;
      
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
      
      // Dibujar fondo con patrón de Zucaritas
      ctx.fillStyle = '#FF9900';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Añadir patrón de fondo (rayas de tigre)
      ctx.fillStyle = '#FF7700';
      for (let i = 0; i < 10; i++) {
        const y = canvas.height * (i / 10);
        ctx.fillRect(0, y, canvas.width, canvas.height * 0.03);
      }
      
      // Mover tigre
      const moveSpeed = canvas.width * 0.007; // Velocidad proporcional al ancho del canvas
      if (keys['ArrowLeft'] && tigerX > 0) {
        tigerX -= moveSpeed;
      }
      if (keys['ArrowRight'] && tigerX < canvas.width - tigerWidth) {
        tigerX += moveSpeed;
      }
      
      // Dibujar tigre (representación mejorada)
      // Cuerpo
      ctx.fillStyle = '#FF6600';
      ctx.fillRect(tigerX, tigerY, tigerWidth, tigerHeight);
      
      // Rayas
      ctx.fillStyle = '#000000';
      for (let i = 0; i < 5; i++) {
        ctx.fillRect(tigerX + tigerWidth * (0.2 + i * 0.15), tigerY, tigerWidth * 0.05, tigerHeight);
      }
      
      // Cara
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.ellipse(tigerX + tigerWidth * 0.3, tigerY + tigerHeight * 0.25, tigerWidth * 0.15, tigerHeight * 0.15, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(tigerX + tigerWidth * 0.7, tigerY + tigerHeight * 0.25, tigerWidth * 0.15, tigerHeight * 0.15, 0, 0, Math.PI * 2);
      ctx.fill();
      
      // Ojos
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.ellipse(tigerX + tigerWidth * 0.3, tigerY + tigerHeight * 0.25, tigerWidth * 0.05, tigerHeight * 0.05, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(tigerX + tigerWidth * 0.7, tigerY + tigerHeight * 0.25, tigerWidth * 0.05, tigerHeight * 0.05, 0, 0, Math.PI * 2);
      ctx.fill();
      
      // Sonrisa
      ctx.beginPath();
      ctx.arc(tigerX + tigerWidth * 0.5, tigerY + tigerHeight * 0.4, tigerWidth * 0.25, 0, Math.PI);
      ctx.stroke();
      
      // Dibujar bowl
      ctx.fillStyle = '#8B4513';
      ctx.beginPath();
      ctx.ellipse(tigerX + tigerWidth/2, tigerY - bowlHeight/2, bowlWidth/2, bowlHeight/2, 0, 0, Math.PI, true);
      ctx.fill();
      
      // Interior del bowl
      ctx.fillStyle = '#D2B48C';
      ctx.beginPath();
      ctx.ellipse(tigerX + tigerWidth/2, tigerY - bowlHeight/2, bowlWidth/2 - 5, bowlHeight/3, 0, 0, Math.PI, true);
      ctx.fill();
      
      // Generar nuevos cereales
      cerealTimer += deltaTime;
      if (cerealTimer > 1000 - Math.min(score * 10, 500)) { // cada segundo, aumentando la frecuencia con el puntaje
        cereals.push({
          x: Math.random() * (canvas.width - cerealSize),
          y: -cerealSize,
          speed: 2 + Math.random() * 5 + Math.min(score * 0.1, 5), // Aumenta la velocidad con el puntaje
          rotation: Math.random() * Math.PI * 2
        });
        cerealTimer = 0;
      }
      
      // Actualizar y dibujar cereales
      for (let i = 0; i < cereals.length; i++) {
        const cereal = cereals[i];
        cereal.y += cereal.speed;
        cereal.rotation += 0.02;
        
        // Dibujar cereal (flake de Zucaritas)
        ctx.save();
        ctx.translate(cereal.x + cerealSize/2, cereal.y + cerealSize/2);
        ctx.rotate(cereal.rotation);
        
        // Cereal
        ctx.fillStyle = '#FFCC00';
        ctx.beginPath();
        
        // Crear forma de estrella para el cereal
        for (let j = 0; j < 8; j++) {
          const angle = j * Math.PI / 4;
          const radius = j % 2 === 0 ? cerealSize / 2 : cerealSize / 4;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          
          if (j === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        
        ctx.closePath();
        ctx.fill();
        
        // Brillo
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(-cerealSize/6, -cerealSize/6, cerealSize/8, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
        
        // Verificar colisión con bowl
        const bowlLeft = tigerX + (tigerWidth - bowlWidth) / 2;
        const bowlTop = tigerY - bowlHeight;
        
        // Punto central del cereal
        const cerealCenterX = cereal.x + cerealSize/2;
        const cerealCenterY = cereal.y + cerealSize/2;
        
        // Punto central del bowl
        const bowlCenterX = bowlLeft + bowlWidth/2;
        const bowlCenterY = bowlTop + bowlHeight/2;
        
        // Calcular distancia entre los centros
        const dx = cerealCenterX - bowlCenterX;
        const dy = cerealCenterY - bowlCenterY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Si el cereal está dentro del bowl (aproximación)
        if (distance < bowlWidth/2) {
          // Colisión detectada
          // Efecto de colisión - partículas
          for (let j = 0; j < 5; j++) {
            const particleSize = cerealSize / 4;
            ctx.fillStyle = '#FFCC00';
            ctx.beginPath();
            ctx.arc(
              cerealCenterX + (Math.random() - 0.5) * 20,
              cerealCenterY + (Math.random() - 0.5) * 20,
              particleSize,
              0, Math.PI * 2
            );
            ctx.fill();
          }
          
          setScore(prevScore => prevScore + 10);
          cereals.splice(i, 1);
          i--;
        } 
        // Si el cereal sale de la pantalla
        else if (cereal.y > canvas.height) {
          cereals.splice(i, 1);
          i--;
          
          // Si no quedan cereales, terminar juego tras un tiempo
          if (cereals.length === 0 && !gameOver) {
            setTimeout(() => {
              setGameOver(true);
            }, 1000);
          }
        }
      }
      
      // Mostrar puntuación
      ctx.fillStyle = '#FFFFFF';
      ctx.font = `bold ${canvas.width * 0.03}px Arial`;
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
    const elephantWidth = canvas.width * 0.1;
    const elephantHeight = canvas.height * 0.1;
    let elephantX = canvas.width / 2 - elephantWidth / 2;
    let elephantY = canvas.height / 2 - elephantHeight / 2;
    
    // Chocolates para recolectar
    const chocolateSize = canvas.width * 0.035;
    let chocolates: {x: number, y: number, size: number, type: number}[] = [];
    
    // Generar chocolates iniciales
    for (let i = 0; i < 15; i++) {
      chocolates.push({
        x: Math.random() * (canvas.width - chocolateSize),
        y: Math.random() * (canvas.height - chocolateSize),
        size: chocolateSize * (0.8 + Math.random() * 0.4), // Tamaño variable
        type: Math.floor(Math.random() * 3) // 3 tipos diferentes de chocolates
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
      touchX = (touch.clientX - rect.left) * (canvas.width / rect.width);
      touchY = (touch.clientY - rect.top) * (canvas.height / rect.height);
    };
    
    touchMoveHandlerRef.current = (e: TouchEvent) => {
      e.preventDefault();
      const touch = e.touches[0];
      const rect = canvas.getBoundingClientRect();
      touchX = (touch.clientX - rect.left) * (canvas.width / rect.width);
      touchY = (touch.clientY - rect.top) * (canvas.height / rect.height);
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
    let trunkAngle = 0; // Ángulo de la trompa del elefante
    
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
      
      // Dibujar fondo con textura de Choco Krispis
      ctx.fillStyle = '#663300';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Añadir patrón de fondo (círculos de chocolate)
      for (let i = 0; i < 50; i++) {
        const circleX = (i * canvas.width / 50) + (Math.sin(i * 0.1 + timestamp * 0.001) * 20);
        const circleY = (i * canvas.height / 50) + (Math.cos(i * 0.1 + timestamp * 0.001) * 20);
        const radius = canvas.width * 0.01 + Math.sin(i * 0.5) * canvas.width * 0.01;
        
        ctx.fillStyle = `rgba(101, 67, 33, ${0.5 + Math.random() * 0.5})`;
        ctx.beginPath();
        ctx.arc(circleX, circleY, radius, 0, Math.PI * 2);
        ctx.fill();
      }
      
      // Mover elefante con teclado
      const speed = canvas.width * 0.005; // Velocidad proporcional al ancho del canvas
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
      
      // Calcular dirección para la trompa
      let nearestChocolate = null;
      let minDistance = Infinity;
      
      for (const chocolate of chocolates) {
        const dx = (chocolate.x + chocolate.size/2) - (elephantX + elephantWidth/2);
        const dy = (chocolate.y + chocolate.size/2) - (elephantY + elephantHeight/2);
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < minDistance) {
          minDistance = distance;
          nearestChocolate = chocolate;
        }
      }
      
      if (nearestChocolate) {
        const dx = (nearestChocolate.x + nearestChocolate.size/2) - (elephantX + elephantWidth/2);
        const dy = (nearestChocolate.y + nearestChocolate.size/2) - (elephantY + elephantHeight/2);
        trunkAngle = Math.atan2(dy, dx);
      }
      
      // Dibujar elefante (representación mejorada)
      // Cuerpo
      ctx.fillStyle = '#995500';
      ctx.beginPath();
      ctx.ellipse(
        elephantX + elephantWidth/2, 
        elephantY + elephantHeight/2, 
        elephantWidth/2, 
        elephantHeight/2, 
        0, 0, Math.PI * 2
      );
      ctx.fill();
      
      // Orejas
      ctx.fillStyle = '#884400';
      ctx.beginPath();
      ctx.ellipse(
        elephantX + elephantWidth*0.25, 
        elephantY + elephantHeight*0.3, 
        elephantWidth*0.25, 
        elephantHeight*0.3, 
        0, 0, Math.PI * 2
      );
      ctx.fill();
      
      ctx.beginPath();
      ctx.ellipse(
        elephantX + elephantWidth*0.75, 
        elephantY + elephantHeight*0.3, 
        elephantWidth*0.25, 
        elephantHeight*0.3, 
        0, 0, Math.PI * 2
      );
      ctx.fill();
      
      // Ojos
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(
        elephantX + elephantWidth*0.35, 
        elephantY + elephantHeight*0.4, 
        elephantWidth*0.08, 
        0, Math.PI * 2
      );
      ctx.fill();
      
      ctx.beginPath();
      ctx.arc(
        elephantX + elephantWidth*0.65, 
        elephantY + elephantHeight*0.4, 
        elephantWidth*0.08, 
        0, Math.PI * 2
      );
      ctx.fill();
      
      // Pupilas
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.arc(
        elephantX + elephantWidth*0.35, 
        elephantY + elephantHeight*0.4, 
        elephantWidth*0.04, 
        0, Math.PI * 2
      );
      ctx.fill();
      
      ctx.beginPath();
      ctx.arc(
        elephantX + elephantWidth*0.65, 
        elephantY + elephantHeight*0.4, 
        elephantWidth*0.04, 
        0, Math.PI * 2
      );
      ctx.fill();
      
      // Trompa
      ctx.strokeStyle = '#995500';
      ctx.lineWidth = elephantWidth * 0.15;
      ctx.lineCap = 'round';
      
      ctx.beginPath();
      const trunkLength = elephantWidth * 0.6;
      ctx.moveTo(elephantX + elephantWidth/2, elephantY + elephantHeight*0.6);
      ctx.lineTo(
        elephantX + elephantWidth/2 + Math.cos(trunkAngle) * trunkLength,
        elephantY + elephantHeight*0.6 + Math.sin(trunkAngle) * trunkLength
      );
      ctx.stroke();
      
      // Actualizar y dibujar chocolates
      for (let i = 0; i < chocolates.length; i++) {
        const chocolate = chocolates[i];
        
        // Dibujar chocolate según su tipo
        switch(chocolate.type) {
          case 0: // Choco Krispis normal
            ctx.fillStyle = '#4B2D0F';
            ctx.beginPath();
            ctx.arc(
              chocolate.x + chocolate.size/2, 
              chocolate.y + chocolate.size/2, 
              chocolate.size/2, 
              0, Math.PI * 2
            );
            ctx.fill();
            
            // Brillo
            ctx.fillStyle = '#FFFFFF';
            ctx.beginPath();
            ctx.arc(
              chocolate.x + chocolate.size*0.3, 
              chocolate.y + chocolate.size*0.3, 
              chocolate.size*0.1, 
              0, Math.PI * 2
            );
            ctx.fill();
            break;
            
          case 1: // Choco Krispis cuadrado
            ctx.fillStyle = '#3B1D00';
            ctx.fillRect(chocolate.x, chocolate.y, chocolate.size, chocolate.size);
            
            // Textura
            ctx.fillStyle = '#2A1500';
            ctx.fillRect(
              chocolate.x + chocolate.size*0.2, 
              chocolate.y + chocolate.size*0.2, 
              chocolate.size*0.6, 
              chocolate.size*0.6
            );
            break;
            
          case 2: // Choco Krispis especial
            ctx.fillStyle = '#693C16';
            ctx.beginPath();
            const corners = 5;
            for (let j = 0; j < corners; j++) {
              const angle = j * 2 * Math.PI / corners - Math.PI / 2;
              const x = chocolate.x + chocolate.size/2 + Math.cos(angle) * chocolate.size/2;
              const y = chocolate.y + chocolate.size/2 + Math.sin(angle) * chocolate.size/2;
              
              if (j === 0) {
                ctx.moveTo(x, y);
              } else {
                ctx.lineTo(x, y);
              }
            }
            ctx.closePath();
            ctx.fill();
            
            // Centro
            ctx.fillStyle = '#8B4513';
            ctx.beginPath();
            ctx.arc(
              chocolate.x + chocolate.size/2, 
              chocolate.y + chocolate.size/2, 
              chocolate.size*0.2, 
              0, Math.PI * 2
            );
            ctx.fill();
            break;
        }
        
        // Verificar colisión con elefante
        // Calcular distancia entre centros
        const elephantCenterX = elephantX + elephantWidth/2;
        const elephantCenterY = elephantY + elephantHeight/2;
        const chocolateCenterX = chocolate.x + chocolate.size/2;
        const chocolateCenterY = chocolate.y + chocolate.size/2;
        
        const dx = chocolateCenterX - elephantCenterX;
        const dy = chocolateCenterY - elephantCenterY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Si hay colisión
        if (distance < elephantWidth/2 + chocolate.size/2) {
          // Efectos de colisión
          // Partículas de chocolate
          for (let j = 0; j < 8; j++) {
            const angle = Math.random() * Math.PI * 2;
            const particleSize = chocolate.size * 0.2;
            const particleX = chocolateCenterX + Math.cos(angle) * chocolate.size;
            const particleY = chocolateCenterY + Math.sin(angle) * chocolate.size;
            
            ctx.fillStyle = '#4B2D0F';
            ctx.beginPath();
            ctx.arc(particleX, particleY, particleSize, 0, Math.PI * 2);
            ctx.fill();
          }
          
          // Aumentar puntaje según el tipo de chocolate
          const points = (chocolate.type + 1) * 10;
          setScore(prevScore => prevScore + points);
          
          // Mostrar los puntos ganados flotando
          ctx.fillStyle = '#FFFFFF';
          ctx.font = `bold ${canvas.width * 0.02}px Arial`;
          ctx.textAlign = 'center';
          ctx.fillText(`+${points}`, chocolateCenterX, chocolateCenterY - 20);
          
          chocolates.splice(i, 1);
          i--;
          
          // Añadir un nuevo chocolate en una posición aleatoria
          chocolates.push({
            x: Math.random() * (canvas.width - chocolateSize),
            y: Math.random() * (canvas.height - chocolateSize),
            size: chocolateSize * (0.8 + Math.random() * 0.4),
            type: Math.floor(Math.random() * 3)
          });
        }
      }
      
      // Mostrar puntuación y tiempo con escala adaptativa
      const fontSize = canvas.width * 0.03;
      ctx.fillStyle = '#FFFFFF';
      ctx.font = `bold ${fontSize}px Arial`;
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
    const birdWidth = canvas.width * 0.08;
    const birdHeight = canvas.height * 0.06;
    let birdY = canvas.height / 2 - birdHeight / 2;
    const birdX = canvas.width / 4;
    let birdVelocity = 0;
    const gravity = canvas.height * 0.0007; // Proporcional a la altura del canvas
    const jumpStrength = -canvas.height * 0.012;
    let birdRotation = 0;
    
    // Obstáculos (aros de colores)
    const loopWidth = canvas.width * 0.12;
    const loopHeight = canvas.height * 0.3;
    const loopThickness = canvas.width * 0.02;
    const colors = ['#FF0000', '#FF9900', '#FFFF00', '#33CC33', '#3366FF', '#9900FF'];
    let loops: {x: number, y: number, color: string, passed: boolean}[] = [];
    
    // Efectos visuales
    const particles: {x: number, y: number, color: string, size: number, vx: number, vy: number, life: number}[] = [];
    const clouds: {x: number, y: number, width: number, height: number, speed: number}[] = [];
    
    // Generar nubes de fondo
    for (let i = 0; i < 5; i++) {
      clouds.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height * 0.5,
        width: canvas.width * (0.1 + Math.random() * 0.1),
        height: canvas.height * (0.05 + Math.random() * 0.05),
        speed: canvas.width * 0.0005 + Math.random() * canvas.width * 0.0005
      });
    }
    
    // Generar primer aro
    loops.push({
      x: canvas.width,
      y: canvas.height * 0.5,
      color: colors[Math.floor(Math.random() * colors.length)],
      passed: false
    });
    
    // Control de salto
    const handleJump = () => {
      if (gameStarted && !gameOver) {
        birdVelocity = jumpStrength;
        
        // Añadir efecto de partículas al saltar
        for (let i = 0; i < 5; i++) {
          particles.push({
            x: birdX - 10,
            y: birdY + birdHeight / 2,
            color: '#FFFFFF',
            size: 2 + Math.random() * 3,
            vx: -2 - Math.random() * 2,
            vy: (Math.random() - 0.5) * 2,
            life: 20 + Math.random() * 10
          });
        }
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
    let loopTimer = 0;
    let backgroundPos = 0;
    
    const gameLoop = (timestamp: number) => {
      if (!gameStarted || gameOver) return;
      
      const deltaTime = timestamp - lastTime;
      lastTime = timestamp;
      
      // Limpiar canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Dibujar fondo degradado de cielo
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#87CEEB'); // Azul claro arriba
      gradient.addColorStop(1, '#E0F7FF'); // Casi blanco abajo
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Mover y dibujar nubes
      for (let i = 0; i < clouds.length; i++) {
        const cloud = clouds[i];
        cloud.x -= cloud.speed * deltaTime;
        
        if (cloud.x + cloud.width < 0) {
          cloud.x = canvas.width;
          cloud.y = Math.random() * canvas.height * 0.5;
        }
        
        // Dibujar nube
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.beginPath();
        ctx.ellipse(cloud.x, cloud.y, cloud.width * 0.5, cloud.height * 0.5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(cloud.x + cloud.width * 0.2, cloud.y - cloud.height * 0.1, cloud.width * 0.3, cloud.height * 0.4, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(cloud.x - cloud.width * 0.2, cloud.y + cloud.height * 0.1, cloud.width * 0.3, cloud.height * 0.4, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      
      // Física del tucán
      birdVelocity += gravity * deltaTime;
      birdY += birdVelocity * deltaTime;
      
      // Limitar rotación del tucán basado en la velocidad
      const targetRotation = birdVelocity * 0.1;
      birdRotation += (targetRotation - birdRotation) * 0.1;
      
      // Dibujar tucán
      ctx.save();
      ctx.translate(birdX + birdWidth/2, birdY + birdHeight/2);
      ctx.rotate(birdRotation);
      
      // Cuerpo del tucán (oval negro)
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.ellipse(0, 0, birdWidth/2, birdHeight/2, 0, 0, Math.PI * 2);
      ctx.fill();
      
      // Pecho blanco
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.ellipse(birdWidth * 0.1, birdHeight * 0.1, birdWidth * 0.25, birdHeight * 0.3, 0, 0, Math.PI * 2);
      ctx.fill();
      
      // Ojo
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(birdWidth * 0.15, -birdHeight * 0.1, birdWidth * 0.08, 0, Math.PI * 2);
      ctx.fill();
      
      // Pupila
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.arc(birdWidth * 0.17, -birdHeight * 0.1, birdWidth * 0.04, 0, Math.PI * 2);
      ctx.fill();
      
      // Pico multicolor - superior
      ctx.fillStyle = '#FF9900';
      ctx.beginPath();
      ctx.moveTo(birdWidth * 0.25, -birdHeight * 0.05);
      ctx.lineTo(birdWidth * 0.7, -birdHeight * 0.15);
      ctx.lineTo(birdWidth * 0.25, -birdHeight * 0.2);
      ctx.fill();
      
      // Pico multicolor - inferior
      ctx.fillStyle = '#FF0000';
      ctx.beginPath();
      ctx.moveTo(birdWidth * 0.25, -birdHeight * 0.05);
      ctx.lineTo(birdWidth * 0.7, birdHeight * 0.05);
      ctx.lineTo(birdWidth * 0.25, birdHeight * 0.1);
      ctx.fill();
      
      ctx.restore();
      
      // Actualizar y dibujar partículas
      for (let i = 0; i < particles.length; i++) {
        const particle = particles[i];
        
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life -= 1;
        
        if (particle.life <= 0) {
          particles.splice(i, 1);
          i--;
          continue;
        }
        
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = particle.life / 30;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
      
      // Generar nuevos aros
      loopTimer += deltaTime;
      const loopInterval = 2000 - Math.min(score * 50, 1000); // Intervalos más cortos a medida que aumenta el puntaje
      if (loopTimer > loopInterval) {
        const gapPosition = canvas.height * (0.2 + Math.random() * 0.6); // Posición aleatoria con margen
        
        loops.push({
          x: canvas.width,
          y: gapPosition,
          color: colors[Math.floor(Math.random() * colors.length)],
          passed: false
        });
        
        loopTimer = 0;
      }
      
      // Actualizar y dibujar aros
      for (let i = 0; i < loops.length; i++) {
        const loop = loops[i];
        loop.x -= (canvas.width * 0.003) * deltaTime * (1 + score * 0.01); // Velocidad aumenta con el puntaje
        
        // Dibujar aro (Froot Loop)
        ctx.save();
        ctx.translate(loop.x, loop.y);
        
        // Exterior del aro
        ctx.strokeStyle = loop.color;
        ctx.lineWidth = loopThickness;
        ctx.beginPath();
        ctx.ellipse(0, 0, loopWidth/2, loopHeight/2, 0, 0, Math.PI * 2);
        ctx.stroke();
        
        // Interior con transparencia
        ctx.fillStyle = `${loop.color}33`;
        ctx.beginPath();
        ctx.ellipse(0, 0, loopWidth/2 - loopThickness/2, loopHeight/2 - loopThickness/2, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Brillos
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.5;
        ctx.beginPath();
        ctx.arc(-loopWidth * 0.2, -loopHeight * 0.25, loopWidth * 0.05, 0, Math.PI * 0.8);
        ctx.stroke();
        
        ctx.restore();
        
        // Verificar colisión (si el tucán no está pasando por el aro)
        // Creamos un cuadro delimitador para el tucán
        const birdLeft = birdX;
        const birdRight = birdX + birdWidth;
        const birdTop = birdY;
        const birdBottom = birdY + birdHeight;
        
        // Centro y dimensiones del aro
        const loopCenterX = loop.x;
        const loopCenterY = loop.y;
        
        // Calcular si el tucán está dentro o fuera del aro
        // Esto es una simplificación - usamos distancia del centro del tucán al centro del aro
        const tucánCenterX = birdX + birdWidth / 2;
        const tucánCenterY = birdY + birdHeight / 2;
        
        const dx = tucánCenterX - loopCenterX;
        const dy = tucánCenterY - loopCenterY;
        
        // Convertir coordenadas a la elipse
        const normalizedX = dx / (loopWidth / 2);
        const normalizedY = dy / (loopHeight / 2);
        
        // Distancia al borde de la elipse
        const distance = Math.sqrt(normalizedX * normalizedX + normalizedY * normalizedY);
        
        // Si el tucán está cerca del aro pero no dentro de él (colisión)
        if (
          birdRight > loopCenterX - loopWidth/2 && 
          birdLeft < loopCenterX + loopWidth/2 &&
          (distance > 0.7 && distance < 1.3)
        ) {
          // Efecto de colisión con partículas
          for (let j = 0; j < 20; j++) {
            particles.push({
              x: birdX + birdWidth / 2,
              y: birdY + birdHeight / 2,
              color: loop.color,
              size: 2 + Math.random() * 5,
              vx: (Math.random() - 0.5) * 5,
              vy: (Math.random() - 0.5) * 5,
              life: 30 + Math.random() * 20
            });
          }
          
          setGameOver(true);
          return;
        }
        
        // Aumentar puntaje al pasar un aro
        if (birdX > loop.x && !loop.passed) {
          loop.passed = true;
          
          // Efectos visuales al sumar puntos
          for (let j = 0; j < 10; j++) {
            particles.push({
              x: birdX + birdWidth,
              y: birdY + birdHeight / 2,
              color: loop.color,
              size: 3 + Math.random() * 3,
              vx: 1 + Math.random() * 3,
              vy: (Math.random() - 0.5) * 2,
              life: 40 + Math.random() * 20
            });
          }
          
          setScore(prevScore => prevScore + 10);
          
          // Mostrar texto de "+10" flotando
          ctx.fillStyle = '#FFFFFF';
          ctx.font = `bold ${canvas.width * 0.03}px Arial`;
          ctx.textAlign = 'center';
          ctx.fillText('+10', loop.x, loop.y - 30);
        }
        
        // Eliminar obstáculos fuera de pantalla
        if (loop.x + loopWidth < 0) {
          loops.splice(i, 1);
          i--;
        }
      }
      
      // Verificar si el tucán toca el suelo o el techo
      if (birdY < 0 || birdY + birdHeight > canvas.height) {
        // Efecto de colisión con el límite
        for (let i = 0; i < 15; i++) {
          particles.push({
            x: birdX + birdWidth / 2,
            y: birdY < 0 ? 0 : canvas.height,
            color: '#FFFFFF',
            size: 2 + Math.random() * 4,
            vx: (Math.random() - 0.5) * 3,
            vy: birdY < 0 ? (1 + Math.random() * 2) : -(1 + Math.random() * 2),
            life: 20 + Math.random() * 10
          });
        }
        
        setGameOver(true);
        return;
      }
      
      // Mostrar puntuación
      ctx.fillStyle = '#FFFFFF';
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 3;
      ctx.font = `bold ${canvas.width * 0.04}px Arial`;
      ctx.textAlign = 'left';
      ctx.strokeText(`Puntos: ${score}`, 20, 40);
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
      
      <div className="w-full max-w-[1200px] bg-white rounded-xl shadow-lg overflow-hidden">
        <canvas 
          ref={canvasRef} 
          width={1200} 
          height={900}
          className="w-full h-auto"
        ></canvas>
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