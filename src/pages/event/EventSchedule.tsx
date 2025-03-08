import { ScheduleMatchView } from "@/components/ScheduleMatchView"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { db } from "@/lib/db"
import { MatchInfo } from "@/lib/types/eventType"
import { useLiveQuery } from "dexie-react-hooks"
import { createRef, useState } from "react"
import { useParams } from "react-router-dom"

export const EventSchedule = () => {
    const { id } = useParams()
    if (!id) throw new Error("ID doesn't exist")

    const events = useLiveQuery(() =>
        db.events.where("id").equalsIgnoreCase(id).toArray()
    )

    const [scheduleMatchToSubmit, setScheduleMatchToSubmit] = useState<Partial<MatchInfo>>({})

    const eventData = events !== undefined ? events[0] : null

    const updateSchedule = (key: "red" | "blue", teamNumber: number, teamValue: number) => {
        setScheduleMatchToSubmit((prev) => {
            if (!matchRef.current) return prev
            const matchInfo = {
                match_number: Number(matchRef.current.value),
                [key]: [...(prev.red || [])]
            
                
            } as Partial<MatchInfo>

            if ( matchInfo[key])
                matchInfo[key][teamNumber] = String(teamValue)
            return matchInfo
            
        })
    }

    const submitSchedule = () => {
        console.log(scheduleMatchToSubmit)
    }

    const matchRef = createRef<HTMLInputElement>()
    return (
        <section className="mx-auto flex w-full max-w-2xl flex-col gap-2 p-4">
            <div className="grid mx-4 grid-cols-2 gap-1 justify-center rounded bg-neutral-100 px-4 py-3 dark:bg-[#302E2E]">
                <Input ref={matchRef} onClick={(e) => setScheduleMatchToSubmit((prev) => {return {...prev, match_number: Number(e.currentTarget.value)}})} className="row-span-1 col-span-2 "placeholder="Match #"/>
                <div className="flex flex-col gap-1 row-start-2">
                    <Input onChange={(e) => matchRef.current && updateSchedule( "red", 0, Number(e.currentTarget.value))} type="number" className="dark:bg-red-400 dark:text-neutral-900 dark:placeholder:text-neutral-800" placeholder="Team 1"/>
                    <Input onChange={(e) => matchRef.current && updateSchedule( "red", 1, Number(e.currentTarget.value))} type="number" className="dark:bg-red-400 dark:text-neutral-900 dark:placeholder:text-neutral-800" placeholder="Team 1"/>
                    <Input onChange={(e) => matchRef.current && updateSchedule( "red", 2, Number(e.currentTarget.value))} type="number" className="dark:bg-red-400 dark:text-neutral-900 dark:placeholder:text-neutral-800" placeholder="Team 1"/>
                </div>
                <div className="flex flex-col gap-1 row-start-2">
                    <Input onChange={(e) => matchRef.current && updateSchedule("blue", 0, Number(e.currentTarget.value))} type="number" className="dark:bg-blue-400 dark:text-neutral-900 dark:placeholder:text-neutral-800" placeholder="Team 1"/>
                    <Input onChange={(e) => matchRef.current && updateSchedule("blue", 1, Number(e.currentTarget.value))} type="number" className="dark:bg-blue-400 dark:text-neutral-900 dark:placeholder:text-neutral-800" placeholder="Team 2"/>
                    <Input onChange={(e) => matchRef.current && updateSchedule("blue", 2, Number(e.currentTarget.value))} type="number" className="dark:bg-blue-400 dark:text-neutral-900 dark:placeholder:text-neutral-800" placeholder="Team 3"/>
                </div>
                <Button className="col-span-2" onClick={submitSchedule}>Submit</Button>
            </div>
            <div className="flex flex-col gap-2 overflow-y-scroll rounded bg-neutral-100 px-4 py-3 dark:bg-[#302E2E]">
                {eventData?.schedule?.map((match, i) => {
                    return <ScheduleMatchView match={match} key={i} />
                })}
            </div>
        </section>
    )
}
