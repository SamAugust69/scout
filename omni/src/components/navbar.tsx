import { useDarkModeContext } from "@/lib/context/darkModeContext";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { MatchNavigation } from "./MatchNavigation";
import { ConnectionStatus } from "./ConnectionStatus";
import { ChevronsLeft, ChevronsRight, Moon, Sun } from "lucide-react";
import { Button } from "./ui/button";

export const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { setDark, dark } = useDarkModeContext();

  return (
    <motion.nav
      className={`relative dark:bg-[#302E2E] flex flex-col px-2 py-4 gap-4 group ${
        !open ? "cursor-pointer" : "cursor-auto"
      }`}
      animate={{ width: open ? 1000 : 100 }}
      transition={{ duration: 0.05 }}
      onClick={() => !open && setOpen(!open)}
    >
      <Button
        onClick={() => setOpen(!open)}
        className={`opacity-0 ${
          open ? "group-hover:opacity-100" : null
        } hover:bg-neutral-300 dark:hover:bg-neutral-800 w-8 p-1 rounded flex items-center justify-center transition-all text-neutral-800 absolute right-2`}
      >
        <ChevronsLeft />
      </Button>
      <Button
        onClick={() => setOpen(!open)}
        className={`opacity-0 ${
          !open ? "group-hover:opacity-100" : null
        } hover:bg-neutral-300 dark:hover:bg-neutral-700 dark:bg-[#302E2E] w-8 p-1 rounded flex items-center justify-center transition-all text-neutral-800 absolute -right-10`}
      >
        <ChevronsRight />
      </Button>
      {/* <button className="peer-hover:block  hidden">cllose</button> */}

      <ConnectionStatus open={open} />

      <div className="h-full">
        <AnimatePresence>{open && <MatchNavigation />}</AnimatePresence>
      </div>

      <div
        className={` flex ${
          open ? "justify-between" : "justify-center"
        } gap-5 px-4`}
      >
        <Button className={`hover:underline text-sm ${open ? "" : "hidden"}`}>
          Help
        </Button>
        <Button onClick={() => setDark(!dark)} className="">
          <Sun className={`${dark ? "size-0" : "size-5"} transition-all`} />
          <Moon className={`${!dark ? "size-0" : "size-5"} transition-all`} />
        </Button>
      </div>
    </motion.nav>
  );
};
