import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import universalBackground from '../assets/images/UniversalBackground.png';

// Importar los assets para el preview
import body1 from '../assets/character/body1.png';
import body2 from '../assets/character/body2.png';
import body3 from '../assets/character/body3.png';
import head1 from '../assets/character/head1.png';
import head2 from '../assets/character/head2.png';
import head3 from '../assets/character/head3.png';
import acc1 from '../assets/character/acc1.png';
import acc2 from '../assets/character/acc2.png';
import acc3 from '../assets/character/acc3.png';

// Importar los iconos para el menú
import body1Icon from '../assets/character/body1_icon.png';
import body2Icon from '../assets/character/body2_icon.png';
import body3Icon from '../assets/character/body3_icon.png';
import head1Icon from '../assets/character/head1_icon.png';
import head2Icon from '../assets/character/head2_icon.png';
import head3Icon from '../assets/character/head3_icon.png';
import acc1Icon from '../assets/character/acc1_icon.png';
import acc2Icon from '../assets/character/acc2_icon.png';
import acc3Icon from '../assets/character/acc3_icon.png';
import removeIcon from '../assets/character/remove_icon.png';

// Definir las opciones disponibles para cada capa
const bodyOptions = [body1, body2, body3];
const headOptions = [head1, head2, head3];
const accOptions = [null, acc1, acc2, acc3];

// Definir los iconos para el menú
const bodyIcons = [body1Icon, body2Icon, body3Icon];
const headIcons = [head1Icon, head2Icon, head3Icon];
const accIcons = [removeIcon, acc1Icon, acc2Icon, acc3Icon];

const Avatar = () => {
  const navigate = useNavigate();
  
  // Estados para cada capa del avatar
  const [selectedBody, setSelectedBody] = useState(0);
  const [selectedHead, setSelectedHead] = useState(0);
  const [selectedAcc, setSelectedAcc] = useState(0);

  // Efecto para cargar la configuración guardada del avatar
  useEffect(() => {
    const savedAvatar = localStorage.getItem('kellogsAvatar');
    if (savedAvatar) {
      const { body, head, acc } = JSON.parse(savedAvatar);
      setSelectedBody(body);
      setSelectedHead(head);
      setSelectedAcc(acc);
    }
  }, []);

  // Función para guardar la configuración del avatar
  const saveAvatar = () => {
    const avatarConfig = {
      body: selectedBody,
      head: selectedHead,
      acc: selectedAcc
    };
    localStorage.setItem('kellogsAvatar', JSON.stringify(avatarConfig));
    navigate('/menu');
  };

  return (
    <div className="h-full w-full flex flex-col relative overflow-hidden">
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
      <header className="relative z-20 sticky top-0 p-4 flex justify-between items-center bg-white/80 backdrop-blur-sm">
        <h1 className="text-2xl font-bold text-gray-800">Personaliza tu Avatar</h1>
        <button
          onClick={saveAvatar}
          className="btn bg-blue-500 hover:bg-blue-600 text-white"
        >
          Guardar y Volver
        </button>
      </header>

      <div className="relative z-10 flex-1 flex flex-col md:flex-row p-4 gap-4 min-h-[600px]">
        {/* Preview del Avatar */}
        <div className="flex-1 flex justify-center items-center">
          <div className="relative w-80 h-80 md:w-[40vw] md:h-[40vw] max-w-[600px] max-h-[600px] bg-white/40 backdrop-blur-sm rounded-xl p-4">
            {/* Capa del cuerpo */}
            <img
              src={bodyOptions[selectedBody]}
              alt="Cuerpo"
              className="absolute inset-0 w-full h-full object-contain"
            />
            {/* Capa de la cabeza */}
            <img
              src={headOptions[selectedHead]}
              alt="Cabeza"
              className="absolute inset-0 w-full h-full object-contain"
            />
            {/* Capa de accesorios */}
            {accOptions[selectedAcc] && (
              <img
                src={accOptions[selectedAcc]}
                alt="Accesorio"
                className="absolute inset-0 w-full h-full object-contain"
              />
            )}
          </div>
        </div>

        {/* Panel de selección */}
        <div className="flex-1 flex flex-col gap-6 bg-white/80 backdrop-blur-sm p-6 rounded-xl max-w-2xl">
          {/* Selector de cuerpo */}
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-gray-800">Cuerpo</h2>
            <div className="flex gap-4">
              {bodyIcons.map((icon, index) => (
                <button
                  key={`body-${index}`}
                  onClick={() => setSelectedBody(index)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-4 transition-all ${
                    selectedBody === index ? 'border-primary scale-110' : 'border-transparent hover:border-primary/50'
                  }`}
                >
                  <img src={icon} alt={`Cuerpo ${index + 1}`} className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          </div>

          {/* Selector de cabeza */}
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-gray-800">Cabeza</h2>
            <div className="flex gap-4">
              {headIcons.map((icon, index) => (
                <button
                  key={`head-${index}`}
                  onClick={() => setSelectedHead(index)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-4 transition-all ${
                    selectedHead === index ? 'border-primary scale-110' : 'border-transparent hover:border-primary/50'
                  }`}
                >
                  <img src={icon} alt={`Cabeza ${index + 1}`} className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          </div>

          {/* Selector de accesorios */}
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-gray-800">Accesorios</h2>
            <div className="flex gap-4">
              {accIcons.map((icon, index) => (
                <button
                  key={`acc-${index}`}
                  onClick={() => setSelectedAcc(index)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-4 transition-all ${
                    selectedAcc === index ? 'border-primary scale-110' : 'border-transparent hover:border-primary/50'
                  }`}
                >
                  <img src={icon} alt={`Accesorio ${index}`} className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Avatar; 