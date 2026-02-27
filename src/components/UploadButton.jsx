import { Camera } from 'lucide-react';

const UploadButton = ({ onUploadSuccess }) => {
  const openWidget = () => {
    if (!window.cloudinary) {
      console.error("Cloudinary no está cargado");
      return;
    }

    window.cloudinary.openUploadWidget(
      {
        cloudName: 'dczfai1zk',
        uploadPreset: 'xv_sofia_galeria',
        folder: 'fotos_xv_sofia',

        // --- CONFIGURACIÓN CRÍTICA PARA ESPAÑOL ---
        language: "es",
        text: {
          es: {
            menu: {
              camera: "Cámara",
              local: "Mis Archivos"
            },
            camera: {
              capture: "Tomar Foto",
              cancel: "Cancelar",
              take_pic: "Capturar",
              explanation: "Captura un momento para la galería de Sofía"
            },
            local: {
              browse: "Elegir de Galería"
            }
          }
        },

        // --- CONFIGURACIÓN PARA CÁMARA DIRECTA ---
        sources: ['camera', 'local'],
        defaultSource: 'camera',
        multiple: false,

        // Estética Rosa Palo (#F8BBD0)
        styles: {
          palette: {
            window: "#000000",
            sourceBg: "#000000",
            windowBorder: "#F8BBD0",
            tabIcon: "#F8BBD0",
            menuIcons: "#F8BBD0",
            textLight: "#FFFFFF",
            action: "#F8BBD0",
            inactiveTabIcon: "#8E9EB1",
            link: "#F8BBD0",
          },
          fonts: {
            default: null,
            "'Inter', sans-serif": "https://fonts.googleapis.com/css2?family=Inter"
          }
        }
      },
      (error, result) => {
        if (!error && result && result.event === "success") {
          if (onUploadSuccess) onUploadSuccess();
          // Opcional: recarga la página para mostrar la foto nueva
          setTimeout(() => window.location.reload(), 1500);
        }
      }
    );
  };

  return (
    <div className="fixed bottom-8 left-0 right-0 flex justify-center px-6 z-50">
      <button
        onClick={openWidget}
        className="
          w-full max-w-sm
          bg-[#F8BBD0] text-black 
          font-bold text-lg py-4 rounded-full 
          shadow-[0_10px_40px_rgba(248,187,208,0.4)] 
          flex items-center justify-center gap-3 
          transform transition-all active:scale-95
        "
      >
        <Camera size={26} />
        <span className="uppercase tracking-widest text-sm">Capturar Momento</span>
      </button>
    </div>
  );
};

export default UploadButton;