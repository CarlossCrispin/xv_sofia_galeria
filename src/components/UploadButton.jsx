import { Camera } from 'lucide-react';

const UploadButton = ({ onUploadSuccess }) => {
  const openWidget = () => {
    if (!window.cloudinary) return;

    // Configuramos el widget con prioridad móvil
    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: 'dczfai1zk',
        uploadPreset: 'xv_sofia_galeria',
        folder: 'fotos_xv_sofia',

        // --- CONFIGURACIÓN FIRST MOBILE ---
        sources: ['camera', 'local'], // 'camera' primero para forzar la pestaña
        defaultSource: 'camera',      // Intenta disparar la cámara de inmediato
        multiple: false,              // UX: Una foto a la vez es más rápido en fiestas
        language: "es",

        // Estilos para que combine con el Header Rosa Palo
        styles: {
          palette: {
            window: "#000000",
            sourceBg: "#000000",
            windowBorder: "#F8BBD0",
            tabIcon: "#F8BBD0",
            menuIcons: "#F8BBD0",
            textLight: "#F5F5F5",
            action: "#F8BBD0",      // Rosa del header
            inactiveTabIcon: "#8E9EB1",
            link: "#F8BBD0",
          },
          fonts: {
            default: null,
            "'Inter', sans-serif": "https://fonts.googleapis.com/css2?family=Inter"
          }
        },

        // Ajustes de interfaz para celulares
        showAdvancedOptions: false,
        cropping: false,
        showSkipCropButton: true,
      },
      (error, result) => {
        if (!error && result && result.event === "success") {
          // Si la subida es exitosa, ejecutamos el callback (recargar galería)
          if (onUploadSuccess) onUploadSuccess();
        }
      }
    );

    widget.open();
  };

  return (
    <div className="fixed bottom-8 left-0 right-0 flex justify-center px-6 z-50">
      {/* Botón Rosa Palo (#F8BBD0) con feedback táctil */}
      <button
        onClick={openWidget}
        className="
          w-full max-w-sm
          bg-[#F8BBD0] text-black 
          font-bold text-lg py-4 px-10 rounded-full 
          shadow-[0_10px_40px_rgba(248,187,208,0.4)] 
          flex items-center justify-center gap-3 
          transform transition-all active:scale-95
          hover:brightness-105
        "
      >
        <Camera size={26} />
        <span className="uppercase tracking-widest text-sm">Capturar Momento</span>
      </button>
    </div>
  );
};

export default UploadButton;