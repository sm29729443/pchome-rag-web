import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  hidePassword = true;
  hideConfirmPassword = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      user_name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.checkPasswords });
  }

  // 自定義驗證器：檢查密碼是否匹配
  checkPasswords(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { notSame: true };
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const { user_name, email, password } = this.registerForm.value;

    this.authService.register(user_name, email, password).subscribe({
      next: () => {
        this.isLoading = false;
        // 註冊成功，跳轉到登入頁面
        this.router.navigate(['/login'], { 
          queryParams: { registered: 'success' }
        });
      },
      error: (error) => {
        this.isLoading = false;
        
        if (error.status === 400) {
          if (error.error?.detail?.includes('用戶名已被使用')) {
            this.errorMessage = '用戶名已被使用';
          } else if (error.error?.detail?.includes('email已被使用')) {
            this.errorMessage = 'Email已被使用';
          } else {
            this.errorMessage = error.error?.detail || '註冊失敗，請稍後再試';
          }
        } else {
          this.errorMessage = '註冊失敗，請稍後再試';
        }
        
        console.error('註冊錯誤:', error);
      }
    });
  }
}
