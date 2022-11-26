/// <reference types="cypress" />

context('Network Requests', () => {
  let API_KEY =  Cypress.env('API_KEY')
  let API_TOKEN = Cypress.env('API_TOKEN') 
  // const AUTH = `OAuth oauth_consumer_key="${API_KEY}", oauth_token="${API_TOKEN}"`

  it('delete all lists', () => {

    cy.request({
      url: 'https://api.trello.com/1/members/me/boards',
      qs: {
        key: API_KEY,
        token: API_TOKEN,
      },
    })
    .should((response) => {
      expect(response.status).to.eq(200)
      expect(response).to.have.property('headers')
      expect(response).to.have.property('duration')
    })
    .its('body').its('0') 
    .as('boards')

    .then(function () {
      cy.request({
        method: 'GET',
        url: `https://api.trello.com/1/boards/${this.boards.id}/lists`,
        qs: {
          key: API_KEY,
          token: API_TOKEN,
        },
      })
      .should((response) => {
        expect(response).property('status').to.equal(200) // new entity created
      })
    })
    .its('body')
    .as('lists')
  
    .then(function () {
      this.lists.forEach(list => {
        cy.request({
          method: 'PUT',
          url: `https://api.trello.com/1/lists/${list.id}/closed`,
          qs: {
            key: API_KEY,
            token: API_TOKEN,
            value: true
          },
        })
        .should((response) => {
          expect(response).property('status').to.equal(200) // new entity created
        })
      })
    })
  
  })

})





