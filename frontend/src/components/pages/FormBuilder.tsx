import { DynamicForm } from "@/components/form/DynamicForm"
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "../ui/resizeable"
import React, {
    useEffect,
    useState,
    useCallback,
    createContext,
    useContext,
} from "react"
import {
    Dropdown,
    DropdownButton,
    DropdownChevron,
    DropdownContent,
    DropdownDivider,
    DropdownItem,
    DropdownItemIcon,
    DropdownRadioButton,
    DropdownRadioGroup,
} from "../ui/dropdown"
import { Button, buttonVariants } from "../ui/button"
import { Plus, LucideIcon, Menu } from "lucide-react"
import { Input } from "../ui/input"
import { cn } from "@/lib/utils"
import clsx from "clsx"
import { Link, useParams } from "react-router-dom"
import { Paragraph } from "../ui/paragraph"
import { Form, useFormStorage } from "@/lib/useFormStorage"
import {
    formComponentRegistry,
    PageComponent,
    Schema,
} from "../form/formComponentRegisry"
import { Draggable, Droppable } from "../ui/drag"

export type FormPage = {
    name: string
    form: PageComponent[]
}

type FormBuilderContext = {
    form: Form
    activePage: FormPage
    activePageNumber: number
}

const FormBuilderContext = createContext<FormBuilderContext | undefined>(
    undefined
)

export const useFormBuilderContext = () => {
    const context = useContext(FormBuilderContext)
    if (!context)
        throw new Error("useFormBuilderContext must be used inside FormBuilder")
    return context
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

    const [selectedComponentId, setSelectedComponentId] = useState<
        string | undefined
    >(undefined)
    const [activePage, setActivePage] = useState<number>(0)

    const onKeyPress = useCallback(
        (e: KeyboardEvent) => {
            switch (e.key) {
                case "Delete":
                    if (!selectedComponentId || !form) return
                    // delete component from page
                    const updatedPages = form.pages.map((page, index) =>
                        index === activePage
                            ? {
                                  ...page,
                                  form: page.form.filter(
                                      (component) =>
                                          component.id !== selectedComponentId
                                  ),
                              }
                            : page
                    )

                    updateForm({ pages: updatedPages })
                    setSelectedComponentId(undefined)
                    break
            }
        },
        [selectedComponentId, form, activePage, updateForm]
    )

    useEffect(() => {
        window.addEventListener("keyup", onKeyPress)

        return () => {
            window.removeEventListener("keyup", onKeyPress)
        }
    }, [onKeyPress])
    if (!id || !form) {
        return <div>Form Not Found</div>
    }

    return (
        <FormBuilderContext.Provider
            value={{
                activePageNumber: activePage,
                form,
                activePage: form.pages[activePage],
            }}
        >
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
                        <ComponentPalette
                            onUpdate={updateForm}
                            selectedComponentId={selectedComponentId}
                            setSelectedComponentId={setSelectedComponentId}
                        />
                    </ResizablePanel>
                    <ResizableHandle />
                    <ResizablePanel
                        className="dots relative flex items-center justify-center p-4 text-neutral-700 dark:bg-[#1d1b1b]"
                        minSize={35}
                    >
                        <DynamicForm
                            config={form.pages}
                            setActivePage={setActivePage}
                        />
                    </ResizablePanel>
                    <ResizableHandle />
                    <ResizablePanel
                        minSize={20}
                        maxSize={35}
                        defaultSize={20}
                        className="border-l border-neutral-700"
                    >
                        {selectedComponentId ? (
                            <ComponentProperties
                                selectedComponentId={selectedComponentId}
                                updateForm={updateForm}
                            />
                        ) : (
                            <PageProperties
                                onUpdate={updateForm}
                                onPageChange={(i) => setActivePage(i)}
                            />
                        )}
                    </ResizablePanel>
                </ResizablePanelGroup>
            </div>
        </FormBuilderContext.Provider>
    )
}

