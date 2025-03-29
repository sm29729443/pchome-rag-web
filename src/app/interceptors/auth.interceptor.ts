import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  // 檢查 token URL 請求是否已經有授權標頭
  if (req.url.includes('/token') || req.headers.has('Authorization')) {
    return next(req);
  }
  
  // 從 Auth 服務獲取令牌
  const token = authService.getToken();
  
  if (token) {
    // 克隆請求並添加授權標頭
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    
    // 送出修改後的請求
    return next(authReq).pipe(
      catchError(error => {
        // 處理 401 (未授權) 錯誤
        if (error.status === 401) {
          authService.logout();
          router.navigate(['/login']);
        }
        return throwError(() => error);
      })
    );
  }
  
  // 如果沒有令牌，直接傳遞原始請求
  return next(req);
};
