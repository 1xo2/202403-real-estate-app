# Real Estate app

## Client:
React TS Jest Cypress Tailwind 

## server:
ExpressJS, MongoDB

full CI-CD with Github.Action 



## -------- app last structure (1Jun/2024)
```
/
│   /client/
│   │   └── .eslintrc.cjs
│   │   /client/cypress/
│   │   │   /client/cypress/downloads/
│   │   │   /client/cypress/e2e/
│   │   │   │   └── note_home.cy.ts
│   │   │   │   └── UserProfile.cy.ts
│   │   │   │   └── UserSigning.cy.ts
│   │   │   /client/cypress/fixtures/
│   │   │   │   └── example.json
│   │   │   /client/cypress/screenshots/
│   │   │   │   /client/cypress/screenshots/UserProfile.cy.ts/
│   │   │   │   │   └── Profile page -- should test render ok (failed).png
│   │   │   /client/cypress/support/
│   │   │   │   └── commands.ts
│   │   │   │   └── component-index.html
│   │   │   │   └── component.ts
│   │   │   │   └── e2e.ts
│   │   │   │   └── index.ts
│   │   └── cypress.config.ts
│   │   └── cypress.d.ts
│   │   └── index.html
│   │   └── info.txt
│   │   └── mockServiceWorker.js.4HttpReq.txt
│   │   └── package-lock.json
│   │   └── package.json
│   │   └── postcss.config.js
│   │   /client/public/
│   │   └── README.md
│   │   └── setupVitest.ts
│   │   /client/src/
│   │   │   └── App.tsx
│   │   │   /client/src/assets/
│   │   │   │   /client/src/assets/images/
│   │   │   │   │   └── real-estate.svg
│   │   │   /client/src/components/
│   │   │   │   /client/src/components/auth/
│   │   │   │   │   /client/src/components/auth/OAuthGoogle/
│   │   │   │   │   │   └── firebase.ts
│   │   │   │   │   │   └── OAuthGoogle.tsx
│   │   │   │   │   └── PrivateRoute.tsx
│   │   │   │   └── Avatar.tsx
│   │   │   │   /client/src/components/card/
│   │   │   │   │   └── Card.module.css
│   │   │   │   │   └── Card.tsx
│   │   │   │   │   └── CardLandscape.module.css
│   │   │   │   │   └── CardLandscape.tsx
│   │   │   │   /client/src/components/Contact/
│   │   │   │   │   └── Contact.tsx.txt
│   │   │   │   └── Header.tsx
│   │   │   │   └── PageContainer.tsx
│   │   │   │   └── SigningForm.tsx
│   │   │   │   /client/src/components/svg/
│   │   │   │   │   └── CheckmarkIcon.tsx
│   │   │   │   /client/src/components/__test__/
│   │   │   │   │   └── Header.test.tsx
│   │   │   │   │   └── signingForm2.test.tsx.txt
│   │   │   │   │   └── signingForm_UnitT_3.test.tsx
│   │   │   │   │   └── SigningForm_Unit_LogIn.test.tsx
│   │   │   │   │   └── SigningForm_Unit_Register.test.tsx
│   │   │   /client/src/errorHandlers/
│   │   │   │   └── clientErrorHandler.ts
│   │   │   │   └── ErrorBoundary.tsx
│   │   │   └── index.css
│   │   │   └── main.tsx
│   │   │   /client/src/pages/
│   │   │   │   └── AboutPage.tsx
│   │   │   │   └── HomePage.tsx
│   │   │   │   /client/src/pages/listing/
│   │   │   │   │   └── ListingPage.module.css
│   │   │   │   │   └── ListingPage.tsx
│   │   │   │   │   └── ListingView.module.css
│   │   │   │   │   └── ListingView.tsx
│   │   │   │   └── LogInPage.tsx
│   │   │   │   /client/src/pages/ProfilePage/
│   │   │   │   │   └── ProfilePage.module.css
│   │   │   │   │   └── ProfilePage.tsx
│   │   │   │   └── RegisterPage.tsx
│   │   │   │   /client/src/pages/__test__/
│   │   │   │   │   └── AboutPage.test.tsx
│   │   │   │   │   └── CreateListingPage.test.tsx
│   │   │   │   │   └── HomePage.test.tsx
│   │   │   │   │   └── LogInPage_integration.test.tsx
│   │   │   │   │   └── ProfilePage.test.tsx
│   │   │   │   │   └── RegisterPage.test.tsx
│   │   │   /client/src/redux/
│   │   │   │   └── store.ts
│   │   │   │   /client/src/redux/user/
│   │   │   │   │   └── userSlice.ts
│   │   │   /client/src/share/
│   │   │   │   └── consts.ts
│   │   │   │   └── enums.ts
│   │   │   │   └── fetchHeaders.ts
│   │   │   │   /client/src/share/firebase/
│   │   │   │   │   /client/src/share/firebase/OAuthGoogle/
│   │   │   │   │   │   └── firebase.ts
│   │   │   │   │   │   └── OAuthGoogle.tsx
│   │   │   │   │   /client/src/share/firebase/storage/
│   │   │   │   │   │   └── imageStorageManager.ts
│   │   │   │   │   │   └── imageStorageManager.txt
│   │   │   │   └── toast.ts
│   │   │   │   /client/src/share/types/
│   │   │   │   │   └── listings.ts
│   │   │   /client/src/test/
│   │   │   │   └── customMatchers.ts
│   │   │   │   └── RenderRouteWithOutletContext.tsx
│   │   │   │   └── setup.ts
│   │   │   │   /client/src/test/__mocks__/
│   │   │   │   │   /client/src/test/__mocks__/redux/
│   │   │   │   │   │   └── redux.ts
│   │   │   /client/src/utils/
│   │   │   │   └── localStorageManager.ts
│   │   │   │   └── stringManipulation.ts
│   │   └── tailwind.config.js
│   │   └── tsconfig.json
│   │   └── tsconfig.node.json
│   │   └── vite.config.ts
│   │   └── vitest.config.ts
│   └── info.txt
│   └── package-lock.json
│   └── package.json
│   └── README.md
│   /server/
│   │   └── DBinfo.txt
│   │   └── nodemon.json
│   │   └── package-lock.json
│   │   └── package.json
│   │   /server/src/
│   │   │   /server/src/controllers/
│   │   │   │   └── auth.controller.ts
│   │   │   │   └── listing.controller.ts
│   │   │   │   └── user.controller.ts
│   │   │   └── index.ts
│   │   │   /server/src/middleware/
│   │   │   │   └── db.ts
│   │   │   │   /server/src/middleware/errorHandling/
│   │   │   │   │   └── errorHandler.ts
│   │   │   │   │   └── errorMiddleware.ts
│   │   │   │   /server/src/middleware/security/
│   │   │   │   │   └── helmetConfig.ts
│   │   │   │   │   └── sanitize.ts
│   │   │   /server/src/models/
│   │   │   │   └── listing.model.ts
│   │   │   │   └── user.model.ts
│   │   │   /server/src/routes/
│   │   │   │   └── auth.route.ts
│   │   │   │   └── listing.route.ts
│   │   │   │   /server/src/routes/public/
│   │   │   │   │   └── public.route.ts
│   │   │   │   └── user.route.ts
│   │   │   /server/src/share/
│   │   │   │   └── constants.ts
│   │   │   │   └── enums.ts
│   │   │   /server/src/utils/
│   │   │   │   └── stringManipulation.ts
│   │   │   │   └── verifyUser.ts
│   │   └── tsconfig.json
│   │   /server/typings/
│   │   │   └── express.d.ts
│   │   │   └── index.d.ts
│   │   │   └── userTypes.ts
│   └── todo.txt


```
