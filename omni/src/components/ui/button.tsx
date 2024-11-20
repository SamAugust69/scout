import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

export const Button = ({
  children,
  onClick,
  className,
}: HTMLAttributes<HTMLButtonElement>) => {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick && onClick(e);
      }}
      className={cn("dark:text-neutral-300", className)}
    >
      {children}
    </button>
  );
};
