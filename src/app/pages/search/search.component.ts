import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SearchService, SearchResponse } from '../../services/search.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {
  searchControl = new FormControl('');
  isLoading = false;
  hasSearched = false;
  error: string | null = null;
  searchResults: SearchResponse | null = null;
  username: string | null = null;

  constructor(
    private searchService: SearchService,
    private authService: AuthService,
    private router: Router
  ) {
    const user = this.authService.getUser();
    if (user) {
      this.username = user.username;
    }
  }

  onSearch(): void {
    const query = this.searchControl.value;
    
    if (!query || query.trim() === '') {
      return;
    }
    
    this.isLoading = true;
    this.error = null;
    
    this.searchService.search(query).subscribe({
      next: (response) => {
        this.searchResults = response;
        this.hasSearched = true;
        this.isLoading = false;
        console.log('搜尋結果:', response);
      },
      error: (error) => {
        this.isLoading = false;
        this.error = '搜尋時發生錯誤，請稍後再試。';
        console.error('搜尋錯誤:', error);
      }
    });
  }

  logout(): void {
    this.authService.logout();
  }

  // 獲取產品評分的顏色
  getRatingColor(rating: number): string {
    if (rating >= 8.5) return 'text-green-600';
    if (rating >= 7) return 'text-blue-600';
    if (rating >= 5) return 'text-yellow-600';
    return 'text-red-600';
  }

  // 比較兩個產品的評分
  compareRatings(rating1: number, rating2: number): string {
    const diff = rating1 - rating2;
    if (diff > 1.5) return 'bg-green-50 text-green-700';
    if (diff < -1.5) return 'bg-red-50 text-red-700';
    return '';
  }
}
