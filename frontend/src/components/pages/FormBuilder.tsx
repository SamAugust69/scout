import { DynamicForm } from "@/components/form/DynamicForm"
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "../ui/resizeable"
import React, { useEffect, useState, useCallback } from "react"
import {
    Dropdown,
    DropdownButton,
    DropdownChevron,
    DropdownContent,
    DropdownDivider,
    DropdownItem,
    DropdownItemIcon,
} from "../ui/dropdown"
import { Button, buttonVariants } from "../ui/button"
import { Plus, GripVertical, LucideIcon, Menu } from "lucide-react"
import { Input } from "../ui/input"
import { cn } from "@/lib/utils"
import clsx from "clsx"
import { Link, useParams } from "react-router-dom"
import { Paragraph } from "../ui/paragraph"
import { Form, useFormStorage } from "@/lib/useFormStorage"
import { Divider } from "../ui/divider"
import { motion, Reorder } from "framer-motion"
import {
    formComponentRegistry,
    PageComponent,
} from "../form/formComponentRegisry"

export type FormPage = {
    name: string
    form: PageComponent[]
}

export const FormBuilder = () => {
    const { id } = useParams()
    const { getForm, saveForm } = useFormStorage()

    const [form, setForm] = useState<Form | undefined>(undefined)
    const [hasChanges, setHasChanges] = useState<boolean>(false)

    useEffect(() => {
        if (!id) return

        const formData = getForm(id)
        setForm(formData)
    }, [id, getForm])

    const updateForm = (changes: Partial<Form>) => {
        setForm((prev) => {
            if (!prev) return prev
            return {
                ...prev,
                ...changes,
            }
        })
        setHasChanges(true)
    }

    const handleSaveChanges = () => {
        if (!id || !form) return
        saveForm(id, form)
        setHasChanges(false)
    }

    const [selectedComponent, setSelectedComponent] = useState<string | null>(
        null
    )
    const [activePage, setActivePage] = useState<number>(0)

    // Use useCallback to memoize the function and include dependencies
    const onKeyPress = useCallback(
        (e: KeyboardEvent) => {
            switch (e.key) {
                case "Delete":
                    if (!selectedComponent || !form) return
                    // delete component from page
                    const updatedPages = form.pages.map((page, index) =>
                        index === activePage
                            ? {
                                  ...page,
                                  form: page.form.filter(
                                      (component) =>
                                          component.id !== selectedComponent
                                  ),
                              }
                            : page
                    )

                    updateForm({ pages: updatedPages })
                    setSelectedComponent(null) // Clear selection after deletion
                    break
            }
        },
        [selectedComponent, form, activePage, updateForm]
    )

    useEffect(() => {
        window.addEventListener("keyup", onKeyPress)

        // Fixed cleanup function - it was missing 'return'
        return () => {
            window.removeEventListener("keyup", onKeyPress)
        }
    }, [onKeyPress]) // Include onKeyPress in dependency array

    if (!id) {
        return <div>Form Not Found</div>
    }

    return (
        <div className="grid w-full grid-cols-1 grid-rows-[45px_1fr]">
            <nav className="flex items-center justify-between border-b border-neutral-700 px-4 py-2 dark:bg-[#1b1919]">
                <div className="flex items-center">
                    <Link
                        to={"/form-dashboard"}
                        className={cn(
                            clsx(
                                buttonVariants({
                                    variant: "link",
                                    size: "none",
                                }),
                                "flex items-center gap-2 text-sm"
                            )
                        )}
                    >
                        <Menu className="h-6 w-6" /> Go Back
                    </Link>
                    <span className="mx-4 block h-full w-0.5 rounded bg-neutral-600" />
                    <Paragraph>{form?.title}</Paragraph>
                </div>
                {hasChanges && (
                    <Button variant="link" onClick={handleSaveChanges}>
                        Save Changes
                    </Button>
                )}
            </nav>
            <ResizablePanelGroup direction="horizontal">
                <ResizablePanel
                    minSize={15}
                    maxSize={25}
                    defaultSize={15}
                    style={{
                        overflow: "visible",
                    }}
                    className="border-r border-neutral-700"
                >
                    {form && form.pages ? (
                        <ComponentPalette
                            currentPage={activePage}
                            form={form}
                            onUpdate={updateForm}
                            selectedComponent={selectedComponent}
                            setSelectedComponent={setSelectedComponent}
                        />
                    ) : (
                        <div>Loading</div>
                    )}
                </ResizablePanel>
                <ResizableHandle />
                <ResizablePanel
                    className="dots relative flex items-center justify-center p-4 text-neutral-700 dark:bg-[#1d1b1b]"
                    minSize={35}
                >
                    {form && form.pages ? (
                        <DynamicForm
                            config={form.pages}
                            activePage={activePage}
                            setActivePage={setActivePage}
                        />
                    ) : (
                        <div>Loading...</div>
                    )}
                </ResizablePanel>
                <ResizableHandle />
                <ResizablePanel
                    minSize={15}
                    maxSize={25}
                    defaultSize={15}
                    className="border-l border-neutral-700 p-2"
                >
                    {form && form.pages ? (
                        selectedComponent ? (
                            <ComponentProperties />
                        ) : (
                            <PageProperties
                                currentPage={activePage}
                                form={form}
                                onUpdate={updateForm}
                                onPageChange={(i) => setActivePage(i)}
                            />
                        )
                    ) : (
                        <div>Loading</div>
                    )}
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    )
}

