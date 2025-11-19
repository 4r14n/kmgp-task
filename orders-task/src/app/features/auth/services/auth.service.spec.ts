import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [AuthService, { provide: Router, useValue: routerSpy }],
    });

    service = TestBed.inject(AuthService);
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('login', () => {
    it('should store token in localStorage and update isAuthenticated signal', (done) => {
      service.login('test@test.com', 'password123').subscribe({
        next: (response) => {
          expect(response.token).toBeTruthy();
          expect(localStorage.getItem('auth_token')).toBeTruthy();
          expect(service.isAuthenticated()).toBe(true);
          done();
        },
      });
    });

    it('should generate token from email and timestamp', (done) => {
      service.login('user@example.com', 'password').subscribe({
        next: (response) => {
          const decoded = atob(response.token);
          expect(decoded).toContain('user@example.com');
          done();
        },
      });
    });
  });

  describe('logout', () => {
    it('should remove token from localStorage and update isAuthenticated signal', () => {
      localStorage.setItem('auth_token', 'test-token');
      service.isAuthenticated.set(true);

      service.logout();

      expect(localStorage.getItem('auth_token')).toBeNull();
      expect(service.isAuthenticated()).toBe(false);
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/auth/login']);
    });
  });

  describe('getToken', () => {
    it('should return token from localStorage', () => {
      localStorage.setItem('auth_token', 'my-token');
      expect(service.getToken()).toBe('my-token');
    });

    it('should return null if no token', () => {
      expect(service.getToken()).toBeNull();
    });
  });

  describe('isLoggedIn', () => {
    it('should return true if token exists', () => {
      localStorage.setItem('auth_token', 'token');
      expect(service.isLoggedIn()).toBe(true);
    });

    it('should return false if no token', () => {
      expect(service.isLoggedIn()).toBe(false);
    });
  });
});
