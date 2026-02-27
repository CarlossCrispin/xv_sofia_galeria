import { Camera } from 'lucide-react';
import { useRef } from 'react';

const UploadButton = ({ onUploadSuccess }) => {
  const fileInputRef = useRef(null);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Mostramos un mensaje de carga sencillo
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
        if (onUploadSuccess) onUploadSuccess();
        window.location.reload(); // Recargamos para ver la foto
      }
    } catch (error) {
      console.error("Error al subir:", error);
      alert("Hubo un error al subir la foto");
    }
  };

  return (
    <div className="fixed bottom-8 left-0 right-0 flex justify-center px-6 z-50">
      {/* Input oculto con 'capture' para forzar la cámara nativa */}
      <input
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />

      <button
        onClick={() => fileInputRef.current.click()}
        className="
          w-full max-w-sm
          bg-[#F8BBD0] text-black 
          font-bold text-lg py-4 rounded-full 
          shadow-[0_10px_40px_rgba(248,187,208,0.4)] 
          flex items-center justify-center gap-3 
          active:scale-95 transition-transform
        "
      >
        <Camera size={26} />
        <span className="uppercase tracking-widest text-sm">Capturar Momento</span>
      </button>
    </div>
  );
};

export default UploadButton;