// components/LenisProvider.tsx
"use client";

import { useEffect, useRef } from "react";
import Lenis from "@studio-freight/lenis";

interface Props {
  children: React.ReactNode;
}

const LenisProvider = ({ children }: Props) => {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      lerp: 0.1,
    });

    lenisRef.current = lenis;

    const raf = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return <div id="smooth-scroll">{children}</div>;
};

export default LenisProvider;
