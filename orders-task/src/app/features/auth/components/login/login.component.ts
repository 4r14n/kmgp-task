import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';

import { ToastService } from '../../../../core/services/toast.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [CardModule, ButtonModule, InputTextModule, PasswordModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Login {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly toastService = inject(ToastService);

  loading = signal<boolean>(false);

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      this.loading.set(true);

      this.authService.login(email!, password!).subscribe({
        next: () => {
          this.loading.set(false);
          this.toastService.success('Вход выполнен успешно');
          this.router.navigate(['/orders']);
        },
        error: () => {
          this.loading.set(false);
          this.toastService.error('Ошибка входа');
        },
      });
    } else {
      this.loginForm.markAllAsTouched();
      this.toastService.error('Заполните все поля корректно');
    }
  }
}
