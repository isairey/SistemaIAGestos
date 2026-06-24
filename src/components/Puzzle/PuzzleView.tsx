import { useGameStore } from "../../store/useGameStore";

export default function PuzzleView() {
  const image = useGameStore((s) => s.image);
  const pieces = useGameStore((s) => s.pieces);
  const setMode = useGameStore((s) => s.setMode);

  if (!image) {
    return (
      <div className="text-center mt-20">
        <p>No hay imagen</p>

        <button
          onClick={() => setMode("camera")}
          className="mt-4 px-4 py-2 bg-black text-white rounded-xl"
        >
          Volver
        </button>
      </div>
    );
  }

  const size = 320;
  const grid = 3;

  return (
    <div className="flex flex-col items-center gap-6 mt-10">
      <h2 className="text-2xl font-bold">🧩 Puzzle Mode</h2>

      <div
        className="grid border shadow-xl"
        style={{
          width: size,
          height: size,
          gridTemplateColumns: `repeat(${grid}, 1fr)`,
        }}
      >
        {pieces.map((p: any, i: number) => (
          <div
            key={i}
            className="border"
            style={{
              backgroundImage: `url(${image})`,
              backgroundSize: `${grid * 100}% ${grid * 100}%`,
              backgroundPosition: `
                ${(p.col * 100) / (grid - 1)}%
                ${(p.row * 100) / (grid - 1)}%
              `,
            }}
          />
        ))}
      </div>

      <button
        onClick={() => setMode("camera")}
        className="px-6 py-3 bg-black text-white rounded-xl"
      >
        Volver
      </button>
    </div>
  );
}