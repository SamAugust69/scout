import { Button, ButtonInterface } from "../ui/button"

export interface FormToggleInterface {
    label: string
    jsonKey: string
}

export const FormToggle = ({
    defaultChecked,
    label,
}: FormToggleInterface & ButtonInterface) => {
    return <Button>{label}</Button>
}
