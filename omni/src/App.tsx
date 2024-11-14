import { useState } from 'react';
import { Navbar } from './components/navbar';
import { DarkModeContext, useDarkModeContext } from './context/darkmode';

function App() {
	const [dark, setDark] = useState(false);

	return (
		<DarkModeContext.Provider value={{ dark, setDark }}>
			<div className="flex h-screen" data-mode={dark ? 'dark' : 'light'}>
				<Navbar />
				<div className="p-4 w-full bg-neutral-100"></div>;
			</div>
		</DarkModeContext.Provider>
	);
}

export default App;
