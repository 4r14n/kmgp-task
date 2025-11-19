import { TestBed } from '@angular/core/testing';

import { OrdersFilterService } from './orders-filter.service';
import { Order } from '../../../core/models/order.interface';

describe('OrdersFilterService', () => {
  let service: OrdersFilterService;

  const mockOrders: Order[] = [
    {
      id: '1',
      number: 'ORD-001',
      customerName: 'Иван Иванов',
      status: 'new',
      items: [],
      total: 100,
      createdAt: '2025-01-15T08:00:00Z',
    },
    {
      id: '2',
      number: 'ORD-002',
      customerName: 'Петр Петров',
      status: 'processing',
      items: [],
      total: 500,
      createdAt: '2025-01-10T08:00:00Z',
    },
    {
      id: '3',
      number: 'ORD-003',
      customerName: 'Анна Сидорова',
      status: 'delivered',
      items: [],
      total: 200,
      createdAt: '2025-01-20T08:00:00Z',
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OrdersFilterService],
    });
    service = TestBed.inject(OrdersFilterService);
  });

  describe('applyFilters', () => {
    it('should return all orders when no filters applied', () => {
      const result = service.applyFilters(mockOrders, '', 'all', 'createdAt', 'desc');
      expect(result.length).toBe(3);
    });

    it('should filter by status', () => {
      const result = service.applyFilters(mockOrders, '', 'new', 'createdAt', 'desc');
      expect(result.length).toBe(1);
      expect(result[0].status).toBe('new');
    });

    it('should filter by search query in customerName', () => {
      const result = service.applyFilters(mockOrders, 'Иван', 'all', 'createdAt', 'desc');
      expect(result.length).toBe(1);
      expect(result[0].customerName).toBe('Иван Иванов');
    });

    it('should filter by search query in order number', () => {
      const result = service.applyFilters(mockOrders, 'ORD-002', 'all', 'createdAt', 'desc');
      expect(result.length).toBe(1);
      expect(result[0].number).toBe('ORD-002');
    });

    it('should sort by createdAt descending', () => {
      const result = service.applyFilters(mockOrders, '', 'all', 'createdAt', 'desc');
      expect(result[0].id).toBe('3'); // Newest first
      expect(result[2].id).toBe('2'); // Oldest last
    });

    it('should sort by total ascending', () => {
      const result = service.applyFilters(mockOrders, '', 'all', 'total', 'asc');
      expect(result[0].total).toBe(100);
      expect(result[2].total).toBe(500);
    });

    it('should combine status filter and search', () => {
      const result = service.applyFilters(mockOrders, 'Петр', 'processing', 'createdAt', 'desc');
      expect(result.length).toBe(1);
      expect(result[0].customerName).toBe('Петр Петров');
    });

    it('should return empty array when no matches', () => {
      const result = service.applyFilters(mockOrders, 'NonExistent', 'all', 'createdAt', 'desc');
      expect(result.length).toBe(0);
    });
  });
});
