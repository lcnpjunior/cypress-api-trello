/// <reference types="cypress" />

context('Network Requests', () => {
  const API_KEY =  Cypress.env('API_KEY')
  const API_TOKEN = Cypress.env('API_TOKEN') 

  it.only('create lists and cards', () => {

      cy.fixture('dados-trello-board').then((dados) => {

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

          dados.forEach(item => {
          
            cy.request({
              method: 'POST',
              url: 'https://api.trello.com/1/lists',
              qs: {
                key: API_KEY,
                token: API_TOKEN,
                name: item.boardName,
                idBoard: this.boards.id
              },
            })
            .should((response) => {
              expect(response).property('status').to.equal(200) // new entity created
              expect(response).property('body').to.contain({
                name: item.boardName,
              })
            })
            .its('body')
            .as('list')

            .then(function () {

              item.cardsList.forEach(card => {

                cy.request({
                  method: 'POST',
                  url: 'https://api.trello.com/1/cards',
                  qs: {
                    key: API_KEY,
                    token: API_TOKEN,
                    name: card,
                    idList: this.list.id
                  },
                })
                .should((response) => {
                  expect(response).property('status').to.equal(200) // new entity created
                  expect(response).property('body').to.contain({
                    name: card,
                  })
                })
              })
            })
          })
        })
      })
  })

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

})





