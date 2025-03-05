import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Importar los assets
import body1 from '../assets/character/body1.png';
import body2 from '../assets/character/body2.png';
import body3 from '../assets/character/body3.png';
import head1 from '../assets/character/head1.png';
import head2 from '../assets/character/head2.png';
import head3 from '../assets/character/head3.png';
import acc1 from '../assets/character/acc1.png';
import acc2 from '../assets/character/acc2.png';
import acc3 from '../assets/character/acc3.png';

// Definir las opciones disponibles para cada capa
const bodyOptions = [body1, body2, body3];
const headOptions = [head1, head2, head3];
const accOptions = [acc1, acc2, acc3];

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
    <div className="h-full w-full flex flex-col bg-gradient-to-br from-primary/10 to-blue-900/20">
      {/* Header */}
      <header className="p-4 flex justify-between items-center bg-white/80 backdrop-blur-sm">
        <h1 className="text-2xl font-bold text-gray-800">Personaliza tu Avatar</h1>
        <button
          onClick={saveAvatar}
          className="btn btn-primary"
        >
          Guardar y Volver
        </button>
      </header>

      <div className="flex-1 flex flex-col md:flex-row p-4 gap-4">
        {/* Preview del Avatar */}
        <div className="flex-1 flex justify-center items-center">
          <div className="relative w-80 h-80">
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
            <img
              src={accOptions[selectedAcc]}
              alt="Accesorio"
              className="absolute inset-0 w-full h-full object-contain"
            />
          </div>
        </div>

        {/* Panel de selección */}
        <div className="flex-1 flex flex-col gap-6 bg-white/90 backdrop-blur-sm p-6 rounded-xl">
          {/* Selector de cuerpo */}
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-gray-800">Cuerpo</h2>
            <div className="flex gap-4">
              {bodyOptions.map((body, index) => (
                <button
                  key={`body-${index}`}
                  onClick={() => setSelectedBody(index)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-4 transition-all ${
                    selectedBody === index ? 'border-primary scale-110' : 'border-transparent hover:border-primary/50'
                  }`}
                >
                  <img src={body} alt={`Cuerpo ${index + 1}`} className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          </div>

          {/* Selector de cabeza */}
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-gray-800">Cabeza</h2>
            <div className="flex gap-4">
              {headOptions.map((head, index) => (
                <button
                  key={`head-${index}`}
                  onClick={() => setSelectedHead(index)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-4 transition-all ${
                    selectedHead === index ? 'border-primary scale-110' : 'border-transparent hover:border-primary/50'
                  }`}
                >
                  <img src={head} alt={`Cabeza ${index + 1}`} className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          </div>

          {/* Selector de accesorios */}
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-gray-800">Accesorios</h2>
            <div className="flex gap-4">
              {accOptions.map((acc, index) => (
                <button
                  key={`acc-${index}`}
                  onClick={() => setSelectedAcc(index)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-4 transition-all ${
                    selectedAcc === index ? 'border-primary scale-110' : 'border-transparent hover:border-primary/50'
                  }`}
                >
                  <img src={acc} alt={`Accesorio ${index + 1}`} className="w-full h-full object-contain" />
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