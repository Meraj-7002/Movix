import axios from "axios";

const BASE_URL = "https://api.themoviedb.org/3";
const TMDB_TOKEN = import.meta.env.VITE_APP_TMDB_TOKEN;

const headers = {
    Authorization: "bearer " + TMDB_TOKEN,
};

const isDataExpired = (cachedData, sessionTimeout = 180) => {
    const { timestamp, data } = cachedData;
    const now = Date.now();
    return now - timestamp > sessionTimeout * 1000 || !data;
};

export const fetchDataFromApi = async (url, params, sessionTimeout = 180) => {
    try {
        const cachedData = sessionStorage.getItem(url);

        if (cachedData) {
            const parsedData = JSON.parse(cachedData);
            if (!isDataExpired(parsedData, sessionTimeout)) {
                console.log("Data retrieved from cache:", parsedData.data);
                return parsedData.data;
            } else {
                // Clear session storage if data is expired
                sessionStorage.removeItem(url);
            }
        }

        const { data } = await axios.get(BASE_URL + url, {
            headers,
            params,
        });

        // Cache the fetched data
        const timestamp = Date.now();
        const dataWithTimestamp = { timestamp, data };
        sessionStorage.setItem(url, JSON.stringify(dataWithTimestamp));
        console.log("Data fetched from API:", data);

        return data;
    } catch (err) {
        console.error("Error fetching data:", err);
        throw err;
    }
};
