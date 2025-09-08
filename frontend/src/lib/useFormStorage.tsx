import { FormPage } from "@/components/pages/FormBuilder"
import { useCallback, useEffect, useState } from "react"

export type Form = {
    pages: FormPage[]
    title: string
    year: number
    dateModified: Date
}

export type FormStorage = {
    [id: string]: Form
}

const FORMS_KEY = "forms"

export const useFormStorage = () => {
    const [forms, setForms] = useState<FormStorage>({})

    const getForms = (): FormStorage => {
        return JSON.parse(localStorage.getItem(FORMS_KEY) || "{}")
    }

    useEffect(() => {
        setForms(() => getForms())
    }, [])

    const getForm = useCallback(
        (id: string): Form => {
            return forms[id]
        },
        [forms]
    )

    const saveForm = (id: string, formData: Form) => {
        localStorage.setItem(
            FORMS_KEY,
            JSON.stringify({ ...forms, [id]: formData })
        )
        setForms(() => getForms())
    }

    const deleteForm = (id: string) => {
        const remainingForms = Object.fromEntries(
            Object.entries(forms).filter(([key]) => key !== id)
        )
        localStorage.setItem(FORMS_KEY, JSON.stringify(remainingForms))
        setForms(() => getForms())
    }

    return { forms, getForm, saveForm, deleteForm }
}
