import { createContext, Dispatch, SetStateAction, useContext } from "react";

export type DarkModeType = {
  dark: boolean;
  setDark: Dispatch<SetStateAction<boolean | null>>;
};

export const DarkModeContext = createContext<DarkModeType | undefined>(
  undefined
);

export const useDarkModeContext = () => {
  const context = useContext(DarkModeContext);
  if (context === undefined) throw new Error("Use within App Context");

  return context;
};
