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

const isValidUrl = (string: string) => {
    try {
        new URL(string)
        return true
    } catch (err) {
        return false
    }
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
                    <div className="flex flex-col">
                        <label
                            htmlFor="teamInput"
                            className="text-xs dark:text-neutral-200"
                        >
                            Server Address
                        </label>
                        <Input
                            id="teamInput"
                            defaultValue={settings?.serverAddr || ""}
                            placeholder="Server Address"
                            className={`${(changes.serverAddr ?? settings.serverAddr) === undefined ? "ring-red-400 dark:border-red-400" : ""} border`}
                            onChange={(e) =>
                                onChange(
                                    isValidUrl(e.target.value)
                                        ? e.target.value
                                        : undefined,
                                    "serverAddr"
                                )
                            }
                        />
                    </div>
                    <Toggle
                        toggleValue={
                            changes.animationsDisabled ??
                            settings.animationsDisabled
                        }
                        onClick={() =>
                            onChange(
                                !(
                                    changes.animationsDisabled ??
                                    settings.animationsDisabled
                                ),
                                "animationsDisabled"
                            )
                        }
                    >
                        Disable Animations
                    </Toggle>
                    <Toggle
                        toggleValue={
                            changes.disableNavbar ?? settings.disableNavbar
                        }
                        onClick={() =>
                            onChange(
                                !(
                                    changes.disableNavbar ??
                                    settings.disableNavbar
                                ),
                                "disableNavbar"
                            )
                        }
                    >
                        Disable Navbar
                    </Toggle>
                </div>
                <ModalFooter className="flex justify-end">
                    <Button
                        size="md"
                        onClick={() => {
                            saveSettings()
                            setIsOpen(false)
                        }}
                    >
                        Save
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
