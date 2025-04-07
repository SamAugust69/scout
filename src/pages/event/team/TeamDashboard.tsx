import { useParams } from "react-router-dom"

import { useState } from "react"
import { motion, useMotionValue, useTransform } from "framer-motion"

import packImg from "./pack.png"

export default function SwipeToOpen() {
    const x = useMotionValue(0)
    const [opened, setOpened] = useState(false)

    const scale = useTransform(x, [-200, 0, 200], [0.8, 1, 1.2])
    const clipPath = useTransform(
        x,
        [-300, 0, 300],
        ["inset(0% 100% 0% 0%)", "inset(0% 0% 0% 0%)", "inset(0% 0% 0% 100%)"]
    )

    const handleDragEnd = (_: any, info: any) => {
        if (Math.abs(info.offset.x) > 150) {
            setOpened(true)
        }
    }

    return (
        <div className="flex h-screen items-center justify-center bg-black">
            {!opened ? (
                <motion.div
                    drag="x"
                    style={{ x, scale, clipPath }}
                    dragConstraints={{ left: -300, right: 300 }}
                    onDragEnd={handleDragEnd}
                    className="h-96 w-64 rounded-xl bg-neutral-50 bg-cover bg-center shadow-xl"
                />
            ) : (
                <div className="text-2xl text-white">✨ Cards Revealed! ✨</div>
            )}
        </div>
    )
}

export const TeamDashboard = () => {
    const { id, team } = useParams()

    return (
        <div>
            {id} {team}
            <SwipeToOpen />
        </div>
    )
}
