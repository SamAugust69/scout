import { createContext, useContext } from 'react';

export type AppContextType = {
	connectionState: 'connected' | 'disconnected' | 'connecting';
};

export const AppContextContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
	const context = useContext(AppContextContext);
	if (context === undefined) throw new Error('Use within App Context');

	return context;
};
