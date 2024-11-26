import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

export const Paragraph = ({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) => {
  return (
    <p className={cn("dark:text-neutral-300", className)} {...props}>
      {children}
    </p>
  );
};
