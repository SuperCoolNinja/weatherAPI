import { Cache } from "./type.ts";

const cache: Cache = {};

// If it found the data into the cache then we use it else we set it to null
const getCachedData = (key: string) => {
  if (cache[key]) {
    return Promise.resolve(cache[key]);
  }

  return Promise.resolve(null);
};

// Cache the data :
const cacheData = (key: string, data: any) => {
  cache[key] = data;
};

// We get the url from the cache if it exist else from the api then we cache it :
export const fetchData = async (url: string) => {
  const cachedData = await getCachedData(url);

  // Check if cachedData is not null then we use it :
  if (cachedData) {
    console.log("Data fetched from the cache : ", cachedData);
    return cachedData;
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Issue found fetching data");
  }

  const data = await response.json();
  cacheData(url, data);
  console.log("Data fetched from API : ", data);
  return data;
};
