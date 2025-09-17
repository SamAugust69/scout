import {
    Divide,
    LucideIcon,
    SquareCheckBigIcon,
    TextCursorInputIcon,
    Type,
} from "lucide-react"
import { ButtonInterface } from "../ui/button"
import { FormInput, FormInputInterface } from "./FormInput"
import { FormToggle, FormToggleInterface } from "./FormToggle"
import { Paragraph, paragraphVariants } from "../ui/paragraph"
import { GetVariantProps } from "@vtechguys/vs"
import { FormDivider } from "./FormDivider"

export type SchemaTypes = "text" | "boolean" | "dropdown"
export type Schema = {
    propKey: string
    type: SchemaTypes
    label: string
    question?: string
    options?: { label: string; value: string }[]
}

type RegistryItem<P> = {
    name: string
    component: React.ComponentType<P>
    defaultProps: Partial<P>
    configSchema: Schema[]
    icon?: LucideIcon
}

export const formComponentRegistry = {
    text: {
        name: "Text Input",
        component: FormInput,
        icon: TextCursorInputIcon,
        defaultProps: {
            label: "Text Field",
            placeholder: "Placeholder...",
            showStepper: false,
            numbersOnly: false,
            jsonKey: undefined,
        },
        configSchema: [
            {
                propKey: "jsonKey",
                type: "text",
                label: "jsonKey",
            },
            {
                propKey: "label",
                type: "text",
                label: "Text Label",
            },
            { propKey: "placeholder", type: "text", label: "Placeholder" },
            {
                propKey: "showStepper",
                type: "boolean",
                label: "Show Incrementation Buttons",
            },
            {
                propKey: "numbersOnly",
                type: "boolean",
                label: "Only Allow Numbers as Input",
            },
        ],
    } satisfies RegistryItem<
        FormInputInterface & React.HTMLAttributes<HTMLInputElement>
    >,
    toggle: {
        name: "Toggle",
        component: FormToggle,
        defaultProps: {
            label: "Toggle",
            defaultChecked: false,
            jsonKey: undefined,
        },
        configSchema: [
            {
                propKey: "jsonKey",
                type: "text",
                label: "jsonKey",
            },
            {
                propKey: "label",
                type: "text",
                label: "Checkbox Label",
            },
            {
                propKey: "defaultChecked",
                type: "boolean",
                label: "Default Checked",
            },
        ],
        icon: SquareCheckBigIcon,
    } satisfies RegistryItem<FormToggleInterface & ButtonInterface>,
    paragraph: {
        name: "Paragraph",
        component: Paragraph,
        defaultProps: {
            children: "Paragraph",
            size: "default",
        },
        configSchema: [
            {
                propKey: "children",
                type: "text",
                label: "Value",
            },
            {
                propKey: "size",
                type: "dropdown",
                label: "Size",
                options: [
                    { label: "Small", value: "sm" },
                    { label: "Default", value: "default" },
                    { label: "Large", value: "lg" },
                ],
            },
        ],
        icon: Type,
    } satisfies RegistryItem<
        React.HTMLAttributes<HTMLParagraphElement> &
            GetVariantProps<typeof paragraphVariants>
    >,
    divider: {
        name: "Divider",
        component: FormDivider,
        defaultProps: {},
        configSchema: [],
        icon: Divide,
    },
}

type FormComponentRegistry = typeof formComponentRegistry

export type PageComponent<
    K extends keyof FormComponentRegistry = keyof FormComponentRegistry,
> = {
    id: string
    type: K
    props: FormComponentRegistry[K]["defaultProps"]
}
