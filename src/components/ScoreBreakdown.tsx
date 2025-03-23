import { Button } from "./ui/button"
import { Paragraph } from "./ui/paragraph"
import { Log, logConfig } from "./forms/formConfig"
import { LogScore } from "@/lib/types/logTypes"
import { Heading } from "./ui/heading"
import { useState } from "react"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "./ui/chart"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { LogBreakdown } from "./LogBreakdown"

const extractScoresFromLogs = (logs: Log<keyof typeof logConfig>[]) => {
    const scores: ({ match: number } & LogScore)[] = []
    logs.map((log) => {
        scores.push({ ...log.score, match: log.match })
    })
    return scores.sort((a, b) => a.match - b.match)
}

interface ScoreBreakdownInterface {
    logs: Log<keyof typeof logConfig>[]
    team: string
}

const averageScores = (
    logs: ({
        match: number
    } & LogScore)[]
) => {
    const averages = { autoAverage: 0, teleopAverage: 0 }
    logs.forEach((score) => {
        averages.autoAverage += score.autoScore
        averages.teleopAverage += score.teleopScore
    })
    averages.autoAverage /= logs.length
    averages.teleopAverage /= logs.length

    return averages
}

export const ScoreBreakdown = ({ logs, team }: ScoreBreakdownInterface) => {
    const logScores = extractScoresFromLogs(logs)
    const [breakdownAuto, setBreakdownAuto] = useState(true)

    const averages = averageScores(logScores)

    const chartConfig = {
        autoScore: {
            label: "Auto Score",
            color: "hsl(var(--chart-1))",
        },
        teleopScore: {
            label: "Teleop Score",
            color: "hsl(var(--chart-1))",
        },
    } satisfies ChartConfig

    return (
        <div className="rounded dark:bg-[#302E2E]">
            <Heading className="px-4 py-2">
                Team <span>{team}</span>
            </Heading>
            <div className="flex justify-between border-y dark:border-neutral-600">
                <div className="p-4">
                    <Heading>Match Score Breakdown</Heading>
                </div>
                <div className="flex w-full max-w-60">
                    <Button
                        variant="none"
                        onClick={() => setBreakdownAuto(true)}
                        className={`flex h-full grow basis-0 flex-col justify-center rounded-none border-x dark:border-neutral-600 ${breakdownAuto ? "dark:bg-neutral-600/50" : ""}`}
                    >
                        <Paragraph className="text-left text-xs font-semibold dark:text-neutral-400">
                            Auto Average
                        </Paragraph>
                        <Paragraph className="text-left font-bold dark:text-white">
                            {averages.autoAverage.toPrecision(2)}{" "}
                            <span className="text-xs dark:text-neutral-300">
                                points
                            </span>
                        </Paragraph>
                    </Button>
                    <Button
                        variant="none"
                        onClick={() => setBreakdownAuto(false)}
                        className={`grow basis-0 rounded-none ${!breakdownAuto ? "dark:bg-neutral-600/50" : ""}`}
                    >
                        <Paragraph className="text-left text-xs font-semibold dark:text-neutral-400">
                            Teleop Average
                        </Paragraph>
                        <Paragraph className="text-left font-bold dark:text-white">
                            {averages.teleopAverage.toPrecision(2)}{" "}
                            <span className="text-xs dark:text-neutral-300">
                                points
                            </span>
                        </Paragraph>
                    </Button>
                </div>
            </div>
            <ChartContainer
                config={chartConfig}
                className="py-4 dark:bg-neutral-800/50"
            >
                <AreaChart
                    data={logScores}
                    margin={{
                        right: 12,
                        top: 1,
                    }}
                >
                    <CartesianGrid vertical={false} stroke={`#585858`} />
                    <YAxis
                        dataKey={breakdownAuto ? "autoScore" : "teleopScore"}
                    />
                    <XAxis
                        dataKey={"match"}
                        height={40}
                        label={{
                            value: "Match",
                            position: "insideBottom",
                        }}
                        tickMargin={4}
                        tickLine={false}
                        axisLine={false}
                    />
                    <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent hideLabel />}
                    />
                    <Area
                        dataKey={breakdownAuto ? "autoScore" : "teleopScore"}
                        type="step"
                        fill="#34563c"
                        fillOpacity={0.4}
                        stroke={`#487251`}
                        strokeWidth={2}
                        isAnimationActive={false}
                    />
                </AreaChart>
            </ChartContainer>
            <ul className="border-t only:border-b dark:border-neutral-600">
                {logs.map((log, i) => (
                    <LogBreakdown key={i} log={log} />
                ))}
            </ul>
        </div>
    )
}
