// This is our common file, this shouldn't be modified.
// make a new log{year}.ts file, and create a schema.

import { MatchStatistics } from "./eventType"
import { Log, logConfig } from "./logTypes"

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
): MatchStatistics => {
    var scores: { [key: string]: number } = {}

    Object.entries(formChanges).map(([section, values]) => {
        if (typeof values === "object" && values !== null) {
            // is object

            Object.entries(values).map(([key, value]) => {
                // console.log(`${section}.${key}`)
                const prevScore = scores[section] || 0
                const newScore =
                    prevScore +
                    (value as number) * scoringMap[`${section}.${key}`]

                console.log(newScore)

                scores[section] = newScore
            })
        }
    })

    console.log(scores)
    return {
        autoAverage: scores?.auto || 0,
        teleopAverage: scores?.teleop || 0,
    }
}
