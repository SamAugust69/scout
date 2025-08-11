import { DynamicForm } from "@/components/forms/DynamicForm"
import { Button } from "@/components/ui/button"
import { Page, PageContent, PageHeader } from "@/components/ui/page"
import { AnimatePresence, motion } from "framer-motion"
import { useState } from "react"

export const FormBuilder = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    return (
        <Page size="desktop" className="max-h-screen">
            <PageHeader title="Form Builder" />
            <PageContent className="dots flex h-full w-full overflow-hidden rounded bg-white dark:bg-neutral-900 dark:text-neutral-600">
                <AnimatePresence>
                    <DynamicForm className="m-4" />
                    <motion.div
                        className={`relative top-0 right-0 h-full w-[350px] rounded-r dark:bg-[#201f1f]`}
                        animate={{ x: isSidebarOpen ? 0 : 350 }}
                        transition={{
                            easings: [0.22, 1, 0.36, 1],
                            duration: 0.25,
                        }}
                    >
                        fart
                    </motion.div>
                    <Button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="absolute"
                    >
                        open
                    </Button>
                </AnimatePresence>
            </PageContent>
        </Page>
    )
}
