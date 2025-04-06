import { 
  HttpHandlerFn, 
  HttpInterceptorFn, 
  HttpRequest, 
  HttpErrorResponse 
} from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>, 
  next: HttpHandlerFn
) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  // 從 AuthService 獲取 token
  const token = authService.getToken();
  
  // 如果有 token，添加到請求頭
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
  
  // 處理請求
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // 處理 401 未授權錯誤
      if (error.status === 401) {
        // 如果是未登入造成的 401 錯誤
        if (router.url !== '/login') {
          // 存儲目前的 URL，以便登入後能夠返回
          localStorage.setItem('redirectUrl', router.url);
          
          // 跳轉到登入頁面
          router.navigate(['/login'], { 
            queryParams: { 
              unauthorized: 'true',
              redirectUrl: router.url 
            }
          });
        }
      }
      
      // 將錯誤傳遞給訂閱者
      return throwError(() => error);
    })
  );
};
