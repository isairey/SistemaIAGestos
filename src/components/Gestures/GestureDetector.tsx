import { useEffect, useRef, useState } from "react";
import DancingCat from "../Pets/DancingCat";

import { useGameStore } from "../../store/useGameStore";
import { generatePuzzle } from "../../utils/generatePuzzle";

interface Props {
  video: HTMLVideoElement | null;
}

export default function GestureDetector({ video }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [catVisible, setCatVisible] = useState(false);
  const [gesture, setGesture] = useState("Esperando gesto...");

  const lastX = useRef<number | null>(null);
  const actionLock = useRef(false);

  // 🔒 evita doble trigger del puzzle
  const puzzleTriggered = useRef(false);

  const setMode = useGameStore((s) => s.setMode);
  const setImage = useGameStore((s) => s.setImage);
  const setPieces = useGameStore((s) => s.setPieces);

  useEffect(() => {
    if (!video) return;

    const hands = new (window as any).Hands({
      locateFile: (file: string) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
    });

    hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.7,
    });

    hands.onResults((results: any) => {
      const canvas = canvasRef.current;
      if (!canvas || !video) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      if (!video.videoWidth) return;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (!results.multiHandLandmarks?.length) {
        setGesture("Esperando mano...");
        return;
      }

      const landmarks = results.multiHandLandmarks[0];
      const wrist = landmarks[0];

      const currentX = wrist.x;

      // =========================
      // ✌️ GESTO PAZ → PUZZLE
      // =========================
      const indexUp = landmarks[8].y < landmarks[6].y;
      const middleUp = landmarks[12].y < landmarks[10].y;
      const ringDown = landmarks[16].y > landmarks[14].y;
      const pinkyDown = landmarks[20].y > landmarks[18].y;

      const peaceGesture =
        indexUp && middleUp && ringDown && pinkyDown;

      if (peaceGesture && !puzzleTriggered.current) {
        puzzleTriggered.current = true;

        setGesture("✌️ Creando rompecabezas...");

        const image = capturePhoto(video);

        console.log("📸 FOTO:", image);

        if (image) {
          setImage(image);
          setPieces(generatePuzzle(image));
          setMode("puzzle");

          console.log("🎮 Puzzle activado");
        }

        setTimeout(() => {
          puzzleTriggered.current = false;
        }, 2000);
      }

      // =========================
      // 👋 SWIPE → GATITO
      // =========================
      if (lastX.current !== null && !actionLock.current) {
        const diff = currentX - lastX.current;

        const isSwipe = Math.abs(diff) > 0.07;

        if (isSwipe) {
          actionLock.current = true;

          setGesture("👋 Gatito activado");

          setCatVisible(true);

          setTimeout(() => {
            setCatVisible(false);
            actionLock.current = false;
          }, 2000);
        }
      }

      lastX.current = currentX;
    });

    const camera = new (window as any).Camera(video, {
      onFrame: async () => {
        await hands.send({ image: video });
      },
      width: 1280,
      height: 720,
    });

    camera.start();

    return () => {
      try {
        camera.stop();
      } catch {}
    };
  }, [video]);

  // 📸 captura segura
  const capturePhoto = (video: HTMLVideoElement): string | null => {
    if (!video || !video.videoWidth) return null;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) return null;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    return canvas.toDataURL("image/png");
  };

  return (
    <>
      {/* Canvas MediaPipe */}
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 z-20 pointer-events-none"
      />

      {/* HUD */}
      <div className="fixed top-6 left-6 z-50 bg-white/70 dark:bg-black/40 backdrop-blur-2xl border border-white/30 rounded-3xl px-6 py-4 shadow-[0_10px_40px_rgba(0,0,0,0.12)]">
        <p className="text-xs tracking-widest text-gray-400 uppercase">
          Gesture AI
        </p>

        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mt-1">
          Cámara activa
        </h2>

        <p className="text-sm text-gray-500 mt-2">{gesture}</p>
      </div>

      {/* Panel */}
      <div className="fixed top-6 right-6 z-50 bg-white/70 dark:bg-black/40 backdrop-blur-2xl border border-white/30 rounded-3xl px-6 py-4 shadow-[0_10px_40px_rgba(0,0,0,0.12)]">
        <p className="text-xs tracking-widest text-gray-400 uppercase">
          Controles
        </p>

        <div className="mt-3 space-y-2 text-sm text-gray-600 dark:text-gray-300">
          <p>✌️ Crear puzzle</p>
          <p>👋 Gatito bailarín</p>
        </div>
      </div>

      <DancingCat visible={catVisible} />
    </>
  );
}