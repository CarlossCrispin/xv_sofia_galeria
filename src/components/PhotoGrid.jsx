import { useEffect, useState } from 'react';
import { X, Loader2 } from 'lucide-react'; // Importamos el spinner [cite: 2025-09-23]

const PhotoGrid = ({ setPhotoCount }) => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  // ESTADO CLAVE: Controla la carga de la imagen ampliada [cite: 2025-09-23]
  const [isImageInModalLoading, setIsImageInModalLoading] = useState(false);

  const fetchPhotos = async () => {
    const cacheBuster = Math.random().toString(36).substring(7);
    const url = `https://res.cloudinary.com/dczfai1zk/image/list/v${cacheBuster}/fiesta_sofia.json`;

    try {
      const response = await fetch(url, { cache: 'no-store' });
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
    const interval = setInterval(fetchPhotos, 10000); // 10s
    return () => clearInterval(interval);
  }, []);

  // Función para abrir el modal [cite: 2025-09-23]
  const handlePhotoClick = (photo) => {
    setIsImageInModalLoading(true); // 1. Activamos el loader ANTES de abrir [cite: 2025-09-23]
    setSelectedPhoto(photo);
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-pulse text-[#F8BBD0] font-serif text-2xl italic">Cargando momentos...</div>
    </div>
  );

  return (
    <div className="w-full bg-black min-h-screen">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1">
        {photos.map((photo) => (
          <div
            key={photo.public_id}
            className="relative aspect-square cursor-pointer overflow-hidden active:scale-95 transition-transform"
            onClick={() => handlePhotoClick(photo)} // Usamos la nueva función [cite: 2025-09-23]
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

      {/* MODAL CON FEEDBACK DE CARGA [cite: 2026-01-12] */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-4 animate-in fade-in duration-300"
          onClick={() => {
            setSelectedPhoto(null);
            setIsImageInModalLoading(false); // Reset al cerrar
          }}
        >
          {/* Botón X siempre visible [cite: 2026-01-12] */}
          <button className="absolute top-8 right-8 text-white/70 hover:text-white z-[110]">
            <X size={35} />
          </button>

          <div className="w-full h-full flex items-center justify-center p-4 relative">

            {/* 2. LOADER: Se muestra si isImageInModalLoading es true [cite: 2025-09-23] */}
            {isImageInModalLoading && (
              <div className="absolute inset-0 flex flex-col gap-3 justify-center items-center text-[#F8BBD0]/90 z-[105]">
                <Loader2 className="animate-spin" size={42} />
                <p className="font-serif text-xl italic text-gray-400 animate-pulse tracking-wide">
                  Revelando recuerdo...
                </p>
              </div>
            )}

            <img
              src={`https://res.cloudinary.com/dczfai1zk/image/upload/f_auto,q_auto/v${selectedPhoto.version}/${selectedPhoto.public_id}.${selectedPhoto.format}`}

              // Ocultamos la imagen hasta que esté cargada para evitar el barrido lento [cite: 2025-09-23]
              className={`max-w-full max-h-[85vh] object-contain rounded-sm shadow-2xl transition-opacity duration-500 
                ${isImageInModalLoading ? 'opacity-0' : 'opacity-100'}`}

              alt="Momento ampliado"

              // 3. EVENTO CLAVE: Apaga el loader cuando la imagen termina de descargar [cite: 2025-09-23]
              onLoad={() => setIsImageInModalLoading(false)}

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