import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import universalBackground from '../assets/images/UniversalBackground.png';
import { addDiamonds, addXp } from '../services/ProgressService';

// Códigos de redención simulados y sus recompensas
const validCodes: Record<string, { type: string; name: string; description: string; }> = {
  'ZUCARITAS': { 
    type: 'accessory', 
    name: 'Gorra de Tony el Tigre', 
    description: 'Una gorra con las orejas de Tony el Tigre' 
  },
  'CHOCOKRISPIS': { 
    type: 'accessory', 
    name: 'Sombrero de Melvin', 
    description: 'Un sombrero con forma de Melvin el elefante' 
  },
  'FROOTLOOPS': { 
    type: 'currency', 
    name: 'Collar de Sam el tucán', 
    description: 'Un collar colorido como Sam el tucán' 
  },
  'KELLOGS2023': { 
    type: 'special', 
    name: 'Capa de Superhéroe Kelloggs', 
    description: 'Una capa especial de edición limitada con el logo de Kelloggs' 
  }
};

const Redeem = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [result, setResult] = useState<{ success: boolean; message: string; reward?: typeof validCodes[keyof typeof validCodes] } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleRedeemCode = () => {
    setIsLoading(true);
    
    // Simulando verificación de código (en una app real esto sería una llamada a API)
    setTimeout(() => {
      setIsLoading(false);
      
      // Lista de códigos válidos (esto sería una verificación en el servidor en una app real)
      const validCodes = ['KELLOGGS2023', 'UNIVERSE', 'TONY2023', 'MELVIN2023', 'SAM2023'];
      
      if (validCodes.includes(code.toUpperCase())) {
        // Otorgar recompensas por canjear un código
        addDiamonds(1);
        addXp(50);
        
        setSuccessMessage('¡Código canjeado correctamente! Has recibido 1 diamante K y 50 XP.');
        setErrorMessage('');
        setCode('');
      } else {
        setErrorMessage('El código ingresado no es válido o ya ha sido utilizado.');
        setSuccessMessage('');
      }
    }, 1500);
  };

  const handleGoBack = () => {
    navigate('/menu');
  };

  return (
    <div className="h-full w-full relative overflow-hidden">
      {/* Fondo */}
      <div 
        className="absolute inset-0 z-0 overflow-hidden"
        style={{ backgroundColor: '#1a1a1a' }}
      >
        <img 
          src={universalBackground} 
          alt="Background" 
          className="absolute w-full h-full object-cover"
          style={{
            opacity: 0.6
          }}
        />
      </div>

      {/* Contenido */}
      <div className="relative z-10 h-full w-full p-4 flex flex-col items-center justify-center">
        <div className="card max-w-md w-full bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-display text-gray-800 mb-2">Canjear Código</h1>
            <p className="text-gray-600">Ingresa el código de tu producto para recibir recompensas exclusivas</p>
          </div>
          
          <form onSubmit={handleRedeemCode} className="space-y-4">
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
                Código
              </label>
              <input
                id="code"
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Ej: ZUCARITAS"
                disabled={isLoading}
              />
              <p className="text-xs text-gray-500 mt-1">
                Puedes encontrar códigos en los productos Kellogg's participantes
              </p>
            </div>
            
            <div className="text-center">
              <button 
                type="submit" 
                className={`btn bg-primary hover:bg-primary/90 text-white w-full ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                disabled={isLoading}
              >
                {isLoading ? 'Procesando...' : 'Canjear Código'}
              </button>
            </div>
          </form>

          {successMessage && (
            <div className="mt-4 p-4 rounded-lg bg-green-100 text-green-700">
              {successMessage}
            </div>
          )}

          {errorMessage && (
            <div className="mt-4 p-4 rounded-lg bg-red-100 text-red-700">
              {errorMessage}
            </div>
          )}

          <div className="mt-6 text-center">
            <button 
              onClick={handleGoBack}
              className="text-gray-600 hover:text-gray-800"
            >
              Volver al Menú
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Redeem; 