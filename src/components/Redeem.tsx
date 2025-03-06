import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import universalBackground from '../assets/images/UniversalBackground.png';
import GameEconomyBar from './GameEconomyBar';
import { useGameEconomy } from '../contexts/GameEconomyContext';

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
  const { addKDiamonds, addXP } = useGameEconomy();

  const handleRedeemCode = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Resetear el resultado anterior
    setResult(null);
    
    // Simular carga
    setIsLoading(true);
    
    // Simulación de validación de código
    setTimeout(() => {
      const trimmedCode = code.trim().toUpperCase();
      
      if (validCodes[trimmedCode]) {
        // Código válido
        const reward = validCodes[trimmedCode];
        
        // Almacenar la recompensa (en un caso real, esto se haría en la base de datos)
        // Para la demo, lo guardamos en localStorage
        const redeemedCodes = JSON.parse(localStorage.getItem('kellogsRedeemedCodes') || '[]');
        
        if (redeemedCodes.includes(trimmedCode)) {
          setResult({
            success: false,
            message: 'Este código ya ha sido canjeado anteriormente.'
          });
        } else {
          // Añadir código a la lista de canjeados
          redeemedCodes.push(trimmedCode);
          localStorage.setItem('kellogsRedeemedCodes', JSON.stringify(redeemedCodes));
          
          // Si es un accesorio, añadirlo a los items del usuario
          if (reward.type === 'accessory') {
            const userItems = JSON.parse(localStorage.getItem('kellogsUserItems') || '[]');
            userItems.push({
              id: trimmedCode,
              name: reward.name,
              type: reward.type
            });
            localStorage.setItem('kellogsUserItems', JSON.stringify(userItems));
          }
          
          // Otorgar 1 diamante K y 50 XP por canjear un código exitosamente
          addKDiamonds(1);
          addXP(50);
          
          setResult({
            success: true,
            message: '¡Código canjeado con éxito! Has recibido 1 Diamante K y 50 XP.',
            reward
          });
        }
      } else {
        // Código inválido
        setResult({
          success: false,
          message: 'Código inválido o expirado. Por favor, verifica e intenta de nuevo.'
        });
      }
      
      setIsLoading(false);
    }, 1500); // Simular tiempo de procesamiento
  };

  const handleGoBack = () => {
    navigate('/menu');
  };

  return (
    <div className="h-full w-full relative overflow-hidden">
      {/* Fondo universal con opacidad */}
      <div 
        className="absolute inset-0 z-0" 
        style={{ 
          backgroundImage: `url(${universalBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.6 
        }}
      />

      {/* Contenido - Añadir padding-bottom para evitar superposición con la barra */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center pb-16">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg w-full max-w-md p-6">
          <h1 className="text-2xl font-bold text-center mb-6">Canjear Código</h1>
          
          <form onSubmit={handleRedeemCode} className="mb-6">
            <div className="mb-4">
              <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
                Ingresa tu código:
              </label>
              <input
                type="text"
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Ej: KELLOGS2023"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                disabled={isLoading}
              />
            </div>
            
            <button
              type="submit"
              className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-colors ${
                isLoading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-primary hover:bg-primary-dark'
              }`}
              disabled={isLoading}
            >
              {isLoading ? 'Verificando...' : 'Canjear Código'}
            </button>
          </form>
          
          {result && (
            <div className={`p-4 rounded-lg mb-6 ${
              result.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              <p className="font-medium">{result.message}</p>
              {result.reward && (
                <div className="mt-2">
                  <p className="font-bold">{result.reward.name}</p>
                  <p>{result.reward.description}</p>
                </div>
              )}
            </div>
          )}
          
          <button
            onClick={handleGoBack}
            className="w-full py-2 px-4 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Volver al Menú
          </button>
        </div>
      </div>
      
      {/* Barra de economía */}
      <GameEconomyBar />
    </div>
  );
};

export default Redeem; 