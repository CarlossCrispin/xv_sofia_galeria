import { Camera } from 'lucide-react';

const UploadButton = ({ onUploadSuccess }) => {
  const openWidget = () => {
    if (!window.cloudinary) return;

    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: 'dczfai1zk',
        uploadPreset: 'xv_sofia_galeria',
        folder: 'fotos_xv_sofia',
        tags: ['fiesta_sofia'],
        language: "es",              // Interfaz en español
        defaultSource: 'camera',     // Abre cámara directo
        sources: ['camera', 'local'],
        multiple: false,

        // Estilos del widget para que combine con el botón
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
          }
        }
      },
      (error, result) => {
        if (!error && result && result.event === "success") {
          if (onUploadSuccess) onUploadSuccess();
        }
      }
    );
    widget.open();
  };

  return (
    <div className="fixed bottom-8 left-0 right-0 flex justify-center px-4 z-50">
      {/* Botón con el rosa exacto del Header (#F8BBD0) */}
      <button
        onClick={openWidget}
        className="
          bg-[#F8BBD0] text-[#000000] 
          font-bold text-lg py-4 px-10 rounded-full 
          shadow-[0_10px_40px_rgba(248,187,208,0.4)] 
          flex items-center gap-3 
          transform transition-all active:scale-90
          hover:brightness-110
        "
      >
        <Camera size={26} />
        <span className="uppercase tracking-widest">Capturar Momento</span>
      </button>
    </div>
  );
};

export default UploadButton;