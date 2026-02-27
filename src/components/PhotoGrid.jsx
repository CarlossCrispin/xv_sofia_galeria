import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

const PhotoGrid = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const fetchPhotos = async () => {
    const url = `https://res.cloudinary.com/dczfai1zk/image/list/v${Date.now()}/fiesta_sofia.json`;
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error();
      const data = await response.json();
      setPhotos(data.resources);
    } catch (error) {
      console.warn("Galería vacía o error de conexión.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
    const interval = setInterval(fetchPhotos, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-pulse text-[#F8BBD0] font-parisienne text-3xl">Cargando magia...</div>
    </div>
  );

  return (
    <div className="w-full bg-black min-h-screen">
      {/* Grid de fotos sin distracciones */}
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
              loading="lazy"
            />
          </div>
        ))}
      </div>

      {/* MODAL SIMPLIFICADO */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex flex-col items-center justify-center animate-in fade-in duration-300"
          onClick={() => setSelectedPhoto(null)}
        >
          <button
            className="absolute top-6 right-6 text-white/70 hover:text-[#F8BBD0] transition-colors"
            onClick={() => setSelectedPhoto(null)}
          >
            <X size={35} />
          </button>

          <div className="w-full h-full flex items-center justify-center p-4">
            <img
              src={`https://res.cloudinary.com/dczfai1zk/image/upload/f_auto,q_auto/v${selectedPhoto.version}/${selectedPhoto.public_id}.${selectedPhoto.format}`}
              className="max-w-full max-h-[90vh] object-contain rounded-sm shadow-2xl shadow-[#F8BBD0]/5"
              alt="Momento ampliado"
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {/* Pie de foto elegante con fuente Parisienne */}
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