import { useEffect, useState } from "react"

const getStoredValue = <T>(key: string, initialValue: T) => {
    const stored = localStorage.getItem(key)

    if (stored) {
        return JSON.parse(stored)
    }
    return initialValue
}

export function useLocalStorage<T>(
    initialValue: T,
    key: string
): [T, React.Dispatch<React.SetStateAction<T>>] {
    const [value, setValue] = useState<T>(getStoredValue(key, initialValue))
    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(value))
    }, [key, value])

    return [value, setValue]
}
