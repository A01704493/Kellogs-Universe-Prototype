import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import universalBackground from '../assets/images/UniversalBackground.png';

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
          
          setResult({
            success: true,
            message: '¡Código canjeado con éxito!',
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
                className={`btn bg-blue-500 hover:bg-blue-600 text-white w-full ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                disabled={isLoading}
              >
                {isLoading ? 'Procesando...' : 'Canjear Código'}
              </button>
            </div>
          </form>

          {result && (
            <div className={`mt-4 p-4 rounded-lg ${result.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {result.message}
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