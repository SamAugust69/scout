import { useEffect, useState } from "react"
import { Button } from "./ui/button"
import { Modal, ModalContent, ModalFooter } from "./ui/modal"
import { Input } from "./ui/input"
import { Settings } from "@/lib/types/settingsType"
import { useAppContext } from "@/lib/context/appContext"
import { Toggle } from "./ui/toggle"

interface SettingsInterface {
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
    isOpen: boolean
}

export const SettingsMenu = ({ isOpen, setIsOpen }: SettingsInterface) => {
    const [changes, setChanges] = useState<Partial<Settings>>({})
    const { settings, setSettings } = useAppContext()

    useEffect(() => {
        console.log("changes", changes)
        console.log("settings", settings)
    }, [changes])

    const saveSettings = () => {
        if (Object.keys(changes).length > 0) {
            setSettings((prev) => ({ ...prev, ...changes }))
            setChanges({})
        }
    }

    const formatStringAsNumber = (value: string) => {
        // takes input like "155mm" and converts it to -> "155"; weird function

        return value.replace(/[^0-9]/g, "")
    }

    const onChange = <T extends keyof Settings>(
        value: Settings[T],
        key: keyof Partial<Settings>
    ) => {
        // const target = e.target as HTMLInputElement;

        setChanges({ ...changes, [key]: value })
    }

    return (
        <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
            <ModalContent className="">
                <div className="flex flex-col gap-2">
                    <div className="flex flex-col">
                        <label
                            htmlFor="teamInput"
                            className="text-xs dark:text-neutral-200"
                        >
                            Team Number
                        </label>
                        <Input
                            id="teamInput"
                            defaultValue={settings?.team || ""}
                            placeholder="Team Number"
                            type="number"
                            onChange={(e) =>
                                onChange(
                                    formatStringAsNumber(e.target.value),
                                    "team"
                                )
                            }
                        />
                    </div>
                    <Toggle
                        value={
                            changes.animationsDisabled ??
                            settings.animationsDisabled
                        }
                        setValue={() =>
                            onChange(
                                !(
                                    changes.animationsDisabled ??
                                    settings.animationsDisabled
                                ),
                                "animationsDisabled"
                            )
                        }
                    >
                        Toggle Test
                    </Toggle>
                </div>
                <ModalFooter className="flex justify-end">
                    <Button size="md" onClick={ () => {saveSettings(); setIsOpen(false);}}>
                        Save
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
