import { useEffect, useState } from "react";
import { fetchDataFromApi } from "../utils/api";

const useFetch = (url, sessionTimeout = 180) => {
    const isDataExpired = (cachedData) => {
        const { timestamp, data } = cachedData;
        const now = Date.now();
        return now - timestamp > sessionTimeout * 1000 || !data;
    };

    const [data, setData] = useState(() => {
        const cachedData = sessionStorage.getItem(url);
        if (cachedData) {
            const parsedData = JSON.parse(cachedData);
            if (!isDataExpired(parsedData)) {
                console.log("Data retrieved from cache:", parsedData.data);
                return parsedData.data;
            } else {
                // Clear session storage if data is expired
                console.log("Sessrion Storage is Empty")
                sessionStorage.removeItem(url);
            }
        }
        return null;
    });

    const [loading, setLoading] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!data) {
            setLoading("loading...");
            console.log("Fetching data from API...");
            fetchDataFromApi(url)
                .then((res) => {
                    setLoading(false);
                    setData(res);
                    const timestamp = Date.now();
                    const dataWithTimestamp = { timestamp, data: res };
                    sessionStorage.setItem(url, JSON.stringify(dataWithTimestamp));
                    console.log("Data fetched from API:", res);
                })
                .catch((err) => {
                    setLoading(false);
                    setError("Something went wrong!");
                    console.error("Error fetching data:", err);
                });
        }
    }, [url, data]);

    return { data, loading, error };
};

export default useFetch;
