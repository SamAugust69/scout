"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "./ui/chart"
import { HTMLAttributes } from "react"

interface LinearChartInterface extends HTMLAttributes<HTMLDivElement> {
    data: Array<any>
    dataKeyX: string
    dataKeyY: string
    suffix?: string
    margin?: number
    title?: string
}

export function LinearChart({
    data,
    title,
    dataKeyX,
    dataKeyY,
    className,
}: LinearChartInterface) {
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
        <div className="flex flex-col gap-2 rounded-md px-2 py-4">
            <h1 className="text-lg font-semibold text-neutral-400">{title}</h1>

            <ChartContainer config={chartConfig} className={className}>
                <AreaChart
                    height={500}
                    data={data}
                    margin={{
                        right: 12,
                    }}
                >
                    <CartesianGrid vertical={false} />
                    <YAxis dataKey={dataKeyY} />
                    <XAxis dataKey={dataKeyX} />
                    <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent hideLabel />}
                    />
                    <Area
                        dataKey={dataKeyY}
                        type="step"
                        fill="#34563c"
                        fillOpacity={0.4}
                        stroke={`#487251`}
                        strokeWidth={2}
                        isAnimationActive={false}
                    />
                </AreaChart>
            </ChartContainer>
        </div>
    )
}
