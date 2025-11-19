import { Injectable, signal, computed, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap, catchError, finalize } from 'rxjs/operators';

import { Order, CacheEntry } from '../../../core/models/order.interface';
import { ApiService } from '../../../core/services/api.service';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  private apiService = inject(ApiService);

  private readonly CACHE_DURATION = 5 * 60 * 1000;

  private ordersCache = signal<CacheEntry<Order[]> | null>(null);
  private loadingSignal = signal<boolean>(false);
  private errorSignal = signal<string | null>(null);

  orders = computed(() => this.ordersCache()?.data ?? []);
  isLoading = computed(() => this.loadingSignal());
  error = computed(() => this.errorSignal());
  isCacheStale = computed(() => this.ordersCache()?.isStale ?? true);

  fetchOrders(forceRefresh = false): Observable<Order[]> {
    const cache = this.ordersCache();
    const now = Date.now();

    if (!forceRefresh && cache && !cache.isStale) {
      const cacheAge = now - cache.timestamp;
      if (cacheAge < this.CACHE_DURATION) {
        return of(cache.data);
      }
    }

    if (cache && cache.isStale && !forceRefresh) {
      setTimeout(() => this.fetchFreshOrders().subscribe(), 0);
      return of(cache.data);
    }

    return this.fetchFreshOrders();
  }

  private fetchFreshOrders(): Observable<Order[]> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    return this.apiService.get<Order[]>('/orders').pipe(
      tap((orders) => {
        this.ordersCache.set({
          data: orders,
          timestamp: Date.now(),
          isStale: false,
        });
      }),
      catchError((error) => {
        const errorMessage = error?.message || 'Не удалось загрузить заказы';
        this.errorSignal.set(errorMessage);
        return of([]);
      }),
      finalize(() => this.loadingSignal.set(false)),
    );
  }

  getOrderById(id: string): Observable<Order> {
    return this.apiService.get<Order>(`/orders/${id}`);
  }

  updateOrder(id: string, order: Partial<Order>): Observable<Order> {
    return this.apiService.put<Order>(`/orders/${id}`, order).pipe(tap(() => this.invalidateCache()));
  }

  deleteOrder(id: string): Observable<void> {
    return this.apiService.delete<void>(`/orders/${id}`).pipe(tap(() => this.invalidateCache()));
  }

  private invalidateCache(): void {
    const cache = this.ordersCache();
    if (cache) {
      this.ordersCache.set({ ...cache, isStale: true });
    }
  }

  clearCache(): void {
    this.ordersCache.set(null);
  }
}
