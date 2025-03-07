import "dotenv/config";
import path from "path";
import { hideBin } from "yargs/helpers";
import yargs from "yargs/yargs";
import { composeTransitions } from "./compose-transitions";
import { csSearch } from "./content-stack/cs-extended-search";
import { csVerifyTargets } from "./verify-targets";
import { readExcel } from "./read-excel";
import { pick, omitBy, invert, mapKeys } from "lodash";
import { csCreateRedirects } from "./content-stack/cs-create-redirect";
import { updateRedirects } from "./content-stack/cs-update-redirect";
import { csPublish } from "./content-stack/cs-publish";

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
  const missingLegacyUrls = legacyUrls.filter(
    (url) => !searchResult.find((item) => item.title === url)
  );

  // check if all legacy URLs were found
  if (missingLegacyUrls.length > 0) {
    console.warn(
      missingLegacyUrls.length,
      "Legacy URLs were not found in the search results:\n",
      missingLegacyUrls
    );
  }

  const targetResult = await csVerifyTargets(newUrls);
  const missingTargetUrls = newUrls.filter(
    (url) => !targetResult.find((item) => item.url === url)
  );

  // check if all new URLs were found
  if (missingTargetUrls.length > 0) {
    console.warn(
      missingTargetUrls.length,
      "Target URLs were not found in the search results. Target URLs not found:\n",
      missingTargetUrls
    );
  }

  // create missing redirects
  if (argv.createMissing) {
    const missingRedirects = pick(data, missingLegacyUrls);

    const created = await csCreateRedirects(missingRedirects);
    const result = await csPublish(created);
  }

  // update existing redirects
  const existingRedirects = omitBy(data, (val, key) => missingLegacyUrls.includes(key) || missingTargetUrls.includes(val));
  const sr = searchResult.reduce((ac,cur) => { ac[cur.title] = cur.uid; return ac;}, {});
  const mp = mapKeys(existingRedirects, (v,k) => sr[k]);


  const updated = await updateRedirects(mp);
  const result = await csPublish(updated);

})();
