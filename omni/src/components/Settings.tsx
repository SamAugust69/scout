import { SettingsIcon } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';

export const Settings = () => {
	return (
		<Dialog>
			<DialogTrigger>
				<Button>
					<SettingsIcon />
				</Button>
			</DialogTrigger>
			<DialogContent></DialogContent>
		</Dialog>
	);
};
