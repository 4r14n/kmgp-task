describe('Authentication', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    cy.clearLocalStorage();
  });

  it('should display login page', () => {
    cy.visit('/auth/login');

    // Check login form elements exist
    cy.get('#email').should('be.visible');
    cy.get('p-password input').should('be.visible');
    cy.get('p-button[type="submit"]').should('be.visible');
  });

  it('should show validation errors for empty form', () => {
    cy.visit('/auth/login');

    // Touch fields to trigger validation
    cy.get('#email').focus().blur();
    cy.get('p-password input').focus().blur();

    // Form should show validation errors
    cy.contains('Email обязателен').should('be.visible');
    cy.contains('Пароль обязателен').should('be.visible');
  });

  it('should login successfully and redirect to orders', () => {
    cy.visit('/auth/login');

    // Fill login form
    cy.get('#email').type('test@example.com');
    cy.get('p-password input').type('password123');

    // Submit form
    cy.get('p-button[type="submit"] button').click();

    // Should redirect to orders page
    cy.url().should('include', '/orders');

    // Should show orders list
    cy.contains('Заказы').should('be.visible');
  });

  it('should persist login state after page reload', () => {
    // Login first
    cy.login();

    // Wait for redirect
    cy.url().should('include', '/orders');

    // Reload page
    cy.reload();

    // Should still be on orders page (not redirected to login)
    cy.url().should('include', '/orders');
  });

  it('should redirect to login when accessing protected route without auth', () => {
    cy.visit('/orders');

    // Should redirect to login
    cy.url().should('include', '/auth/login');
  });

  it('should redirect logged-in user from login to orders', () => {
    // Login first
    cy.login();
    cy.url().should('include', '/orders');

    // Try to visit login page
    cy.visit('/auth/login');

    // Should redirect back to orders
    cy.url().should('include', '/orders');
  });
});
