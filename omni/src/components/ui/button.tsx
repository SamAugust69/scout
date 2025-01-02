import { cn } from "@/lib/utils"
import { GetVariantProps, vs } from "@vtechguys/vs"
import clsx from "clsx"

import { motion, MotionProps } from "motion/react"
import { ButtonHTMLAttributes, HTMLAttributes } from "react"

// export const Button = ({ children, onClick, className }: HTMLAttributes<HTMLButtonElement>) => {
// 	return (
// 		<motion.button
// 			onClick={(e) => {
// 				e.stopPropagation();
// 				onClick && onClick(e);
// 			}}
// 			className={cn(
// 				'dark:text-neutral-300 dark:hover:bg-neutral-600 dark:bg-neutral-700 bg-neutral-300 hover:bg-neutral-200 rounded-sm transition-colors',
// 				className
// 			)}
// 		>
// 			{children}
// 		</motion.button>
// 	);
// };

export const buttonVariants = vs({
    base: "transition-colors rounded-sm cursor-pointer disabled:select-none disabled:cursor-not-allowed disabled:opacity-50",
    variants: {
        variant: {
            primary:
                "bg-neutral-100 enabled:hover:bg-neutral-50 dark:bg-neutral-700 enabled:dark:hover:bg-neutral-600/75 dark:text-neutral-300",
            secondary:
                "dark:text-neutral-300 dark:hover:bg-neutral-600 dark:bg-neutral-700 bg-neutral-300 hover:bg-neutral-200",
            link: "hover:underline dark:bg-transparent dark:hover:bg-transparent hover:text-neutral-700 dark:hover:text-neutral-300/65",
        },
        size: {
            xl: "h-15 px-4 py-2",
            lg: "h-12 px-4 py-2",
            md: "px-4 py-1",
            default: "px-3 py-1",
            none: "",
        },
    },
    defaultVariants: {
        size: "default",
        variant: "primary",
    },
})

interface ButtonInterface
    extends MotionProps,
        GetVariantProps<typeof buttonVariants>,
        Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof MotionProps> {}

export const Button = ({
    variant,
    size,
    className,
    children,
    onClick,
    ...props
}: ButtonInterface) => {
    return (
        <motion.button
            onClick={(e) => {
                e.stopPropagation()
                onClick && onClick(e)
            }}
            className={cn(clsx(buttonVariants({ variant, size })), className)}
            {...props}
        >
            {children}
        </motion.button>
    )
}
