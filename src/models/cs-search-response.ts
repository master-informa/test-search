export interface CSSearchResponse {
  items: CSSearchItem[];
  count: number;
}

export interface CSSearchItem {
  _content_type_uid: string;
  uid: string;
  title: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
  version: number;
  url: string;
  fields: Field[];
}

export interface Field {
  uid: string;
  value: string | boolean | unknown[];
}
