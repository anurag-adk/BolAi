"use client";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";
import React, { useRef, useState, useEffect } from "react";

export const BackgroundBeamsWithCollision = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const parentRef = useRef<HTMLDivElement>(null);

  const [beams, setBeams] = useState<
    {
      initialX: number;
      translateY: number;
      duration: number;
      delay?: number;
      repeatDelay?: number;
      className?: string;
      width?: number;
    }[]
  >([]);

  // Initialize beams dynamically for full screen width
  useEffect(() => {
    const beamCount = 10; // keep 10 for performance
    const width = window.innerWidth;
    const newBeams = Array.from({ length: beamCount }).map(() => ({
      initialX: Math.random() * width,
      translateY: 1800,
      duration: Math.random() * 6 + 4, // 4-10 seconds
      delay: Math.random() * 5,
      repeatDelay: Math.random() * 3,
      className: `h-${Math.floor(Math.random() * 20) + 6}`, // random height
      width: Math.random() * 2 + 1, // 2-5px width
    }));
    setBeams(newBeams);
  }, []);

  return (
    <div
      ref={parentRef}
      className={cn("relative w-full h-full overflow-hidden", className)}
    >
      {beams.map((beam, index) => (
        <CollisionMechanism
          key={index}
          beamOptions={beam}
          containerRef={containerRef}
          parentRef={parentRef}
        />
      ))}

      {children}

      <div
        ref={containerRef}
        className="absolute bottom-0 w-full inset-x-0 pointer-events-none"
      />
    </div>
  );
};

const CollisionMechanism = React.forwardRef<
  HTMLDivElement,
  {
    containerRef: React.RefObject<HTMLDivElement>;
    parentRef: React.RefObject<HTMLDivElement>;
    beamOptions?: {
      initialX?: number;
      translateY?: number;
      rotate?: number;
      className?: string;
      duration?: number;
      delay?: number;
      repeatDelay?: number;
      width?: number;
    };
  }
>(({ parentRef, containerRef, beamOptions = {} }, ref) => {
  const beamRef = useRef<HTMLDivElement>(null);
  const [collision, setCollision] = useState<{
    detected: boolean;
    coordinates: { x: number; y: number } | null;
  }>({ detected: false, coordinates: null });

  const [beamKey, setBeamKey] = useState(0);
  const [cycleCollisionDetected, setCycleCollisionDetected] = useState(false);

  // Check collision (optimized)
  useEffect(() => {
    const checkCollision = () => {
      if (
        beamRef.current &&
        containerRef.current &&
        parentRef.current &&
        !cycleCollisionDetected
      ) {
        const beamRect = beamRef.current.getBoundingClientRect();
        const containerRect = containerRef.current.getBoundingClientRect();
        const parentRect = parentRef.current.getBoundingClientRect();

        if (beamRect.bottom >= containerRect.top) {
          const relativeX =
            beamRect.left - parentRect.left + beamRect.width / 2;
          const relativeY = beamRect.bottom - parentRect.top;

          setCollision({
            detected: true,
            coordinates: { x: relativeX, y: relativeY },
          });
          setCycleCollisionDetected(true);
        }
      }
    };

    const interval = setInterval(checkCollision, 100); // check every 100ms
    return () => clearInterval(interval);
  }, [cycleCollisionDetected, containerRef]);

  useEffect(() => {
    if (collision.detected && collision.coordinates) {
      setTimeout(() => {
        setCollision({ detected: false, coordinates: null });
        setCycleCollisionDetected(false);
      }, 2000);

      setTimeout(() => {
        setBeamKey((prev) => prev + 1);
      }, 2000);
    }
  }, [collision]);

  return (
    <>
      <motion.div
        key={beamKey}
        ref={beamRef}
        animate={{ translateY: beamOptions.translateY || 1800 }}
        initial={{
          translateY: -200,
          left: beamOptions.initialX || 0,
          rotate: beamOptions.rotate || 0,
        }}
        transition={{
          duration: beamOptions.duration || 8,
          repeat: Infinity,
          repeatType: "loop",
          ease: "linear",
          delay: beamOptions.delay || 0,
          repeatDelay: beamOptions.repeatDelay || 0,
        }}
        className={cn(
          "absolute top-0 rounded-full bg-gradient-to-t from-green-400 via-green-500 to-transparent",
          beamOptions.className
        )}
        style={{
          left: beamOptions.initialX,
          width: beamOptions.width || 4, // dynamic width
        }}
      />
      <AnimatePresence>
        {collision.detected && collision.coordinates && (
          <Explosion
            key={`${collision.coordinates.x}-${collision.coordinates.y}`}
            style={{
              left: `${collision.coordinates.x}px`,
              top: `${collision.coordinates.y}px`,
              transform: "translate(-50%, -50%)",
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
});

CollisionMechanism.displayName = "CollisionMechanism";

// Explosion effect
const Explosion = ({ ...props }: React.HTMLProps<HTMLDivElement>) => {
  const spans = Array.from({ length: 20 }, (_, index) => ({
    id: index,
    initialX: 0,
    initialY: 0,
    directionX: Math.floor(Math.random() * 80 - 40),
    directionY: Math.floor(Math.random() * -50 - 10),
  }));

  return (
    <div {...props} className={cn("absolute z-50 h-2 w-2", props.className)}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute -inset-x-10 top-0 m-auto h-2 w-10 rounded-full bg-gradient-to-r from-transparent via-green-500 to-transparent blur-sm"
      />
      {spans.map((span) => (
        <motion.span
          key={span.id}
          initial={{ x: span.initialX, y: span.initialY, opacity: 1 }}
          animate={{ x: span.directionX, y: span.directionY, opacity: 0 }}
          transition={{
            duration: Math.random() * 1.5 + 0.5,
            ease: "easeOut",
          }}
          className="absolute h-1 w-1 rounded-full bg-gradient-to-b from-green-500 to-emerald-500"
        />
      ))}
    </div>
  );
};
