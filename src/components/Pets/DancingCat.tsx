import catGif from "./ss.gif";

interface Props {
  visible: boolean;
}

export default function DancingCat({ visible }: Props) {
  if (!visible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[9999] animate-bounce">
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-4 shadow-2xl">
        <img
          src={catGif}
          alt="Dancing Cat"
          className="w-48 h-48 object-contain"
        />

        <div className="mt-2 text-center">
          <p className="text-white font-bold">
            🐱 Gatito Bailarín
          </p>

          <p className="text-xs text-gray-300">
            Gesto detectado
          </p>
        </div>
      </div>
    </div>
  );
}