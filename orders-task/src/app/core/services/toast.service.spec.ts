import { TestBed } from '@angular/core/testing';
import { MessageService } from 'primeng/api';

import { ToastService } from './toast.service';

describe('ToastService', () => {
  let service: ToastService;
  let messageServiceSpy: jasmine.SpyObj<MessageService>;

  beforeEach(() => {
    messageServiceSpy = jasmine.createSpyObj('MessageService', ['add', 'clear']);

    TestBed.configureTestingModule({
      providers: [ToastService, { provide: MessageService, useValue: messageServiceSpy }],
    });

    service = TestBed.inject(ToastService);
  });

  describe('success', () => {
    it('should call MessageService.add with success severity', () => {
      service.success('Operation completed');

      expect(messageServiceSpy.add).toHaveBeenCalledWith(
        jasmine.objectContaining({
          severity: 'success',
          detail: 'Operation completed',
          life: 3000,
        }),
      );
    });

    it('should use custom title and duration', () => {
      service.success('Done', 'Custom Title', 5000);

      expect(messageServiceSpy.add).toHaveBeenCalledWith(
        jasmine.objectContaining({
          severity: 'success',
          summary: 'Custom Title',
          detail: 'Done',
          life: 5000,
        }),
      );
    });
  });

  describe('error', () => {
    it('should call MessageService.add with error severity', () => {
      service.error('Something went wrong');

      expect(messageServiceSpy.add).toHaveBeenCalledWith(
        jasmine.objectContaining({
          severity: 'error',
          detail: 'Something went wrong',
          life: 5000,
        }),
      );
    });
  });

  describe('info', () => {
    it('should call MessageService.add with info severity', () => {
      service.info('Information message');

      expect(messageServiceSpy.add).toHaveBeenCalledWith(
        jasmine.objectContaining({
          severity: 'info',
          detail: 'Information message',
          life: 3000,
        }),
      );
    });
  });

  describe('warn', () => {
    it('should call MessageService.add with warn severity', () => {
      service.warn('Warning message');

      expect(messageServiceSpy.add).toHaveBeenCalledWith(
        jasmine.objectContaining({
          severity: 'warn',
          detail: 'Warning message',
          life: 4000,
        }),
      );
    });
  });

  describe('clear', () => {
    it('should call MessageService.clear', () => {
      service.clear();
      expect(messageServiceSpy.clear).toHaveBeenCalled();
    });
  });
});
