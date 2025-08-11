import { DynamicForm } from "@/components/forms/DynamicForm"
import { Page, PageContent, PageHeader } from "@/components/ui/page"

export const FormBuilder = () => {
    return (
        <Page size="desktop" className="max-h-screen">
            <PageHeader title="Form Builder" />
            <PageContent className="flex h-full w-full bg-white">
                <DynamicForm className="mx-auto" />
            </PageContent>
        </Page>
    )
}
