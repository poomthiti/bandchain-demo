/// <reference types="cypress" />

describe("Home Page", () => {
  before(() => {
    cy.visit('/')
  })

  it("Successfully render all tabs", () => {
    cy.get('[id="crypto"]').should('contain', 'Request Crypto Price')
    cy.get('[id="sendcoin"]').should('contain', 'Send Band Token')
    cy.get('[id="getpair"]').should('contain', 'Get Reference Data')
    cy.get('[id="delegate"]').should('contain', 'Delegate')
  })
})