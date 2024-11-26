import axios from 'axios';

interface fetchProps {
	url: string;
	onErr?: Function;
}

const fetchTBA = async ({ url, onErr }: fetchProps): Promise<any> => {
	const options = {
		method: 'GET',
		headers: {
			'X-TBA-Auth-Key': import.meta.env.VITE_TBA_KEY,
		},
	};
	try {
		// use data destructuring to get data from the promise object
		const { data: response } = await axios.get(url, options);
		return response;
	} catch (error) {
		onErr != undefined && onErr;
	}
};

export default fetchTBA;
