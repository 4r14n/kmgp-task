# ToastService - Примеры использования

## Базовое использование

### 1. Успешное уведомление
```typescript
import { inject } from '@angular/core';
import { ToastService } from '@core/services/toast.service';

export class MyComponent {
  private toastService = inject(ToastService);

  saveData() {
    // ... логика сохранения
    this.toastService.success('Данные успешно сохранены');
  }
}
```

### 2. Уведомление об ошибке
```typescript
deleteOrder(id: number) {
  try {
    // ... логика удаления
    this.toastService.success('Заказ удален');
  } catch (error) {
    this.toastService.error('Не удалось удалить заказ');
  }
}
```

### 3. Предупреждение
```typescript
checkStock() {
  if (stock < 5) {
    this.toastService.warn('Товар заканчивается на складе', 'Низкий остаток');
  }
}
```

### 4. Информационное сообщение
```typescript
startSync() {
  this.toastService.info('Синхронизация началась', 'Обновление данных');
}
```

## Продвинутое использование

### 5. Кастомная длительность
```typescript
// Показать успех на 5 секунд
this.toastService.success('Операция завершена', 'Успех', 5000);

// Быстрое уведомление на 1.5 секунды
this.toastService.info('Автосохранение', '', 1500);
```

### 6. Sticky уведомления (не исчезают автоматически)
```typescript
showCriticalError() {
  this.toastService.sticky(
    'error',
    'Критическая ошибка! Требуется ручное вмешательство.',
    'Критическая ошибка'
  );
}
```

### 7. Кастомное уведомление с опциями
```typescript
showCustomNotification() {
  this.toastService.custom(
    'success',
    'Заказ создан',
    'Новый заказ #12345',
    {
      life: 6000,
      sticky: false,
      closable: true,
      key: 'order-notification',
      data: { orderId: 12345 }
    }
  );
}
```

### 8. Очистка уведомлений
```typescript
// Очистить все
clearAll() {
  this.toastService.clear();
}

// Очистить по ключу
clearOrderNotifications() {
  this.toastService.clearByKey('order-notification');
}
```

## Использование в сервисах

### OrdersService
```typescript
@Injectable({ providedIn: 'root' })
export class OrdersService {
  private http = inject(HttpClient);
  private toastService = inject(ToastService);

  async updateOrder(id: number, data: Partial<Order>) {
    try {
      const result = await this.http.put(`/orders/${id}`, data).toPromise();
      this.toastService.success('Заказ обновлен');
      return result;
    } catch (error) {
      this.toastService.error('Не удалось обновить заказ');
      throw error;
    }
  }
}
```

### AuthService
```typescript
@Injectable({ providedIn: 'root' })
export class AuthService {
  private toastService = inject(ToastService);

  login(email: string, password: string) {
    // ... логика входа
    this.toastService.success(`Добро пожаловать, ${email}!`, 'Вход выполнен');
  }

  logout() {
    // ... логика выхода
    this.toastService.info('Вы вышли из системы', 'До свидания');
  }
}
```

## Все доступные методы

| Метод | Описание | Длительность по умолчанию |
|-------|----------|---------------------------|
| `success(message, title?, life?)` | Успешное уведомление | 3000ms |
| `error(message, title?, life?)` | Ошибка | 5000ms |
| `info(message, title?, life?)` | Информация | 3000ms |
| `warn(message, title?, life?)` | Предупреждение | 4000ms |
| `contrast(message, title?, life?)` | Контрастное (важное) | 6000ms |
| `secondary(message, title?, life?)` | Вторичное | 3000ms |
| `sticky(severity, message, title?)` | Не исчезает автоматически | ∞ |
| `custom(severity, summary, detail, options?)` | Полный контроль | По настройке |
| `clear()` | Очистить все | - |
| `clearByKey(key)` | Очистить по ключу | - |

## Severity (типы уведомлений)

- `success` - Зеленое (успех)
- `info` - Синее (информация)
- `warn` - Желтое (предупреждение)
- `error` - Красное (ошибка)
- `secondary` - Серое (вторичное)
- `contrast` - Контрастное (важное)
