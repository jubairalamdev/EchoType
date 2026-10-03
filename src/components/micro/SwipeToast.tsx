"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

// Swipe-to-dismiss toast in the spirit of ReactBits Swipe Toast.
// Usage: render <ToastHost /> once, then call pushToast("...") anywhere.
interface Toast {
  id: number;
  text: string;
}

let pushImpl: (text: string) => void = () => {};

export function pushToast(text: string) {
  pushImpl(text);
}

export function ToastHost() {
  const [items, setItems] = useState<Toast[]>([]);
  const idRef = useRef(0);

  useEffect(() => {
    pushImpl = (text: string) => {
      const id = ++idRef.current;
      setItems((prev) => [...prev.slice(-2), { id, text }]);
      window.setTimeout(() => {
        setItems((prev) => prev.filter((t) => t.id !== id));
      }, 2600);
    };
    return () => {
      pushImpl = () => {};
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-[100] flex flex-col items-center gap-2" aria-live="polite">
      <AnimatePresence>
        {items.map((t) => (
          <motion.div
            key={t.id}
            className="glow-box-violet pointer-events-auto rounded-full border border-violet-400/40 bg-[#14141f]/95 px-5 py-2.5 text-sm text-zinc-100"
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.95 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.6}
            onDragEnd={(_e, info) => {
              if (Math.abs(info.offset.x) > 60) {
                setItems((prev) => prev.filter((x) => x.id !== t.id));
              }
            }}
          >
            {t.text}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
