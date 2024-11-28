import { useAppContext } from '@/lib/context/appContext';
import { Paragraph } from './ui/paragraph';

interface ConnectionStatusInterface {
	open: boolean;
}

export const ConnectionStatus = ({ open }: ConnectionStatusInterface) => {
	const { connectionState } = useAppContext();
	return (
		<div
			className={`dark:bg-[#272424] bg-neutral-200 rounded-sm p-2 flex gap-2 items-center h-8 justify-center px-8 mx-auto`}
		>
			<div className={`rounded-full w-3 h-3  ${connectionState ? 'bg-[#7C8C77]' : 'bg-red-600'}`}></div>
			<Paragraph className={`text-sm ${!open ? 'hidden' : ''}`}>
				{connectionState ? 'connected' : 'disconnected'}
			</Paragraph>
		</div>
	);
};
