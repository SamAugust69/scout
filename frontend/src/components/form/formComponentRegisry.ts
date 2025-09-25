import {
    Divide,
    Heading1,
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
import { Heading, HeadingInterface } from "../ui/heading"

export type PropTypes = "text" | "boolean" | "dropdown" | "style-text"
export type Schema = {
    propKey: string
    type: PropTypes
    label: string
    question?: string
    options?: { label: string; value: string }[]
}

type RegistryItem<P> = {
    name: string
    component: React.ComponentType<P>
    defaultProps: Partial<P>
    configSchema: Schema[]
    writesToJSON?: boolean // determines if jsonKey is needed in component properties
    icon?: LucideIcon
}

export const formComponentRegistry = {
    text: {
        name: "Text Input",
        component: FormInput,
        icon: TextCursorInputIcon,
        writesToJSON: true,
        defaultProps: {
            label: "Text Field",
            placeholder: "Placeholder...",
            showStepper: false,
            numbersOnly: false,
        },
        configSchema: [
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
        writesToJSON: true,
        defaultProps: {
            label: "Toggle",
            defaultChecked: false,
        },
        configSchema: [
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
        },
        configSchema: [
            {
                propKey: "children",
                type: "text",
                label: "Text",
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
    header: {
        name: "Header",
        component: Heading,
        defaultProps: {
            children: "Heading",
            size: "default",
            style: {},
        },
        configSchema: [
            {
                propKey: "color",
                type: "style-text",
                label: "Text Color",
            },
            {
                propKey: "children",
                type: "text",
                label: "Text",
            },
            {
                propKey: "size",
                type: "dropdown",
                label: "Size",
                options: [
                    { label: "Small", value: "sm" },
                    { label: "Default", value: "default" },
                    { label: "Large", value: "lg" },
                    { label: "Extra Large", value: "xl" },
                ],
            },
            {
                propKey: "textAlign",
                type: "dropdown",
                label: "Text Alignment",
                options: [
                    { label: "Left", value: "left" },
                    { label: "Center", value: "center" },
                    { label: "Right", value: "right" },
                ],
            },
        ],
        icon: Heading1,
    } satisfies RegistryItem<HeadingInterface>,
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
    jsonKey: string | undefined
}
