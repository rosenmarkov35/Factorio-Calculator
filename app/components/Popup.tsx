// components/DelayedHoverPopup.tsx
"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Popup() {
  const [showPopup, setShowPopup] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    timerRef.current = setTimeout(() => {
      setShowPopup(true);
    }, 1000); // 1 second delay
  };

  const handleMouseLeave = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setShowPopup(false);
  };

  return (
    <div className="absolute w-full h-full inline-block">
      <div
        onMouseEnter={handleMouseEnter}
        onWheel={handleMouseLeave}
        onMouseLeave={handleMouseLeave}
        className="w-full h-full bg-transparent "
      >
      </div>

      <AnimatePresence>
        {showPopup && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.2 }}
            className="absolute left-1/2 -translate-x-1/2 mt-2 w-max bg-secondary text-white text-sm px-3 py-2 rounded shadow-lg z-50"
          >
            Scroll to select
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
