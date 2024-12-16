import { Modal, ModalContent } from "../ui/modal"

export const Log = () => {
    return (
        <Modal isOpen={true} setIsOpen={() => null}>
            <ModalContent>test</ModalContent>
        </Modal>
    )
}
