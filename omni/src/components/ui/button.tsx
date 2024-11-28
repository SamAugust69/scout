import { cn } from "@/lib/utils";
import { GetVariantProps, vs } from "@vtechguys/vs";
import clsx from "clsx";

import { motion, MotionProps } from "motion/react";
import { HTMLAttributes } from "react";

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
  base: "transition-colors rounded-sm",
  variants: {
    variant: {
      primary:
        "bg-neutral-100 hover:bg-neutral-50 dark:bg-neutral-700 dark:hover:bg-neutral-700/50 dark:text-neutral-300",
      secondary:
        "dark:text-neutral-300 dark:hover:bg-neutral-600 dark:bg-neutral-700 bg-neutral-300 hover:bg-neutral-200",
      link: "hover:underline dark:bg-transparent dark:hover:bg-transparent",
    },
    size: {
      lg: "w-40 h-12 px-4 py-2",
      md: "px-4 py-1",
      default: "px-3 py-1",
      none: "",
    },
  },
  defaultVariants: {
    size: "default",
    variant: "primary",
  },
});

interface ButtonInterface
  extends MotionProps,
    GetVariantProps<typeof buttonVariants>,
    Omit<HTMLAttributes<HTMLButtonElement>, keyof MotionProps> {}

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
        e.stopPropagation();
        onClick && onClick(e);
      }}
      className={cn(clsx(buttonVariants({ variant, size })), className)}
      {...props}
    >
      {children}
    </motion.button>
  );
};
