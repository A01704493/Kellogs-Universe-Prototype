import { useEffect, useState } from 'react';

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

const bodyOptions = [body1, body2, body3];
const headOptions = [head1, head2, head3];
const accOptions = [null, acc1, acc2, acc3];

const FloatingAvatar = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [direction, setDirection] = useState({ x: 1, y: 1 });
  const [avatar, setAvatar] = useState({ body: 0, head: 0, acc: 0 });

  useEffect(() => {
    // Cargar la configuración del avatar
    const savedAvatar = localStorage.getItem('kellogsAvatar');
    if (savedAvatar) {
      setAvatar(JSON.parse(savedAvatar));
    }

    // Animación de movimiento aleatorio
    const moveInterval = setInterval(() => {
      setPosition(prev => ({
        x: prev.x + direction.x * 0.2,
        y: prev.y + direction.y * 0.2
      }));
    }, 50);

    // Cambiar dirección aleatoriamente
    const directionInterval = setInterval(() => {
      setDirection({
        x: (Math.random() - 0.5) * 2,
        y: (Math.random() - 0.5) * 2
      });
    }, 3000);

    return () => {
      clearInterval(moveInterval);
      clearInterval(directionInterval);
    };
  }, [direction]);

  return (
    <div 
      className="absolute w-32 h-32 transition-transform duration-300 ease-in-out"
      style={{ 
        transform: `translate(${position.x}px, ${position.y}px)`,
        left: '50%',
        top: '50%',
      }}
    >
      <div className="relative w-full h-full">
        {/* Capa del cuerpo */}
        <img
          src={bodyOptions[avatar.body]}
          alt="Cuerpo"
          className="absolute inset-0 w-full h-full object-contain"
        />
        {/* Capa de la cabeza */}
        <img
          src={headOptions[avatar.head]}
          alt="Cabeza"
          className="absolute inset-0 w-full h-full object-contain"
        />
        {/* Capa de accesorios */}
        {accOptions[avatar.acc] && (
          <img
            src={accOptions[avatar.acc]}
            alt="Accesorio"
            className="absolute inset-0 w-full h-full object-contain"
          />
        )}
      </div>
    </div>
  );
};

export default FloatingAvatar; 