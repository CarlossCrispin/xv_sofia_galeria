import { useEffect, useState } from 'react';
import { X, Loader2 } from 'lucide-react'; // Importamos el icono de carga [cite: 2025-09-23]

const PhotoGrid = ({ setPhotoCount }) => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  // ESTADO CLAVE: Para saber si la imagen del modal está cargando [cite: 2025-09-23]
  const [isModalImageLoading, setIsModalImageLoading] = useState(false);

  // ... (tu función fetchPhotos sigue igual) ...
  const fetchPhotos = async () => {
    // (Lógica de fetch, sortedPhotos, setPhotoCount, etc.)
  };

  useEffect(() => {
    fetchPhotos();
    const interval = setInterval(fetchPhotos, 10000);
    return () => clearInterval(interval);
  }, []);

  // Función para abrir el modal [cite: 2025-09-23]
  const handleOpenModal = (photo) => {
    // 1. Activamos el loader antes de abrir [cite: 2025-09-23]
    setIsModalImageLoading(true);
    setSelectedPhoto(photo);
  };

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
            className="relative aspect-square cursor-pointer overflow-hidden group active:scale-95 transition-transform"
            onClick={() => handleOpenModal(photo)} // Usamos la nueva función [cite: 2025-09-23]
          >
            <img
              // Usamos q_auto,f_auto para ahorrar datos en móviles [cite: 2026-01-12]
              src={`https://res.cloudinary.com/dczfai1zk/image/upload/w_500,h_500,c_fill,g_auto,f_auto,q_auto/v${photo.version}/${photo.public_id}.${photo.format}`}
              alt="XV Sofía"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        ))}
      </div>

      {/* MODAL OPTIMIZADO PARA UX MOBILE [cite: 2026-01-12] */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex flex-col items-center justify-center animate-in fade-in duration-300"
          onClick={() => setSelectedPhoto(null)}
        >
          <button className="absolute top-6 right-6 text-white/70" onClick={() => setSelectedPhoto(null)}>
            <X size={35} />
          </button>

          <div className="w-full h-full flex items-center justify-center p-4 relative">

            {/* LOADER: Aparece solo si isModalImageLoading es true [cite: 2025-09-23] */}
            {isModalImageLoading && (
              <div className="absolute inset-0 flex flex-col gap-3 justify-center items-center text-[#F8BBD0]/80">
                <Loader2 className="animate-spin" size={40} />
                <p className="font-serif text-lg text-gray-400">Ampliando momento...</p>
              </div>
            )}

            <img
              // Imagen de ALTA CALIDAD para el modal [cite: 2026-01-12]
              src={`https://res.cloudinary.com/dczfai1zk/image/upload/f_auto,q_auto/v${selectedPhoto.version}/${selectedPhoto.public_id}.${selectedPhoto.format}`}

              // Si está cargando, ocultamos la imagen para no ver el "trazo" [cite: 2025-09-23]
              className={`max-w-full max-h-[85vh] object-contain rounded-sm shadow-2xl transition-opacity duration-300 
                ${isModalImageLoading ? 'opacity-0' : 'opacity-100'}`}

              alt="Momento ampliado"

              // EVENTO CLAVE: Desactiva el loader cuando la imagen termina de descargar [cite: 2025-09-23]
              onLoad={() => setIsModalImageLoading(false)}

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