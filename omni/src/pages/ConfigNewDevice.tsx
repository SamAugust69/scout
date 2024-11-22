import { Paragraph } from "@/components/ui/paragraph";
import { Heading } from "@/components/ui/heading";
import { Input } from "@/components/ui/input";

export const ConfigNewDevice = () => {
  return (
    <section className="p-4 flex flex-col w-full max-w-xl mx-auto gap-2">
      <Paragraph className="text-end font-bold mb-1">
        Setup New Device
      </Paragraph>
      <span className="h-0.5 w-full rounded mb-4 bg-[#7C8C77]"></span>
      <div className=" flex justify-center mx-auto w-full flex-col gap-4">
        <div>
          <Heading size="lg">Select an Event!</Heading>
          <Paragraph>No events? Create one below</Paragraph>
        </div>

        <Input id="test" placeholder="test" />
      </div>
    </section>
  );
};
