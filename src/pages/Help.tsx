import { buttonVariants } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"

import { Paragraph } from "@/components/ui/paragraph"
import { cn } from "@/lib/utils"
import clsx from "clsx"
import { ChevronLeft } from "lucide-react"
import { Link } from "react-router-dom"

export const Help = () => {
    return (
        <section className="mx-auto flex w-full max-w-xl flex-col gap-2 p-4">
            <div className="flex justify-between">
                <Link
                    to={"/"}
                    className={cn(
                        clsx(
                            buttonVariants({
                                variant: "link",
                                size: "none",
                            }),
                            "flex items-center gap-2"
                        )
                    )}
                >
                    <ChevronLeft className="w-4" /> Go Home
                </Link>
                <Paragraph className="font-bold">Help</Paragraph>
            </div>
            <span className="mb-3 h-0.5 w-full rounded-sm bg-[#7C8C77]"></span>
            {/* content */}
            <div className="mx-auto flex w-full flex-col justify-center">
                {/* <Accordion>
                    <AccordionItem label="Test" index={0}></AccordionItem>
                    <AccordionItem label="Test" index={1}></AccordionItem>
                </Accordion> */}
                <Heading size="lg" className="mb-2">
                    Export Server Setup
                </Heading>
                <Paragraph size="lg">
                    The export server allows communication between clients
                    through the use of a self-hosted server
                </Paragraph>
            </div>
        </section>
    )
}
