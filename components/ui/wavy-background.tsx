/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { cn } from "@/lib/utils";
import React, { useEffect, useRef, useState } from "react";
import { createNoise3D } from "simplex-noise";

export const WavyBackground = ({
  children,
  className,
  containerClassName,
  colors,
  waveWidth,
  backgroundFill = "transparent",
  blur = 10,
  speed = "fast",
  waveOpacity = 0.5,
  ...props
}: {
  children?: any;
  className?: string;
  containerClassName?: string;
  colors?: string[];
  waveWidth?: number;
  backgroundFill?: string;
  blur?: number;
  speed?: "slow" | "fast";
  waveOpacity?: number;
  [key: string]: any;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationId = useRef<number>();
  const noise = createNoise3D();

  const getSpeed = () => (speed === "fast" ? 0.002 : 0.001);

  const drawDiagonalWave = (
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    nt: number,
    waveCount: number,
    waveColors: string[]
  ) => {
    for (let i = 0; i < waveCount; i++) {
      ctx.beginPath();
      ctx.lineWidth = waveWidth || 50;
      ctx.strokeStyle = waveColors[i % waveColors.length];

      // Calculate diagonal distance and steps
      const diagonalDistance = Math.sqrt(w * w + h * h);
      const steps = Math.ceil(diagonalDistance / 5);

      for (let step = 0; step <= steps; step++) {
        // Calculate position along the diagonal
        const t = step / steps;
        const baseX = t * w;
        const baseY = t * h;

        // Add noise perpendicular to the diagonal
        const noiseValue = noise(step / 160, 0.3 * i, nt) * 30;

        // Calculate perpendicular offset (rotated 90 degrees from diagonal)
        const perpX = -noiseValue * (h / diagonalDistance);
        const perpY = noiseValue * (w / diagonalDistance);

        const finalX = baseX + perpX;
        const finalY = baseY + perpY;

        if (step === 0) {
          ctx.moveTo(finalX, finalY);
        } else {
          ctx.lineTo(finalX, finalY);
        }
      }
      ctx.stroke();
      ctx.closePath();
    }
  };

  const render = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    waveColors: string[]
  ) => {
    let nt = 0;
    const animate = () => {
      nt += getSpeed();
      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h); // clear previous frame
      ctx.fillStyle = backgroundFill;
      ctx.globalAlpha = waveOpacity;
      ctx.fillRect(0, 0, w, h);

      ctx.filter = `blur(${blur}px)`;

      drawDiagonalWave(ctx, w, h, nt, 5, waveColors);

      animationId.current = requestAnimationFrame(animate);
    };
    animate();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      // Use container dimensions instead of canvas offset dimensions
      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const waveColors = colors ?? [
      "#0ea5e9", // sky-500
      "#06b6d4", // cyan-500
      "#0891b2", // cyan-600
      "#0284c7", // sky-600
      "#0369a1", // sky-700s
    ];
    render(ctx, canvas, waveColors);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationId.current) cancelAnimationFrame(animationId.current);
    };
  }, []);

  return (
    <div ref={containerRef} className={cn("relative", containerClassName)}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full z-0"
        {...props}
      ></canvas>
      <div className={cn("relative z-10", className)}>{children}</div>
    </div>
  );
};
