import { cn } from '@/lib/utils';
import { GetVariantProps, vs } from '@vtechguys/vs';
import clsx from 'clsx';

import { motion } from 'motion/react';
import { HTMLAttributes } from 'react';

// export const Button = ({ children, onClick, className }: HTMLAttributes<HTMLButtonElement>) => {
// 	return (
// 		<motion.button
// 			onClick={(e) => {
// 				e.stopPropagation();
// 				onClick && onClick(e);
// 			}}
// 			className={cn(
// 				'dark:text-neutral-300 dark:hover:bg-neutral-600 dark:bg-neutral-700 bg-neutral-300 hover:bg-neutral-200 rounded transition-colors',
// 				className
// 			)}
// 		>
// 			{children}
// 		</motion.button>
// 	);
// };

export const buttonVariants = vs({
	base: 'transition-colors',
	variants: {
		variant: {
			primary:
				'dark:text-neutral-300 dark:hover:bg-neutral-600 dark:bg-neutral-700 bg-neutral-300 hover:bg-neutral-200 rounded',
		},
		size: {
			small: 'px-3 py-1',
		},
	},
	defaultVariants: {
		size: 'small',
		variant: 'primary',
	},
});

interface ButtonInterface extends HTMLAttributes<HTMLButtonElement>, GetVariantProps<typeof buttonVariants> {}

export const Button = ({ variant, size, className, children, ...props }: ButtonInterface) => {
	return (
		<motion.button className={cn(clsx(buttonVariants({ variant, size })), className)} {...props}>
			{children}
		</motion.button>
	);
};
