import { Camera, Loader2, Lock } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';

const UploadButton = ({ onUploadSuccess }) => {
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isEventExpired, setIsEventExpired] = useState(false);

  const EXPIRATION_DATE = new Date('2026-03-08T23:59:59');

  useEffect(() => {
    const checkStatus = () => {
      const now = new Date();
      if (now > EXPIRATION_DATE) {
        setIsEventExpired(true);
      }
    };
    checkStatus();
    const interval = setInterval(checkStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleFileChange = async (event) => {
    if (isEventExpired) return;
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'xv_sofia_galeria');
    formData.append('folder', 'fotos_xv_sofia');
    formData.append('tags', 'fiesta_sofia');

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/dczfai1zk/image/upload`,
        { method: 'POST', body: formData }
      );
      if (response.ok) {
        setTimeout(() => {
          if (onUploadSuccess) onUploadSuccess();
          window.location.reload();
        }, 2000);
      }
    } catch (error) {
      console.error("Error al subir:", error);
      setIsUploading(false);
    }
  };

  if (isEventExpired) {
    return (
      <div className="fixed bottom-8 left-0 right-0 flex justify-center px-6 z-50 animate-in fade-in duration-500">
        <div className="w-full max-w-sm bg-zinc-900/90 backdrop-blur-md text-zinc-500 font-bold py-4 rounded-full border border-white/5 flex items-center justify-center gap-3 shadow-xl">
          <Lock size={18} className="opacity-50" />
          <span className="uppercase tracking-[0.2em] text-[10px]">Galería Cerrada</span>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-8 left-0 right-0 flex justify-center px-6 z-50">
      <input
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
        disabled={isUploading}
      />

      <button
        onClick={() => !isUploading && fileInputRef.current.click()}
        disabled={isUploading}
        className={`
          w-full max-w-sm
          text-black font-bold py-4 rounded-full border-pink-100 border-4
          flex items-center justify-center gap-3 
          transition-all duration-300 ease-out
          
          /* ESTADOS DINÁMICOS [cite: 2025-09-23] */
          ${isUploading
            ? 'bg-zinc-800 cursor-not-allowed border-zinc-700'
            : 'bg-[#F8BBD0] hover:bg-[#fbcbdc] hover:-translate-y-1 hover:shadow-[0_15px_45px_rgba(248,187,208,0.4)] active:scale-95 cursor-pointer shadow-[0_10px_40px_rgba(248,187,208,0.2)]'
          }
        `}
      >
        {isUploading ? (
          <>
            <Loader2 className="animate-spin" size={24} />
            <span className="uppercase tracking-widest text-xs">Guardando Magia...</span>
          </>
        ) : (
          <>
            <Camera size={24} />
            <span className="uppercase tracking-widest text-xs">Subir Foto</span>
          </>
        )}
      </button>
    </div>
  );
};

export default UploadButton;