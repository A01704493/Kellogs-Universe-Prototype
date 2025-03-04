import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import loginBackground from '../assets/images/Login_Background.png';
import kellogsLogo from '../assets/images/KellogsUniverse_Logo.png';

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  
  // Estado para el efecto parallax
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [deviceOrientation, setDeviceOrientation] = useState({ beta: 0, gamma: 0 });
  const [isMobile, setIsMobile] = useState(false);

  // Detectar si es dispositivo móvil
  useEffect(() => {
    const checkMobile = () => {
      const userAgent = typeof window.navigator === 'undefined' ? '' : navigator.userAgent;
      const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Windows Phone/i;
      setIsMobile(mobileRegex.test(userAgent));
    };
    
    checkMobile();
  }, []);

  // Efecto para el parallax con mouse
  useEffect(() => {
    if (isMobile) return; // No aplicar en móviles

    const handleMouseMove = (e: MouseEvent) => {
      // Convertir la posición del mouse a valores entre -1 y 1
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isMobile]);

  // Efecto para el parallax con giroscopio en móviles
  useEffect(() => {
    if (!isMobile) return; // Solo aplicar en móviles

    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.beta !== null && e.gamma !== null) {
        // Limitar los valores para un movimiento sutil
        const beta = Math.max(-10, Math.min(10, e.beta)) / 10; // -1 a 1
        const gamma = Math.max(-10, Math.min(10, e.gamma)) / 10; // -1 a 1
        setDeviceOrientation({ beta, gamma });
      }
    };

    window.addEventListener('deviceorientation', handleOrientation as EventListener);
    return () => {
      window.removeEventListener('deviceorientation', handleOrientation as EventListener);
    };
  }, [isMobile]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      localStorage.setItem('kellogsUsername', username.trim());
      navigate('/menu');
    }
  };

  // Calcular la transformación para el efecto parallax
  const getParallaxStyle = () => {
    // Usar los valores del giroscopio si es móvil, de lo contrario usar posición del mouse
    const x = isMobile ? deviceOrientation.gamma * 15 : mousePosition.x * 15; // 15px de movimiento máximo
    const y = isMobile ? deviceOrientation.beta * 15 : mousePosition.y * 15;
    
    return {
      transform: `translate(${x}px, ${y}px)`,
      transition: 'transform 0.2s ease-out'
    };
  };

  return (
    <div className="h-full w-full flex flex-col justify-center items-center relative overflow-hidden">
      {/* Fondo con efecto parallax */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ 
          backgroundImage: `url(${loginBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          ...getParallaxStyle()
        }}
      ></div>
      
      {/* Capa de oscurecimiento para mejorar contraste */}
      <div className="absolute inset-0 z-0 bg-black opacity-30"></div>
      
      <div className="relative z-10 w-full max-w-md p-8 bg-white/80 backdrop-blur-md rounded-xl shadow-2xl">
        <div className="text-center mb-6">
          <img src={kellogsLogo} alt="Kellogs Universe" className="h-20 mx-auto mb-2" />
          <p className="text-gray-600">¡Ingresa para comenzar tu aventura!</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-700">
              Nombre de usuario
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Escribe tu nombre de aventurero"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full px-4 py-3 text-white bg-primary hover:bg-primary-dark rounded-lg transition-colors"
          >
            Comenzar Aventura
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login; 