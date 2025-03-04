import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import kellogsLogo from '../assets/images/KellogsUniverse_Logo.png';

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      localStorage.setItem('kellogsUsername', username.trim());
      navigate('/menu');
    }
  };

  return (
    <div className="h-full w-full flex flex-col justify-center items-center relative overflow-hidden bg-primary/10">
      {/* Fondo con gradiente */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-primary/20 to-blue-900/30"></div>
      
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