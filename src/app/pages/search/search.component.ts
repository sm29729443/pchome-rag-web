import { Component, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { SearchService, SearchResponse, QueryRecord, QueryHistoryResponse } from '../../services/search.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  searchControl = new FormControl('');
  isLoading = false;
  hasSearched = false;
  error: string | null = null;
  searchResults: SearchResponse | null = null;
  username: string | null = null;
  
  // 歷史記錄相關屬性
  historyRecords: QueryRecord[] = [];
  historyTotal: number = 0;
  historyPage: number = 0;
  historyLimit: number = 5;
  isLoadingHistory: boolean = false;
  historyError: string | null = null;
  showHistory: boolean = false;
  Math = Math; // 使 Math 對象在模板中可用
  isLoggedIn: boolean = false; // 判斷用戶是否登入

  // 在模板中使用的日期格式化方法
  formatDate(dateStr: string): string {
    try {
      const date = new Date(dateStr);
      return date.toLocaleString();
    } catch(e) {
      return dateStr;
    }
  }

  constructor(
    private searchService: SearchService,
    private authService: AuthService,
    private router: Router
  ) {
    const user = this.authService.getUser();
    if (user) {
      this.username = user.username;
    }
    this.isLoggedIn = this.authService.isLoggedIn();
  }

  ngOnInit(): void {
    // 如果用戶已登入，載入歷史記錄
    if (this.isLoggedIn) {
      this.loadHistory();
    }
  }

  onSearch(): void {
    const query = this.searchControl.value;
    this.isLoading = true;
    this.searchResults = null;
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
        
        // 成功搜尋後重新載入歷史記錄
        if (this.isLoggedIn) {
          this.loadHistory();
        }
      },
      error: (error) => {
        this.isLoading = false;
        
        // 根據錯誤題型顯示不同的錯誤訊息
        if (error.status === 401) {
          this.error = '您尚未登入或登入已過期，請先登入後再使用搜尋功能。';
          
          // 我們不需要再這裡引導登入，因為攝截器已經處理了 401 錯誤
          // 但還是可以顯示一個不同的錯誤訊息
        } else if (error.status === 500) {
          this.error = '伺服器發生錯誤，請稍後再試。';
        } else {
          this.error = '搜尋時發生錯誤，請稍後再試。';
        }
        
        console.error('搜尋錯誤:', error);
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.isLoggedIn = false;
    this.showHistory = false;
  }

  // 載入歷史記錄
  loadHistory(): void {
    this.isLoadingHistory = true;
    this.historyError = null;
    const skip = this.historyPage * this.historyLimit;

    this.searchService.getHistory(skip, this.historyLimit).subscribe({
      next: (response) => {
        this.historyRecords = response.records;
        this.historyTotal = response.total;
        this.isLoadingHistory = false;
      },
      error: (error) => {
        this.isLoadingHistory = false;
        this.historyError = '無法載入歷史記錄';
        console.error('歷史記錄載入錯誤:', error);
      }
    });
  }

  // 切換歷史記錄頁面
  changePage(increment: number): void {
    const newPage = this.historyPage + increment;
    if (newPage >= 0 && newPage * this.historyLimit < this.historyTotal) {
      this.historyPage = newPage;
      this.loadHistory();
    }
  }

  // 使用歷史記錄中的查詢
  useHistoryQuery(query: string): void {
    this.searchControl.setValue(query);
    this.onSearch();
  }

  // 刪除歷史記錄
  deleteHistoryRecord(id: number, event: Event): void {
    event.stopPropagation(); // 防止觸發父元素的點擊事件
    
    this.searchService.deleteHistoryRecord(id).subscribe({
      next: () => {
        // 刪除成功後重新載入歷史記錄
        this.loadHistory();
      },
      error: (error) => {
        console.error('刪除歷史記錄錯誤:', error);
      }
    });
  }

  // 切換歷史記錄顯示狀態
  toggleHistory(): void {
    this.showHistory = !this.showHistory;
    if (this.showHistory && this.isLoggedIn && this.historyRecords.length === 0) {
      this.loadHistory();
    }
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
