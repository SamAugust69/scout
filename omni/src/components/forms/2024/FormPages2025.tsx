import {
    FieldChildren,
    FormField,
    FormFieldTextArea,
    FormInputDescription,
    FormInputNumber,
    FormInputText,
    FormInputTitle,
    FormInputToggle,
    InputLabel,
} from "@/components/ui/form"
import { Log2024 } from "@/lib/types/log2024Type"

interface PageInterface {
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    formChanges: Partial<Log2024>
}

const Auto2025 = ({ handleChange, formChanges }: PageInterface) => {
    return <></>
}

const StartLogInfo2025 = ({ handleChange, formChanges }: PageInterface) => {
    return <></>
}

const Teleop2025 = ({ handleChange, formChanges }: PageInterface) => {
    return <></>
}

const Finishing2025 = ({}: PageInterface) => {
    return <></>
}

export { StartLogInfo2025, Auto2025, Teleop2025, Finishing2025 }
