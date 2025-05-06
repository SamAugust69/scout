import { useState } from "react"
import { Paragraph } from "./ui/paragraph"
import { Log, logConfig } from "./forms/formConfig"
import { ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "./ui/button"

interface LogBreakdownInterface {
    log: Log<keyof typeof logConfig>
}

export const LogBreakdown = ({ log }: LogBreakdownInterface) => {
    const [open, setOpen] = useState(false)

    return (
        <Button
            variant="none"
            className="relative w-full rounded-none border-b p-0 text-left last:border-0 hover:cursor-pointer dark:border-neutral-600"
            onClick={() => setOpen(!open)}
        >
            <div className="sticky top-10 flex justify-between bg-[#302E2E] px-3 py-2">
                <Paragraph size="sm">Match {log.match}</Paragraph>
                <div className="flex items-center gap-4">
                    {log.damaged ? (
                        <Paragraph size="xs" className="dark:text-yellow-400">
                            Damaged
                        </Paragraph>
                    ) : null}
                    {log.broken ? (
                        <Paragraph size="xs" className="dark:text-red-400">
                            Broken
                        </Paragraph>
                    ) : null}
                    {log.defence ? (
                        <Paragraph size="xs" className="dark:text-blue-400">
                            Defence
                        </Paragraph>
                    ) : null}
                    {!open ? (
                        <ChevronDown className="w-4" />
                    ) : (
                        <ChevronUp className="w-4" />
                    )}
                </div>
            </div>
            {open ? (
                <div className="relative px-3 py-2 dark:bg-neutral-800/50">
                    <div className="right-3 flex gap-4">
                        <div>
                            <Paragraph size="xs">Auto Score</Paragraph>
                            {log.score.autoScore.toPrecision(2)}
                        </div>
                        <div className="">
                            <Paragraph size="xs">Teleop Score</Paragraph>
                            {log.score.teleopScore.toPrecision(2)}
                        </div>
                        <div className="">
                            <Paragraph size="xs">Scouter</Paragraph>
                            {log.scout}
                        </div>
                    </div>

                    <Paragraph size="xs" className="mt-2">
                        Auto
                    </Paragraph>
                    <Paragraph className="ml-1">
                        {JSON.stringify(log.auto) || "N/A"}
                    </Paragraph>
                    <Paragraph size="xs" className="mt-2">
                        Teleop
                    </Paragraph>

                    <Paragraph className="ml-1">
                        {JSON.stringify(log.teleop) || "N/A"}
                    </Paragraph>

                    <Paragraph size="xs" className="mt-2">
                        Notes
                    </Paragraph>

                    <Paragraph size="sm" className="ml-1">
                        {log.notes ? `"${log.notes}"` : "N/A"}
                    </Paragraph>
                </div>
            ) : null}
        </Button>
    )
}
