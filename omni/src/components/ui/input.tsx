import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

interface InputInterface {
  placeholder?: string;
}

export const Input = ({
  className,
  ...props
}: HTMLAttributes<HTMLInputElement> & InputInterface) => {
  return (
    <input
      {...props}
      className={cn(
        "rounded dark:bg-neutral-900 py-2 px-4 focus:ring-2 outline-none placeholder-neutral-500 dark:placeholder-neutral-300  dark:text-neutral-300 w-full",
        className
      )}
    />
  );
};
