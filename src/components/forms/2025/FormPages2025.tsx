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
import { Paragraph } from "@/components/ui/paragraph"

const Auto2025 = ({ handleChange, formChanges }: FormPageInterface) => {
    return (
        <>
            <FormField>
                <FormInputNumber
                    incrementButton
                    onChange={(e) =>
                        handleChange(
                            "auto.coralL4",
                            parseInt(e.currentTarget.value)
                        )
                    }
                    defaultValue={formChanges.auto?.coralL4}
                />
                <InputLabel>Coral Scored in L4</InputLabel>
            </FormField>
            <FormField>
                <FormInputNumber
                    incrementButton
                    onChange={(e) =>
                        handleChange(
                            "auto.coralL3",
                            parseInt(e.currentTarget.value)
                        )
                    }
                    defaultValue={formChanges.auto?.coralL3}
                />
                <InputLabel>Coral Scored in L3</InputLabel>
            </FormField>
            <FormField>
                <FormInputNumber
                    incrementButton
                    onChange={(e) =>
                        handleChange(
                            "auto.coralL2",
                            parseInt(e.currentTarget.value)
                        )
                    }
                    defaultValue={formChanges.auto?.coralL2}
                />
                <InputLabel>Coral Scored in L2</InputLabel>
            </FormField>

            <FormField>
                <FormInputNumber
                    incrementButton
                    onChange={(e) =>
                        handleChange(
                            "auto.coralL1",
                            parseInt(e.currentTarget.value)
                        )
                    }
                    defaultValue={formChanges.auto?.coralL1}
                />
                <InputLabel>
                    Coral Scored in Trough <span className="text-xs">(L1)</span>
                </InputLabel>
            </FormField>
        </>
    )
}

const StartLogInfo2025 = ({ handleChange, formChanges }: FormPageInterface) => {
    return (
        <>
            <FormField>
                <FormInputNumber
                    incrementButton
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
            <Paragraph>Coral Scored</Paragraph>

            <div className="mb-2 flex flex-col gap-2">
                <FormField>
                    <FormInputNumber
                        incrementButton
                        onChange={(e) =>
                            handleChange(
                                "teleop.coralL4",
                                parseInt(e.currentTarget.value)
                            )
                        }
                        defaultValue={formChanges.teleop?.coralL4}
                    />
                    <InputLabel>Coral Scored in L4</InputLabel>
                </FormField>
                <FormField>
                    <FormInputNumber
                        incrementButton
                        onChange={(e) =>
                            handleChange(
                                "teleop.coralL3",
                                parseInt(e.currentTarget.value)
                            )
                        }
                        defaultValue={formChanges.teleop?.coralL3}
                    />
                    <InputLabel>Coral Scored in L3</InputLabel>
                </FormField>
                <FormField>
                    <FormInputNumber
                        incrementButton
                        onChange={(e) =>
                            handleChange(
                                "teleop.coralL2",
                                parseInt(e.currentTarget.value)
                            )
                        }
                        defaultValue={formChanges.teleop?.coralL2}
                    />
                    <InputLabel>Coral Scored in L2</InputLabel>
                </FormField>

                <FormField>
                    <FormInputNumber
                        incrementButton
                        onChange={(e) =>
                            handleChange(
                                "teleop.coralL1",
                                parseInt(e.currentTarget.value)
                            )
                        }
                        defaultValue={formChanges.teleop?.coralL1}
                    />
                    <InputLabel>
                        Coral Scored in Trough{" "}
                        <span className="text-xs">(L1)</span>
                    </InputLabel>
                </FormField>
            </div>

            <Paragraph>
                Algae Scored <span className="text-xs">by robot</span>
            </Paragraph>
            <div className="mb-2 flex flex-col gap-2">
                <FormField>
                    <FormInputNumber
                        incrementButton
                        onChange={(e) =>
                            handleChange(
                                "teleop.algae",
                                parseInt(e.currentTarget.value)
                            )
                        }
                        defaultValue={formChanges.teleop?.algae}
                    />
                    <InputLabel>Algae Processed</InputLabel>
                </FormField>
                <FormField>
                    <FormInputNumber
                        incrementButton
                        onChange={(e) =>
                            handleChange(
                                "teleop.net",
                                parseInt(e.currentTarget.value)
                            )
                        }
                        defaultValue={formChanges.teleop?.net}
                    />
                    <InputLabel>Algae Thrown in Net</InputLabel>
                </FormField>
            </div>
            <Paragraph>Climb</Paragraph>

            <div className="mb-2 flex flex-col gap-2">
                <FormField>
                    <FormInputToggle
                        defaultChecked={formChanges.teleop?.parked}
                        onChange={(e) =>
                            handleChange(
                                "teleop.parked",
                                e.currentTarget.checked
                            )
                        }
                    >
                        <FormInputTitle>Parked Under Barge</FormInputTitle>
                        <FormInputDescription>
                            Did your robot park under the barge
                        </FormInputDescription>
                    </FormInputToggle>
                </FormField>

                <FormField>
                    <FormInputToggle
                        defaultChecked={formChanges.teleop?.hung}
                        onChange={(e) =>
                            handleChange("teleop.hung", e.currentTarget.checked)
                        }
                    >
                        <FormInputTitle>Hung</FormInputTitle>
                        <FormInputDescription>
                            Did your robot hang on a cage?
                        </FormInputDescription>
                    </FormInputToggle>
                    <FieldChildren>
                        <FormField>
                            <FormInputToggle
                                defaultChecked={formChanges.teleop?.deepHang}
                                onChange={(e) =>
                                    handleChange(
                                        "teleop.deepHang",
                                        e.currentTarget.checked
                                    )
                                }
                            >
                                <FormInputTitle>Hung Deep</FormInputTitle>
                                <FormInputDescription>
                                    Did your robot hang on the cage close to the ground?
                                </FormInputDescription>
                            </FormInputToggle>
                        </FormField>
                        <FormField>
                            <FormInputToggle
                                defaultChecked={formChanges.teleop?.shallowHang}
                                onChange={(e) =>
                                    handleChange(
                                        "teleop.shallowHang",
                                        e.currentTarget.checked
                                    )
                                }
                            >
                                <FormInputTitle>Hung Shallow</FormInputTitle>
                                <FormInputDescription>
                                    Did your robot hang on the cage high up?
                                </FormInputDescription>
                            </FormInputToggle>
                        </FormField>
                    </FieldChildren>
                </FormField>
            </div>
        </>
    )
}

const Finishing2025 = ({}: FormPageInterface) => {
    return (
        <>
            <FormField>
                <FormFieldTextArea></FormFieldTextArea>
            </FormField>
        </>
    )
}

export { StartLogInfo2025, Auto2025, Teleop2025, Finishing2025 }
