"use client"
import { motion } from "framer-motion"
import useMeasure from "react-use-measure"

const AnimatedPage = ({ children, ...props }: any) => {
    const [ref, { height }] = useMeasure()

    return (
        <motion.div animate={{ height }} className="overflow-hidden">
            <div ref={ref} {...props}>
                {children}
            </div>
        </motion.div>
    )
}

export default AnimatedPage
