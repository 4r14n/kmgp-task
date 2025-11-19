// Cypress E2E support file
// Add custom commands and global configuration here

// Custom command to login
Cypress.Commands.add('login', (email = 'test@example.com', password = 'password123') => {
  cy.visit('/auth/login');
  cy.get('#email').type(email);
  cy.get('p-password input').type(password);
  cy.get('p-button[type="submit"] button').click();
});

// Declare custom commands for TypeScript
declare global {
  namespace Cypress {
    interface Chainable {
      login(email?: string, password?: string): Chainable<void>;
    }
  }
}

export {};
