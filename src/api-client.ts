import axios from "axios";

const MANAGEMENT_BASE_URL = process.env.MANAGEMENT_BASE_URL;
const COOKIE_AUTH_TOKEN = process.env.COOKIE_AUTH_TOKEN;
const STACK_API_KEY = process.env.STACK_API_KEY;

const headers = {
  Accept: "application/json, text/plain, */*",
  "Accept-Language": "en-GB,en;q=0.9",
  api_key: STACK_API_KEY,
  branch: "main",
  "Cache-Control": "no-cache",
  "Content-Type": "application/json",
  Pragma: "no-cache",
  Cookie: `authtoken=${COOKIE_AUTH_TOKEN};`,
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.3 Safari/605.1.15 Ddg/18.3",
};

export const apiClient = axios.create({
  baseURL: MANAGEMENT_BASE_URL,
  headers,
  //   paramsSerializer: params => qs.stringify(params, { encodeValuesOnly: true })
});
