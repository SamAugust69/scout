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
import { PageInterface } from "../formConfig"

const Auto2025 = ({ handleChange, formChanges }: PageInterface) => {
    return (
        <>
            <FormField>
                <FormInputToggle
                    name="auto.left"
                    onChange={(e) =>
                        handleChange(
                            2025,
                            "auto.coralL1",
                            e.currentTarget.checked
                        )
                    }
                    defaultChecked={formChanges.auto?.left}
                >
                    <FormInputTitle>Left Starting Line</FormInputTitle>
                    <FormInputDescription>
                        Did your robot score during auto?
                    </FormInputDescription>
                </FormInputToggle>
            </FormField>

            <FormField>
                <FormInputNumber
                    onChange={(e) =>
                        handleChange(2025, "team", e.currentTarget.checked)
                    }
                    defaultValue={formChanges.team}
                    placeholder="Team"
                />
            </FormField>
        </>
    )
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
