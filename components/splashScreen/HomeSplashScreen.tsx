"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const HomeSplashScreen = () => {
  const [showSplash, setShowSplash] = useState<boolean>(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 1600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {showSplash && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="fixed top-0 left-0 w-full h-full bg-gradient-to-b from-green-700 to-green-300 flex items-center justify-center z-50 bg-center"
        >
          <h1 className={`text-3xl sm:text-5xl text-white tracking-widest font-bold px-6`}>明日の笑顔を共に創る</h1>
          </motion.div>
      )}
    </AnimatePresence>
  );
};

export default HomeSplashScreen;
//確認
