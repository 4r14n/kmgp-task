import { Injectable } from '@angular/core';

import { Order, OrderStatus } from '../../../core/models/order.interface';

/**
 * Сервис для фильтрации и сортировки заказов
 * Содержит чистые функции без состояния
 */
@Injectable({
  providedIn: 'root',
})
export class OrdersFilterService {
  /**
   * Применить все фильтры к массиву заказов
   */
  applyFilters(
    orders: Order[],
    searchQuery: string,
    status: OrderStatus | 'all',
    sortField: 'createdAt' | 'total',
    sortOrder: 'asc' | 'desc',
  ): Order[] {
    let result = [...orders];

    // Фильтр по статусу
    result = this.filterByStatus(result, status);

    // Поиск по имени клиента или номеру заказа
    result = this.filterBySearch(result, searchQuery);

    // Сортировка
    result = this.sortOrders(result, sortField, sortOrder);

    return result;
  }

  /**
   * Фильтрация по статусу
   */
  private filterByStatus(orders: Order[], status: OrderStatus | 'all'): Order[] {
    if (status === 'all') {
      return orders;
    }
    return orders.filter((order) => order.status === status);
  }

  /**
   * Фильтрация по поисковому запросу
   */
  private filterBySearch(orders: Order[], searchQuery: string): Order[] {
    if (!searchQuery) {
      return orders;
    }

    const query = searchQuery.toLowerCase();
    return orders.filter(
      (order) => order.customerName.toLowerCase().includes(query) || order.number.toLowerCase().includes(query),
    );
  }

  /**
   * Сортировка заказов
   */
  private sortOrders(orders: Order[], field: 'createdAt' | 'total', order: 'asc' | 'desc'): Order[] {
    return orders.sort((a, b) => {
      let aVal: number, bVal: number;

      if (field === 'createdAt') {
        aVal = new Date(a.createdAt).getTime();
        bVal = new Date(b.createdAt).getTime();
      } else {
        aVal = a.total;
        bVal = b.total;
      }

      return order === 'asc' ? aVal - bVal : bVal - aVal;
    });
  }
}
