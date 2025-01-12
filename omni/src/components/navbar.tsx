import { useDarkModeContext } from "@/lib/context/darkModeContext"
import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ConnectionStatus } from "./ConnectionStatus"
import { ChevronsLeft, ChevronsRight, Moon, Settings, Sun } from "lucide-react"
import { Button, buttonVariants } from "./ui/button"
import { SettingsMenu } from "./Settings"
import { Link } from "react-router-dom"
import { cn } from "@/lib/utils"
import { MatchNavigation } from "./MatchNavigation"

export const Navbar = () => {
    // const [open, setOpen] = useState(false)
    const [settingsOpen, setSettingsOpen] = useState<boolean>(false)
    const { setDark, dark } = useDarkModeContext()

    const openWidth = 400
    const closedWidth = 110
    const [width, setWidth] = useState<number>(closedWidth)

    // const handleDrag = (event: any, info: any) => {
    //     // Check drag direction and distance
    //     setWidth((prev) => {
    //         return prev + info.offset.x
    //     })
    // }

    return (
        <motion.nav
            className={`group/nav scroll-bar-0 relative grid h-full max-h-screen shrink-0 grid-rows-[auto_1fr_auto] gap-4 bg-neutral-100 px-2 py-4 dark:bg-[#302E2E] ${
                width !== openWidth ? "cursor-pointer" : "cursor-auto"
            }`}
            animate={{ width: `${width}px` }}
            transition={{ duration: 0.1 }}
            onClick={() => width === closedWidth && setWidth(openWidth)}
        >
            <Button
                onClick={() =>
                    setWidth(width === openWidth ? closedWidth : openWidth)
                }
                className={`opacity-0 ${
                    width === openWidth ? "group-hover/nav:opacity-100" : null
                } absolute top-2 right-2 flex w-8 items-center justify-center p-1 transition-opacity`}
            >
                <ChevronsLeft />
            </Button>
            <Button
                onClick={() =>
                    setWidth(width === openWidth ? closedWidth : openWidth)
                }
                className={`opacity-0 ${
                    width !== openWidth ? "group-hover/nav:opacity-100" : null
                } absolute top-2 -right-10 flex w-8 items-center justify-center rounded p-1 transition-all dark:bg-[#302E2E]`}
            >
                <ChevronsRight />
            </Button>

            <ConnectionStatus open={width === openWidth} />
            <AnimatePresence>
                <motion.div
                    initial={{ y: 5, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 5, opacity: 0 }}
                    transition={{ duration: 1 }}
                    className="row-span-11 flex h-full flex-col gap-1"
                >
                    {width === openWidth && <MatchNavigation />}
                </motion.div>
            </AnimatePresence>

            <div
                className={`flex ${
                    width === openWidth ? "justify-between" : "justify-center"
                } gap-1 rounded px-4`}
            >
                <Link
                    to={"/help"}
                    className={cn(
                        buttonVariants({ variant: "link" }),
                        `text-sm ${width === openWidth ? "" : "hidden"}`
                    )}
                    onClick={() =>
                        setWidth(width === openWidth ? closedWidth : openWidth)
                    }
                >
                    Help
                </Link>
                <div className="flex gap-4">
                    <Button
                        variant="secondary"
                        onClick={() => setSettingsOpen(!settingsOpen)}
                        className={` ${width !== openWidth ? "hidden" : "flex"} w-10 items-center justify-center rounded p-1 transition-all`}
                    >
                        <Settings className="w-5" />
                    </Button>
                    <Button
                        variant="secondary"
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

            <Button
                onClick={() => setSettingsOpen(!settingsOpen)}
                className={`absolute -right-12 bottom-2 flex w-10 items-center justify-center rounded p-1 py-2 opacity-100 transition-all dark:bg-[#302E2E]`}
            >
                <Settings
                    className="w-5"
                    onClick={() => setSettingsOpen(!settingsOpen)}
                />
            </Button>
            <SettingsMenu isOpen={settingsOpen} setIsOpen={setSettingsOpen} />
        </motion.nav>
    )
}
