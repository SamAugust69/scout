import { cn } from "@/lib/utils";
import { HTMLAttributes, InputHTMLAttributes } from "react";

interface InputInterface {}

export const Input = ({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & InputInterface) => {
  return (
    <input
      {...props}
      className={cn(
        "rounded-sm dark:bg-neutral-900 py-2 px-4 focus:ring-2 outline-hidden placeholder-neutral-500 dark:placeholder-neutral-300  dark:text-neutral-300 w-full border-2 dark:border-neutral-800 border-neutral-100 invalid:border-red-500  box-border",
        className
      )}
    />
  );
};
