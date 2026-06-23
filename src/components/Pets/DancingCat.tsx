import catGif from "./ss.gif";

interface Props {
  visible: boolean;
}

export default function DancingCat({ visible }: Props) {
  if (!visible) return null;

  return (
    <div
      className="
        fixed bottom-8 right-8 z-[9999]

        animate-[fadeIn_.4s_ease]

        transition-all
      "
    >
      {/* Card estilo Apple */}
      <div
        className="
          bg-white/70 dark:bg-black/40

          backdrop-blur-2xl

          border border-white/30

          rounded-[28px]

          p-4

          shadow-[0_20px_60px_rgba(0,0,0,0.15)]
        "
      >
        <img
          src={catGif}
          alt="Dancing Cat"
          className="
            w-52 h-52
            object-contain
            rounded-2xl
          "
        />

        {/* Texto limpio estilo iOS */}
        <div className="mt-3 text-center">
          <p className="text-sm font-semibold text-gray-800 dark:text-white">
            🐱 Gatito activo
          </p>

          <p className="text-xs text-gray-500 dark:text-gray-300 mt-1">
            Movimiento detectado
          </p>
        </div>
      </div>
    </div>
  );
}