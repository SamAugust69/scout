import { useDarkModeContext } from "@/lib/context/darkModeContext"
import { useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { MatchNavigation } from "./MatchNavigation"
import { ConnectionStatus } from "./ConnectionStatus"
import { ChevronsLeft, ChevronsRight, Moon, Settings, Sun } from "lucide-react"
import { Button } from "./ui/button"
import { SettingsMenu } from "./Settings"

export const Navbar = () => {
    const [open, setOpen] = useState(false)
    const [settingsOpen, setSetttingsOpen] = useState<boolean>(true)
    const { setDark, dark } = useDarkModeContext()

    return (
        <motion.nav
            className={`group/nav relative flex w-[100px] max-w-[100vw] shrink-0 flex-col gap-4 bg-neutral-100 px-2 py-4 dark:bg-[#302E2E] ${
                !open ? "cursor-pointer" : "cursor-auto"
            }`}
            animate={{ width: open ? "600px" : "100px" }}
            transition={{ duration: 0.1 }}
            onClick={() => !open && setOpen(!open)}
        >
            <Button
                onClick={() => setOpen(!open)}
                className={`opacity-0 ${
                    open ? "group-hover/nav:opacity-100" : null
                } absolute right-2 flex w-8 items-center justify-center p-1 transition-opacity`}
            >
                <ChevronsLeft />
            </Button>
            <Button
                onClick={() => setOpen(!open)}
                className={`opacity-0 ${
                    !open ? "group-hover/nav:opacity-100" : null
                } absolute -right-10 flex w-8 items-center justify-center rounded p-1 transition-all dark:bg-[#302E2E]`}
            >
                <ChevronsRight />
            </Button>

            <ConnectionStatus open={open} />
            {/* <Link
        to={"/test"}
        onClick={(e) => {
          e.stopPropagation();
          setOpen(false);
        }}
      >
        navigate somewhere else btn
      </Link> */}

            {/* <Button className="mx-auto px-3 py-1 text-neutral-800 flex text-sm gap-1 group/home">
				<Home className="w-5 h-5" />
				<span className="hidden group-hover/home:block">Home</span>
			</Button> */}

            <div className="h-full">
                <AnimatePresence>{open && <MatchNavigation />}</AnimatePresence>
            </div>

            <div
                className={`flex ${
                    open ? "justify-between" : "justify-center"
                } gap-1 rounded px-4`}
            >
                <Button
                    variant="link"
                    className={`text-sm ${open ? "" : "hidden"}`}
                >
                    Help
                </Button>
                <div className="flex gap-4">
                    <Button
                        onClick={() => setSetttingsOpen(!settingsOpen)}
                        className={` ${!open ? "hidden" : "flex"} w-10 items-center justify-center rounded p-1 transition-all`}
                    >
                        <Settings className="w-5" />
                    </Button>
                    <Button
                        onClick={() => setDark(!dark)}
                        className="flex h-8 w-16 items-center justify-center rounded-sm transition-colors"
                    >
                        <Sun
                            className={`${dark ? "size-0" : "size-5"} transition-all`}
                        />
                        <Moon
                            className={`${!dark ? "size-0" : "size-5"} transition-all`}
                        />
                    </Button>
                </div>
            </div>
            {/* nav closed settings button */}
            <Button
                onClick={() => setSetttingsOpen(!settingsOpen)}
                className={`opacity-100 ${open ? "opacity-0" : ""} absolute -right-12 bottom-2 flex w-10 items-center justify-center rounded p-1 py-2 transition-all dark:bg-[#302E2E]`}
            >
                <Settings
                    className="w-5"
                    onClick={() => setSetttingsOpen(!settingsOpen)}
                />
            </Button>
            <SettingsMenu isOpen={settingsOpen} setIsOpen={setSetttingsOpen} />
        </motion.nav>
    )
}
