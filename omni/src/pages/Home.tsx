import { Button, buttonVariants } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Paragraph } from '@/components/ui/paragraph';
import { cn } from '@/lib/utils';
import clsx from 'clsx';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';

export const Home = () => {
	const events = useLiveQuery(async () => {
		return await db.events.toArray();
	});

	return (
		<section className="p-4 flex flex-col w-full max-w-xl mx-auto gap-2 min-w-96">
			<Paragraph className="text-end font-bold mb-1">Home</Paragraph>
			<span className="h-0.5 w-full rounded-sm mb-4 bg-[#7C8C77]"></span>
			<div className=" flex justify-center mx-auto w-full flex-col gap-4">
				<div>
					<Heading size="lg">Select an Event!</Heading>
					<Paragraph>No events? Create one below</Paragraph>
				</div>
				{events?.map((event) => {
					return (
						<Button variant="primary" size="lg" className="w-full flex justify-center items-center gap-2">
							{event.name}
						</Button>
					);
				})}
				<Link
					to="/create"
					className={cn(
						clsx(buttonVariants({ variant: 'primary', size: 'lg' })),
						'w-full flex justify-center items-center gap-2'
					)}
				>
					Add Event
					<Plus className="w-4" />
				</Link>
			</div>
		</section>
	);
};
