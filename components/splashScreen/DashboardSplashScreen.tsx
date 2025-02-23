import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

const DashboardSplashScreen = () => {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {showSplash && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="fixed top-[4.6%] left-0 w-full h-[90.8%] bg-gradient-to-b from-gray-200 to-gray-100 z-50"
        ></motion.div>
      )}
    </AnimatePresence>
  );
};

export default DashboardSplashScreen;
