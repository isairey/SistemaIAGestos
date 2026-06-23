import { useEffect, useRef, useState } from "react";
import DancingCat from "../Pets/DancingCat";

interface Props {
  video: HTMLVideoElement | null;
}

export default function GestureDetector({ video }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [catVisible, setCatVisible] = useState(false);
  const [gesture, setGesture] = useState("Esperando gesto...");

  const lastX = useRef<number | null>(null);
  const actionLock = useRef(false);

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
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

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
      // ✌️ GESTO PAZ = FOTO
      // =========================
      const indexUp = landmarks[8].y < landmarks[6].y;
      const middleUp = landmarks[12].y < landmarks[10].y;
      const ringDown = landmarks[16].y > landmarks[14].y;
      const pinkyDown = landmarks[20].y > landmarks[18].y;

      const peaceGesture =
        indexUp &&
        middleUp &&
        ringDown &&
        pinkyDown;

      if (peaceGesture && !actionLock.current) {
        actionLock.current = true;

        setGesture("✌️ Foto tomada");

        capturePhoto(video);

        setTimeout(() => {
          actionLock.current = false;
        }, 1500);
      }

      // =========================
      // 👋 SWIPE = GATITO
      // =========================
      if (lastX.current !== null && !actionLock.current) {
        const diff = currentX - lastX.current;

        const isSwipe = Math.abs(diff) > 0.07;

        if (isSwipe) {
          setGesture("👋 Gatito activado");

          setCatVisible(true);

          setTimeout(() => {
            setCatVisible(false);
          }, 3000);
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
      } catch (error) {
        console.error(error);
      }
    };
  }, [video]);

  const capturePhoto = (video: HTMLVideoElement) => {
    const canvas = document.createElement("canvas");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    ctx.drawImage(video, 0, 0);

    const image = canvas.toDataURL("image/png");

    const link = document.createElement("a");

    link.href = image;
    link.download = `photo-${Date.now()}.png`;

    link.click();
  };

  return (
    <>
      {/* Canvas MediaPipe */}
      <canvas
        ref={canvasRef}
        className="
          absolute
          top-0
          left-0
          z-20
          pointer-events-none
        "
      />

      {/* HUD Principal */}
      <div
        className="
          fixed
          top-5
          left-5
          z-50
          bg-black/70
          backdrop-blur-lg
          border
          border-cyan-400/30
          rounded-2xl
          p-4
          text-white
          shadow-xl
        "
      >
        <h2 className="font-bold text-cyan-400 text-lg">
          🤖 Gesture AI
        </h2>

        <p className="text-sm text-gray-300">
          Cámara activa
        </p>

        <div className="mt-3">
          <p className="text-xs text-gray-400">
            Estado actual
          </p>

          <p className="font-semibold text-cyan-300">
            {gesture}
          </p>
        </div>
      </div>

      {/* Panel de gestos */}
      <div
        className="
          fixed
          top-5
          right-5
          z-50
          bg-white/10
          backdrop-blur-lg
          border
          border-white/20
          rounded-2xl
          p-4
          text-white
          shadow-xl
        "
      >
        <h3 className="font-semibold">
          🎮 Controles
        </h3>

        <ul className="mt-2 text-sm space-y-1">
          <li>✌️ Tomar foto</li>
          <li>👋 Mostrar gatito</li>
        </ul>
      </div>

      {/* Gatito */}
      <DancingCat visible={catVisible} />
    </>
  );
}