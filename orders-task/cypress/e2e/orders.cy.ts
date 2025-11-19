describe('Orders Management', () => {
  beforeEach(() => {
    // Login before each test
    cy.login();
    cy.url().should('include', '/orders');
  });

  describe('Orders List', () => {
    it('should display orders table', () => {
      // Check table headers
      cy.contains('Номер заказа').should('be.visible');
      cy.contains('Клиент').should('be.visible');
      cy.contains('Статус').should('be.visible');
      cy.contains('Сумма').should('be.visible');
      cy.contains('Дата создания').should('be.visible');
    });

    it('should filter orders by search', () => {
      // Type in search field
      cy.get('input[placeholder*="Имя клиента"]').type('Иван');

      // Should show filtered results
      cy.contains('Иван Иванов').should('be.visible');
    });

    it('should filter orders by status', () => {
      // Open status dropdown and select
      cy.get('p-select[id="status"]').click();
      cy.contains('Новый').click();

      // Should show only new orders
      cy.get('p-tag').each(($tag) => {
        cy.wrap($tag).should('contain.text', 'Новый');
      });
    });

    it('should navigate to order details on row click', () => {
      // Click on first order row
      cy.get('table tbody tr').first().click();

      // Should navigate to order details
      cy.url().should('match', /\/orders\/\d+/);
    });
  });

  describe('Order Details', () => {
    beforeEach(() => {
      // Navigate to first order
      cy.get('table tbody tr').first().click();
      cy.url().should('match', /\/orders\/\d+/);
    });

    it('should display order information', () => {
      // Check order details are visible
      cy.get('input[formcontrolname="customerName"]').should('be.visible');
      cy.get('p-select').should('exist'); // Status dropdown
    });

    it('should edit customer name and save', () => {
      // Get original customer name
      cy.get('input[formcontrolname="customerName"]')
        .invoke('val')
        .then((originalName) => {
          // Clear and type new name
          cy.get('input[formcontrolname="customerName"]').clear().type('Updated Customer Name');

          // Save button should be enabled
          cy.contains('button', 'Сохранить').should('not.be.disabled');

          // Click save
          cy.contains('button', 'Сохранить').click();

          // Should show success toast
          cy.contains('успешно').should('be.visible');

          // Restore original name for other tests
          cy.get('input[formcontrolname="customerName"]').clear().type(String(originalName));
          cy.contains('button', 'Сохранить').click();
        });
    });

    it('should navigate back to orders list', () => {
      // Click back button (icon button with arrow-left)
      cy.get('p-button[icon="pi pi-arrow-left"] button').first().click();

      // Should be on orders list
      cy.url().should('match', /\/orders$/);
    });

    it('should add new item to order', () => {
      // Count initial items
      cy.get('table tbody tr').then(($rows) => {
        const initialCount = $rows.length;

        // Click add item button
        cy.contains('button', 'Добавить').click();

        // Should have one more row
        cy.get('table tbody tr').should('have.length', initialCount + 1);
      });
    });

    it('should show validation error for empty customer name', () => {
      // Clear customer name
      cy.get('input[formcontrolname="customerName"]').clear();

      // Trigger validation
      cy.get('input[formcontrolname="customerName"]').blur();

      // Should show validation error
      cy.get('input[formcontrolname="customerName"]').should('have.class', 'ng-invalid');
    });

    it('should recalculate total when item quantity changes', () => {
      // Get initial total
      cy.contains('Общая сумма заказа:')
        .parent()
        .invoke('text')
        .then((initialTotal) => {
          // Change quantity of first item
          cy.get('p-inputnumber input').first().clear().type('5');

          // Total should change
          cy.contains('Общая сумма заказа:').parent().invoke('text').should('not.eq', initialTotal);
        });
    });
  });

  describe('Delete Order', () => {
    it('should show confirmation dialog before delete', () => {
      // Navigate to order details
      cy.get('table tbody tr').first().click();

      // Click delete button
      cy.contains('button', 'Удалить').click();

      // Should show confirmation dialog
      cy.contains('Подтверждение').should('be.visible');
      cy.contains('Отмена').should('be.visible');
    });

    it('should cancel delete when clicking cancel', () => {
      // Navigate to order details
      cy.get('table tbody tr').first().click();

      // Click delete button
      cy.contains('button', 'Удалить').click();

      // Click cancel in dialog
      cy.contains('button', 'Отмена').click();

      // Should still be on order details
      cy.url().should('match', /\/orders\/\d+/);
    });
  });
});
