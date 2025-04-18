import Axios from "axios";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

export const axios = Axios.create({ baseURL: apiUrl + "/api" });

export const isAxiosError = Axios.isAxiosError;
