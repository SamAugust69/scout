import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Modal, ModalContent, ModalFooter } from "./ui/modal";
import { Input } from "./ui/input";
import { Settings } from "@/lib/types/settings";

interface SettingsInterface {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isOpen: boolean;
}

export const SettingsMenu = ({ isOpen, setIsOpen }: SettingsInterface) => {
  const [changes, setChanges] = useState<Partial<Settings>>({});

  useEffect(() => {
    console.log(changes);
  }, [changes]);

  const onChange = (
    e: React.FormEvent<HTMLInputElement>,
    key: keyof Partial<Settings>
  ) => {
    const target = e.target as HTMLInputElement;

    setChanges({ ...changes, [key]: target.value });
  };

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <ModalContent>
        <label htmlFor="teamInput" className="dark:text-neutral-200 text-xs">
          Team Number
        </label>
        <Input
          id="teamInput"
          placeholder=""
          onChange={(e) => onChange(e, "team")}
        />
        <ModalFooter className="flex justify-end">
          <Button size="md">Save</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
