import "dotenv/config";
import path from "path";
import { hideBin } from "yargs/helpers";
import yargs from "yargs/yargs";
import { composeTransitions } from "./compose-transitions";
import { csSearch } from "./cs-search";
import { csVerifyTargets } from "./cs-verify-targets";
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
  const newUrls = Object.values(data);

  const searchResult = await csSearch(legacyUrls);
  const foundedLegacyUrls = searchResult.map((item) => item.title);

  // check if all legacy URLs were found
  if (foundedLegacyUrls.length !== legacyUrls.length) {
    console.warn(
      legacyUrls.length - foundedLegacyUrls.length,
      "Legacy URLs were not found in the search results"
    );
    console.warn(
      "Legacy URLs not found:",
      legacyUrls.filter((url) => foundedLegacyUrls.indexOf(url) < 0)
    );
  }

  const targetResult = await csVerifyTargets(newUrls);
  const foundedTargetUrls = targetResult.map((item) => item.url);

  // check if all new URLs were found
  if (foundedTargetUrls.length !== newUrls.length) {
    console.warn(
      newUrls.length - foundedTargetUrls.length,
      "Target URLs were not found in the search results"
    );
    console.warn(
      "Target URLs not found:",
      newUrls.filter((url) => foundedTargetUrls.indexOf(url) < 0)
    );
  }
})();
