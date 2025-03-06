import { apiClient } from "./api-client";
import { CSSearchItem, CSSearchResponse } from "./models/cs-search-response";

const STACK_API_KEY = process.env.STACK_API_KEY;

const defaultParams = {
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
};

export async function csSearch(urls: string[]): Promise<CSSearchItem[]> {
  urls = Array.from(new Set(urls));

  const step = 20; // 20 is the maximum number of query conditions at once

  const c: CSSearchItem[] = [];

  // to avoid error "Error: URI Too Long"
  for (let i = 0; i < urls.length; i += step) {
    const chunk = urls.slice(i, Math.min(urls.length, i + step));

    const titles = chunk.map((title) => ({ title: { $eq: title } }));

    let query: any = {
      $and: [
        { _content_type_uid: { $eq: "settings_redirects" } },
        { $or: titles },
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

      c.push(...lastResponse.items);

      params.skip += params.limit;
    } while (lastResponse.count >= params.limit);
  }

  const foundedUrls = c.map((item) => item.title);

  if (foundedUrls.length !== urls.length) {
    console.warn(
      urls.length - foundedUrls.length,
      "URLs were not found in the search results"
    );
    console.warn(
      "URLs not found:",
      urls.filter((url) => foundedUrls.indexOf(url) < 0)
    );
  }

  return c;
}
