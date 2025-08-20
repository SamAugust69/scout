import { DynamicForm } from "@/components/forms/DynamicForm"
import { motion } from "framer-motion"
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "../ui/resizeable"

export const FormBuilder = () => {
    return (
        <ResizablePanelGroup direction="horizontal">
            <ResizablePanel
                className="relative text-neutral-700 dark:bg-[#1f1d1d]"
                minSize={50}
            >
                {/* <DynamicForm className="m-4" /> */}

                <aside className="absolute bottom-4 left-1/2 mx-auto h-16 w-52 -translate-x-1/2 rounded border border-neutral-600 p-2 dark:bg-[#272424]">
                    test
                </aside>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel
                minSize={20}
                defaultSize={20}
                className="border-l border-neutral-600 p-2"
            >
                Nav
            </ResizablePanel>
        </ResizablePanelGroup>
    )
}
