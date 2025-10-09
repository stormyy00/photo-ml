"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import mock from "@/public/mock.svg";
import Image from "next/image";

type Props = {
  images?: string[];
  folders?: string[];
  autoPlayDelayMs?: number;
};

const MockImage = () => (
  <svg viewBox="0 0 200 200" className="w-full h-full">
    <rect width="200" height="200" fill="#e5e7eb" />
    <circle cx="100" cy="80" r="30" fill="#9ca3af" />
    <path
      d="M 60 120 L 100 160 L 140 120 L 180 180 L 20 180 Z"
      fill="#9ca3af"
    />
  </svg>
);

function Folder({
  label,
  dropRef,
}: {
  label: string;
  dropRef?: React.RefObject<HTMLDivElement>;
}) {
  return (
    <div className="relative w-36 h-28">
      <div className="absolute inset-0 rounded-lg bg-photo-green-200 border border-photo-green-300 shadow-md" />
      <div className="absolute -top-1.5 left-2 h-4 w-16 rounded-t-md bg-photo-green-200 border border-photo-green-400 border-b-0 shadow-sm" />
      <div className="absolute inset-0 flex items-center justify-center px-3">
        <div className="w-full text-center text-white text-sm font-bold truncate select-none">
          {label}
        </div>
      </div>
      <div
        ref={dropRef}
        className="absolute left-1.5 right-1.5 top-5 bottom-6 rounded overflow-hidden z-10"
      />
      <div className="absolute bottom-0 left-0 right-0 h-6 rounded-b-lg bg-photo-green-200/90 border-t border-photo-green-200 shadow-sm z-20" />
    </div>
  );
}

const PhotoSortAnimation = ({
  images = [mock, mock, mock],
  folders = ["Kavin", "Trips", "Events"],
  autoPlayDelayMs = 400,
}: Props) => {
  const labs = useMemo(() => folders.slice(0, 3), [folders]);

  const stageRef = useRef<HTMLDivElement | null>(null);
  const dropZoneRefs = [
    useRef<HTMLDivElement | null>(null),
    useRef<HTMLDivElement | null>(null),
    useRef<HTMLDivElement | null>(null),
  ];

  const ctrls = [useAnimation(), useAnimation(), useAnimation()];
  const [hidden, setHidden] = useState<[boolean, boolean, boolean]>([
    false,
    false,
    false,
  ]);
  const [isRunning, setIsRunning] = useState(false);
  const [finished, setFinished] = useState(false);
  const [phase, setPhase] = useState<"single" | "fan" | "sort" | "done">(
    "single",
  );

  const waitForLayout = async () =>
    new Promise<void>((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
    );

  const initialStates = [
    { x: 30, y: 0, rotate: 0 },
    { x: 150, y: 40, rotate: 30 },
    { x: 246, y: 140, rotate: 60 },
  ];

  const computeTargets = () => {
    const stage = stageRef.current;
    if (!stage)
      return [
        { x: 0, y: 0 },
        { x: 0, y: 0 },
        { x: 0, y: 0 },
      ];

    const stageBox = stage.getBoundingClientRect();
    const size = 128;

    return dropZoneRefs.map((ref) => {
      const el = ref.current;
      if (!el) return { x: 0, y: 0 };
      const box = el.getBoundingClientRect();
      const destX = box.left - stageBox.left + box.width / 2 - size / 2 - 30;
      const destY = box.top - stageBox.top + box.height / 2 - size / 2 - 20;
      return { x: destX, y: destY };
    });
  };

  const run = async () => {
    setIsRunning(true);
    setFinished(false);
    setHidden([false, false, false]);
    setPhase("single");

    await Promise.all(
      ctrls.map((c, i) =>
        c.start({
          x: initialStates[i].x,
          y: initialStates[i].y,
          scale: 1.6,
          rotate: initialStates[i].rotate,
          opacity: 1,
          zIndex: 10 - i,
          transition: { duration: 0 },
        }),
      ),
    );

    await new Promise((r) => setTimeout(r, 1000));

    setPhase("fan");
    await waitForLayout();
    await new Promise((r) => setTimeout(r, 600));

    setPhase("sort");
    await waitForLayout();

    const targets = computeTargets();

    await Promise.all(
      ctrls.map(async (c, i) => {
        const { x, y } = targets[i] ?? { x: 0, y: 0 };

        await c.start({
          x: [initialStates[i].x, x * 0.5, x],
          y: [initialStates[i].y, -40, y],
          scale: [1, 1.6, 0.95],
          rotate: [initialStates[i].rotate, i === 0 ? -8 : i === 2 ? 8 : 0, 0],
          transition: { duration: 2.0, ease: [0.25, 0.8, 0.25, 1] },
        });

        await c.start({
          y: y + 30,
          scale: 0.7,
          opacity: 0,
          transition: { duration: 0.6, ease: "easeIn" },
        });

        setHidden((prev) => {
          const next = [...prev] as [boolean, boolean, boolean];
          next[i] = true;
          return next;
        });
      }),
    );

    setPhase("done");
    setFinished(true);
    setIsRunning(false);
  };

  useEffect(() => {
    const runContinuously = async () => {
      await new Promise((r) => setTimeout(r, autoPlayDelayMs));
      while (true) {
        await run();
        await new Promise((r) => setTimeout(r, 1500));
      }
    };
    runContinuously();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="w-full flex flex-col items-center justify-center my-10">
      <div
        ref={stageRef}
        className="relative w-full max-w-5xl h-[400px] overflow-visible"
      >
        <div className="absolute top-0 left-12 w-32 h-32">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={ctrls[i]}
              initial={{
                x: initialStates[i].x,
                y: initialStates[i].y,
                scale: 1,
                opacity: 1,
                rotate: initialStates[i].rotate,
                zIndex: 10 - i,
              }}
              className={`absolute w-32 h-full rounded-lg overflow-visible shadow-lg  ${
                hidden[i] ? "pointer-events-none" : ""
              }`}
            >
              {images && images[i] ? (
                <Image
                  src={images[i]}
                  alt={`Photo ${i + 1}`}
                  priority
                  draggable="false"
                  className="w-full h-full object-cover"
                />
              ) : (
                <MockImage />
              )}
            </motion.div>
          ))}
        </div>

        <motion.div
          className={`absolute left-1/2 -translate-x-1/2 bottom-16 grid w-full ${
            phase === "single"
              ? "grid-cols-1 place-items-start"
              : "grid-cols-3 gap-12 md:gap-16 place-items-center"
          }  transition-all duration-700 ease-out`}
          initial={false}
        >
          {phase === "single" && (
            <motion.div
              layout
              className="relative"
              transition={{ type: "spring", stiffness: 280, damping: 24 }}
            >
              <Folder label="Photos" />
            </motion.div>
          )}

          {phase !== "single" && (
            <>
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  layout
                  className="relative"
                  transition={{ type: "spring", stiffness: 100, damping: 22 }}
                  initial={{
                    scale: 1,
                    opacity: 0,
                    x: -200,
                  }}
                  animate={{
                    scale: 1,
                    opacity: 1,
                    x: 0,

                    transition: {
                      type: "spring",
                      stiffness: 100,
                      damping: 22,
                      delay: i * 0.15,
                    },
                  }}
                >
                  <Folder label={labs[i]} dropRef={dropZoneRefs[i]} />
                </motion.div>
              ))}
            </>
          )}
        </motion.div>

        <AnimatePresence>
          {isRunning && phase === "sort" && (
            <motion.div
              key="trail"
              className="absolute top-4 left-1/2 -translate-x-1/2"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 0.4 }}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PhotoSortAnimation;
