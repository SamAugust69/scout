import { useDarkModeContext } from '@/lib/context/darkModeContext';
import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { MatchNavigation } from './MatchNavigation';
import { ConnectionStatus } from './ConnectionStatus';
import { ChevronsLeft, ChevronsRight, Moon, Settings, Sun } from 'lucide-react';
import { Button } from './ui/button';

export const Navbar = () => {
	const [open, setOpen] = useState(false);
	const { setDark, dark } = useDarkModeContext();

	return (
		<motion.nav
			className={`relative dark:bg-[#302E2E] bg-neutral-100 flex flex-col px-2 py-4 gap-4 group/nav max-w-[100vw] flex-shrink-0 w-[100px] ${
				!open ? 'cursor-pointer' : 'cursor-auto'
			}`}
			animate={{ width: open ? '600px' : '100px' }}
			transition={{ duration: 0.1 }}
			onClick={() => !open && setOpen(!open)}
		>
			<Button
				onClick={() => setOpen(!open)}
				className={`opacity-0 ${
					open ? 'group-hover/nav:opacity-100' : null
				}  w-8 p-1 flex items-center justify-center absolute right-2 transition-opacity`}
			>
				<ChevronsLeft />
			</Button>
			<Button
				onClick={() => setOpen(!open)}
				className={`opacity-0 ${
					!open ? 'group-hover/nav:opacity-100' : null
				}  dark:bg-[#302E2E] w-8 p-1 rounded flex items-center justify-center transition-all  absolute -right-10`}
			>
				<ChevronsRight />
			</Button>

			<ConnectionStatus open={open} />
			{/* <Link
        to={"/test"}
        onClick={(e) => {
          e.stopPropagation();
          setOpen(false);
        }}
      >
        navigate somewhere else btn
      </Link> */}

			{/* <Button className="mx-auto px-3 py-1 text-neutral-800 flex text-sm gap-1 group/home">
				<Home className="w-5 h-5" />
				<span className="hidden group-hover/home:block">Home</span>
			</Button> */}

			<div className="h-full">
				<AnimatePresence>{open && <MatchNavigation />}</AnimatePresence>
			</div>

			<div className={` flex ${open ? 'justify-between' : 'justify-center'} gap-1 rounded px-4`}>
				<Button variant="link" className={`text-sm ${open ? '' : 'hidden'}`}>
					Help
				</Button>
				<div className="flex gap-4">
					<Button
						className={` ${!open ? 'hidden' : 'flex'}
              w-10 p-1 rounded items-center justify-center transition-all `}
					>
						<Settings className="w-5" />
					</Button>
					<Button
						onClick={() => setDark(!dark)}
						className="transition-colors h-8 w-16 rounded flex justify-center items-center"
					>
						<Sun className={`${dark ? 'size-0' : 'size-5'} transition-all`} />
						<Moon className={`${!dark ? 'size-0' : 'size-5'} transition-all`} />
					</Button>
				</div>
				{/* <Settings /> */}
			</div>
			<Button
				className={`opacity-100 ${open ? 'opacity-0' : ''}
          dark:bg-[#302E2E] w-10 p-1 py-2 rounded flex items-center justify-center transition-all  absolute -right-12 bottom-2`}
			>
				<Settings className="w-5" />
			</Button>
		</motion.nav>
	);
};
