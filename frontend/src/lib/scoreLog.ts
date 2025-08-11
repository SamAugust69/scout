import { Log, logConfig } from "@/components/forms/formConfig"
import { LogStatistics } from "./types/logTypes"

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
