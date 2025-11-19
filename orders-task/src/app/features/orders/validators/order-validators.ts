import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Валидатор для минимального количества товара
 */
export function minQuantityValidator(min: number = 1): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (value === null || value === undefined || value === '') {
      return null; // Пустое значение обрабатывается Validators.required
    }

    const numValue = Number(value);

    if (isNaN(numValue)) {
      return { invalidNumber: true };
    }

    if (numValue < min) {
      return { minQuantity: { min, actual: numValue } };
    }

    return null;
  };
}

/**
 * Валидатор для минимальной цены
 */
export function minPriceValidator(min: number = 0.01): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (value === null || value === undefined || value === '') {
      return null;
    }

    const numValue = Number(value);

    if (isNaN(numValue)) {
      return { invalidNumber: true };
    }

    if (numValue < min) {
      return { minPrice: { min, actual: numValue } };
    }

    return null;
  };
}

/**
 * Валидатор для проверки, что хотя бы один товар присутствует в заказе
 */
export function minOrderItemsValidator(min: number = 1): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const items = control.value;

    if (!Array.isArray(items)) {
      return { invalidArray: true };
    }

    if (items.length < min) {
      return { minItems: { min, actual: items.length } };
    }

    return null;
  };
}

/**
 * Валидатор для проверки, что имя клиента не пустое и не состоит только из пробелов
 */
export function customerNameValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (!value) {
      return null; // Обрабатывается Validators.required
    }

    if (typeof value !== 'string') {
      return { invalidString: true };
    }

    if (value.trim().length === 0) {
      return { emptyString: true };
    }

    if (value.trim().length < 2) {
      return { minLength: { min: 2, actual: value.trim().length } };
    }

    return null;
  };
}
