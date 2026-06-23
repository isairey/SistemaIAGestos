import { useEffect, useRef, useState } from "react";
import DancingCat from "../Pets/DancingCat";

interface Props {
  video: HTMLVideoElement | null;
}

export default function GestureDetector({ video }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [catVisible, setCatVisible] = useState(false);

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

      if (!results.multiHandLandmarks?.length) return;

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
        indexUp && middleUp && ringDown && pinkyDown;

      if (peaceGesture && !actionLock.current) {
        actionLock.current = true;

        capturePhoto(video);

        setTimeout(() => {
          actionLock.current = false;
        }, 1500);
      }

      // =========================
      // 👋 SWIPE = GATO
      // =========================
      if (lastX.current !== null && !actionLock.current) {
        const diff = currentX - lastX.current;

        const isSwipe = Math.abs(diff) > 0.07;

        if (isSwipe) {
          setCatVisible(true);

          setTimeout(() => {
            setCatVisible(false);
          }, 1000);
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
  }, [video]);

  const capturePhoto = (video: HTMLVideoElement) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    ctx.drawImage(video, 0, 0);

    const image = canvas.toDataURL("image/png");

    const link = document.createElement("a");
    link.href = image;
    link.download = `photo-${Date.now()}.png`;
    link.click();
  };

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
        }}
      />

      <DancingCat visible={catVisible} />
    </>
  );
}