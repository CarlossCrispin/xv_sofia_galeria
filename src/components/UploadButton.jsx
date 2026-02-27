import { Camera, Loader2 } from 'lucide-react'; // Añadimos Loader2
import { useRef, useState } from 'react';

const UploadButton = ({ onUploadSuccess }) => {
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false); // ESTADO DE CARGA

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true); // Bloqueamos el botón y mostramos feedback

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'xv_sofia_galeria');
    formData.append('folder', 'fotos_xv_sofia');

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/dczfai1zk/image/upload`,
        { method: 'POST', body: formData }
      );

      if (response.ok) {
        // Un pequeño delay para que Cloudinary termine de indexar la etiqueta
        setTimeout(() => {
          if (onUploadSuccess) onUploadSuccess();
          window.location.reload();
        }, 1500);
      } else {
        throw new Error("Fallo en la subida");
      }
    } catch (error) {
      console.error("Error al subir:", error);
      alert("Error al subir. Intenta de nuevo.");
      setIsUploading(false); // Liberamos el botón si falla
    }
  };

  return (
    <div className="fixed bottom-8 left-0 right-0 flex justify-center px-6 z-50">
      <input
        type="file"
        accept="image/jpeg,image/png,image/jpg" // Más específico
        capture="environment"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />

      <button
        onClick={() => !isUploading && fileInputRef.current.click()}
        disabled={isUploading}
        className={`
          w-full max-w-sm
          ${isUploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#F8BBD0]'} 
          text-black font-bold text-lg py-4 rounded-full 
          shadow-[0_10px_40px_rgba(248,187,208,0.4)] 
          flex items-center justify-center gap-3 
          active:scale-95 transition-all
        `}
      >
        {isUploading ? (
          <>
            <Loader2 className="animate-spin" size={26} />
            <span className="uppercase tracking-widest text-sm">Guardando Magia...</span>
          </>
        ) : (
          <>
            <Camera size={26} />
            <span className="uppercase tracking-widest text-sm text-black">Capturar Momento</span>
          </>
        )}
      </button>
    </div>
  );
};

export default UploadButton;