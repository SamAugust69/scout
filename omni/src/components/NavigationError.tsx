import { Link } from 'react-router-dom';
import { useRouteError } from 'react-router-dom';

export const NavigationError = () => {
	const error = useRouteError() as any;
	console.error(error);

	return (
		<div className="w-full min-h-screen flex items-center justify-center">
			<div className="max-w-xl w-full bg-neutral-100 dark:bg-[#302E2E] h-72 p-4 rounded shadow-md shadow-neutral-300 dark:shadow-neutral-800 flex flex-col items-center">
				<h1 className="text-lg font-semibold text-neutral-900 dark:text-neutral-300 m-1">Ooopsy Poopsy</h1>
				<div className="h-full flex flex-col items-center justify-center">
					<p className=" font-medium text-2xl text-neutral-700 dark:text-neutral-200">{error.status || null}</p>
					<i>{error.statusText || null}</i>
				</div>
				<Link to={'/'} className="text-sm underline hover:text-neutral-600 dark:hover:text-neutral-400 transition-colors">
					Go Home
				</Link>
			</div>
		</div>
	);
};
