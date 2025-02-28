import { createContext, Dispatch, SetStateAction, useContext } from "react"

export type FormContextType = {
    formIsOpen: boolean
    setFormIsOpen: Dispatch<SetStateAction<boolean>>
}

export const FormContext = createContext<FormContextType | undefined>(undefined)

export const useFormContext = () => {
    const context = useContext(FormContext)
    if (context === undefined) throw new Error("Use within Form Context")

    return context
}
