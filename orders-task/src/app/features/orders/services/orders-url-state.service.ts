import { Injectable, inject } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { OrderStatus } from '../../../core/models/order.interface';
import { OrdersFilterParams, DEFAULT_FILTER_PARAMS } from '../models/orders-filter.interface';

/**
 * Сервис для синхронизации состояния фильтров с URL
 */
@Injectable({
  providedIn: 'root',
})
export class OrdersUrlStateService {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  /**
   * Загрузить параметры фильтрации из URL
   */
  loadFromUrl(): OrdersFilterParams {
    const params = this.route.snapshot.queryParams;

    return {
      status: (params['status'] as OrderStatus | 'all') || DEFAULT_FILTER_PARAMS.status,
      searchQuery: params['search'] || DEFAULT_FILTER_PARAMS.searchQuery,
      sortField: (params['sortBy'] as 'createdAt' | 'total') || DEFAULT_FILTER_PARAMS.sortField,
      sortOrder: (params['sortOrder'] as 'asc' | 'desc') || DEFAULT_FILTER_PARAMS.sortOrder,
      pageSize: params['pageSize'] ? +params['pageSize'] : DEFAULT_FILTER_PARAMS.pageSize,
    };
  }

  /**
   * Синхронизировать параметры с URL
   */
  syncToUrl(params: OrdersFilterParams): void {
    const queryParams: Params = {
      status: params.status !== 'all' ? params.status : null,
      search: params.searchQuery || null,
      sortBy: params.sortField,
      sortOrder: params.sortOrder,
      pageSize: params.pageSize,
    };

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }
}
