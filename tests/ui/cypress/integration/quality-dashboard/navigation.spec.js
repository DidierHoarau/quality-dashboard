/// <reference types="Cypress" />

context('Navigation', () => {
  beforeEach(() => {
    cy.visit('http://localhost/quality-dashboard/');
  });

  it('Visit Login Page', () => {
    cy.get('.app-actions')
      .get('.fa-user')
      .click();
    cy.location('pathname').should('include', 'login');
  });
});
