import { OrderStatus } from '../../../core/models/order.interface';

/**
 * Маппинг статусов на severity для PrimeNG Tag
 */
export const ORDER_STATUS_SEVERITY: Record<OrderStatus, 'success' | 'info' | 'warn' | 'danger' | 'secondary'> = {
  new: 'info',
  processing: 'warn',
  shipped: 'secondary',
  delivered: 'success',
  cancelled: 'danger',
};

/**
 * Маппинг статусов на русские labels
 */
export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  new: 'Новый',
  processing: 'В обработке',
  shipped: 'Отправлен',
  delivered: 'Доставлен',
  cancelled: 'Отменён',
};

/**
 * Опции для dropdown выбора статуса
 */
export const ORDER_STATUS_OPTIONS = [
  { label: 'Все статусы', value: 'all' },
  { label: ORDER_STATUS_LABELS.new, value: 'new' },
  { label: ORDER_STATUS_LABELS.processing, value: 'processing' },
  { label: ORDER_STATUS_LABELS.shipped, value: 'shipped' },
  { label: ORDER_STATUS_LABELS.delivered, value: 'delivered' },
  { label: ORDER_STATUS_LABELS.cancelled, value: 'cancelled' },
];

/**
 * Опции для dropdown размера страницы
 */
export const PAGE_SIZE_OPTIONS = [
  { label: '5', value: 5 },
  { label: '10', value: 10 },
  { label: '20', value: 20 },
  { label: '50', value: 50 },
];
