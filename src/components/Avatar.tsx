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
    <div style={{ 
      minHeight: '100vh', 
      paddingBottom: '100px', 
      position: 'absolute', 
      top: 0, 
      left: 0, 
      width: '100%' 
    }}>
      {/* Fondo */}
      <div 
        style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0,
          zIndex: 0,
          backgroundColor: '#1a1a1a' 
        }}
      >
        <img 
          src={universalBackground} 
          alt="Background" 
          style={{ 
            position: 'absolute', 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover',
            opacity: 0.6 
          }}
        />
      </div>

      {/* Contenido */}
      <header style={{ 
        position: 'sticky', 
        top: 0, 
        zIndex: 20, 
        padding: '1rem', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(8px)'
      }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937' }}>
          Personaliza tu Avatar
        </h1>
        <button
          onClick={saveAvatar}
          style={{ 
            padding: '0.5rem 1rem', 
            backgroundColor: '#3b82f6', 
            color: 'white', 
            borderRadius: '0.5rem',
            fontWeight: '500',
            cursor: 'pointer'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
        >
          Guardar y Volver
        </button>
      </header>

      <div style={{ 
        position: 'relative', 
        zIndex: 10, 
        padding: '1rem', 
        display: 'flex', 
        flexDirection: window.innerWidth < 768 ? 'column' : 'row',
        gap: '1rem' 
      }}>
        {/* Preview del Avatar */}
        <div style={{ 
          flex: 1, 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          marginBottom: window.innerWidth < 768 ? '1.5rem' : 0
        }}>
          <div style={{ 
            position: 'relative', 
            width: '20rem', 
            height: '20rem', 
            maxWidth: '600px', 
            maxHeight: '600px', 
            backgroundColor: 'rgba(255, 255, 255, 0.4)',
            backdropFilter: 'blur(8px)',
            borderRadius: '0.75rem',
            padding: '1rem'
          }}>
            {/* Capa del cuerpo */}
            <img
              src={bodyOptions[selectedBody]}
              alt="Cuerpo"
              style={{ 
                position: 'absolute', 
                inset: 0, 
                width: '100%', 
                height: '100%', 
                objectFit: 'contain'
              }}
            />
            {/* Capa de la cabeza */}
            <img
              src={headOptions[selectedHead]}
              alt="Cabeza"
              style={{ 
                position: 'absolute', 
                inset: 0, 
                width: '100%', 
                height: '100%', 
                objectFit: 'contain'
              }}
            />
            {/* Capa de accesorios */}
            {accOptions[selectedAcc] && (
              <img
                src={accOptions[selectedAcc]}
                alt="Accesorio"
                style={{ 
                  position: 'absolute', 
                  inset: 0, 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'contain'
                }}
              />
            )}
          </div>
        </div>

        {/* Panel de selección - Solo renderizamos los selectores para no alargar demasiado el código */}
        <div style={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '1.5rem', 
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(8px)', 
          padding: '1.5rem', 
          borderRadius: '0.75rem', 
          maxWidth: '42rem' 
        }}>
          {/* Contenido de los selectores */}
          {/* Mantenemos el código JSX original para los selectores */}
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