import { CurrencyPipe } from '@angular/common';
import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { ReactiveFormsModule, FormArray, FormGroup } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-order-items-table',
  standalone: true,
  imports: [CurrencyPipe, ReactiveFormsModule, TableModule, ButtonModule, InputTextModule, InputNumberModule],
  templateUrl: './order-items-table.component.html',
  styleUrl: './order-items-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderItemsTable {
  // Inputs
  itemsFormArray = input.required<FormArray>();
  readonly = input<boolean>(false);

  // Outputs
  removeItem = output<number>();
  addItem = output<void>();

  /**
   * Получить FormGroup для конкретного индекса
   */
  getItemFormGroup(index: number): FormGroup {
    return this.itemsFormArray().at(index) as FormGroup;
  }

  /**
   * Проверить, есть ли ошибка валидации у поля
   */
  hasError(index: number, fieldName: string): boolean {
    const formGroup = this.getItemFormGroup(index);
    const control = formGroup.get(fieldName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  /**
   * Получить текст ошибки для поля
   */
  getErrorMessage(index: number, fieldName: string): string {
    const formGroup = this.getItemFormGroup(index);
    const control = formGroup.get(fieldName);

    if (!control || !control.errors) {
      return '';
    }

    if (control.errors['required']) {
      return 'Обязательное поле';
    }

    if (control.errors['minQuantity']) {
      return `Минимум ${control.errors['minQuantity'].min}`;
    }

    if (control.errors['minPrice']) {
      return `Минимум ${control.errors['minPrice'].min}`;
    }

    if (control.errors['invalidNumber']) {
      return 'Некорректное число';
    }

    return 'Некорректное значение';
  }

  /**
   * Вычислить сумму для товара
   */
  calculateItemTotal(index: number): number {
    const formGroup = this.getItemFormGroup(index);
    const qty = formGroup.get('qty')?.value || 0;
    const price = formGroup.get('price')?.value || 0;
    return qty * price;
  }

  /**
   * Обработчик удаления товара
   */
  onRemoveItem(index: number): void {
    this.removeItem.emit(index);
  }

  /**
   * Обработчик добавления товара
   */
  onAddItem(): void {
    this.addItem.emit();
  }
}
