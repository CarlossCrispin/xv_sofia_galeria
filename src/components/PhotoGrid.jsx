import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

const PhotoGrid = ({ setPhotoCount }) => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const fetchPhotos = async () => {
    // 1. Generamos un timestamp único para cada petición para saltar el caché
    const cacheBuster = new Date().getTime();
    const url = `https://res.cloudinary.com/dczfai1zk/image/list/v${cacheBuster}/fiesta_sofia.json`;
    
    try {
      // 2. Agregamos headers para evitar que el navegador guarde la respuesta
      const response = await fetch(url, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      if (!response.ok) throw new Error();
      const data = await response.json();
      
      // 3. Ordenamos por fecha de creación (las más nuevas arriba) [cite: 2026-01-12]
      const sortedPhotos = data.resources.sort((a, b) => {
        return new Date(b.created_at) - new Date(a.created_at);
      });

      setPhotos(sortedPhotos);
      if (setPhotoCount) setPhotoCount(sortedPhotos.length);
    } catch (error) {
      console.warn("Esperando actualización de lista en Cloudinary...");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
    // 4. Intervalo de 10 segundos para que la fiesta se sienta "En Vivo" [cite: 2025-09-23]
    const interval = setInterval(fetchPhotos, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-pulse text-[#F8BBD0] font-serif text-xl">Sincronizando momentos...</div>
    </div>
  );

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1">
      {photos.map((photo) => (
        <div 
          key={photo.public_id} 
          className="relative aspect-square cursor-pointer bg-gray-900 overflow-hidden group"
          onClick={() => setSelectedPhoto(photo)}
        >
          <img
            src={`https://res.cloudinary.com/dczfai1zk/image/upload/w_600,h_600,c_fill,g_auto,f_auto,q_auto/v${photo.version}/${photo.public_id}.${photo.format}`}
            className="w-full h-full object-cover transition-opacity duration-300 group-active:opacity-70"
            alt="XV Sofía"
          />
        </div>
      ))}

      {/* Modal de visualización que ya tenías */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center p-4" onClick={() => setSelectedPhoto(null)}>
          <button className="absolute top-6 right-6 text-white"><X size={32} /></button>
          <img
            src={`https://res.cloudinary.com/dczfai1zk/image/upload/f_auto,q_auto/v${selectedPhoto.version}/${selectedPhoto.public_id}.${selectedPhoto.format}`}
            className="max-w-full max-h-[90vh] object-contain shadow-2xl"
          />
        </div>
      )}
    </div>
  );
};

export default PhotoGrid;