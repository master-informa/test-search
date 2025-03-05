import ExcelJS from "exceljs";
import axios from "axios";
import rxjs from "rxjs";
import path from "path";
import qs from 'qs';
import 'dotenv/config';

const MANAGEMENT_BASE_URL = process.env.MANAGEMENT_BASE_URL;
const STACK_API_KEY = process.env.STACK_API_KEY;
const COOKIE_AUTH_TOKEN = process.env.COOKIE_AUTH_TOKEN;

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

const apiClient = axios.create({
  baseURL: MANAGEMENT_BASE_URL,
  headers,
//   paramsSerializer: params => qs.stringify(params, { encodeValuesOnly: true })
});

async function readExcelData(
  filePath: string
): Promise<string[][] | undefined> {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);

  // Get the first worksheet
  const worksheet = workbook.worksheets[0];

  if (!worksheet) {
    console.error("No worksheet found!");
    return;
  }

  const data: string[][] = [];

  // Iterate over rows starting from the second row (skipping the first row)
  worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
    if (rowNumber === 1) return; // Skip the header row

    let r = row.values as any;

    data.push([r[1].text ?? r[1], r[3].text ?? r[3]]); // Slice to remove the first empty index
  });

  return data;
}

function composeObj(data): object {
  // compose an object from the data
  return data.reduce((acc, [legacyUrl, newUrl]) => {
    // remove the leading domain
    try {
      legacyUrl = legacyUrl.replace(/^(https?:)?(\/\/)?(www\.)?nrn.com/, "");

      acc[legacyUrl] = newUrl.replace(/^(https?:)?(\/\/)?(www\.)?nrn.com/, "");
    } catch (e) {
      console.error(e, "--", acc, "--", legacyUrl, "--", newUrl, "<--");
      throw e;
    }

    return acc;
  }, {} as any);
}

async function search(k: string[]): Promise<any> {
  const titles = k.map((title) => ({ title: { $eq: title } }));
  console.log('--titles', titles);
  let query: any = 
  {
    $and: [
      { _content_type_uid: { $eq: "settings_redirects" } },
    //   { $or: titles },
    { $or: [{"title":{"$eq":"/speakerbox"}},{"title":{"$eq":"/menu-tracker"}}]}
    ],
  }
  ;
// query = qs.stringify(query, { encodeValuesOnly: true});
query = new URLSearchParams(
    Object.fromEntries(
      Object.entries(query).map(([k, v]) => [
        k,
        typeof v === "object" ? JSON.stringify(v) : String(v),
      ])
    )
  ).toString();
  
console.log('--query', JSON.stringify(query));
  let params = {
    skip: 0,

    include_publish_details: true,
    include_unpublished: true,
    include_workflow: true,
    include_fields: true,
    include_rules: true,
    include_title_field_uid: true,
    include_taxonomies: true,
    include_creator_details: true,
    type: "entries",

    limit: 100,
    desc: "created_at",
    query,
  };
  



  // Add a request interceptor to log request details
apiClient.interceptors.request.use(request => {
    console.log("🔵 Axios Request Info:");
    console.log("➡️ URL:", request.baseURL, request.url);
    console.log("📝 Query Params:", request.params, JSON.stringify(request.params));
    console.log("📩 Encoded Query String:", qs.stringify(request.params, { encodeValuesOnly: true }));
    console.log("📨 Headers:", request.headers);
    return request;
});

  const response = await apiClient.get(
    `/stacks/${STACK_API_KEY}/search`,
    {params}
  );

  console.log(response.status, response.request);

  return response.data;
}

// Usage example
async function run() {
  const excelData = await readExcelData(
    path.join(__dirname, "NRN_Redirect_Request_Mapping.xlsx")
  );

  if (!excelData) {
    console.error("No data found!");
    return;
  }

  const data = composeObj(excelData);
  try {
  const searchResult = await search(Object.keys(data).slice(0, 10));

  console.log("--response", searchResult);
  } catch(er) {
console.log(er.message);
  }


}

run();

interface CSSearchResponse {
  items: any[];
  count: number;
}
