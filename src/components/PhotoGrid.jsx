import { useEffect, useState } from 'react';

const PhotoGrid = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPhotos = async () => {
    // IMPORTANTE: v${Date.now()} rompe el caché para que si alguien sube una foto, 
    // aparezca al actualizar sin esperar a Cloudinary.
    const url = `https://res.cloudinary.com/dczfai1zk/image/list/v${Date.now()}/fiesta_sofia.json`;

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Aún no hay fotos con este tag");

      const data = await response.json();
      setPhotos(data.resources || []);
    } catch (error) {
      console.warn("Galería vacía o configuración de 'Resource List' pendiente.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
    // Actualización automática cada 20 segundos (UX ideal para fiestas)
    const interval = setInterval(fetchPhotos, 20000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse text-[#D4AF37]">Cargando galería...</div>
      </div>
    );
  }

  return (
    <div className="p-4 pb-28"> {/* pb-28 para que el botón flotante no tape fotos */}
      {photos.length > 0 ? (
        <div className="columns-2 md:columns-3 gap-3 space-y-3">
          {photos.map((photo) => (
            <div key={photo.public_id} className="break-inside-avoid">
              <img
                // Optimizamos: w_500 (ancho), q_auto (calidad), f_auto (formato ligero como WebP)
                src={`https://res.cloudinary.com/dczfai1zk/image/upload/w_500,q_auto,f_auto/v${photo.version}/${photo.public_id}.${photo.format}`}
                alt="Momento de la fiesta"
                className="rounded-xl shadow-lg border border-white/10 w-full h-auto hover:opacity-90 transition-opacity"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/20">
          <p className="text-gray-400">¡Nadie ha subido fotos aún!</p>
          <p className="text-[#D4AF37] text-sm mt-2">Sé el primero en compartir un momento</p>
        </div>
      )}
    </div>
  );
};

export default PhotoGrid;