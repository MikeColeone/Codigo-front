import { useRef } from "react";
import { useParticleCanvas } from "../../hooks/use-particle-canvas";

/** 渲染首页背景粒子画布。 */
export function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useParticleCanvas(canvasRef);

  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 opacity-90" />;
}

export default ParticleBackground;
