export function composeTransitions(data): object {
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
  