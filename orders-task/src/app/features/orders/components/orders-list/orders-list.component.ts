import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, OnInit, signal, computed, inject, ChangeDetectionStrategy, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { filter } from 'rxjs';

import { OrderStatus } from '../../../../core/models/order.interface';
import { ToastService } from '../../../../core/services/toast.service';
import { AuthService } from '../../../auth/services/auth.service';
import {
  ORDER_STATUS_SEVERITY,
  ORDER_STATUS_LABELS,
  ORDER_STATUS_OPTIONS,
  PAGE_SIZE_OPTIONS,
} from '../../models/order-status.constants';
import { OrdersFilterParams } from '../../models/orders-filter.interface';
import { OrdersFilterService } from '../../services/orders-filter.service';
import { OrdersUrlStateService } from '../../services/orders-url-state.service';
import { OrdersService } from '../../services/orders.service';

@Component({
  selector: 'app-orders-list',
  standalone: true,
  imports: [
    DatePipe,
    DecimalPipe,
    FormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    SelectModule,
    TagModule,
    ProgressSpinnerModule,
    TooltipModule,
  ],
  templateUrl: './orders-list.component.html',
  styleUrl: './orders-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrdersList implements OnInit {
  readonly ordersService = inject(OrdersService);
  private readonly filterService = inject(OrdersFilterService);
  private readonly urlStateService = inject(OrdersUrlStateService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly toastService = inject(ToastService);
  private readonly authService = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);

  searchQuery = signal<string>('');
  selectedStatus: OrderStatus | 'all' = 'all';
  sortField = signal<'createdAt' | 'total'>('createdAt');
  sortOrder = signal<'asc' | 'desc'>('desc');
  pageSize = 10;

  private filterTrigger = signal<number>(0);

  filteredOrders = computed(() => {
    this.filterTrigger();

    return this.filterService.applyFilters(
      this.ordersService.orders(),
      this.searchQuery(),
      this.selectedStatus,
      this.sortField(),
      this.sortOrder(),
    );
  });

  totalRecords = computed(() => this.filteredOrders().length);

  readonly statusOptions = ORDER_STATUS_OPTIONS;
  readonly pageSizeOptions = PAGE_SIZE_OPTIONS;

  constructor() {}


  ngOnInit(): void {
    const urlState = this.urlStateService.loadFromUrl();
    this.applyUrlState(urlState);

    this.loadOrders();

    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => {
        this.loadOrders();
      });
  }

  /**
   * Применить состояние из URL к компоненту
   */
  private applyUrlState(state: OrdersFilterParams): void {
    this.selectedStatus = state.status;
    this.searchQuery.set(state.searchQuery);
    this.sortField.set(state.sortField);
    this.sortOrder.set(state.sortOrder);
    this.pageSize = state.pageSize;
  }

  /**
   * Загрузить заказы с сервера
   */
  loadOrders(): void {
    this.ordersService.fetchOrders().subscribe({
      next: () => {},
      error: () => {
        this.toastService.error('Не удалось загрузить заказы');
      },
    });
  }

  /**
   * Обработчик поиска
   */
  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchQuery.set(value);
    this.triggerFilter();
    this.syncStateToUrl();
  }

  /**
   * Обработчик изменения статуса
   */
  onStatusChange(): void {
    this.triggerFilter();
    this.syncStateToUrl();
  }

  /**
   * Обработчик сортировки
   */
  onSort(field: 'createdAt' | 'total'): void {
    if (this.sortField() === field) {
      this.sortOrder.set(this.sortOrder() === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortField.set(field);
      this.sortOrder.set('desc');
    }
    this.triggerFilter();
    this.syncStateToUrl();
  }

  /**
   * Обработчик изменения страницы
   */
  onPageChange(event: { rows: number }): void {
    this.pageSize = event.rows;
    this.syncStateToUrl();
  }

  /**
   * Переход к деталям заказа
   */
  onViewOrder(orderId: string): void {
    this.router.navigate([orderId], { relativeTo: this.route });
  }

  /**
   * Сбросить все фильтры
   */
  resetFilters(): void {
    this.searchQuery.set('');
    this.selectedStatus = 'all';
    this.triggerFilter();
    this.syncStateToUrl();
  }

  /**
   * Триггер для обновления фильтров
   */
  private triggerFilter(): void {
    this.filterTrigger.update((v) => v + 1);
  }

  /**
   * Синхронизировать текущее состояние с URL
   */
  private syncStateToUrl(): void {
    this.urlStateService.syncToUrl({
      status: this.selectedStatus,
      searchQuery: this.searchQuery(),
      sortField: this.sortField(),
      sortOrder: this.sortOrder(),
      pageSize: this.pageSize,
    });
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

  /**
   * Выход из системы
   */
  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
