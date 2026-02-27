import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

const PhotoGrid = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const fetchPhotos = async () => {
    // 1. Usamos una técnica de "cache busting" más agresiva
    const url = `https://res.cloudinary.com/dczfai1zk/image/list/v${new Date().getTime()}/fiesta_sofia.json`;

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error();
      const data = await response.json();

      // 2. ORDENAR: Ponemos las fotos nuevas primero (created_at de forma descendente)
      const sortedPhotos = data.resources.sort((a, b) => {
        return new Date(b.created_at) - new Date(a.created_at);
      });

      setPhotos(sortedPhotos);
    } catch (error) {
      console.warn("Galería vacía o error de conexión.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
    // 3. Sincronización más frecuente para la fiesta (cada 15 segundos)
    const interval = setInterval(fetchPhotos, 15000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-pulse text-[#F8BBD0] font-parisienne text-3xl">Cargando magia...</div>
    </div>
  );

  return (
    <div className="w-full bg-black min-h-screen">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-0.5">
        {photos.map((photo) => (
          <div
            key={photo.public_id}
            className="relative aspect-square cursor-pointer overflow-hidden group"
            onClick={() => setSelectedPhoto(photo)}
          >
            <img
              src={`https://res.cloudinary.com/dczfai1zk/image/upload/w_600,h_600,c_fill,g_auto,f_auto,q_auto/v${photo.version}/${photo.public_id}.${photo.format}`}
              alt="XV Sofía"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
        ))}
      </div>

      {selectedPhoto && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex flex-col items-center justify-center animate-in fade-in duration-300"
          onClick={() => setSelectedPhoto(null)}
        >
          <button
            className="absolute top-6 right-6 text-white/70 hover:text-[#F8BBD0]"
            onClick={() => setSelectedPhoto(null)}
          >
            <X size={35} />
          </button>

          <div className="w-full h-full flex items-center justify-center p-4">
            <img
              src={`https://res.cloudinary.com/dczfai1zk/image/upload/f_auto,q_auto/v${selectedPhoto.version}/${selectedPhoto.public_id}.${selectedPhoto.format}`}
              className="max-w-full max-h-[90vh] object-contain rounded-sm shadow-2xl"
              alt="Momento ampliado"
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          <div className="absolute bottom-10">
            <p className="text-[#F8BBD0] font-parisienne text-2xl tracking-widest opacity-80">
              XV Sofía
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoGrid;