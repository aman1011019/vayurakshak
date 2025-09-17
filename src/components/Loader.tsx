import React from "react";
import { motion } from "framer-motion";

const Loader: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 relative overflow-hidden">
      {/* Drone */}
      <motion.div
        initial={{ x: -200, y: -50, opacity: 0 }}
        animate={{ x: 0, y: 0, opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="absolute top-1/4"
      >
        <img
          src="/drone.png" // 👈 put drone image inside public/drone.png
          alt="Drone"
          className="w-40"
        />
      </motion.div>

      {/* Package (carried by drone) */}
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 50, opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute top-1/4"
      >
        <img
          src="/package.png" // 👈 put package image inside public/package.png
          alt="Package"
          className="w-16"
        />
      </motion.div>

      {/* Dropped Package falling down */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 200, opacity: 1 }}
        transition={{ delay: 2.5, duration: 1 }}
        className="absolute top-1/2"
      >
        <img
          src="/package.png"
          alt="Dropped Package"
          className="w-16 opacity-90"
        />
      </motion.div>

      {/* Loading text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.5, duration: 1 }}
        className="absolute bottom-10 text-lg font-bold text-gray-700"
      >
        Preparing your disaster-response system...
      </motion.div>
    </div>
  );
};

export default Loader;
