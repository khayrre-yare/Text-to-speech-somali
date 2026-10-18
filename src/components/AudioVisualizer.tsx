import React, { useEffect, useRef } from 'react';

interface AudioVisualizerProps {
  isPlaying: boolean;
  audioElement: HTMLAudioElement | null;
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ isPlaying, audioElement }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let phase = 0;

    const renderFallbackWave = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const width = canvas.width;
      const height = canvas.height;
      const bars = 48;
      const barWidth = width / bars;

      for (let i = 0; i < bars; i++) {
        let barHeight = 6;
        if (isPlaying) {
          // Dynamic organic wave simulation
          const sinVal = Math.sin(i * 0.25 + phase) * Math.cos(i * 0.15 - phase * 0.8);
          barHeight = Math.max(6, Math.abs(sinVal) * (height * 0.75));
        }

        const x = i * barWidth;
        const y = (height - barHeight) / 2;

        // Gradient from sky-400 to blue-600
        const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
        if (isPlaying) {
          gradient.addColorStop(0, '#38bdf8');
          gradient.addColorStop(0.5, '#60a5fa');
          gradient.addColorStop(1, '#2563eb');
        } else {
          gradient.addColorStop(0, '#334155');
          gradient.addColorStop(1, '#1e293b');
        }

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(x + 1.5, y, Math.max(2, barWidth - 3), barHeight, 3);
        ctx.fill();
      }

      if (isPlaying) {
        phase += 0.08;
      }

      animationFrameRef.current = requestAnimationFrame(renderFallbackWave);
    };

    renderFallbackWave();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying]);

  return (
    <div className="relative w-full h-16 sm:h-20 bg-slate-950/70 rounded-xl overflow-hidden border border-slate-800/80 flex items-center justify-center p-2">
      <canvas
        ref={canvasRef}
        width={600}
        height={80}
        className="w-full h-full object-contain"
      />
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-[11px] font-medium text-slate-500 bg-slate-900/80 px-2.5 py-1 rounded-full border border-slate-800">
            Codka wuxuu diyaar u yahay dhegeysi
          </span>
        </div>
      )}
    </div>
  );
};