const ComponentProperties = () => {
    return <div>Component Properties Panel</div>
}

const PageProperties = ({
    onUpdate,
    onPageChange,
    currentPage,
    form,
}: {
    onUpdate: (updates: Partial<Form>) => void
    onPageChange: (pageIndex: number) => void
    currentPage: number
    form: Form
}) => {
    const page = form.pages[currentPage]
    const [showPageReorder, setShowPageReorder] = useState(false)

    const createNewPage = () => {
        onUpdate({
            pages: [
                ...form.pages,
                { form: [], name: `Page ${form.pages.length + 1}` },
            ],
        })
        onPageChange(form.pages.length)
    }

    const updatePage = (pageIndex: number, changes: Partial<FormPage>) => {
        onUpdate({
            pages: form.pages.map((formPage, index) =>
                index === pageIndex ? { ...formPage, ...changes } : formPage
            ),
        })
    }

    const handleReorderPages = (newOrder: FormPage[]) => {
        const oldCurrentPage = form.pages[currentPage]
        const newCurrentPageIndex = newOrder.findIndex(
            (p) => p === oldCurrentPage
        )

        onUpdate({ pages: newOrder })
        onPageChange(newCurrentPageIndex >= 0 ? newCurrentPageIndex : 0)
    }

    return (
        <div className="relative flex flex-col gap-2 p-1">
            <div>
                <label className="text-sm font-medium">Form Title</label>
                <Input
                    defaultValue={form.title}
                    onChange={(e) => {
                        onUpdate({ title: e.currentTarget.value })
                    }}
                />
            </div>
            <div>
                <label className="text-sm font-medium">Year</label>
                <Input
                    defaultValue={form.year}
                    numbersOnly
                    onChange={(e) => {
                        onUpdate({ year: Number(e.currentTarget.value) })
                    }}
                />
            </div>

            <div>
                <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Pages</label>
                    <Button
                        size="xs"
                        onClick={() => setShowPageReorder(!showPageReorder)}
                    >
                        {showPageReorder ? "Done" : "Reorder"}
                    </Button>
                </div>

                {showPageReorder ? (
                    <div className="max-h-64 space-y-2 overflow-y-auto p-1">
                        <Reorder.Group
                            axis="y"
                            values={form.pages}
                            onReorder={handleReorderPages}
                            layoutScroll
                        >
                            {form.pages.map((formPage, index) => (
                                <Reorder.Item
                                    key={`${formPage.name}-${index}`}
                                    value={formPage}
                                    className="cursor-grab active:cursor-grabbing"
                                    whileDrag={{
                                        scale: 1.02,
                                        boxShadow:
                                            "0 4px 12px rgba(0,0,0,0.15)",
                                        zIndex: 10,
                                    }}
                                    dragTransition={{
                                        bounceStiffness: 300,
                                        bounceDamping: 40,
                                        power: 0.2,
                                    }}
                                    dragElastic={0.05}
                                >
                                    <motion.div
                                        className={cn(
                                            "flex items-center gap-2 rounded border p-2 text-sm",
                                            index === currentPage
                                                ? "border-blue-300 bg-blue-50 dark:border-blue-700 dark:bg-blue-950/20"
                                                : "border-gray-200 bg-white dark:border-neutral-700 dark:bg-neutral-800"
                                        )}
                                        whileHover={{ y: -1 }}
                                        layout
                                    >
                                        <GripVertical className="h-4 w-4 flex-shrink-0 text-gray-400" />
                                        <span className="flex-1 truncate">
                                            {formPage.name}
                                        </span>
                                        <span className="flex-shrink-0 text-xs text-gray-500">
                                            {index + 1}
                                        </span>
                                    </motion.div>
                                </Reorder.Item>
                            ))}
                        </Reorder.Group>

                        <Button
                            size="lg"
                            onClick={createNewPage}
                            className="flex w-full items-center justify-between"
                        >
                            Add New Page
                            <Plus className="mr-2 h-4 w-4" />
                        </Button>
                    </div>
                ) : (
                    <Dropdown disabled={!page}>
                        <DropdownButton>
                            <Button
                                variant="dark"
                                size="lg"
                                className="flex w-full items-center justify-between text-left"
                                onClick={() => !page && createNewPage()}
                            >
                                {page ? page.name : "Create New"}
                                {page ? <DropdownChevron /> : <Plus />}
                            </Button>
                        </DropdownButton>
                        <DropdownContent className="absolute left-0 w-full translate-x-0">
                            {form.pages.map(({ name }, i) => {
                                return (
                                    <DropdownItem
                                        key={name}
                                        onClick={() => onPageChange(i)}
                                        className={
                                            i === currentPage
                                                ? "bg-blue-50 dark:bg-blue-950/20"
                                                : ""
                                        }
                                    >
                                        <span className="flex-1">{name}</span>
                                        <span className="ml-2 text-xs text-gray-500">
                                            {i + 1}
                                        </span>
                                    </DropdownItem>
                                )
                            })}
                            <DropdownDivider />
                            <DropdownItem onClick={createNewPage}>
                                <DropdownItemIcon>
                                    <Plus />
                                </DropdownItemIcon>{" "}
                                Create New Page
                            </DropdownItem>
                        </DropdownContent>
                    </Dropdown>
                )}
            </div>

            <Divider className="my-2" />
            {page && (
                <>
                    <div>
                        <label className="text-sm font-medium">
                            Page Title
                        </label>
                        <Input
                            value={page.name}
                            onChange={(e) =>
                                updatePage(currentPage, {
                                    name: e.currentTarget.value,
                                })
                            }
                        />
                    </div>
                    <Divider className="my-2" />
                </>
            )}
        </div>
    )
}

