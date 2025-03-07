import { apiClient } from "./api-client";
import { CSSearchItem, CSSearchResponse } from "./models/cs-search-response";

const STACK_API_KEY = process.env.STACK_API_KEY;
const STEP = 20; // 20 is the maximum number of query conditions at once

const defaultParams = {
  type: "entries",
  skip: 0,
  limit: 100,
  include_publish_details: true,
  include_unpublished: true,
  include_workflow: true,
  include_fields: true,
  include_rules: true,
  include_title_field_uid: true,
  include_taxonomies: true,
  include_creator_details: true,
};

export async function csVerifyTargets(urls: string[]): Promise<CSSearchItem[]> {
  urls = Array.from(new Set(urls));

  const responseItems: CSSearchItem[] = [];

  // to avoid error 414 "Error: URI Too Long"
  for (let i = 0; i < urls.length; i += STEP) {
    const chunk = urls.slice(i, Math.min(urls.length, i + STEP));

    const urls2 = chunk.map((url) => ({ url: { $eq: url } }));

    let query = {
      $and: [
        { _content_type_uid: { $ne: "settings_redirects" } },
        { $or: urls2 },
      ],
    };

    const params = {
      ...defaultParams,
      query: JSON.stringify(query),
    };

    let lastResponse: CSSearchResponse | null = null;

    do {
      const response = await apiClient.get<CSSearchResponse>(
        `/stacks/${STACK_API_KEY}/search`,
        {
          params,
        }
      );
      lastResponse = response.data;

      responseItems.push(...lastResponse.items);

      params.skip += params.limit;
    } while (lastResponse.count >= params.limit);
  }

  return responseItems;
}
