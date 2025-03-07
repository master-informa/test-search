import { apiClient } from "../api-client";

export async function updateRedirects(redirects: object): Promise<string[]> {
  const uids: string[] = [];

  for (const [uid, newUrl] of Object.entries(redirects)) {
    const response = await updateRedirect(uid, newUrl);

    uids.push(response.entry.uid);
  }

  return uids;
}

export async function updateRedirect(
  uid: string,
  targetUrl: string
): Promise<{ entry: { uid: string } }> {
  const response = await apiClient.get(
    `/content_types/settings_redirects/entries/${uid}`.replaceAll("//", "/")
  );

  const data = response.data;

  return apiClient.put(
    `/content_types/settings_redirects/entries/${uid}`,
    {
      entry: {
        title: data.title,
        matching_type: data.matching_type,
        original_path: data.original_path,
        query_strings: [],
        target_url: targetUrl,
        status_code: data.status_code,
        settings: {
          include_query_string: false,
        },
        tags: [],
      },
    },
    {
      params: {
        form_uid: "settings_redirects",
        entry_uid: uid,
        locale: "en-us",
      },
    }
  );
}
