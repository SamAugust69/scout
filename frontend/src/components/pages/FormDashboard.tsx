import { Dot, Edit, Ellipsis, LucideDelete } from "lucide-react"
import { Page, PageContent, PageHeader } from "../ui/page"
import { Paragraph } from "../ui/paragraph"
import { Link } from "react-router-dom"
import { Button, buttonVariants } from "../ui/button"
import { cn } from "@/lib/utils"
import { Divider } from "../ui/divider"
import {
    Dropdown,
    DropdownButton,
    DropdownContent,
    DropdownItem,
} from "../ui/dropdown"
import { Form, useFormStorage } from "@/lib/useFormStorage"
import { formatDistance } from "date-fns"

export const FormDashboard = () => {
    const { forms, saveForm, deleteForm } = useFormStorage()
    const createNewForm = () => {
        const date = new Date()

        const newForm: Form = {
            dateModified: date,
            pages: [],
            title: "New Form",
            year: date.getFullYear(),
        }

        const id = crypto.randomUUID()

        saveForm(id, newForm)
    }
    return (
        <Page>
            <PageHeader title="Form Dashboard" />
            <PageContent className="flex flex-col gap-4">
                {Object.entries(forms).map(([id, form]) => {
                    return (
                        <div
                            className={cn(
                                "relative flex flex-col rounded p-4 dark:bg-neutral-700"
                            )}
                        >
                            <div className="flex justify-between">
                                <Link
                                    to={`${id}`}
                                    className={cn(
                                        buttonVariants({ variant: "link" }),
                                        "truncate p-0 text-left text-xl font-bold"
                                    )}
                                >
                                    {form.title}
                                </Link>
                                <Dropdown>
                                    <DropdownButton>
                                        <Button variant="dark">
                                            <Ellipsis />
                                        </Button>
                                    </DropdownButton>
                                    <DropdownContent>
                                        <DropdownItem>Edit </DropdownItem>
                                        <DropdownItem
                                            className="dark:text-red-500"
                                            onClick={() => deleteForm(id)}
                                        >
                                            Delete{" "}
                                        </DropdownItem>
                                    </DropdownContent>
                                </Dropdown>
                            </div>
                            <Paragraph
                                size="sm"
                                className="flex items-center font-semibold dark:text-neutral-300"
                            >
                                {form.year}
                                <Dot />
                                Modified{" "}
                                {formatDistance(new Date(), form.dateModified, {
                                    includeSeconds: true,
                                })}{" "}
                                ago
                                <Dot />
                                Used in # Events
                            </Paragraph>
                        </div>
                    )
                })}
                <Divider className="bg-neutral-600" />
                <Button onClick={() => createNewForm()}>Create New Form</Button>
            </PageContent>
        </Page>
    )
}
