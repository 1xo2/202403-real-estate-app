/// <reference types="cypress" />
import { fetchHeaders } from './../../src/share/fetchHeaders';




const userId = '123';
const listing = {
    _id: userId,
    name: "Listing--5",
    description: "des 5",
    address: "address 5",
    price: 500,
    priceDiscounted: 444,
    bathrooms: 1,
    bedrooms: 1,
    furnished: true,
    parking: true,
    type: "rent",
    offer: true,
    imageUrl: [
        "66325435f974e1389b48d311%2Flisting%2FUntitled_1715507200463.png?alt=media&token=8890804d-57e4-45e9-a92b-b93fe6dcf321"
    ],
    FK_User: "66325435f974e1389b48d311",
    createdAt: "2024-05-10T08:50:34.849Z",
    updatedAt: "2024-05-12T16:04:42.357Z",
    __v: 0
};

beforeEach(() => {
    cy.clearLocalStorage();
    cy.visit('/');

    // console.log('window.__store__ is set', window.__store__);
    cy.mock_loginSuccess()

});



it('should test render ok', () => {
    cy.visit('/profile');

    cy.get('.text-center').should('have.text', 'Profile Page')

    // Verify the presence of two text input fields
    cy.get('input[type="text"]').should('have.length', 2);

    // Verify the presence of one password input field
    cy.get('input[type="password"]').should('have.length', 1);

    // Verify the presence of a button with the label "Update"
    cy.contains('button', /Update/i).should('be.visible');

    // Verify the presence of a button with the label "Create Listings"
    // cy.contains('button', /CREATE LISTINGS/i).should('be.visible');
    cy.get('#btnSelectListing').should('be.visible');

    // Verify the presence of an <li> element with the text "Show Listing"
    cy.contains('li', /Show Listing/i).should('be.visible');

    // Verify the presence of an <li> element with the text "Log-Out"
    cy.contains('li', /Log-Out/i).should('be.visible');

    // Verify the presence of an <li> element with the text "Delete Account"
    cy.contains('li', /Delete Account/i).should('be.visible');
});

it('should ensure none of the controls are disabled', () => {
    cy.visit('/profile');
    cy.get('input[type="text"]').each(($input) => {
        cy.wrap($input).should('not.be.disabled');
    });

    cy.get('input[type="password"]').should('not.be.disabled');

    cy.get('button').each(($button) => {
        cy.wrap($button).should('not.be.disabled');
    });

    // // Test checkboxes
    // cy.get('input[type="checkbox"]').each(($checkbox) => {
    //     cy.wrap($checkbox).should('not.be.disabled');
    // });

    // cy.get('input[type="radio"]').each(($radio) => {
    //     cy.wrap($radio).should('not.be.disabled');
    // });       
});

it('should test update', () => {
    cy.visit('/profile');
    const newDate = {
        userName: 'new name',
        eMail: 'new_email@example.com',
        password: 'new-password'
    }

    const apiPath = '/api/user/update/123';
    // Intercept the API request based on the environment
    cy.intercept("POST", apiPath, {
        statusCode: 200,
        body: { success: true },        
    }).as("updateRequest");


    cy.get('#userName').clear().type(newDate.userName);
    cy.get('[data-testid="email-input"]').clear().type(newDate.eMail);
    cy.get('[data-testid="password-input"]').clear().type(newDate.password);
    cy.get('.false').click();

    cy.wait("@updateRequest", { timeout: 5000 });
    cy.get('#icoProfileUpdate_CyTest').should('be.visible');

})
// Show Listings

describe('render Listing', () => { 
    
    const apiPath = '/api/listing/list/123';
    const _localStorageKey = "listingUser_"
    // _localStorageKey + _id + key
    const localStorageKey = `${_localStorageKey}${userId}listing`


it('(should fetch API and render and store in local storage on first click', () => {

    
    // Intercept the API request and inject a detailed JSON response
    cy.intercept("GET", apiPath, {
        statusCode: 200,
        body: [listing],
        headers: fetchHeaders,
        delayMs: 1000,

    }).as("getRequest");

    cy.visit('/profile');


    // Trigger the API request
    cy.get('#showListings').click();

    // Wait for the intercepted request to complete
    cy.wait("@getRequest", { timeout: 5000 })
        .its('response.statusCode').should('eq', 200).then((interception) => {
        // console.log('interception', interception)
    })


    // TEST:  DOM to update and then assert
    // cy.get('._card_1iz3v_1', { timeout: 5000 }).should('be.visible').should('have.length', 1);
    cy.get("[data-cy='cy-card']", { timeout: 5000 }).should('be.visible').should('have.length', 1);


    
    // TEST: get localStorage
    cy.window().then((win) => {
        const storage = win.localStorage.getItem(localStorageKey);        
        // Assert the local storage content
        expect(storage).to.eq(JSON.stringify([listing]));        
    });


});

    it('should fetch Local Storage on second click and render', () => {
        const sListing = JSON.stringify([listing]);
        
        cy.window().then((win) => {
            win.localStorage.setItem(localStorageKey, sListing);
        });

        cy.intercept("GET", apiPath, {
            statusCode: 200,
            body: [listing],
            headers: fetchHeaders,
            delayMs: 1000,  // Set a delay to mimic real network conditions
        }).as("getRequestDelayed");

        cy.spyConsoleLog('/profile');

    
        cy.get('#showListings').click();

        
        // Check if the console log has been called with the expected arguments
        cy.get('@consoleLog').should('be.calledWith', 'using localStorage:', sListing);

        // Ensure the API request was not completed
        cy.get('@getRequestDelayed.all').should('have.length', 0);

        // Verify the local storage content
        cy.window().then((win) => {
            const storage = win.localStorage.getItem(localStorageKey);
            // console.log('storage-Cy:', storage);
            expect(storage).to.eq(sListing);
        });
    });

})


it('should test log out', () => {
    cy.visit('/profile');
    const apiPath = '/api/auth/logout';
    // Intercept the API request based on the environment
    cy.intercept("GET", apiPath, {
        statusCode: 200,
        body: { success: true },
    }).as("getRequest");

    cy.get('#logOut').click();
    cy.wait("@getRequest", { timeout: 5000 });

    // Verify that the user is redirected to the login page
    cy.url().should("include", "/login");

})

it('should test delete account', () => {
    cy.visit('/profile');
    const apiPath = '/api/user/delete/';
    // Intercept the API request based on the environment
    cy.intercept("delete", apiPath, {
        statusCode: 200,
        body: { success: true },
    }).as("deleteRequest");

    cy.get('#deleteAccount').click();

    
    
    // clicking on ok dialogBox
    cy.get('.buttons > :nth-child(1)').click();
    
    // Verify that the user is redirected to the login page
    // cy.wait("@deleteRequest", { timeout: 5000 });
    
    cy.url().should("include", "/login");
})
