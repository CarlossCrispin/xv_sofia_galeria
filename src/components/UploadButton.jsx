import { Camera } from 'lucide-react';

const UploadButton = ({ onUploadSuccess }) => {
  const openWidget = () => {
    if (!window.cloudinary) {
      alert("Cargando servicios de imagen... intenta de nuevo.");
      return;
    }

    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: 'dczfai1zk',
        uploadPreset: 'xv_sofia_galeria',
        // --- ADAPTACIÓN DE CARPETA Y TAGS ---
        folder: 'fotos_xv_sofia', // <--- Se crea esta carpeta automáticamente en Cloudinary
        tags: ['fiesta_sofia'],    // Sigue siendo necesario para que el PhotoGrid las encuentre
        // ------------------------------------
        sources: ['camera', 'local'],
        multiple: false,
        language: "es",
        styles: {
          palette: {
            window: "#0F172A",
            sourceBg: "#0F172A",
            windowBorder: "#D4AF37",
            tabIcon: "#D4AF37",
            inactiveTabIcon: "#8E9EB1",
            menuIcons: "#D4AF37",
            link: "#FFB6C1",
            action: "#D4AF37",
            inProgress: "#FFB6C1",
            complete: "#20B832",
            error: "#EA3546",
            textDark: "#000000",
            textLight: "#FFFFFF"
          }
        }
      },
      (error, result) => {
        if (!error && result && result.event === "success") {
          console.log("¡Foto guardada en carpeta!", result.info.secure_url);
          if (onUploadSuccess) {
            onUploadSuccess(result.info);
          }
        }
      }
    );

    widget.open();
  };

  return (
    <div className="fixed bottom-8 left-0 right-0 flex justify-center px-4 z-50">
      <button
        onClick={openWidget}
        className="bg-[#D4AF37] text-pink-400 font-bold py-4 px-8 rounded-full shadow-2xl flex items-center gap-3 transform active:scale-95 transition-all w-full max-w-xs justify-center"
      >
        <Camera size={24} />
        <span>Subir Foto de la Fiesta</span>
      </button>
    </div>
  );
};

export default UploadButton;