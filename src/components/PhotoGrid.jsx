import { useEffect, useState } from 'react';
import { X, Loader2 } from 'lucide-react';

const PhotoGrid = ({ setPhotoCount }) => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  // Estado para controlar el mensaje de carga en el modal
  const [isImageLoading, setIsImageLoading] = useState(false);

  const fetchPhotos = async () => {
    const cacheBuster = new Date().getTime();
    const url = `https://res.cloudinary.com/dczfai1zk/image/list/v${cacheBuster}/fiesta_sofia.json`;

    try {
      const response = await fetch(url, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });

      if (!response.ok) throw new Error();
      const data = await response.json();

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
    const interval = setInterval(fetchPhotos, 10000);
    return () => clearInterval(interval);
  }, []);

  // Función para manejar el clic y forzar el loader
  const handlePhotoClick = (photo) => {
    setIsImageLoading(true); // Iniciamos el mensaje de carga inmediatamente
    setSelectedPhoto(photo);
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-pulse text-[#F8BBD0] font-serif text-xl italic">Sincronizando momentos...</div>
    </div>
  );

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1">
      {photos.map((photo) => (
        <div
          key={photo.public_id}
          className="relative aspect-square cursor-pointer bg-gray-900 overflow-hidden group active:scale-95 transition-transform"
          onClick={() => handlePhotoClick(photo)}
        >
          <img
            src={`https://res.cloudinary.com/dczfai1zk/image/upload/w_600,h_600,c_fill,g_auto,f_auto,q_auto/v${photo.version}/${photo.public_id}.${photo.format}`}
            className="w-full h-full object-cover transition-opacity duration-300 group-active:opacity-70"
            alt="XV Sofía"
          />
        </div>
      ))}

      {/* Modal con Loader de Imagen */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => {
            setSelectedPhoto(null);
            setIsImageLoading(false); // Reseteamos al cerrar
          }}
        >
          <button className="absolute top-6 right-6 text-white/80 z-[110]">
            <X size={32} />
          </button>

          {/* MENSAJE DE CARGA: Visible solo cuando isImageLoading es true */}
          {isImageLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center z-[105] bg-black">
              <Loader2 className="animate-spin text-[#F8BBD0] mb-4" size={40} />
              <p className="text-[#F8BBD0] font-serif italic text-xl animate-pulse tracking-widest">
                Revelando momento...
              </p>
            </div>
          )}

          <img
            src={`https://res.cloudinary.com/dczfai1zk/image/upload/f_auto,q_auto/v${selectedPhoto.version}/${selectedPhoto.public_id}.${selectedPhoto.format}`}

            // La imagen es invisible hasta que onLoad se dispara
            className={`max-w-full max-h-[90vh] object-contain shadow-2xl transition-opacity duration-500 ${isImageLoading ? 'opacity-0' : 'opacity-100'
              }`}

            // Evento que detecta cuando la imagen ya bajó al celular
            onLoad={() => setIsImageLoading(false)}

            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};

export default PhotoGrid;