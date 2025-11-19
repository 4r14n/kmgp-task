import { inject, Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private readonly messageService = inject(MessageService);

  success(message: string, title = 'Успешно', life = 3000): void {
    this.messageService.add({
      severity: 'success',
      summary: title,
      detail: message,
      life,
    });
  }

  error(message: string, title = 'Ошибка', life = 5000): void {
    this.messageService.add({
      severity: 'error',
      summary: title,
      detail: message,
      life,
    });
  }

  info(message: string, title = 'Информация', life = 3000): void {
    this.messageService.add({
      severity: 'info',
      summary: title,
      detail: message,
      life,
    });
  }

  warn(message: string, title = 'Внимание', life = 4000): void {
    this.messageService.add({
      severity: 'warn',
      summary: title,
      detail: message,
      life,
    });
  }

  contrast(message: string, title = 'Внимание!', life = 6000): void {
    this.messageService.add({
      severity: 'contrast',
      summary: title,
      detail: message,
      life,
    });
  }

  secondary(message: string, title = '', life = 3000): void {
    this.messageService.add({
      severity: 'secondary',
      summary: title,
      detail: message,
      life,
    });
  }

  clear(): void {
    this.messageService.clear();
  }

  clearByKey(key: string): void {
    this.messageService.clear(key);
  }

  custom(
    severity: 'success' | 'info' | 'warn' | 'error' | 'secondary' | 'contrast',
    summary: string,
    detail: string,
    options?: {
      life?: number;
      sticky?: boolean;
      closable?: boolean;
      key?: string;
      data?: unknown;
    },
  ): void {
    this.messageService.add({
      severity,
      summary,
      detail,
      life: options?.life,
      sticky: options?.sticky,
      closable: options?.closable,
      key: options?.key,
      data: options?.data,
    });
  }

  sticky(severity: 'success' | 'info' | 'warn' | 'error', message: string, title = ''): void {
    this.messageService.add({
      severity,
      summary: title,
      detail: message,
      sticky: true,
    });
  }
}
