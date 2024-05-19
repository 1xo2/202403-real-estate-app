// // Register the custom Cypress command to dispatch Redux actions
// Cypress.Commands.add('mock_loginSuccess', (user: IUser) => {    
//     window.__store__.dispatch(actions.login_Success(user));
//    console.log('window.__store__.getState():', window.__store__.getState()) // has value 
// //    const currentUser = window.__store__.getState().user.currentUser
// //    console.log('currentUser:', currentUser)
// //    currentUser.debug()
// //     cy.pause()  
// });