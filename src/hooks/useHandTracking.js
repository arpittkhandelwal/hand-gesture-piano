import { useEffect, useRef, useState, useCallback } from 'react';
import { HandLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

export function useHandTracking(videoRef) {
  const [results, setResults] = useState(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const landmarkerRef = useRef(null);
  const requestRef = useRef(null);
  const lastVideoTimeRef = useRef(-1);

  useEffect(() => {
    async function init() {
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
      );
      
      landmarkerRef.current = await HandLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
          delegate: "GPU"
        },
        runningMode: "VIDEO",
        numHands: 2
      });

      // Simple camera setup
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 1280, height: 720 }
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.addEventListener("loadeddata", () => {
            setIsCameraReady(true);
            predict();
          });
        }
      }
    }

    async function predict() {
      if (videoRef.current && landmarkerRef.current) {
        let startTimeMs = performance.now();
        if (lastVideoTimeRef.current !== videoRef.current.currentTime) {
          lastVideoTimeRef.current = videoRef.current.currentTime;
          const result = landmarkerRef.current.detectForVideo(videoRef.current, startTimeMs);
          
          // Map to compatible format for existing components
          setResults({
            multiHandLandmarks: result.landmarks
          });
        }
      }
      requestRef.current = requestAnimationFrame(predict);
    }

    init();

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      landmarkerRef.current?.close();
    };
  }, [videoRef]);

  return { results, isCameraReady };
}
