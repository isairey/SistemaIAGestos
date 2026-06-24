import { useEffect, useState } from "react";
import WebcamView from "../components/Camera/WebcamView";
import GestureDetector from "../components/Gestures/GestureDetector";
import PuzzleView from "../components/Puzzle/PuzzleView";
import { useGameStore } from "../store/useGameStore";

export default function Home() {
  const [video, setVideo] =
    useState<HTMLVideoElement | null>(null);

  const mode = useGameStore((s) => s.mode);

  const isCamera = mode === "camera";
  const isPuzzle = mode === "puzzle";

  useEffect(() => {
    if (!isCamera) setVideo(null);
  }, [isCamera]);

  return (
    <div
      className="
        min-h-screen
        relative
        overflow-hidden

        bg-gradient-to-br
        from-zinc-50
        via-white
        to-zinc-200
      "
    >
      {/* Glow Background */}
      <div
        className="
          absolute
          top-[-200px]
          left-[-200px]
          w-[500px]
          h-[500px]
          rounded-full
          bg-blue-300/20
          blur-3xl
        "
      />

      <div
        className="
          absolute
          bottom-[-250px]
          right-[-250px]
          w-[600px]
          h-[600px]
          rounded-full
          bg-violet-300/20
          blur-3xl
        "
      />

      <div
        className="
          relative
          z-10

          max-w-7xl
          mx-auto

          px-8
          py-10
        "
      >
        {/* HEADER */}
        <header
          className="
            flex
            flex-col
            items-center
            text-center
          "
        >
          <div
            className="
              px-5
              py-2

              rounded-full

              bg-white/60
              backdrop-blur-xl

              border
              border-white/50

              shadow-lg
            "
          >
            <span
              className="
                text-xs
                font-semibold
                tracking-[0.3em]
                uppercase
                text-zinc-500
              "
            >
              AI COMPUTER VISION
            </span>
          </div>

          <h1
            className="
              mt-8

              text-7xl
              font-black

              tracking-tight

              bg-gradient-to-r
              from-zinc-900
              via-zinc-700
              to-zinc-500

              bg-clip-text
              text-transparent
            "
          >
            Gesture Puzzle AI
          </h1>

          <p
            className="
              mt-5

              text-lg
              text-zinc-500

              max-w-2xl
            "
          >
            Controla el juego mediante gestos
            detectados en tiempo real utilizando
            inteligencia artificial y visión por
            computadora.
          </p>
        </header>

        {/* STATS */}
        <div
          className="
            grid
            md:grid-cols-3
            gap-6

            mt-12
            mb-10
          "
        >
          <div
            className="
              bg-white/70
              backdrop-blur-2xl

              rounded-3xl
              p-6

              border
              border-white/50

              shadow-xl
            "
          >
            <p className="text-zinc-400 text-sm">
              Estado
            </p>

            <h3 className="text-2xl font-bold text-zinc-900 mt-2">
              {isCamera
                ? "Cámara Activa"
                : "Puzzle Activo"}
            </h3>
          </div>

          <div
            className="
              bg-white/70
              backdrop-blur-2xl

              rounded-3xl
              p-6

              border
              border-white/50

              shadow-xl
            "
          >
            <p className="text-zinc-400 text-sm">
              Gesto Principal
            </p>

            <h3 className="text-2xl font-bold text-zinc-900 mt-2">
              ✌️ Crear Puzzle
            </h3>
          </div>

          <div
            className="
              bg-white/70
              backdrop-blur-2xl

              rounded-3xl
              p-6

              border
              border-white/50

              shadow-xl
            "
          >
            <p className="text-zinc-400 text-sm">
              Acción Extra
            </p>

            <h3 className="text-2xl font-bold text-zinc-900 mt-2">
              👋 Gatito AI
            </h3>
          </div>
        </div>

        {/* CAMERA / PUZZLE */}
        <main>
          {isCamera && (
            <div
              className="
                flex
                flex-col
                items-center
                gap-8
              "
            >
              <div
                className="
                  relative

                  overflow-hidden

                  rounded-[42px]

                  bg-white/60
                  backdrop-blur-2xl

                  border
                  border-white/60

                  shadow-[0_40px_100px_rgba(0,0,0,0.15)]
                "
              >
                <WebcamView onReady={setVideo} />

                <GestureDetector
                  video={video}
                />
              </div>

              <div
                className="
                  bg-white/70
                  backdrop-blur-xl

                  rounded-3xl

                  border
                  border-white/50

                  px-8
                  py-5

                  shadow-xl
                "
              >
                <div
                  className="
                    flex
                    gap-8
                    text-sm
                    text-zinc-600
                  "
                >
                  <span>
                    ✌️ Crear Rompecabezas
                  </span>

                  <span>
                    👋 Activar Gatito
                  </span>
                </div>
              </div>
            </div>
          )}

          {isPuzzle && (
            <div
              className="
                flex
                justify-center

                mt-8
              "
            >
              <PuzzleView />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}