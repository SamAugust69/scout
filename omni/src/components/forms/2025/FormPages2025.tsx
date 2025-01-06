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
    return (
        <>
            <FormField>
                <FormInputNumber
                    name="match"
                    onChange={handleChange}
                    defaultValue={formChanges.match}
                    required
                    placeholder="Match Number"
                />
                <InputLabel>Match</InputLabel>
            </FormField>

            <FormField>
                <FormInputNumber
                    name="team"
                    onChange={handleChange}
                    defaultValue={formChanges.team}
                    required
                    placeholder="Team Number"
                />
                <InputLabel>Team</InputLabel>
            </FormField>

            <FormField>
                <FormInputText
                    name="scout"
                    onChange={handleChange}
                    defaultValue={formChanges.scout}
                />
                <InputLabel>Scout</InputLabel>
            </FormField>
        </>
    )
}

const Teleop2025 = ({ handleChange, formChanges }: PageInterface) => {
    return <></>
}

const Finishing2025 = ({}: PageInterface) => {
    return <></>
}

export { StartLogInfo2025, Auto2025, Teleop2025, Finishing2025 }
