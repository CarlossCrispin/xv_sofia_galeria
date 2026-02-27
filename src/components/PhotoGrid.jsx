import { useEffect, useState } from 'react';
import { X, Loader2, CameraOff } from 'lucide-react';

const PhotoGrid = ({ setPhotoCount }) => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [isImageInModalLoading, setIsImageInModalLoading] = useState(false);

  const fetchPhotos = async () => {
    // Usamos un cache buster aleatorio para evitar el 404 cacheado del navegador [cite: 2026-01-12]
    const cacheBuster = Math.random().toString(36).substring(7);
    const url = `https://res.cloudinary.com/dczfai1zk/image/list/v${cacheBuster}/fiesta_sofia.json`;

    try {
      const response = await fetch(url, { cache: 'no-store' });

      if (response.status === 404) {
        console.error("Error 404: ¿Activaste 'Resource list' en Cloudinary?");
        setPhotos([]);
        return;
      }

      const data = await response.json();
      const sortedPhotos = data.resources.sort((a, b) =>
        new Date(b.created_at) - new Date(a.created_at)
      );

      setPhotos(sortedPhotos);
      if (setPhotoCount) setPhotoCount(sortedPhotos.length);
    } catch (error) {
      console.warn("Esperando fotos...");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
    const interval = setInterval(fetchPhotos, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center h-64 text-[#F8BBD0]">
      <Loader2 className="animate-spin mr-2" />
      <span className="font-serif italic text-xl">Preparando galería...</span>
    </div>
  );

  // UX: Si no hay fotos, mostramos un mensaje motivador [cite: 2025-09-23, 2026-01-12]
  if (photos.length === 0) return (
    <div className="flex flex-col items-center justify-center h-64 text-gray-500 border-2 border-dashed border-white/5 rounded-2xl m-4">
      <CameraOff size={48} className="mb-4 opacity-20" />
      <p className="font-serif italic text-lg">Sé el primero en capturar un momento</p>
    </div>
  );

  return (
    <div className="w-full bg-black min-h-screen">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1">
        {photos.map((photo) => (
          <div
            key={photo.public_id}
            className="relative aspect-square cursor-pointer overflow-hidden active:scale-95 transition-transform"
            onClick={() => {
              setIsImageInModalLoading(true);
              setSelectedPhoto(photo);
            }}
          >
            <img
              src={`https://res.cloudinary.com/dczfai1zk/image/upload/w_600,h_600,c_fill,g_auto,f_auto,q_auto/v${photo.version}/${photo.public_id}.${photo.format}`}
              alt="XV Sofía"
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      {selectedPhoto && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-4"
          onClick={() => {
            setSelectedPhoto(null);
            setIsImageInModalLoading(false);
          }}
        >
          <button className="absolute top-8 right-8 text-white/70 z-[110]"><X size={35} /></button>

          <div className="w-full h-full flex items-center justify-center p-4 relative">
            {isImageInModalLoading && (
              <div className="absolute inset-0 flex flex-col gap-3 justify-center items-center text-[#F8BBD0]/90 z-[105]">
                <Loader2 className="animate-spin" size={42} />
                <p className="font-serif text-xl italic text-gray-400">Revelando recuerdo...</p>
              </div>
            )}

            <img
              src={`https://res.cloudinary.com/dczfai1zk/image/upload/f_auto,q_auto/v${selectedPhoto.version}/${selectedPhoto.public_id}.${selectedPhoto.format}`}
              className={`max-w-full max-h-[85vh] object-contain transition-opacity duration-500 ${isImageInModalLoading ? 'opacity-0' : 'opacity-100'}`}
              onLoad={() => setIsImageInModalLoading(false)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoGrid;