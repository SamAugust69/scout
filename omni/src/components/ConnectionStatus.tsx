import { useAppContext } from '@/lib/context/appContext';
import { Paragraph } from './ui/paragraph';

interface ConnectionStatusInterface {
	open: boolean;
}

export const ConnectionStatus = ({ open }: ConnectionStatusInterface) => {
	const { connectionState } = useAppContext();
	return (
		<div
			className={`dark:bg-[#272424] bg-neutral-200 rounded p-2 flex gap-2 items-center h-8 justify-center px-8 mx-auto`}
		>
			<div className="rounded-full w-3 h-3 bg-[#7C8C77]"></div>
			<Paragraph className={`text-sm ${!open ? 'hidden' : ''}`}>{connectionState}</Paragraph>
		</div>
	);
};
