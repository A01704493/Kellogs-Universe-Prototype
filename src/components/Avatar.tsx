import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface AvatarPart {
  id: string;
  name: string;
  options: {
    id: string;
    name: string;
    src: string;
  }[];
}

const Avatar = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('Aventurero');
  
  // Estado para cada parte del avatar
  const [selectedHead, setSelectedHead] = useState('head1');
  const [selectedBody, setSelectedBody] = useState('body1');
  const [selectedAccessory, setSelectedAccessory] = useState('');

  // Definición de partes de avatar disponibles
  const avatarParts: AvatarPart[] = [
    {
      id: 'head',
      name: 'Cabeza',
      options: [
        { id: 'head1', name: 'Estilo 1', src: '/avatar/head1.png' },
        { id: 'head2', name: 'Estilo 2', src: '/avatar/head2.png' },
        { id: 'head3', name: 'Estilo 3', src: '/avatar/head3.png' },
      ]
    },
    {
      id: 'body',
      name: 'Cuerpo',
      options: [
        { id: 'body1', name: 'Estilo 1', src: '/avatar/body1.png' },
        { id: 'body2', name: 'Estilo 2', src: '/avatar/body2.png' },
        { id: 'body3', name: 'Estilo 3', src: '/avatar/body3.png' },
      ]
    },
    {
      id: 'accessory',
      name: 'Accesorios',
      options: [
        { id: '', name: 'Ninguno', src: '' },
        { id: 'acc1', name: 'Gafas Cool', src: '/avatar/acc1.png' },
        { id: 'acc2', name: 'Sombrero', src: '/avatar/acc2.png' },
        { id: 'acc3', name: 'Corbata', src: '/avatar/acc3.png' },
      ]
    }
  ];

  useEffect(() => {
    // Recuperar nombre de usuario del localStorage
    const savedUsername = localStorage.getItem('kellogsUsername');
    if (savedUsername) {
      setUsername(savedUsername);
    }

    // Recuperar configuración guardada del avatar
    const savedHead = localStorage.getItem('kellogsAvatarHead') || 'head1';
    const savedBody = localStorage.getItem('kellogsAvatarBody') || 'body1';
    const savedAccessory = localStorage.getItem('kellogsAvatarAccessory') || '';

    setSelectedHead(savedHead);
    setSelectedBody(savedBody);
    setSelectedAccessory(savedAccessory);
  }, []);

  const handlePartChange = (partId: string, optionId: string) => {
    switch (partId) {
      case 'head':
        setSelectedHead(optionId);
        localStorage.setItem('kellogsAvatarHead', optionId);
        break;
      case 'body':
        setSelectedBody(optionId);
        localStorage.setItem('kellogsAvatarBody', optionId);
        break;
      case 'accessory':
        setSelectedAccessory(optionId);
        localStorage.setItem('kellogsAvatarAccessory', optionId);
        break;
    }
  };

  const handleGoBack = () => {
    navigate('/menu');
  };

  return (
    <div className="h-full w-full bg-background p-4 overflow-auto">
      <header className="mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-display text-primary">Personaliza tu Avatar</h1>
          <button 
            onClick={handleGoBack}
            className="btn btn-primary"
          >
            Volver al Menú
          </button>
        </div>
        <p className="text-gray-600">Hola, {username}! Personaliza tu apariencia.</p>
      </header>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Vista previa del avatar */}
        <div className="card flex flex-col items-center justify-center p-8">
          <h2 className="text-xl font-display text-primary mb-4">Tu Avatar</h2>
          <div className="w-48 h-48 bg-gray-200 rounded-full flex items-center justify-center mb-4">
            {/* Aquí iría la visualización del avatar con las partes seleccionadas */}
            <div className="text-center text-gray-500">
              Vista previa
              <div className="text-xs">
                Cabeza: {selectedHead}<br />
                Cuerpo: {selectedBody}<br />
                Accesorio: {selectedAccessory || 'Ninguno'}
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-600 text-center">
            La visualización del avatar es simplificada en esta demo
          </p>
        </div>

        {/* Selector de partes */}
        <div className="space-y-6">
          {avatarParts.map(part => (
            <div key={part.id} className="card">
              <h3 className="text-lg font-display text-primary mb-3">{part.name}</h3>
              <div className="grid grid-cols-3 gap-2">
                {part.options.map(option => (
                  <button
                    key={option.id}
                    className={`p-2 rounded-lg border-2 transition-colors ${
                      (part.id === 'head' && selectedHead === option.id) ||
                      (part.id === 'body' && selectedBody === option.id) ||
                      (part.id === 'accessory' && selectedAccessory === option.id)
                        ? 'border-primary bg-primary/10'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handlePartChange(part.id, option.id)}
                  >
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full mb-1 flex items-center justify-center">
                        {option.id ? (
                          <span className="text-xs text-gray-400">{option.id}</span>
                        ) : (
                          <span className="text-xs text-gray-400">Ninguno</span>
                        )}
                      </div>
                      <div className="text-xs">{option.name}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Avatar; 