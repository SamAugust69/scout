import { Log, logConfig } from "@/components/forms/formConfig"
import { Paragraph } from "@/components/ui/paragraph"
import { getLogs } from "@/lib/getLogs"
import { Event } from "@/lib/types/eventType"
import { useState, useMemo } from "react"

interface FartInterface {
    value: [
        string,
        {
            amount: number
            notes: string[]
        },
    ]
    logs: Log<keyof typeof logConfig>[]
}

const Fart = ({ value, logs }: FartInterface) => {
    const [open, setOpen] = useState(false)
    console.log(value)
    return (
        <>
            <li
                onClick={() => setOpen(!open)}
                className="flex justify-between border-b p-2 even:bg-[#302E2E]/50 dark:border-neutral-600 dark:bg-[#302E2E]"
            >
                {value[0]}
                <div className="flex gap-4">
                    <Paragraph size="xs">
                        <span className="pl-4 text-base">
                            {value[1].amount}
                        </span>
                    </Paragraph>
                    <Paragraph>
                        {((value[1].amount / logs.length) * 100).toPrecision(2)}
                        %
                    </Paragraph>
                    <Paragraph>
                        {(
                            (value[1].notes.length / value[1].amount) *
                            100
                        ).toPrecision(3)}
                        %
                    </Paragraph>
                </div>
            </li>
            {open ? (
                <div className="border-b border-neutral-600 p-2">
                    {value[1].notes.map((note, i) => {
                        return (
                            <div key={i} className="max-h-32 overflow-scroll">
                                "{note}"
                            </div>
                        )
                    })}
                </div>
            ) : null}
        </>
    )
}

export const EventStats = () => {
    const [eventData, setEventData] = useState<Event | undefined>(undefined)

    const uploadEvent = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files) return

        const fileReader = new FileReader()

        fileReader.readAsText(files[0])

        fileReader.onload = (e) => {
            try {
                const data = JSON.parse(e.target?.result as string)
                setEventData(data)
            } catch (error) {
                console.error("Error parsing JSON:", error)
            }
        }
    }

    const logs = useMemo(
        () => (eventData ? getLogs(eventData.match_logs) : []),
        [eventData]
    )

    const totalScouted = useMemo(() => {
        const scouted: { [key: string]: { amount: number; notes: string[] } } =
            {}
        logs.forEach((log) => {
            const key = log.scout?.replace(" ", "").toLocaleLowerCase()
            if (key) {
                if (!scouted[key]) {
                    scouted[key] = { amount: 0, notes: [] }
                }
                scouted[key].amount += 1
                log.notes && scouted[key].notes.push(log.notes)
            }
        })
        return scouted
    }, [logs])

    if (!eventData) {
        return <input type="file" onChange={uploadEvent} accept=".json" />
    }

    return (
        <div className="flex w-full flex-col overflow-scroll p-2">
            {Object.entries(totalScouted)
                .sort((a, b) => b[1].amount - a[1].amount)
                .map((value, i) => (
                    <Fart logs={logs} value={value} key={i} />
                ))}
        </div>
    )
}
