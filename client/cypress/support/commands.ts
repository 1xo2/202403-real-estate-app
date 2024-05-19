/// <reference types="cypress" />
import { Store } from 'redux';
import { IUser } from '../../src/redux/user/userSlice'; // Import your user slice interfaces

declare global {
    interface Window {
        __store__: Store;
    }

    namespace Cypress {
        interface Chainable {
            mock_loginSuccess(): void;
            __store__: Store;
            spyConsoleLog(url: string): Chainable<void>;
        }
    }
}



const mockUser: IUser = {
    userName: 'mockuser',
    eMail: 'mockuser@example.com',
    createdAt: '2024-05-16T12:00:00.000Z',
    updatedAt: '2024-05-16T12:00:00.000Z',
    __v: 0,
    _id: '123',
    userPhoto: 'mock/photo.jpg',
    source: 'local',
};


Cypress.Commands.add('mock_loginSuccess', () => {

    return cy.window().then((win) => {
        return cy.wrap(win.__store__).invoke('dispatch', { type: 'user/login_Success', payload: mockUser });
    });
});

Cypress.Commands.add('spyConsoleLog', (url: string) => {
    cy.visit(url, {
        onBeforeLoad(win) {
            cy.stub(win.console, 'log').as('consoleLog');
        },
    });
});



// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }