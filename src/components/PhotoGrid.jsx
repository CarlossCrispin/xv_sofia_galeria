import { useEffect, useState } from 'react';
import { X, Loader2 } from 'lucide-react';

const PhotoGrid = ({ setPhotoCount }) => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  // Estado para el loader del modal
  const [isImageLoading, setIsImageLoading] = useState(false);

  const fetchPhotos = async () => {
    // Cache busting para asegurar que las últimas fotos aparezcan
    const cacheBuster = Math.random().toString(36).substring(7);
    const url = `https://res.cloudinary.com/dczfai1zk/image/list/v${cacheBuster}/fiesta_sofia.json`;

    try {
      const response = await fetch(url, { cache: 'no-store' });
      if (!response.ok) throw new Error();
      const data = await response.json();

      // Orden cronológico descendente (lo nuevo primero)
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
    const interval = setInterval(fetchPhotos, 10000); // 10s para mantenerlo vivo
    return () => clearInterval(interval);
  }, []);

  // Función para abrir el modal reseteando el loader
  const handlePhotoClick = (photo) => {
    setIsImageLoading(true);
    setSelectedPhoto(photo);
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-pulse text-[#F8BBD0] font-serif text-2xl italic">Iniciando magia...</div>
    </div>
  );

  return (
    <div className="w-full bg-black min-h-screen">
      {/* Grid de fotos optimizado para pulgar (Mobile-First) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1">
        {photos.map((photo) => (
          <div
            key={photo.public_id}
            className="relative aspect-square cursor-pointer overflow-hidden active:scale-95 transition-transform"
            onClick={() => handlePhotoClick(photo)}
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

      {/* MODAL CON LOADER INTEGRADO */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => {
            setSelectedPhoto(null);
            setIsImageLoading(false);
          }}
        >
          {/* Botón de cierre con prioridad visual */}
          <button className="absolute top-8 right-8 text-white/80 z-[110]">
            <X size={35} />
          </button>

          {/* Loader específico para la imagen ampliada */}
          {isImageLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center z-[105]">
              <Loader2 className="animate-spin text-[#F8BBD0] mb-4" size={40} />
              <p className="text-[#F8BBD0] font-serif italic text-sm animate-pulse tracking-widest">
                REVELANDO MOMENTO
              </p>
            </div>
          )}

          <img
            src={`https://res.cloudinary.com/dczfai1zk/image/upload/f_auto,q_auto/v${selectedPhoto.version}/${selectedPhoto.public_id}.${selectedPhoto.format}`}

            // La imagen solo aparece cuando onLoad se dispara
            className={`max-w-full max-h-[85vh] object-contain shadow-2xl transition-opacity duration-500 ${isImageLoading ? 'opacity-0' : 'opacity-100'
              }`}

            onLoad={() => setIsImageLoading(false)}
            onClick={(e) => e.stopPropagation()}
          />

          {/* Pie de foto elegante opcional */}
          <div className="absolute bottom-10 pointer-events-none">
            <p className="text-[#F8BBD0] font-serif text-xl tracking-[0.3em] opacity-40 uppercase">
              XV Sofía
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoGrid;