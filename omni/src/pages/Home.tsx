import { Button, buttonVariants } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Paragraph } from "@/components/ui/paragraph";
import { cn } from "@/lib/utils";
import clsx from "clsx";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";

export const Home = () => {
  return (
    <section className="p-4 flex flex-col w-full max-w-xl mx-auto gap-2">
      <Paragraph className="text-end font-bold mb-1">Home</Paragraph>
      <span className="h-0.5 w-full rounded mb-4 bg-[#7C8C77]"></span>
      <div className=" flex justify-center mx-auto w-full flex-col gap-4">
        <div>
          <Heading size="lg">Select an Event!</Heading>
          <Paragraph>No events? Create one below</Paragraph>
        </div>
        <Link
          to="/create"
          className={cn(
            clsx(buttonVariants({ variant: "primary", size: "lg" })),
            "w-full flex justify-center items-center gap-2"
          )}
        >
          Add Event
          <Plus className="w-4" />
        </Link>
      </div>
    </section>
  );
};