const ComponentPalette = ({
    onUpdate,
    currentPage,
    form,
    selectedComponent,
    setSelectedComponent,
}: {
    onUpdate: (updates: Partial<Form>) => void
    currentPage: number
    form: Form
    setSelectedComponent: React.Dispatch<React.SetStateAction<string | null>>
    selectedComponent: string | null
}) => {
    const [activePage, setActivePage] = useState<FormPage | undefined>(
        undefined
    )

    useEffect(() => {
        setActivePage(form.pages[currentPage])
    }, [form, currentPage])

    const addComponent = (type: keyof typeof formComponentRegistry) => {
        const componentRegistry = formComponentRegistry[type]
        const newComponent: PageComponent = {
            id: crypto.randomUUID(),
            type: type,
            props: {
                ...componentRegistry.defaultProps,
            },
        }
        onUpdate({
            pages: form.pages.map((formPage, index) =>
                index === currentPage
                    ? { ...formPage, form: [...formPage.form, newComponent] }
                    : formPage
            ),
        })
    }

    return (
        <>
            <div className="flex items-center justify-between border-b border-neutral-700 px-4 py-3">
                <Paragraph className="font-semibold">Elements</Paragraph>
                <Dropdown disabled={false}>
                    <DropdownButton>
                        <Button
                            size="sm"
                            className="flex items-center gap-1"
                            variant="link"
                        >
                            <Plus className="h-5 w-5" />
                            Add
                        </Button>
                    </DropdownButton>
                    <DropdownContent position="left" size="md" className="p-0">
                        <Paragraph
                            size="sm"
                            className="border-b border-neutral-700 p-2 font-semibold"
                        >
                            Add Elements
                        </Paragraph>
                        <div className="grid grid-cols-3 gap-2 p-2">
                            {Object.entries(formComponentRegistry).map(
                                ([type, props]) => {
                                    const Icon = (
                                        props as typeof props & {
                                            icon?: LucideIcon
                                        }
                                    ).icon

                                    return (
                                        <Button
                                            key={type}
                                            className="flex h-20 flex-col items-center justify-center gap-1 text-sm"
                                            size="none"
                                            onClick={() =>
                                                addComponent(
                                                    type as keyof typeof formComponentRegistry
                                                )
                                            }
                                        >
                                            {Icon && (
                                                <Icon className="h-5 w-5" />
                                            )}{" "}
                                            {props.name}
                                        </Button>
                                    )
                                }
                            )}
                        </div>
                    </DropdownContent>
                </Dropdown>
            </div>
            <div className="flex flex-col py-1">
                {activePage &&
                    activePage.form.map(({ id, type }) => {
                        const component = formComponentRegistry[type]
                        return (
                            <>
                                <div draggable>
                                    <Button
                                        key={id}
                                        variant="link"
                                        className={`relative flex items-center gap-2 rounded-none py-2 ${selectedComponent === id ? "dark:bg-blue-200/25 dark:hover:bg-blue-200/15" : ""}`}
                                        size="sm"
                                        onClick={() =>
                                            selectedComponent !== id
                                                ? setSelectedComponent(id)
                                                : setSelectedComponent(null)
                                        }
                                    >
                                        <component.icon className="h-3 w-3 dark:text-neutral-500" />
                                        {component.name}
                                    </Button>
                                </div>
                                <DropIndicator beforeId="-1" />
                            </>
                        )
                    })}
            </div>
        </>
    )
}

const DropIndicator = ({ beforeId }: { beforeId: string }) => {
    return <span className="block h-0.5 w-full bg-blue-200/50"></span>
}
