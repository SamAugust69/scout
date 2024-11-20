import { useDarkModeContext } from '@/lib/context/darkModeContext';
import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { MatchNavigation } from './MatchNavigation';
import { ConnectionStatus } from './ConnectionStatus';

export const Navbar = () => {
	const [open, setOpen] = useState(false);
	const { setDark, dark } = useDarkModeContext();

	return (
		<motion.nav
			className={` dark:bg-[#302E2E] flex flex-col p-2 gap-4 peer`}
			animate={{ width: open ? 1000 : 100 }}
			transition={{ duration: 0.05 }}
		>
			<button onClick={() => setOpen(!open)}>open {open ? 'true' : 'false'}</button>
			{/* <button className="peer-hover:block  hidden">cllose</button> */}

			<ConnectionStatus open={open} />

			<div className="h-full">
				<AnimatePresence>{open && <MatchNavigation />}</AnimatePresence>
			</div>
			<button className=" " onClick={() => setDark(!dark)}>
				dark
			</button>
		</motion.nav>
	);
};
