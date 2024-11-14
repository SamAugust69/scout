import { useDarkModeContext } from '@/context/darkmode';
import { useState } from 'react';

export const Navbar = () => {
	const [open, setOpen] = useState(true);
	const { dark, setDark } = useDarkModeContext();

	return (
		<nav className={`${open && 'w-[40rem]'} dark:bg-neutral-900`}>
			<button onClick={() => setDark(!dark)}>dark</button>
		</nav>
	);
};
