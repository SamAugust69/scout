import {
    FormField,
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
                    onChange={(e) =>
                        handleChange("auto.left", e.currentTarget.checked)
                    }
                    defaultChecked={formChanges.auto?.left}
                >
                    <FormInputTitle>Left Starting Line</FormInputTitle>
                    <FormInputDescription>
                        Did your robot leave the start line?
                    </FormInputDescription>
                </FormInputToggle>
            </FormField>

            <FormField>
                <FormInputNumber
                    onChange={(e) =>
                        handleChange(
                            "auto.coralL1",
                            parseInt(e.currentTarget.value)
                        )
                    }
                    defaultValue={formChanges.auto?.coralL1}
                />
                <InputLabel>Coral L1</InputLabel>
            </FormField>

            <FormField>
                <FormInputNumber
                    onChange={(e) =>
                        handleChange(
                            "auto.coralL2",
                            parseInt(e.currentTarget.value)
                        )
                    }
                    defaultValue={formChanges.auto?.coralL2}
                />
                <InputLabel>Coral L2</InputLabel>
            </FormField>
            <FormField>
                <FormInputNumber
                    onChange={(e) =>
                        handleChange(
                            "auto.coralL3",
                            parseInt(e.currentTarget.value)
                        )
                    }
                    defaultValue={formChanges.auto?.coralL3}
                />
                <InputLabel>Coral L3</InputLabel>
            </FormField>
            <FormField>
                <FormInputNumber
                    onChange={(e) =>
                        handleChange(
                            "auto.coralL4",
                            parseInt(e.currentTarget.value)
                        )
                    }
                    defaultValue={formChanges.auto?.coralL4}
                />
                <InputLabel>Coral L4</InputLabel>
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
                        handleChange(
                            "match",
                            parseInt(e.currentTarget.value) || undefined
                        )
                    }
                    defaultValue={formChanges.match}
                    required
                />
                <InputLabel>Match</InputLabel>
            </FormField>

            <FormField>
                <FormInputNumber
                    onChange={(e) =>
                        handleChange(
                            "team",
                            parseInt(e.currentTarget.value) || undefined
                        )
                    }
                    defaultValue={formChanges.team}
                    required
                />
                <InputLabel>Team</InputLabel>
            </FormField>

            <FormField>
                <FormInputText
                    onChange={(e) =>
                        handleChange("scout", e.currentTarget.value)
                    }
                    defaultValue={formChanges.scout}
                />
                <InputLabel>Scouter Name</InputLabel>
            </FormField>
        </>
    )
}

const Teleop2025 = ({ handleChange, formChanges }: FormPageInterface) => {
    return (
        <>
            <FormField>
                <FormInputNumber
                    onChange={(e) =>
                        handleChange(
                            "teleop.coralL1",
                            parseInt(e.currentTarget.value)
                        )
                    }
                    defaultValue={formChanges.teleop?.coralL1}
                />
                <InputLabel>Coral L1</InputLabel>
            </FormField>

            <FormField>
                <FormInputNumber
                    onChange={(e) =>
                        handleChange(
                            "teleop.coralL2",
                            parseInt(e.currentTarget.value)
                        )
                    }
                    defaultValue={formChanges.teleop?.coralL2}
                />
                <InputLabel>Coral L2</InputLabel>
            </FormField>
            <FormField>
                <FormInputNumber
                    onChange={(e) =>
                        handleChange(
                            "teleop.coralL3",
                            parseInt(e.currentTarget.value)
                        )
                    }
                    defaultValue={formChanges.teleop?.coralL3}
                />
                <InputLabel>Coral L3</InputLabel>
            </FormField>
            <FormField>
                <FormInputNumber
                    onChange={(e) =>
                        handleChange(
                            "teleop.coralL4",
                            parseInt(e.currentTarget.value)
                        )
                    }
                    defaultValue={formChanges.teleop?.coralL4}
                />
                <InputLabel>Coral L4</InputLabel>
            </FormField>
        </>
    )
}

const Finishing2025 = ({}: FormPageInterface) => {
    return <></>
}

export { StartLogInfo2025, Auto2025, Teleop2025, Finishing2025 }
