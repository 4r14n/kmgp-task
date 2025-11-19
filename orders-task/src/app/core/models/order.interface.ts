/**
 * Типы статусов заказа
 */
export type OrderStatus = 'new' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

/**
 * Интерфейс позиции заказа
 */
export interface OrderItem {
  productId: number;
  productName: string;
  qty: number;
  price: number;
}

/**
 * Интерфейс заказа (соответствует структуре db.json)
 */
export interface Order {
  id: string;
  number: string;
  customerName: string;
  status: OrderStatus;
  items: OrderItem[];
  total: number;
  createdAt: string; // ISO date string
}

/**
 * Параметры запроса для фильтрации и сортировки заказов
 */
export interface OrderQueryParams {
  status?: OrderStatus | 'all';
  search?: string;
  sortBy?: 'createdAt' | 'total';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}

/**
 * Интерфейс для кэша данных (stale-while-revalidate pattern)
 */
export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  isStale: boolean;
}
