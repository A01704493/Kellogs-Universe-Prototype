import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import universalBackground from '../assets/images/UniversalBackground.png';
import GameEconomyBar from './GameEconomyBar';

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

  useEffect(() => {
    // Aplicar estilos a todos los elementos que podrían estar bloqueando el scroll
    const elementsToModify = [
      document.documentElement, // html
      document.body,
      document.getElementById('root'),
      document.querySelector('.app')
    ];
    
    // Guardar los estilos originales para restaurarlos
    const originalStyles = elementsToModify.map(el => {
      if (!el) return null;
      return {
        element: el,
        overflow: el.style.overflow,
        height: el.style.height
      };
    });
    
    // Aplicar nuevos estilos
    elementsToModify.forEach(el => {
      if (!el) return;
      el.style.overflow = 'auto';
      el.style.height = 'auto';
    });
    
    // Función de limpieza para restaurar estilos originales
    return () => {
      originalStyles.forEach(style => {
        if (!style) return;
        style.element.style.overflow = style.overflow;
        style.element.style.height = style.height;
      });
    };
  }, []);

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

      {/* Contenido principal - Añadir padding-bottom para evitar superposición con la barra */}
      <div className="relative z-10 flex flex-col h-full pb-16">
        {/* Encabezado */}
        <div className="p-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Personaliza tu Avatar</h1>
          <button 
            onClick={saveAvatar}
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark"
          >
            Guardar y Volver
          </button>
        </div>

        {/* Área principal */}
        <div className="flex-1 flex flex-col md:flex-row">
          {/* Vista previa del avatar */}
          <div className="w-full md:w-1/2 flex items-center justify-center p-4">
            <div className="relative w-64 h-64 bg-white/20 backdrop-blur-sm rounded-full">
              {/* Cuerpo */}
              {selectedBody !== null && (
                <img 
                  src={bodyOptions[selectedBody]} 
                  alt="Body" 
                  className="absolute inset-0 w-full h-full object-contain"
                />
              )}
              
              {/* Cabeza */}
              {selectedHead !== null && (
                <img 
                  src={headOptions[selectedHead]} 
                  alt="Head" 
                  className="absolute inset-0 w-full h-full object-contain"
                />
              )}
              
              {/* Accesorio (opcional) */}
              {selectedAcc !== 0 && accOptions[selectedAcc] && (
                <img 
                  src={accOptions[selectedAcc]} 
                  alt="Accessory" 
                  className="absolute inset-0 w-full h-full object-contain"
                />
              )}
            </div>
          </div>
          
          {/* Selector de partes */}
          <div className="w-full md:w-1/2 p-4 overflow-y-auto">
            {/* Selector de cuerpo */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.75rem' }}>Cuerpo</h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                {bodyIcons.map((icon, index) => (
                  <button
                    key={`body-${index}`}
                    onClick={() => setSelectedBody(index)}
                    style={{ 
                      width: window.innerWidth < 768 ? '4.5rem' : '5.5rem', 
                      height: window.innerWidth < 768 ? '4.5rem' : '5.5rem',
                      borderRadius: '0.5rem',
                      overflow: 'hidden',
                      border: selectedBody === index ? '4px solid #ef0e44' : '4px solid transparent',
                      transform: selectedBody === index ? 'scale(1.1)' : 'scale(1)',
                      transition: 'all 0.2s ease',
                      backgroundColor: 'white'
                    }}
                    onMouseOver={(e) => {
                      if (selectedBody !== index) {
                        e.currentTarget.style.border = '4px solid rgba(239, 14, 68, 0.5)';
                      }
                    }}
                    onMouseOut={(e) => {
                      if (selectedBody !== index) {
                        e.currentTarget.style.border = '4px solid transparent';
                      }
                    }}
                  >
                    <img 
                      src={icon} 
                      alt={`Cuerpo ${index + 1}`} 
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Selector de cabeza */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.75rem' }}>Cabeza</h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                {headIcons.map((icon, index) => (
                  <button
                    key={`head-${index}`}
                    onClick={() => setSelectedHead(index)}
                    style={{ 
                      width: window.innerWidth < 768 ? '4.5rem' : '5.5rem', 
                      height: window.innerWidth < 768 ? '4.5rem' : '5.5rem',
                      borderRadius: '0.5rem',
                      overflow: 'hidden',
                      border: selectedHead === index ? '4px solid #ef0e44' : '4px solid transparent',
                      transform: selectedHead === index ? 'scale(1.1)' : 'scale(1)',
                      transition: 'all 0.2s ease',
                      backgroundColor: 'white'
                    }}
                    onMouseOver={(e) => {
                      if (selectedHead !== index) {
                        e.currentTarget.style.border = '4px solid rgba(239, 14, 68, 0.5)';
                      }
                    }}
                    onMouseOut={(e) => {
                      if (selectedHead !== index) {
                        e.currentTarget.style.border = '4px solid transparent';
                      }
                    }}
                  >
                    <img 
                      src={icon} 
                      alt={`Cabeza ${index + 1}`} 
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Selector de accesorios */}
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.75rem' }}>Accesorios</h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                {accIcons.map((icon, index) => (
                  <button
                    key={`acc-${index}`}
                    onClick={() => setSelectedAcc(index)}
                    style={{ 
                      width: window.innerWidth < 768 ? '4.5rem' : '5.5rem', 
                      height: window.innerWidth < 768 ? '4.5rem' : '5.5rem',
                      borderRadius: '0.5rem',
                      overflow: 'hidden',
                      border: selectedAcc === index ? '4px solid #ef0e44' : '4px solid transparent',
                      transform: selectedAcc === index ? 'scale(1.1)' : 'scale(1)',
                      transition: 'all 0.2s ease',
                      backgroundColor: 'white'
                    }}
                    onMouseOver={(e) => {
                      if (selectedAcc !== index) {
                        e.currentTarget.style.border = '4px solid rgba(239, 14, 68, 0.5)';
                      }
                    }}
                    onMouseOut={(e) => {
                      if (selectedAcc !== index) {
                        e.currentTarget.style.border = '4px solid transparent';
                      }
                    }}
                  >
                    <img 
                      src={icon} 
                      alt={`Accesorio ${index}`} 
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Barra de economía */}
      <GameEconomyBar />
    </div>
  );
};

export default Avatar; 