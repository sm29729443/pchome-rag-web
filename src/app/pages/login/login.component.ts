import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  hidePassword = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    // 檢查是否從註冊頁面跳轉過來
    this.route.queryParams.subscribe(params => {
      if (params['registered'] === 'success') {
        // 如果是註冊成功跳轉過來，顯示成功訊息
        this.errorMessage = '註冊成功，請登入您的帳號';
      } else if (params['unauthorized'] === 'true') {
        // 如果是未登入使用需要認證的功能，顯示提示
        this.errorMessage = '您尚未登入或登入已過期，請先登入';
        // 記錄重定向 URL
        if (params['redirectUrl']) {
          localStorage.setItem('redirectUrl', params['redirectUrl']);
        }
      }
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const { username, password } = this.loginForm.value;

    // 使用後端 API 進行登入
    this.authService.login(username, password).subscribe({
      next: () => {
        this.isLoading = false;
        
        // 要檢查是否有重定向 URL 並導向該頁面
        const redirectUrl = localStorage.getItem('redirectUrl');
        if (redirectUrl) {
          // 移除存儲的重定向 URL
          localStorage.removeItem('redirectUrl');
          // 導向到原始訪問的頁面
          this.router.navigateByUrl(redirectUrl);
        } else {
          // 如果沒有重定向 URL，就導向到搜尋頁面
          this.router.navigate(['/search']);
        }
      },
      error: (error) => {
        this.isLoading = false;
        
        if (error.status === 401) {
          this.errorMessage = '用戶名或密碼錯誤';
        } else {
          this.errorMessage = '登入失敗，請稍後再試';
        }
        
        console.error('登入錯誤:', error);
      }
    });
  }
}
