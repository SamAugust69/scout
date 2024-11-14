import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import '@/styles/App.css';
import { Navbar } from './components/navbar.tsx';
import { DarkModeContext } from './context/darkmode.ts';

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<App />
	</StrictMode>
);
