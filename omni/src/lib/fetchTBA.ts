import axios from "axios"

interface fetchProps {
    url: string
}

const fetchTBA = async ({ url }: fetchProps): Promise<any> => {
    const options = {
        method: "GET",
        headers: {
            "X-TBA-Auth-Key": import.meta.env.VITE_TBA_KEY,
        },
    }
    try {
        // use data destructuring to get data from the promise object
        const { data: response } = await axios.get(url, options)
        return response
    } catch (error) {
        throw error
    }
}

export default fetchTBA
