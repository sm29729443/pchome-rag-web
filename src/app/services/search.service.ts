import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

export interface QueryRecord {
  id: number;
  user_id: number;
  query: string;
  response: string;
  created_at: string;
}

export interface QueryHistoryResponse {
  records: QueryRecord[];
  total: number;
}

export interface SearchRequest {
  content: string;
}

export interface ComparisonResults {
  best_choice: string;
  best_value: string;
  best_quality: string;
  most_features: string;
}

export interface ProductComparison {
  product_name: string;
  brand: string;
  price: string;
  pros: string[];
  cons: string[];
  key_features: string[];
  suitable_scenarios: string[];
  rating: number;
}

export interface SearchResponse {
  comparison_results: ComparisonResults;
  product_comparisons: ProductComparison[];
  analysis: string;
}

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  search(content: string): Observable<SearchResponse> {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json');
    
    const body: SearchRequest = { content };
    
    return this.http.post<SearchResponse>(`${this.apiUrl}/search`, body, { headers });
  }

  getHistory(skip: number = 0, limit: number = 10): Observable<QueryHistoryResponse> {
    return this.http.get<QueryHistoryResponse>(`${this.apiUrl}/history?skip=${skip}&limit=${limit}`);
  }

  getHistoryRecord(id: number): Observable<QueryRecord> {
    return this.http.get<QueryRecord>(`${this.apiUrl}/history/${id}`);
  }

  deleteHistoryRecord(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/history/${id}`);
  }
}
