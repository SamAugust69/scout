import { createContext, useContext } from 'react';

export type DarkModeType = { dark: boolean; setDark: (val: boolean) => void };

export const DarkModeContext = createContext<DarkModeType | undefined>(undefined);

export const useDarkModeContext = () => {
	const context = useContext(DarkModeContext);
	if (context === undefined) throw new Error('Use within App Context');

	return context;
};