const PropertySwitcher = ({
    type,
    propKey,
    label,
    options,
    propValue,
    editComponentProp,
}: Schema & {
    propValue: any
    editComponentProp: (propKey: string, value: any) => void
}) => {
    switch (type) {
        case "text":
            return (
                <div>
                    <label>{label}</label>
                    <Input
                        value={propValue ?? ""}
                        onChange={(e) =>
                            editComponentProp(propKey, e.currentTarget.value)
                        }
                    />
                </div>
            )
        case "boolean":
            return (
                <div>
                    <label>{label}</label>
                </div>
            )
        case "dropdown":
            return (
                <Dropdown>
                    <DropdownButton>
                        <div>test</div>
                    </DropdownButton>
                    <DropdownContent>
                        {options && (
                            <DropdownRadioGroup
                                setValue={(value) =>
                                    editComponentProp(propKey, value)
                                }
                                value={propValue}
                            >
                                {options.map(({ label, value }) => {
                                    return (
                                        <DropdownRadioButton
                                            value={value}
                                            key={label}
                                        >
                                            {label}
                                        </DropdownRadioButton>
                                    )
                                })}
                            </DropdownRadioGroup>
                        )}
                    </DropdownContent>
                </Dropdown>
            )
        default:
            return (
                <Paragraph className="text-wrap break-words dark:text-red-400">{`Unknown schema type "${type}" - Check PropertySwitcher and SchemaTypes`}</Paragraph>
            )
    }
}

const ComponentProperties = ({
    selectedComponentId,
    updateForm,
}: {
    selectedComponentId: string
    updateForm: (changes: Partial<Form>) => void
}) => {
    const { form, activePageNumber } = useFormBuilderContext()
    const selectedComponent = form.pages[activePageNumber]?.form.find(
        (comp) => comp.id === selectedComponentId
    )

    if (!selectedComponent) return

    const registry = formComponentRegistry[selectedComponent.type]
    const { configSchema, name } = registry

    const getComponentPropValue = (
        component: PageComponent,
        propKey: string
    ) => {
        return (component.props as Record<string, any>)[propKey]
    }

    const editComponentProp = useCallback(
        (propKey: string, value: any) => {
            const updatedPages = form.pages.map((page, i) =>
                i === activePageNumber
                    ? {
                          ...page,
                          form: page.form.map((component) =>
                              component.id === selectedComponent.id
                                  ? {
                                        ...component,
                                        props: {
                                            ...component.props,
                                            [propKey]: value,
                                        },
                                    }
                                  : component
                          ),
                      }
                    : page
            )
            updateForm({ pages: updatedPages })
        },
        [selectedComponent.id, activePageNumber, form.pages, updateForm]
    )

    const editComponentJsonKey = useCallback(
        (value: string) => {
            const updatedPages = form.pages.map((page, i) =>
                i === activePageNumber
                    ? {
                          ...page,
                          form: page.form.map((component) =>
                              component.id === selectedComponent.id
                                  ? {
                                        ...component,
                                        jsonKey: value,
                                    }
                                  : component
                          ),
                      }
                    : page
            )
            updateForm({ pages: updatedPages })
        },
        [selectedComponent.id, activePageNumber, form.pages, updateForm]
    )

    const doesWrite = (
        registry as typeof registry & {
            writesToJSON?: boolean
        }
    ).writesToJSON

    useEffect(() => {
        console.log("tes")
    }, [selectedComponent])

    return (
        <>
            <div className="flex items-center justify-between border-b border-neutral-700 px-4 py-3">
                <Paragraph>{name}</Paragraph>
            </div>
            <div className="flex flex-col gap-2 px-4 py-3">
                {doesWrite && (
                    <div>
                        <label className="text-sm font-bold">jsonKey</label>
                        <Input
                            value={selectedComponent.jsonKey ?? ""}
                            onChange={(e) =>
                                editComponentJsonKey(e.currentTarget.value)
                            }
                        ></Input>
                    </div>
                )}
                {configSchema.map((schema: Schema, i) => {
                    return (
                        <PropertySwitcher
                            key={i}
                            {...schema}
                            propValue={getComponentPropValue(
                                selectedComponent,
                                schema.propKey
                            )}
                            editComponentProp={editComponentProp}
                        />
                    )
                })}
            </div>
        </>
    )
}

