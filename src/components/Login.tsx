import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import kellogsLogo from '../assets/images/KellogsUniverse_Logo.png';

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulación de login (sin validación real)
    if (username.trim() === '') {
      setError('Por favor ingresa un nombre de usuario');
      return;
    }
    
    // Almacenar el nombre de usuario en localStorage para usarlo en toda la app
    localStorage.setItem('kellogsUsername', username);
    
    // Redireccionar al menú principal
    navigate('/menu');
  };

  return (
    <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-primary to-secondary p-4">
      <div className="card max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-2">
            <img src={kellogsLogo} alt="Kellogs Universe" className="h-16 object-contain" />
          </div>
          <p className="text-gray-600">¡Ingresa a un mundo de diversión!</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Nombre de Usuario
            </label>
            <input
              id="username"
              type="text"
              className="input w-full"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Escribe tu nombre de aventurero"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              className="input w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
            />
            <p className="text-xs text-gray-500 mt-1">
              (Puedes usar cualquier contraseña, ¡es sólo una demo!)
            </p>
          </div>
          
          {error && <p className="text-red-500 text-sm">{error}</p>}
          
          <button 
            type="submit" 
            className="btn btn-primary w-full"
          >
            ¡Aventura Comienza!
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login; 