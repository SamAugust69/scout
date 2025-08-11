import { useDarkModeContext } from "@/lib/context/darkModeContext"
import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ChevronsLeft, ChevronsRight, Moon, Settings, Sun } from "lucide-react"
import { Button } from "./ui/button"
import { SettingsMenu } from "./Settings"
import { MatchNavigation } from "./MatchNavigation"
import { useAppContext } from "@/lib/context/appContext"
import { Paragraph } from "./ui/paragraph"

export const Navbar = () => {
    // const [open, setOpen] = useState(false)
    const [settingsOpen, setSettingsOpen] = useState<boolean>(false)
    const { internetConnected } = useAppContext()

    const { setDark, dark } = useDarkModeContext()

    const [open, setOpen] = useState(false)

    const navRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            console.log(event.target)
            if (
                open &&
                navRef.current &&
                event.target &&
                !navRef.current?.contains(event.target as Node)
            ) {
                setOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () =>
            document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    return (
        <>
            <SettingsMenu isOpen={settingsOpen} setIsOpen={setSettingsOpen} />
            <div className="max-h-screen w-[75px] bg-white" ref={navRef}>
                <motion.nav
                    className={`absolute z-10 grid h-full grid-cols-1 grid-rows-[auto_1fr_auto] gap-2 bg-neutral-100 p-2 dark:bg-[#302E2E]`}
                    animate={{
                        width: open
                            ? Math.min(window.innerWidth, 500) + "px"
                            : "75px",
                    }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    onClick={() => !open && setOpen(true)}
                >
                    {/* open/close buttons */}

                    {/* connection status */}
                    <div
                        className={`mx-auto flex h-8 w-full max-w-32 items-center justify-center gap-2 rounded-sm bg-neutral-200 dark:bg-[#272424]`}
                    >
                        <div
                            className={`h-3 w-3 rounded-full ${internetConnected ? "bg-[#7C8C77]" : "bg-red-600"}`}
                        ></div>
                        <Paragraph
                            className={`text-sm ${!open ? "hidden size-0" : ""} transition-all`}
                        >
                            {internetConnected ? "connected" : "disconnected"}
                        </Paragraph>
                    </div>
                    {/* content */}
                    <div className="h-full w-full">
                        {open && <MatchNavigation />}
                    </div>
                    {/* settings/theme buttons */}
                    <div className={`flex ${open ? "" : "flex-col"} gap-2`}>
                        <Button
                            size="none"
                            variant="secondary"
                            onClick={() => setSettingsOpen(!settingsOpen)}
                            className="flex h-12 w-full items-center justify-center"
                        >
                            <Settings className="size-6" />
                        </Button>
                        <Button
                            size="none"
                            variant="secondary"
                            onClick={() => setDark(!dark)}
                            className="flex h-12 w-full items-center justify-center"
                        >
                            <Sun
                                className={`${dark ? "size-0" : "size-6"} transition-all`}
                            />
                            <Moon
                                className={`${!dark ? "size-0" : "size-6"} transition-all`}
                            />
                        </Button>
                    </div>
                </motion.nav>
            </div>
        </>
    )

    return (
        <div className="w-8">
            <motion.nav
                className={`group/nav scroll-bar-0 absolute z-40 grid h-full max-h-screen shrink-0 grid-cols-1 grid-rows-[auto_1fr_auto] bg-neutral-100 py-4 transition-transform dark:bg-[#302E2E] ${open ? "px-2" : "px-1"}`}
                onClick={() => setOpen(!open)}
                animate={{ width: open ? "100%" : "2.5rem" }}
            >
                {/* Open/Close Buttons */}
                <Button
                    className={`opacity-0 ${
                        width === openWidth ? "opacity-100" : null
                    } absolute top-2 right-2 flex w-8 items-center justify-center p-1 transition-opacity`}
                >
                    <ChevronsLeft />
                </Button>
                <Button
                    className={`opacity-0 ${width !== openWidth ? "group-hover/nav:opacity-100" : null} absolute top-2 -right-10 z-50 flex w-8 items-center justify-center rounded p-1 transition-all dark:bg-[#302E2E]`}
                >
                    <ChevronsRight />
                </Button>

                {/* Connection Status */}
                <div
                    className={`mx-auto flex h-8 w-full max-w-32 items-center justify-center gap-2 rounded-sm bg-neutral-200 dark:bg-[#272424]`}
                >
                    <div
                        className={`h-3 w-3 rounded-full ${internetConnected ? "bg-[#7C8C77]" : "bg-red-600"}`}
                    ></div>
                    <Paragraph
                        className={`text-sm ${!open ? "hidden size-0" : ""} transition-all`}
                    >
                        {internetConnected ? "connected" : "disconnected"}
                    </Paragraph>
                </div>

                {/* Content */}
                <AnimatePresence>
                    <motion.div
                        initial={{ y: 5, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 5, opacity: 0 }}
                        transition={{ duration: 1 }}
                        className="row-span-11 m-2 flex h-full flex-col"
                    >
                        {open && <MatchNavigation />}
                    </motion.div>
                </AnimatePresence>

                {/* footer */}

                <div
                    className={`flex ${!open ? "flex-col" : "px-2"} items-center justify-center gap-2`}
                >
                    <Button
                        variant="secondary"
                        onClick={() => setSettingsOpen(!settingsOpen)}
                        size="none"
                        className={`flex h-16 w-full items-center justify-center rounded transition-all`}
                    >
                        <Settings className="" />
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={() => setDark(!dark)}
                        size="none"
                        className="flex h-16 w-full items-center justify-center rounded-sm transition-colors"
                    >
                        <Sun
                            className={`${dark ? "size-0" : "size-5"} transition-all`}
                        />
                        <Moon
                            className={`${!dark ? "size-0" : "size-5"} transition-all`}
                        />
                    </Button>
                </div>

                {/* <Button
                onClick={() => setSettingsOpen(!settingsOpen)}
                className={`absolute -right-12 bottom-2 flex w-10 items-center justify-center rounded p-1 py-2 opacity-100 transition-all dark:bg-[#302E2E]`}
            >
                <Settings
                    className="w-5"
                    onClick={() => setSettingsOpen(!settingsOpen)}
                />
            </Button> */}
                <SettingsMenu
                    isOpen={settingsOpen}
                    setIsOpen={setSettingsOpen}
                />
            </motion.nav>
        </div>
    )
}
