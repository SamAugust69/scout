import {
    FieldChildren,
    FormField,
    FormInputDescription,
    FormInputNumber,
    FormInputText,
    FormInputTitle,
    FormInputToggle,
    InputLabel,
} from "@/components/ui/formElements"
import { FormPageInterface } from "../formConfig"
import { Paragraph } from "@/components/ui/paragraph"

const Auto2025 = ({ handleChange, formChanges }: FormPageInterface) => {
    return (
        <>
            <FormField>
                <FormInputToggle
                    defaultChecked={formChanges.auto?.left}
                    onChange={(e) =>
                        handleChange("auto.left", e.currentTarget.checked)
                    }
                >
                    <FormInputTitle>Left Starting Line</FormInputTitle>
                    <FormInputDescription>
                        Did your robot move off the starting line?
                    </FormInputDescription>
                </FormInputToggle>
            </FormField>
            <Paragraph>Coral Scored</Paragraph>
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
            <Paragraph>Algae Scored</Paragraph>
            <FormField>
                <FormInputNumber
                    incrementButton
                    onChange={(e) =>
                        handleChange(
                            "auto.algae",
                            parseInt(e.currentTarget.value)
                        )
                    }
                    defaultValue={formChanges.auto?.algae}
                />
                <InputLabel>Algae Processed</InputLabel>
            </FormField>
            <FormField>
                <FormInputNumber
                    incrementButton
                    onChange={(e) =>
                        handleChange(
                            "auto.net",
                            parseInt(e.currentTarget.value)
                        )
                    }
                    defaultValue={formChanges.auto?.net}
                />
                <InputLabel>Algae Thrown in Net</InputLabel>
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
                    required
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
                    <FormInputToggle
                        defaultChecked={formChanges.teleop?.parked}
                        onChange={(e) =>
                            handleChange(
                                "teleop.manipulatesAlgae",
                                e.currentTarget.checked
                            )
                        }
                    >
                        <FormInputTitle>Manipulated Algae</FormInputTitle>
                        <FormInputDescription>
                            Did your robot move around Algae
                        </FormInputDescription>
                    </FormInputToggle>
                </FormField>
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
            <Paragraph>Barge</Paragraph>

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
                                    Did your robot hang on a cage low to the
                                    ground?
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
                                    Did your robot hang on a cage high in the
                                    air?
                                </FormInputDescription>
                            </FormInputToggle>
                        </FormField>
                    </FieldChildren>
                </FormField>
            </div>

        </>
    )
}

const Finishing2025 = ({ handleChange, formChanges }: FormPageInterface) => {
    return (
        <>
                    <FormField>
                <FormInputToggle
                    defaultChecked={formChanges.defence}
                    className="dark:border-blue-400 dark:bg-blue-500/25 enabled:hover:dark:bg-blue-500/20"
                    onChange={(e) =>
                        handleChange("defence", e.currentTarget.checked)
                    }
                >
                    <FormInputTitle>Defence Robot</FormInputTitle>
                    <FormInputDescription>
                        Was your robot a defence bot? Did they goto the opponents side?
                    </FormInputDescription>
                </FormInputToggle>
            </FormField>
            <FormField>
                <FormInputToggle
                    defaultChecked={formChanges.damaged}
                    className="dark:border-yellow-400 dark:bg-yellow-500/25 enabled:hover:dark:bg-yellow-500/20"
                    onChange={(e) =>
                        handleChange("damaged", e.currentTarget.checked)
                    }
                >
                    <FormInputTitle>Partially Broken Robot</FormInputTitle>
                    <FormInputDescription>
                        Did a portion of your robot break, impacting the game?
                    </FormInputDescription>
                </FormInputToggle>
            </FormField>
            <FormField>
                <FormInputToggle
                    defaultChecked={formChanges.broken}
                    className="dark:border-red-400 dark:bg-red-500/25 enabled:hover:dark:bg-red-500/20"
                    onChange={(e) =>
                        handleChange("broken", e.currentTarget.checked)
                    }
                >
                    <FormInputTitle>Broken Robot</FormInputTitle>
                    <FormInputDescription>
                        Did your robot fully break and disable during the match?
                    </FormInputDescription>
                </FormInputToggle>
            </FormField>
        </>
    )
}

export { StartLogInfo2025, Auto2025, Teleop2025, Finishing2025 }
