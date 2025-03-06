export interface CSSearchResponse {
  items: CSSearchItem[];
  count: number;
}

export interface CSSearchItem {
  uid: string;
  title: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
  _content_type_uid: string;
  version: number;
}
