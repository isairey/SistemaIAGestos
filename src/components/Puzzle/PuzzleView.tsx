import { useGameStore } from "../../store/useGameStore";

export default function PuzzleView() {
  const image = useGameStore((s) => s.image);
  const pieces = useGameStore((s) => s.pieces);
  const setMode = useGameStore((s) => s.setMode);

  if (!image) {
    return (
      <div className="text-center mt-20">
        <p className="text-gray-500">No hay imagen para el puzzle</p>

        <button
          onClick={() => setMode("camera")}
          className="mt-4 px-4 py-2 bg-black text-white rounded-xl"
        >
          Volver
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6 mt-10">
      <h2 className="text-2xl font-bold text-zinc-800">
        🧩 Puzzle Mode
      </h2>

      {/* Imagen original */}
      <div className="rounded-2xl overflow-hidden shadow-xl border">
        <img
          src={image}
          className="w-[400px] h-auto"
          alt="puzzle source"
        />
      </div>

      {/* Info debug piezas */}
      <div className="text-sm text-gray-500">
        Piezas generadas: {pieces?.length ?? 0}
      </div>

      {/* Botón regresar */}
      <button
        onClick={() => setMode("camera")}
        className="
          px-6 py-3
          bg-black
          text-white
          rounded-2xl
          hover:scale-105
          transition
        "
      >
        Volver a cámara
      </button>
    </div>
  );
}