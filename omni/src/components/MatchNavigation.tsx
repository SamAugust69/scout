import { motion } from "motion/react";

export const MatchNavigation = () => {
  return (
    <motion.div
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 5, opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="flex flex-col gap-0.5 h-full"
    >
      <div className="bg-neutral-200 dark:bg-[#272424] p-4 rounded-t"></div>
      <div className="bg-neutral-200 dark:bg-[#272424] p-4 rounded-b h-full"></div>
    </motion.div>
  );
};
