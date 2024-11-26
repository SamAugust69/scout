export async function handleConnection(): Promise<boolean> {
	if (navigator.onLine) {
		try {
			const online = await isReachable(window.location.origin);
			if (online) {
				console.log('connected');
				return true;
			}
		} catch (err) {
			console.warn('Reachability check failed:', err);
		}
	}
	console.log('disconnected');
	return false;
}

async function isReachable(url: string): Promise<boolean> {
	try {
		/**
		 * Note: fetch() still "succeeds" for 404s on subdirectories,
		 * which is ok when only testing for domain reachability.
		 *
		 * Example:
		 *   https://google.com/noexist does not throw
		 *   https://noexist.com/noexist does throw
		 */
		const resp = await fetch(url, { method: 'HEAD', mode: 'no-cors' });
		return resp && (resp.ok || resp.type === 'opaque');
	} catch (err) {
		console.warn('[conn test failure]:', err);
		return false;
	}
}
