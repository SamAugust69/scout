import { EventSearcher } from "@/components/EventSearcher"
import { Button, buttonVariants } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Paragraph } from "@/components/ui/paragraph"
import { cn } from "@/lib/utils"
import clsx from "clsx"
import { ChevronLeft } from "lucide-react"
import { useRef } from "react"
import { Link, useNavigate } from "react-router-dom"

export const Create = () => {
    const inputRef = useRef<HTMLInputElement | null>(null)
    const navigate = useNavigate()

    const uploadEvent = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files) return

        const fileReader = new FileReader()

        if (!fileReader) return

        fileReader.readAsText(files[0])

        fileReader.onload = (e) => {
            navigate("manual", {
                state: JSON.parse(e.target?.result as string),
            })
        }
    }
    return (
        <section className="mx-auto flex w-full max-w-xl flex-col gap-2 p-4">
            <div className="flex justify-between">
                <Dialog>
                    <DialogTrigger>
                        <Button
                            variant="link"
                            className="flex gap-2"
                            size="none"
                        >
                            <ChevronLeft className="w-4" /> Go Home
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogTitle>Are you sure?</DialogTitle>
                        <DialogDescription>
                            You'll lose all your progress
                        </DialogDescription>
                        <DialogFooter className="flex justify-between">
                            <DialogClose>
                                <Button size="md">Cancel</Button>
                            </DialogClose>
                            <Link
                                to={"/"}
                                className={cn(
                                    clsx(
                                        buttonVariants({
                                            variant: "primary",
                                            size: "md",
                                        })
                                    ),
                                    "bg-red-300 dark:bg-red-500"
                                )}
                            >
                                Lose Progress
                            </Link>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
                <Paragraph className="mb-1 font-bold">Create Event</Paragraph>
            </div>
            <span className="mb-4 h-0.5 w-full rounded-sm bg-[#7C8C77]"></span>
            {/* content */}
            <div className="mx-auto flex w-full flex-col justify-center gap-8">
                <EventSearcher />
                <div className="flex flex-col gap-2">
                    <Link
                        to={"/create/manual"}
                        className={cn(
                            clsx(
                                buttonVariants({
                                    variant: "primary",
                                    size: "lg",
                                })
                            ),
                            "flex w-full items-center justify-center gap-2"
                        )}
                    >
                        Create Manually
                    </Link>
                    <Button size="lg" onClick={() => inputRef.current?.click()}>
                        Import From .json
                    </Button>
                    <input
                        type="file"
                        className="hidden"
                        ref={inputRef}
                        onChange={uploadEvent}
                        accept=".json"
                    />
                </div>
            </div>
        </section>
    )
}
