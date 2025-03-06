import { apiClient } from "./api-client";

export async function createRedirect(
  legacyUrl: string,
  newUrl: string
): Promise<void> {
  return apiClient.post(
    "/content_types/settings_redirects/entries",
    {
      entry: {
        title: legacyUrl,
        matching_type: "path_querystring",
        original_path: legacyUrl,
        query_strings: [],
        target_url: newUrl,
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
