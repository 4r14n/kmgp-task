import { OrderStatus } from '../../../core/models/order.interface';

/**
 * Интерфейс для параметров фильтрации заказов
 */
export interface OrdersFilterParams {
  searchQuery: string;
  status: OrderStatus | 'all';
  sortField: 'createdAt' | 'total';
  sortOrder: 'asc' | 'desc';
  pageSize: number;
}

/**
 * Дефолтные параметры фильтрации
 */
export const DEFAULT_FILTER_PARAMS: OrdersFilterParams = {
  searchQuery: '',
  status: 'all',
  sortField: 'createdAt',
  sortOrder: 'desc',
  pageSize: 10,
};
