import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, OnInit, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';

import { Order, OrderStatus, OrderItem } from '../../../../core/models/order.interface';
import { ToastService } from '../../../../core/services/toast.service';
import { ORDER_STATUS_SEVERITY, ORDER_STATUS_LABELS, ORDER_STATUS_OPTIONS } from '../../models/order-status.constants';
import { OrdersService } from '../../services/orders.service';
import {
  minQuantityValidator,
  minPriceValidator,
  minOrderItemsValidator,
  customerNameValidator,
} from '../../validators/order-validators';
import { OrderItemsTable } from '../order-items-table/order-items-table.component';

@Component({
  selector: 'app-orders-detail',
  standalone: true,
  imports: [
    CurrencyPipe,
    DatePipe,
    ReactiveFormsModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    SelectModule,
    TagModule,
    ProgressSpinnerModule,
    ConfirmDialogModule,
    OrderItemsTable,
  ],
  providers: [ConfirmationService],
  templateUrl: './orders-detail.component.html',
  styleUrl: './orders-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrdersDetail implements OnInit {
  private readonly ordersService = inject(OrdersService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);
  private readonly toastService = inject(ToastService);
  private readonly confirmationService = inject(ConfirmationService);

  loading = signal<boolean>(true);
  error = signal<string | null>(null);
  order = signal<Order | null>(null);
  saving = signal<boolean>(false);

  orderForm: FormGroup;

  get totalAmount(): number {
    if (!this.orderForm) {
      return 0;
    }

    const items = this.itemsFormArray.value as OrderItem[];
    return items.reduce((sum, item) => sum + (item.qty || 0) * (item.price || 0), 0);
  }

  get hasChanges(): boolean {
    return this.orderForm?.dirty ?? false;
  }

  readonly statusOptions = ORDER_STATUS_OPTIONS;

  constructor() {
    this.orderForm = this.fb.group({
      customerName: ['', [Validators.required, customerNameValidator()]],
      status: ['new' as OrderStatus, [Validators.required]],
      items: this.fb.array([], [minOrderItemsValidator(1)]),
    });
  }

  ngOnInit(): void {
    const orderId = this.route.snapshot.paramMap.get('id');

    if (!orderId) {
      this.error.set('ID заказа не найден');
      this.loading.set(false);
      return;
    }

    this.loadOrder(orderId);
  }

  /**
   * Загрузить заказ с сервера
   */
  private loadOrder(orderId: string): void {
    this.loading.set(true);
    this.error.set(null);

    this.ordersService.getOrderById(orderId).subscribe({
      next: (order) => {
        this.order.set(order);
        this.populateForm(order);
        this.loading.set(false);
      },
      error: (_err) => {
        this.error.set('Не удалось загрузить заказ');
        this.loading.set(false);
        this.toastService.error('Не удалось загрузить заказ');
      },
    });
  }

  /**
   * Заполнить форму данными заказа
   */
  private populateForm(order: Order): void {
    this.orderForm.patchValue({
      customerName: order.customerName,
      status: order.status,
    });

    // Очистить существующие товары
    this.itemsFormArray.clear();

    // Добавить товары из заказа
    order.items.forEach((item) => {
      this.itemsFormArray.push(this.createItemFormGroup(item));
    });

    // Сбросить dirty state после загрузки
    this.orderForm.markAsPristine();
  }

  /**
   * Создать FormGroup для товара
   */
  private createItemFormGroup(item?: OrderItem): FormGroup {
    return this.fb.group({
      productId: [item?.productId || 0],
      productName: [item?.productName || '', [Validators.required]],
      qty: [item?.qty || 1, [Validators.required, minQuantityValidator(1)]],
      price: [item?.price || 0, [Validators.required, minPriceValidator(0.01)]],
    });
  }

  /**
   * Получить FormArray товаров
   */
  get itemsFormArray(): FormArray {
    return this.orderForm.get('items') as FormArray;
  }

  /**
   * Добавить новый товар
   */
  onAddItem(): void {
    this.itemsFormArray.push(this.createItemFormGroup());
    this.orderForm.markAsDirty();
  }

  /**
   * Удалить товар
   */
  onRemoveItem(index: number): void {
    this.itemsFormArray.removeAt(index);
    this.orderForm.markAsDirty();
  }

  /**
   * Сохранить изменения заказа
   */
  onSave(): void {
    if (this.orderForm.invalid) {
      this.orderForm.markAllAsTouched();
      this.toastService.error('Форма заполнена некорректно');
      return;
    }

    const currentOrder = this.order();
    if (!currentOrder) {
      return;
    }

    // Подготовить данные для отправки
    const updatedOrder: Order = {
      ...currentOrder,
      customerName: this.orderForm.value.customerName,
      status: this.orderForm.value.status,
      items: this.orderForm.value.items,
      total: this.totalAmount,
    };

    // Optimistic update: сразу обновляем UI
    const previousOrder = { ...currentOrder };
    this.order.set(updatedOrder);
    this.orderForm.markAsPristine();

    this.saving.set(true);

    this.ordersService.updateOrder(updatedOrder.id, updatedOrder).subscribe({
      next: (savedOrder) => {
        this.order.set(savedOrder);
        this.populateForm(savedOrder);
        this.saving.set(false);
        this.toastService.success('Заказ успешно сохранён');
      },
      error: (_err) => {
        // Rollback при ошибке
        this.order.set(previousOrder);
        this.populateForm(previousOrder);
        this.saving.set(false);
        this.toastService.error('Не удалось сохранить заказ');
      },
    });
  }

  /**
   * Удалить заказ
   */
  onDelete(): void {
    const currentOrder = this.order();
    if (!currentOrder) {
      return;
    }

    this.confirmationService.confirm({
      message: `Вы уверены, что хотите удалить заказ ${currentOrder.number}?`,
      header: 'Подтверждение удаления',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Да, удалить',
      rejectLabel: 'Отмена',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.performDelete(currentOrder.id);
      },
    });
  }

  /**
   * Выполнить удаление заказа
   */
  private performDelete(orderId: string): void {
    this.saving.set(true);

    this.ordersService.deleteOrder(orderId).subscribe({
      next: () => {
        this.toastService.success('Заказ успешно удалён');
        this.router.navigate(['/orders']);
      },
      error: (_err) => {
        this.saving.set(false);
        this.toastService.error('Не удалось удалить заказ');
      },
    });
  }

  /**
   * Вернуться к списку заказов
   */
  onBack(): void {
    this.router.navigate(['/orders']);
  }

  /**
   * Получить severity для тега статуса
   */
  getStatusSeverity(status: OrderStatus): 'success' | 'info' | 'warn' | 'danger' | 'secondary' {
    return ORDER_STATUS_SEVERITY[status];
  }

  /**
   * Получить русский label для статуса
   */
  getStatusLabel(status: OrderStatus): string {
    return ORDER_STATUS_LABELS[status];
  }
}
