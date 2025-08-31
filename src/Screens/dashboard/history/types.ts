export interface SearchResult {
  zipcode: string;
  resultCount: number;
}

export interface HistoryItem {
  date: string;
  results: SearchResult[];
}

export type FilterType = 'date' | 'results' | 'text';
