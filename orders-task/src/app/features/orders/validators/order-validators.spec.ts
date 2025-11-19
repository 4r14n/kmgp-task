import { FormControl, FormArray, FormGroup } from '@angular/forms';

import {
  minQuantityValidator,
  minPriceValidator,
  minOrderItemsValidator,
  customerNameValidator,
} from './order-validators';

describe('Order Validators', () => {
  describe('minQuantityValidator', () => {
    it('should return null for valid quantity', () => {
      const control = new FormControl(5);
      const validator = minQuantityValidator(1);
      expect(validator(control)).toBeNull();
    });

    it('should return error for quantity below min', () => {
      const control = new FormControl(0);
      const validator = minQuantityValidator(1);
      const result = validator(control);
      expect(result).toEqual({ minQuantity: { min: 1, actual: 0 } });
    });

    it('should return error for invalid number', () => {
      const control = new FormControl('abc');
      const validator = minQuantityValidator(1);
      const result = validator(control);
      expect(result).toEqual({ invalidNumber: true });
    });
  });

  describe('minPriceValidator', () => {
    it('should return null for valid price', () => {
      const control = new FormControl(99.99);
      const validator = minPriceValidator(0.01);
      expect(validator(control)).toBeNull();
    });

    it('should return error for price below min', () => {
      const control = new FormControl(0);
      const validator = minPriceValidator(0.01);
      const result = validator(control);
      expect(result).toEqual({ minPrice: { min: 0.01, actual: 0 } });
    });
  });

  describe('minOrderItemsValidator', () => {
    it('should return null for FormArray with enough items', () => {
      const formArray = new FormArray([new FormGroup({}), new FormGroup({})]);
      const validator = minOrderItemsValidator(1);
      expect(validator(formArray)).toBeNull();
    });

    it('should return error for empty FormArray', () => {
      const formArray = new FormArray([]);
      const validator = minOrderItemsValidator(1);
      const result = validator(formArray);
      expect(result).toEqual({ minItems: { min: 1, actual: 0 } });
    });
  });

  describe('customerNameValidator', () => {
    it('should return null for valid name', () => {
      const control = new FormControl('Иван Иванов');
      const validator = customerNameValidator();
      expect(validator(control)).toBeNull();
    });

    it('should return error for whitespace-only name', () => {
      const control = new FormControl('   ');
      const validator = customerNameValidator();
      const result = validator(control);
      expect(result).toEqual({ emptyString: true });
    });

    it('should return error for name shorter than 2 characters', () => {
      const control = new FormControl('A');
      const validator = customerNameValidator();
      const result = validator(control);
      expect(result).toEqual({ minLength: { min: 2, actual: 1 } });
    });

    it('should return null for empty value (let Validators.required handle)', () => {
      const control = new FormControl('');
      const validator = customerNameValidator();
      expect(validator(control)).toBeNull();
    });
  });
});
