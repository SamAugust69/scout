import { useState } from "react"
import { Button } from "./button"
import { vs } from "@vtechguys/vs"

export const toggleVariants = vs({
    base: "",
    variants: {
        variant: {
            default: "",
        },
        size: {
            default: "",
        },
    },
    defaultVariants: {
        size: "default",
        variant: "default",
    },
})

export const Toggle = () => {
    const [toggled, setToggled] = useState<boolean>(false)

    return <Button variant="secondary">test</Button>
}
