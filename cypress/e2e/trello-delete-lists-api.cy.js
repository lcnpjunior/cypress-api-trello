/// <reference types="cypress" />

context('Network Requests', () => {
  const API_KEY = ''
  const API_TOKEN = '' 
  // const AUTH = `OAuth oauth_consumer_key="${API_KEY}", oauth_token="${API_TOKEN}"`

  it('create lists and cards', () => {
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
        method: 'POST',
        url: 'https://api.trello.com/1/lists',
        qs: {
          key: API_KEY,
          token: API_TOKEN,
          name: 'Backlog',
          idBoard: this.boards.id
        },
      })
      .should((response) => {
        expect(response).property('status').to.equal(200) // new entity created
        expect(response).property('body').to.contain({
          name: 'Backlog',
        })
      })
      .its('body')
      .as('list')

      .then(function () {

        cardsListsName.forEach(cardName => {
          cy.request({
            method: 'POST',
            url: 'https://api.trello.com/1/cards',
            qs: {
              key: API_KEY,
              token: API_TOKEN,
              name: cardName,
              idList: this.list.id
            },
          })
          .should((response) => {
            expect(response).property('status').to.equal(200) // new entity created
            expect(response).property('body').to.contain({
              name: cardName,
            })
          })
        })
      })

    })
  })





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





