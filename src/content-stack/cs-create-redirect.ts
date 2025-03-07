import { apiClient } from "../api-client";

export async function csCreateRedirects(redirects: object): Promise<string[]> {
  const uids: string[] = [];

  for (const [legacyUrl, newUrl] of Object.entries(redirects)) {
    const result = await csCreateRedirect(legacyUrl, newUrl);

    uids.push(result.entry.uid);
  }

  return uids;
}

export async function csCreateRedirect(
  legacyUrl: string,
  targetUrl: string
): Promise<{ entry: { uid: string } }> {
  return apiClient.post(
    "/content_types/settings_redirects/entries",
    {
      entry: {
        title: legacyUrl,
        matching_type: "path_querystring",
        original_path: legacyUrl,
        query_strings: [],
        target_url: targetUrl,
        status_code: "301",
        settings: { include_query_string: false },
        tags: [],
      },
    },
    {
      params: {
        form_uid: "settings_redirects",
      },
    }
  );
}
