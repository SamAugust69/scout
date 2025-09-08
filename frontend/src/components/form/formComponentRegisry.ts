import { FormInput } from "./FormInput"

export const formComponentRegistry = {
    text: {
        name: "Text Input",
        component: FormInput,
        defaultProps: {
            label: "Text Field",
            placeholder: "Placeholder...",
            required: false,
            showStepper: false,
            numbersOnly: false,
        },
        configSchema: [
            {
                key: "label",
                type: "text",
                label: "Text Label",
                required: true,
            },
            { key: "placeholder", type: "text", label: "Placeholder" },
            { key: "required", type: "boolean", label: "Required" },
            {
                key: "showStepper",
                type: "boolean",
                label: "Show Incrementation Buttons",
            },
            {
                key: "numbersOnly",
                type: "boolean",
                label: "Only Allow Numbers as Input",
            },
        ],
    },
    // toggle: {
    //     name: "Toggle/Checkbox",
    //     component: FormInput,
    //     defaultProps: {
    //         label: "Toggle",
    //         defaultValue: false,
    //     },
    //     configSchema: [
    //         {
    //             key: "label",
    //             type: "text",
    //             label: "Checkbox Label",
    //             required: true,
    //         },
    //         { key: "defaultValue", type: "boolean", label: "Default Checked" },
    //     ],
    // },
}
