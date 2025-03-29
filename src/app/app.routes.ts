import { Routes } from '@angular/router';

export const routes: Routes = [
  // 重定向根路徑到搜尋頁面，因為搜尋頁面不再需要登入
  { path: '', redirectTo: '/search', pathMatch: 'full' },
  
  // 登入頁面
  { 
    path: 'login', 
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
  },
  
  // 搜尋頁面 (移除了 AuthGuard，不再需要身份驗證)
  { 
    path: 'search', 
    loadComponent: () => import('./pages/search/search.component').then(m => m.SearchComponent)
  },
  
  // 通配符路由 - 未找到頁面將重定向到搜尋頁面
  { path: '**', redirectTo: '/search' }
];