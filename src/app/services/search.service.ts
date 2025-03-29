import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

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
}
