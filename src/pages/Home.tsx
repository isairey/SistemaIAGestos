import { useState } from "react";
import WebcamView from "../components/Camera/WebcamView";
import GestureDetector from "../components/Gestures/GestureDetector";
import PuzzleView from "../components/Puzzle/PuzzleView";
import { useGameStore } from "../store/useGameStore";

export default function Home() {
  const [video, setVideo] = useState<HTMLVideoElement | null>(null);

  // 🧠 estado global del juego
  const mode = useGameStore((s) => s.mode);

  return (
    <div
      className="
        min-h-screen
        bg-gradient-to-b
        from-zinc-100
        via-white
        to-zinc-200

        flex
        flex-col
        items-center

        px-6
        py-10
      "
    >
      {/* Header */}
      <div className="text-center mb-10">
        <p className="uppercase tracking-[0.3em] text-zinc-400 text-xs font-medium">
          Gesture AI
        </p>

        <h1 className="text-5xl font-bold text-zinc-900 mt-3">
          Gesture Puzzle AI
        </h1>

        <p className="mt-4 text-zinc-500 text-lg">
          Controla la aplicación usando movimientos de la mano.
        </p>
      </div>

      {/* CAMBIO DE VISTA SEGÚN MODO */}
      {mode === "camera" && (
        <>
          {/* Cámara */}
          <div
            className="
              relative
              overflow-hidden
              rounded-[40px]
              bg-white/70
              backdrop-blur-2xl
              border border-white/50
              shadow-[0_30px_80px_rgba(0,0,0,0.12)]
            "
          >
            <WebcamView onReady={setVideo} />
            <GestureDetector video={video} />
          </div>

          {/* Panel inferior */}
          <div
            className="
              mt-8
              bg-white/70
              backdrop-blur-xl
              border border-white/40
              rounded-3xl
              px-8 py-5
              shadow-lg
              text-center
            "
          >
            <p className="text-zinc-700 font-medium">
              Gestos disponibles
            </p>

            <div className="mt-3 flex gap-8 text-zinc-500 text-sm">
              <span>✌️ Tomar Foto / Puzzle</span>
              <span>👋 Gatito Bailarín</span>
            </div>
          </div>
        </>
      )}

      {/* 🧩 PANTALLA PUZZLE */}
      {mode === "puzzle" && (
        <div className="w-full flex justify-center">
          <PuzzleView />
        </div>
      )}
    </div>
  );
}