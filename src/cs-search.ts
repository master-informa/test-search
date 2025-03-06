export async function csSearch(k: string[]): Promise<any> {
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