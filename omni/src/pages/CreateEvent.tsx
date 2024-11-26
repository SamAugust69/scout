import { EventSearcher } from "@/components/EventSearcher";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Paragraph } from "@/components/ui/paragraph";
import { cn } from "@/lib/utils";
import clsx from "clsx";
import { ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";

export const Create = () => {
  return (
    <section className="p-4 flex flex-col w-full max-w-xl mx-auto gap-2">
      <div className="flex justify-between">
        <Dialog>
          <DialogTrigger>
            <Button variant="link" className="flex gap-2" size="none">
              <ChevronLeft className="w-4" /> Go Home
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>You'll lose all your progress</DialogDescription>
            <DialogFooter className="flex justify-between">
              <Button size="md">Cancel</Button>
              <DialogClose>
                <Link
                  to={"/"}
                  className={cn(
                    clsx(buttonVariants({ variant: "primary", size: "md" })),
                    "dark:bg-red-500 bg-red-300"
                  )}
                >
                  Lose Progress
                </Link>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Paragraph className="font-bold mb-1">Create Event</Paragraph>
      </div>
      <span className="h-0.5 w-full rounded mb-4 bg-[#7C8C77]"></span>
      {/* content */}
      <div className=" flex justify-center mx-auto w-full flex-col gap-8">
        <EventSearcher />
        <Link
          to={"/"}
          className={cn(
            clsx(buttonVariants({ variant: "primary", size: "lg" })),
            "w-full flex justify-center items-center gap-2"
          )}
        >
          Create Manually
        </Link>
      </div>
    </section>
  );
};
