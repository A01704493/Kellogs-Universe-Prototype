import React, { useState } from 'react';

// Importar las imágenes de las capas
import body1 from '../assets/character/body1.png';
import body2 from '../assets/character/body2.png';
import head1 from '../assets/character/head1.png';
import head2 from '../assets/character/head2.png';
import accessory1 from '../assets/character/accessory1.png';
import accessory2 from '../assets/character/accessory2.png';

const AvatarCustomizer = () => {
  // Estado para las selecciones de capas
  const [selectedBody, setSelectedBody] = useState(body1);
  const [selectedHead, setSelectedHead] = useState(head1);
  const [selectedAccessory, setSelectedAccessory] = useState(accessory1);

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-4">Personaliza tu Avatar</h2>
      <div className="relative w-40 h-40">
        {/* Capa de cuerpo */}
        <img src={selectedBody} alt="Cuerpo" className="absolute w-full h-full" />
        {/* Capa de cabeza */}
        <img src={selectedHead} alt="Cabeza" className="absolute w-full h-full" />
        {/* Capa de accesorios */}
        <img src={selectedAccessory} alt="Accesorio" className="absolute w-full h-full" />
      </div>

      <div className="mt-4">
        <h3 className="text-lg font-semibold">Selecciona el Cuerpo</h3>
        <div className="flex gap-2 mt-2">
          <button onClick={() => setSelectedBody(body1)} className="p-2 border rounded">Cuerpo 1</button>
          <button onClick={() => setSelectedBody(body2)} className="p-2 border rounded">Cuerpo 2</button>
        </div>
      </div>

      <div className="mt-4">
        <h3 className="text-lg font-semibold">Selecciona la Cabeza</h3>
        <div className="flex gap-2 mt-2">
          <button onClick={() => setSelectedHead(head1)} className="p-2 border rounded">Cabeza 1</button>
          <button onClick={() => setSelectedHead(head2)} className="p-2 border rounded">Cabeza 2</button>
        </div>
      </div>

      <div className="mt-4">
        <h3 className="text-lg font-semibold">Selecciona el Accesorio</h3>
        <div className="flex gap-2 mt-2">
          <button onClick={() => setSelectedAccessory(accessory1)} className="p-2 border rounded">Accesorio 1</button>
          <button onClick={() => setSelectedAccessory(accessory2)} className="p-2 border rounded">Accesorio 2</button>
        </div>
      </div>
    </div>
  );
};

export default AvatarCustomizer; 