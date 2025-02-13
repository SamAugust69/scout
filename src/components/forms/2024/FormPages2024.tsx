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
import { PageInterface } from "../formConfig"

const Auto2024 = ({ handleChange, formChanges }: PageInterface) => {
    return (
        <>
            <FormField>
                <FormInputToggle>
                    <FormInputTitle>Left Starting Zone</FormInputTitle>
                    <FormInputDescription>
                        Did your robot leave during auto?
                    </FormInputDescription>
                </FormInputToggle>
            </FormField>
            <FormField>
                <FormInputToggle
                    name="auto.scored"
                    onChange={handleChange}
                    defaultChecked={formChanges.auto?.scored}
                >
                    <FormInputTitle>Auto Scored</FormInputTitle>
                    <FormInputDescription>
                        Did your robot score during auto?
                    </FormInputDescription>
                </FormInputToggle>

                <FieldChildren>
                    <FormField>
                        <FormInputNumber
                            name={"auto.ampScore"}
                            defaultValue={formChanges.auto?.ampScore}
                            onChange={handleChange}
                        />
                        <InputLabel>Amp Notes Scored</InputLabel>
                    </FormField>
                    <FormField>
                        <FormInputNumber
                            name={"auto.speakerScore"}
                            defaultValue={formChanges.auto?.speakerScore}
                            onChange={handleChange}
                        />
                        <InputLabel>Speaker Notes Scored</InputLabel>
                    </FormField>
                </FieldChildren>
            </FormField>
        </>
    )
}

const StartLogInfo2024 = ({ handleChange, formChanges }: PageInterface) => {
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

const Teleop2024 = ({ handleChange, formChanges }: PageInterface) => {
    return (
        <>
            <FormField>
                <FormInputNumber
                    name="teleop.speakerScore"
                    onChange={handleChange}
                    defaultValue={formChanges.teleop?.speakerScore}
                    placeholder="Speaker Notes Scored"
                    incrementButton
                />
                <InputLabel>Speaker Notes</InputLabel>
            </FormField>
            <FormField>
                <FormInputNumber
                    name="teleop.amplifiedSpeakerScore"
                    onChange={handleChange}
                    defaultValue={formChanges.teleop?.amplifiedSpeakerScore}
                    placeholder="Amplified Speaker Notes Scored"
                    incrementButton
                />
                <InputLabel>Amplified Speaker Notes</InputLabel>
            </FormField>
            <FormField>
                <FormInputNumber
                    name="teleop.ampScore"
                    onChange={handleChange}
                    defaultValue={formChanges.teleop?.ampScore}
                    placeholder="Amp Notes Scored"
                    incrementButton
                />
                <InputLabel>Amp Notes</InputLabel>
            </FormField>
            <FormField>
                <FormInputNumber
                    name="teleop.trapScore"
                    onChange={handleChange}
                    defaultValue={formChanges.teleop?.trapScore}
                    placeholder="Trap Notes Scored"
                    incrementButton
                />
                <InputLabel>Trap Notes</InputLabel>
            </FormField>
            <FormField>
                <FormInputToggle>
                    <FormInputTitle>Hung on Chain</FormInputTitle>
                    <FormInputDescription>
                        Does it hang low?
                    </FormInputDescription>
                </FormInputToggle>
            </FormField>
            <FormField>
                <FormInputToggle
                    name="teleop.hangOnChain"
                    defaultChecked={formChanges.teleop?.hangOnChain}
                    onChange={handleChange}
                >
                    <FormInputTitle>Hung on Chain</FormInputTitle>
                    <FormInputDescription>
                        Does it hang low?
                    </FormInputDescription>
                </FormInputToggle>

                <FieldChildren>
                    <FormField>
                        <FormInputToggle
                            name="teleop.hangInHarmony"
                            onChange={handleChange}
                            defaultChecked={formChanges.teleop?.hangInHarmony}
                        >
                            <FormInputTitle>Hung in Harmony</FormInputTitle>
                            <FormInputDescription>
                                Are there two robots on one chain?
                            </FormInputDescription>
                        </FormInputToggle>
                    </FormField>
                </FieldChildren>
            </FormField>
        </>
    )
}

const Finishing2024 = ({}: PageInterface) => {
    return (
        <FormField>
            <FormFieldTextArea />
        </FormField>
    )
}

export { StartLogInfo2024, Auto2024, Teleop2024, Finishing2024 }
