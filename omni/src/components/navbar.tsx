import { useDarkModeContext } from "@/lib/context/darkmode";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";

export const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { setDark, dark } = useDarkModeContext();

  return (
    <motion.nav
      className={`${
        open ? "w-[40rem]" : "w-20"
      } dark:bg-[#302E2E] flex flex-col p-2 gap-4`}
    >
      {/* <button onClick={() => setDark(!dark)}>dark</button> */}
      <button onClick={() => setOpen(!open)}>open</button>

      <AnimatePresence>
        {open && (
          <motion.div
            exit={{ y: 3, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-4"
          >
            <div className="p-4 bg-neutral-900/50 "></div>
            <div className="p-4 bg-neutral-900/50 "></div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};
