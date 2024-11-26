import { useAppContext } from '@/lib/context/appContext';
import { Event } from '@/lib/db';
import fetchTBA from '@/lib/fetchTBA';
import { useEffect, useState } from 'react';

const searchEvents = async (connectionState: boolean, team: number, year: number): Promise<Event[] | null> => {
	if (!connectionState) return null;
	// search for event keys
	var eventKeys = await fetchTBA({
		url: `https://www.thebluealliance.com/api/v3/team/frc${team}/events/${year}/keys`,
		onErr: (e: any) => console.log('issue', e),
	}).then((res: Array<string>) => {
		return res;
	});

	var events: Array<any> = [];

	if (eventKeys == undefined) return null;

	await Promise.all(
		eventKeys.map(async (key) => {
			var event = await fetchTBA({
				url: `https://www.thebluealliance.com/api/v3/event/${key}`,
			});
			events = [...events, event];
		})
	);
	return events;
};

export const EventSearcher = () => {
	const { connectionState } = useAppContext();
	const [eventsFound, setEventsFound] = useState<Event[]>();

	useEffect(() => {
		const search = async () => {
			const events = await searchEvents(connectionState, 155, 2024);
			console.log(events);
		};
		search();
	}, []);

	return (
		<div className={`relative p-2 rounded bg-red-50 ${!connectionState ? 'cursor-not-allowed blur-sm' : ''}`}>
			search<span className="absolute -bottom-3.5 text-xs left-0">connect to internet to use</span>
		</div>
	);
};
