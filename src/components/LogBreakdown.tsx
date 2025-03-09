import { useState } from "react"
import { Paragraph } from "./ui/paragraph"
import { Log, logConfig } from "./forms/formConfig"
import { ChevronDown, ChevronUp } from "lucide-react"

interface LogBreakdownInterface {
    log: Log<keyof typeof logConfig>
}

export const LogBreakdown = ({log}: LogBreakdownInterface) => {
    const [open, setOpen] = useState(false)

    return (
        <li className="dark:border-neutral-600 border-b last:border-0 hover:cursor-pointer" onClick={() => setOpen(!open)}>
            <div className="flex justify-between py-2 px-3">
                <Paragraph size="sm">Match {log.match}</Paragraph>
                <div className="flex gap-4 items-center">
                    {log.damaged ?<Paragraph size="xs" className="dark:text-yellow-400">Damaged</Paragraph> : null}
                    { log.broken ? <Paragraph size="xs" className="dark:text-red-400">Broken</Paragraph> : null}
                    { log.defence ? <Paragraph size="xs" className="dark:text-blue-400">Defence</Paragraph> : null}
                    {!open ?<ChevronDown className="w-4"/> : <ChevronUp className="w-4"/>}

                </div>
            </div>
            {open ?
            <div className="dark:bg-neutral-800/50 px-3 py-2 relative">
                <div className="flex gap-4 right-3">

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

                <Paragraph size="xs" className="mt-2">Auto</Paragraph>
                <Paragraph className="ml-1">{JSON.stringify(log.auto) || "N/A"}</Paragraph>
                <Paragraph size="xs" className="mt-2">Teleop</Paragraph>

                <Paragraph className="ml-1">{JSON.stringify(log.teleop) || "N/A"}</Paragraph>

                <Paragraph size="xs" className="mt-2">Notes</Paragraph>
                
                <Paragraph size="sm" className="ml-1">{log.notes ? `"${log.notes}"` : "N/A"}</Paragraph>

            </div> : null}

        </li>
    )
}