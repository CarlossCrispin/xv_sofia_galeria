import { useEffect, useState } from 'react';
import { X, Loader2 } from 'lucide-react';

const PhotoGrid = ({ setPhotoCount }) => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  // Estado para controlar la carga de la imagen DENTRO del modal [cite: 2025-09-23]
  const [isModalImageLoading, setIsModalImageLoading] = useState(false);

  const fetchPhotos = async () => {
    const cacheBuster = Math.random().toString(36).substring(7);
    const url = `https://res.cloudinary.com/dczfai1zk/image/list/v${cacheBuster}/fiesta_sofia.json`;

    try {
      const response = await fetch(url, { cache: 'no-store' });
      if (!response.ok) throw new Error();
      const data = await response.json();

      const sortedPhotos = data.resources.sort((a, b) =>
        new Date(b.created_at) - new Date(a.created_at)
      );

      setPhotos(sortedPhotos);
      if (setPhotoCount) setPhotoCount(sortedPhotos.length);
    } catch (error) {
      console.warn("Sincronizando galería...");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
    const interval = setInterval(fetchPhotos, 10000);
    return () => clearInterval(interval);
  }, []);

  // Función para abrir el modal activando el loader [cite: 2025-09-23]
  const handleOpenPhoto = (photo) => {
    setIsModalImageLoading(true); // Iniciamos el estado de carga
    setSelectedPhoto(photo);
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-pulse text-[#F8BBD0] font-serif text-2xl italic">Cargando...</div>
    </div>
  );

  return (
    <div className="w-full bg-black min-h-screen">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1">
        {photos.map((photo) => (
          <div
            key={photo.public_id}
            className="relative aspect-square cursor-pointer overflow-hidden active:scale-95 transition-transform"
            onClick={() => handleOpenPhoto(photo)}
          >
            <img
              src={`https://res.cloudinary.com/dczfai1zk/image/upload/w_600,h_600,c_fill,g_auto,f_auto,q_auto/v${photo.version}/${photo.public_id}.${photo.format}`}
              alt="XV Sofía"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        ))}
      </div>

      {/* MODAL CON OPTIMIZACIÓN DE CARGA [cite: 2026-01-12] */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => {
            setSelectedPhoto(null);
            setIsModalImageLoading(false);
          }}
        >
          <button className="absolute top-8 right-8 text-white/80 z-[110]">
            <X size={35} />
          </button>

          {/* MENSAJE DE CARGA (Se muestra mientras isModalImageLoading sea true) [cite: 2025-09-23] */}
          {isModalImageLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center z-[105]">
              <Loader2 className="animate-spin text-[#F8BBD0] mb-3" size={40} />
              <p className="text-[#F8BBD0] font-serif italic text-sm animate-pulse tracking-widest">
                REVELANDO MOMENTO...
              </p>
            </div>
          )}

          <img
            src={`https://res.cloudinary.com/dczfai1zk/image/upload/f_auto,q_auto/v${selectedPhoto.version}/${selectedPhoto.public_id}.${selectedPhoto.format}`}

            // Ocultamos la imagen hasta que esté cargada para evitar el efecto de barrido lento
            className={`max-w-full max-h-[85vh] object-contain shadow-2xl transition-opacity duration-500 ${isModalImageLoading ? 'opacity-0' : 'opacity-100'
              }`}

            // EVENTO CLAVE: Se dispara cuando la imagen termina de bajar al móvil [cite: 2025-09-23]
            onLoad={() => setIsModalImageLoading(false)}

            onClick={(e) => e.stopPropagation()}
          />

          <div className="absolute bottom-10 pointer-events-none">
            <p className="text-[#F8BBD0]/30 font-serif text-xl tracking-[0.4em] uppercase">
              XV Sofía
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoGrid;