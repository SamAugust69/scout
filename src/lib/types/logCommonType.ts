// This is our common file, this shouldn't be modified.
// make a new log{year}.ts file, and create a schema.

import { Log, logConfig } from "@/components/forms/formConfig"
import { LogStatistics } from "./logTypes"

// Types that all logs should contain, no matter the year

export type EventCommon = {
    id: string
    name: string
    week: number
    year: number
    event_code: number
    schedule: Array<any>
}

export const scoreLog = <Y extends keyof typeof logConfig>(
    formChanges: Partial<Log<Y>>,
    scoringMap: { [key: string]: number }
): LogStatistics => {
    var scores: { [key: string]: number } = {}

    Object.entries(formChanges).map(([section, values]) => {
        if (typeof values === "object" && values !== null) {
            // is object

            Object.entries(values).map(([key, value]) => {
                console.log(
                    `${section}.${key}: ${scoringMap[`${section}.${key}`]}`
                )
                // console.log(`${section}.${key}`)

                if (!scoringMap[`${section}.${key}`]) return
                const prevScore = scores[section] || 0

                const newScore =
                    prevScore +
                    ((value as number) || 0) * scoringMap[`${section}.${key}`]

                scores[section] = newScore
                console.log(scores)
            })
            console.log(scores)
        }
    })

    return {
        autoScore: scores?.auto || 0,
        teleopScore: scores?.teleop || 0,
    }
}
