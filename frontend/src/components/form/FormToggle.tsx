import { Button, ButtonInterface } from "../ui/button"

export interface FormToggleInterface {
    label: string
}

export const FormToggle = ({
    defaultChecked,
    label,
}: FormToggleInterface & ButtonInterface) => {
    return <Button>{label}</Button>
}
