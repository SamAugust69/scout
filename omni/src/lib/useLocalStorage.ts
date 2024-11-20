import { useEffect, useState } from "react";

const getStoredValue = <T>(key: string, initialValue: T | null) => {
  const stored = localStorage.getItem(key);

  if (stored) {
    return JSON.parse(stored);
  }
  return initialValue;
};

export function useLocalStorage<T>(
  initialValue: T | null,
  key: string
): [T | null, React.Dispatch<React.SetStateAction<T | null>>] {
  const [value, setValue] = useState<T | null>(
    getStoredValue(key, initialValue)
  );
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}
