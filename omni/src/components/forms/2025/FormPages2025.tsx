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
import { FormPageInterface } from "../formConfig"

const Auto2025 = ({ handleChange, formChanges }: FormPageInterface) => {
    return (
        <>
            <FormField>
                <FormInputToggle
                    name="auto.left"
                    onChange={(e) =>
                        handleChange("auto.coralL1", e.currentTarget.checked)
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
                        handleChange("team", parseInt(e.currentTarget.value))
                    }
                    defaultValue={formChanges.team}
                    placeholder="Team"
                />
            </FormField>
        </>
    )
}

const StartLogInfo2025 = ({ handleChange, formChanges }: FormPageInterface) => {
    return (
        <>
            <FormField>
                <FormInputNumber
                    onChange={(e) =>
                        handleChange("match", parseInt(e.currentTarget.value))
                    }
                    defaultValue={formChanges.match}
                    required
                    placeholder="Match Number"
                />
                <InputLabel>Match</InputLabel>
            </FormField>

            <FormField>
                <FormInputNumber
                    onChange={(e) =>
                        handleChange("team", parseInt(e.currentTarget.value))
                    }
                    defaultValue={formChanges.team}
                    required
                    placeholder="Team Number"
                />
                <InputLabel>Team</InputLabel>
            </FormField>

            <FormField>
                <FormInputText
                    name="scout"
                    onChange={(e) =>
                        handleChange("scout", e.currentTarget.value)
                    }
                    defaultValue={formChanges.scout}
                />
                <InputLabel>Scout</InputLabel>
            </FormField>
        </>
    )
}

const Teleop2025 = ({ handleChange, formChanges }: FormPageInterface) => {
    return <></>
}

const Finishing2025 = ({}: FormPageInterface) => {
    return <></>
}

export { StartLogInfo2025, Auto2025, Teleop2025, Finishing2025 }
