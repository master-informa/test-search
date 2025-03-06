import "dotenv/config";
import path from "path";
import { hideBin } from "yargs/helpers";
import yargs from "yargs/yargs";
import { composeTransitions } from "./compose-transitions";
import { csSearch } from "./cs-search";
import { readExcel } from "./read-excel";

const argv = yargs(hideBin(process.argv))
  .options({
    source: { type: "string", demandOption: true },
  })
  .parseSync();

// Usage example
(async function (): Promise<void> {
  const excelData = await readExcel(
    path.resolve(process.cwd(), argv.source),
    true
  );

  if (!excelData) {
    console.error("No data found!");
    return;
  }

  const data = composeTransitions(excelData);
  const legacyUrls = Object.keys(data);

  try {
    const searchResult = await csSearch(legacyUrls);

    console.log("--response", searchResult.length);
  } catch (er) {
    console.log('error:::', er, er.message, JSON.stringify(er.response.data));
  }
})();
