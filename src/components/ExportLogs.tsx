import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Paragraph } from "./ui/paragraph"

export const ExportLogs = () => {
    return (
        <div className="flex gap-2 rounded bg-neutral-100 p-4 dark:bg-[#302E2E]">
            {/* <div className="grid grid-cols-4 grid-rows-[auto_1fr]">
                <Paragraph size="sm" className="row-span-1">
                    Address
                </Paragraph>
                <Input
                    placeholder="http://localhost:155"
                    className="col-span-3 row-start-2"
                />
                <Button size="md" className="col-span-1 row-start-2">
                    Connect
                </Button>
            </div> */}

            <div className="w-full">
                <Paragraph size="sm" className="row-span-1">
                    Address
                </Paragraph>
                <div className="flex gap-2">
                    <Input
                        placeholder="http://localhost:155"
                        className="col-span-3 row-start-2"
                    />
                    <Button size="md" className="col-span-1 row-start-2">
                        Connect
                    </Button>
                </div>
            </div>
        </div>
    )
}
