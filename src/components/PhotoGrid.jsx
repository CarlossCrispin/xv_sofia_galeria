import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

const PhotoGrid = ({ setPhotoCount }) => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const fetchPhotos = async () => {
    const url = `https://res.cloudinary.com/dczfai1zk/image/list/v${new Date().getTime()}/fiesta_sofia.json`;
    try {
      const response = await fetch(url);
      const data = await response.json();

      const sortedPhotos = data.resources.sort((a, b) =>
        new Date(b.created_at) - new Date(a.created_at)
      );

      setPhotos(sortedPhotos);
      // Actualizamos el contador en el header [cite: 2025-09-23]
      setPhotoCount(sortedPhotos.length);
    } catch (e) {
      console.warn("Galería vacía");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
    const interval = setInterval(fetchPhotos, 15000);
    return () => clearInterval(interval);
  }, []);

  // ... (mismo código de renderizado de la grilla y modal que ya tienes)
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-0.5">
      {photos.map((photo) => (
        <div key={photo.public_id} onClick={() => setSelectedPhoto(photo)} className="aspect-square overflow-hidden">
          <img
            src={`https://res.cloudinary.com/dczfai1zk/image/upload/w_600,c_fill,g_auto,f_auto,q_auto/v${photo.version}/${photo.public_id}.${photo.format}`}
            className="w-full h-full object-cover"
          />
        </div>
      ))}
      {/* (Modal sigue aquí) */}
    </div>
  );
};

export default PhotoGrid;