const PageProperties = ({
    onUpdate,
    onPageChange,
}: {
    onUpdate: (updates: Partial<Form>) => void
    onPageChange: (pageIndex: number) => void
}) => {
    const {
        activePage: page,
        activePageNumber: activePage,
        form,
    } = useFormBuilderContext()

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

    const handleDragEnd = (elementToDrag: number, draggingTo: number) => {
        var copy = [...form.pages]
        const temp = copy[elementToDrag]
        copy = copy.filter((_, i) => i !== elementToDrag)

        copy.splice(draggingTo, 0, temp)

        const oldCurrentPage = form.pages[activePage]
        const newCurrentPageIndex = copy.findIndex((p) => p === oldCurrentPage)
        console.log(elementToDrag, draggingTo)

        onUpdate({ pages: copy })
        onPageChange(newCurrentPageIndex >= 0 ? newCurrentPageIndex : 0)
    }

    return (
        <div className="relative flex flex-col">
            <Paragraph
                className="border-b border-neutral-700 px-4 py-3 font-semibold"
                size="sm"
            >
                Form Properties
            </Paragraph>
            <div className="px-2 py-2">
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

                <label className="text-sm font-medium">Pages</label>
                <Dropdown disabled={!page}>
                    <DropdownButton>
                        <Button
                            variant="dark"
                            size="lg"
                            className="flex w-full items-center justify-between text-left"
                            onClick={() => !page && createNewPage()}
                        >
                            {page
                                ? page.name !== ""
                                    ? page.name
                                    : "Unnamed"
                                : "Create New"}
                            {page ? <DropdownChevron /> : <Plus />}
                        </Button>
                    </DropdownButton>
                    <DropdownContent className="absolute left-0 w-full translate-x-0">
                        <Droppable onDragEnd={handleDragEnd}>
                            {form.pages.map(({ name }, i) => {
                                return (
                                    <Draggable index={i} key={name}>
                                        <DropdownItem
                                            onClick={() => onPageChange(i)}
                                            className={`w-full ${
                                                i === activePage
                                                    ? "bg-blue-50 dark:bg-blue-950/20"
                                                    : ""
                                            }`}
                                        >
                                            <span className="flex-1">
                                                {name !== "" ? name : "Unnamed"}
                                            </span>
                                            <span className="ml-2 text-xs text-gray-500">
                                                {i + 1}
                                            </span>
                                        </DropdownItem>
                                    </Draggable>
                                )
                            })}
                        </Droppable>
                        <DropdownDivider />
                        <DropdownItem onClick={createNewPage}>
                            <DropdownItemIcon>
                                <Plus />
                            </DropdownItemIcon>{" "}
                            Create New Page
                        </DropdownItem>
                    </DropdownContent>
                </Dropdown>
            </div>

            {page && (
                <>
                    <Paragraph
                        className="border-y border-neutral-700 px-4 py-3 font-semibold"
                        size="sm"
                    >
                        Page Properties
                    </Paragraph>
                    <div className="flex flex-col p-2">
                        <label className="text-sm font-medium">
                            Page Title
                        </label>
                        <Input
                            value={page.name}
                            onChange={(e) =>
                                updatePage(activePage, {
                                    name: e.currentTarget.value,
                                })
                            }
                        />
                    </div>
                </>
            )}
        </div>
    )
}

const ComponentPalette = ({
    onUpdate,
    selectedComponentId,
    setSelectedComponentId,
}: {
    onUpdate: (updates: Partial<Form>) => void
    setSelectedComponentId: React.Dispatch<
        React.SetStateAction<string | undefined>
    >
    selectedComponentId: string | undefined
}) => {
    const {
        activePage,
        activePageNumber: currentPage,
        form,
    } = useFormBuilderContext()

    const addComponent = (type: keyof typeof formComponentRegistry) => {
        const componentRegistry = formComponentRegistry[type]
        const newComponent: PageComponent = {
            id: crypto.randomUUID(),
            type: type,
            jsonKey: undefined,
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

    const sortItems = (elementToDrag: number, draggingTo: number) => {
        const copy = [...activePage.form]
        const temp = copy[elementToDrag]

        copy.splice(elementToDrag, 1)
        copy.splice(draggingTo, 0, temp)

        onUpdate({
            pages: form.pages.map((formPage, index) =>
                index === currentPage ? { ...formPage, form: copy } : formPage
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
                {activePage && (
                    <Droppable onDragEnd={sortItems}>
                        {activePage.form.map((comp, i) => {
                            const component = formComponentRegistry[comp.type]
                            return (
                                <Draggable index={i} key={comp.id}>
                                    <Button
                                        variant="link"
                                        className={`relative flex w-full items-center gap-2 rounded-none py-2 ${selectedComponentId === comp.id ? "dark:bg-blue-200/25 dark:hover:bg-blue-200/15" : ""}`}
                                        size="sm"
                                        onClick={() =>
                                            selectedComponentId !== comp.id
                                                ? setSelectedComponentId(
                                                      comp.id
                                                  )
                                                : setSelectedComponentId(
                                                      undefined
                                                  )
                                        }
                                    >
                                        <component.icon className="h-3 w-3 dark:text-neutral-500" />
                                        {component.name}
                                    </Button>
                                </Draggable>
                            )
                        })}
                    </Droppable>
                )}
            </div>
        </>
    )
}
