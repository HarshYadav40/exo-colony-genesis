
import React, { useRef, useEffect } from 'react';
import { Planet } from '../types/game';

interface PlanetViewerProps {
  planet: Planet | null;
}

export const PlanetViewer: React.FC<PlanetViewerProps> = ({ planet }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !planet) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    let animationId: number;
    let rotation = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = Math.min(canvas.width, canvas.height) * 0.3;

      // Draw planet
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(rotation);

      // Planet gradient based on habitability
      const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, radius);
      if (planet.habitability === 'high') {
        gradient.addColorStop(0, '#10b981');
        gradient.addColorStop(1, '#065f46');
      } else if (planet.habitability === 'moderate') {
        gradient.addColorStop(0, '#f59e0b');
        gradient.addColorStop(1, '#92400e');
      } else {
        gradient.addColorStop(0, '#ef4444');
        gradient.addColorStop(1, '#7f1d1d');
      }

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.fill();

      // Surface details
      ctx.globalAlpha = 0.3;
      for (let i = 0; i < 8; i++) {
        const angle = (i * Math.PI * 2) / 8;
        const x = Math.cos(angle) * radius * 0.8;
        const y = Math.sin(angle) * radius * 0.8;
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(x, y, radius * 0.1, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();

      // Atmosphere glow
      ctx.globalAlpha = 0.4;
      const atmosphereGradient = ctx.createRadialGradient(centerX, centerY, radius, centerX, centerY, radius * 1.3);
      atmosphereGradient.addColorStop(0, 'rgba(16, 185, 129, 0.3)');
      atmosphereGradient.addColorStop(1, 'transparent');
      ctx.fillStyle = atmosphereGradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 1.3, 0, Math.PI * 2);
      ctx.fill();

      rotation += 0.005;
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [planet]);

  if (!planet) {
    return (
      <div className="w-full h-full flex items-center justify-center glass-morphism rounded-xl">
        <p className="text-muted-foreground font-orbitron">Select a planet to explore</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative glass-morphism rounded-xl overflow-hidden">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ filter: 'drop-shadow(0 0 20px rgba(16, 185, 129, 0.5))' }}
      />
      <div className="absolute bottom-4 left-4 right-4">
        <h3 className="text-xl font-orbitron text-primary mb-2">{planet.name}</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="glass-morphism p-2 rounded">
            <span className="text-muted-foreground">Distance:</span>
            <span className="text-white ml-2">{planet.distance_ly} ly</span>
          </div>
          <div className="glass-morphism p-2 rounded">
            <span className="text-muted-foreground">Gravity:</span>
            <span className="text-white ml-2">{planet.gravity}g</span>
          </div>
        </div>
      </div>
    </div>
  );
};
