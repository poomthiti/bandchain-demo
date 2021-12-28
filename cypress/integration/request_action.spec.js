/// <reference types="cypress" />

describe("BandChain Action", () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it("Request Crypto Price Successfully", () => {
    cy.get('[id="symbols-select"]').click()
    cy.get('[id="list-item-BTC"]').click().clickOutside()
    cy.get('[id="submit-btn"]').click().should('be.disabled')
    cy.get('[id="loading-section"]').should('be.visible')
    cy.get('[id="symbols-result"]', { timeout: 20000 }).should('contain', "rates")
  })

  it("Send BAND Token successfully", () => {
    cy.get('[id="sendcoin"]').click()
    cy.get('[id="send-amount"]').type('1')
    cy.get('[id="submit-btn"]').click().should('be.disabled')
    cy.get('[id="loading-section"]').should('be.visible')
    cy.get('[id="result-container"]', { timeout: 10000 }).should('be.visible')
  })

  it("Get Reference Data Successfully", () => {
    cy.get('[id="getpair"]').click()
    cy.get('[id="symbols-select"]').click()
    cy.get('[id="list-item-BTC/USD"]').click().clickOutside()
    cy.get('[id="submit-btn"]').click().should('be.disabled')
    cy.get('[id="loading-section"]').should('be.visible')
    cy.get('[id="getpair-result"]', { timeout: 10000 }).should('contain', 'pair')
  })

  it("Delegate successfully", () => {
    cy.get('[id="delegate"]').click()
    cy.get('[id="delegate-amount"]').type('1')
    cy.get('[id="submit-btn"]').click().should('be.disabled')
    cy.get('[id="loading-section"]').should('be.visible')
    cy.get('[id="delegate-result"]', { timeout: 10000 }).should('contain', 'txhash')
  })
})