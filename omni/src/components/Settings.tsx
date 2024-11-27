import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Modal, ModalContent, ModalFooter } from "./ui/modal";
import { Input } from "./ui/input";
import { Settings } from "@/lib/types/settings";
import { useAppContext } from "@/lib/context/appContext";

interface SettingsInterface {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isOpen: boolean;
}

export const SettingsMenu = ({ isOpen, setIsOpen }: SettingsInterface) => {
  const [changes, setChanges] = useState<Partial<Settings>>({});
  const { settings, setSettings } = useAppContext();

  useEffect(() => {
    console.log(changes);
  }, [changes]);

  const formatStringAsNumber = (value: string) => {
    // takes input like "155mm" and converts it to -> "155"; weird function

    return value.replace(/[^0-9]/g, "");
  };

  const onChange = (value: string, key: keyof Partial<Settings>) => {
    // const target = e.target as HTMLInputElement;
    console.log(value);

    setChanges({ ...changes, [key]: value });
  };

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <ModalContent>
        <label htmlFor="teamInput" className="dark:text-neutral-200 text-xs">
          Team Number
        </label>
        <Input
          id="teamInput"
          defaultValue={settings.team || 0}
          placeholder="Team Number"
          type="number"
          onChange={(e) =>
            onChange(formatStringAsNumber(e.target.value), "team")
          }
        />
        <ModalFooter className="flex justify-end">
          <Button size="md">Save</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
