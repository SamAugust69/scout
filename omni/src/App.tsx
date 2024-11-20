import { Navbar } from '@/components/Navbar';
import { useLocalStorage } from '@/lib/useLocalStorage';
import { DarkModeContext } from '@/lib/context/darkModeContext';
import { AppContextContext } from './lib/context/appContext';

function App() {
	const [dark, setDark] = useLocalStorage<boolean>(false, 'theme');

	return (
		<DarkModeContext.Provider value={{ dark: dark || false, setDark }}>
			<div className="flex h-screen font-host-grotesk" data-mode={dark ? 'dark' : 'light'}>
				<AppContextContext.Provider value={{ connectionState: 'connected' }}>
					<Navbar />
					<div className="p-4 w-full bg-neutral-100 dark:bg-[#272424]"></div>
				</AppContextContext.Provider>
			</div>
		</DarkModeContext.Provider>
	);
}

export default App;
