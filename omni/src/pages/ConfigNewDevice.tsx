import { Paragraph } from "@/components/ui/paragraph"
import { Heading } from "@/components/ui/heading"
import { Input } from "@/components/ui/input"

export const ConfigNewDevice = () => {
    return (
        <section className="mx-auto flex w-full max-w-xl flex-col gap-2 p-4">
            <Paragraph className="mb-1 text-end font-bold">
                Setup New Device
            </Paragraph>
            <span className="mb-4 h-0.5 w-full rounded-sm bg-[#7C8C77]"></span>
            <div className="mx-auto flex w-full flex-col justify-center gap-4">
                <div>
                    <Heading size="lg">Hey,</Heading>
                    <Paragraph>Lets get to know you</Paragraph>
                </div>
                <Input id="testaa" placeholder="Team Number" />
            </div>
        </section>
    )
}
