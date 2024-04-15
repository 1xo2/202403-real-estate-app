
import { Store, configureStore } from "@reduxjs/toolkit";
// import { rootReducer } from "../../redux/store";
import { vi } from "vitest";
import { rootReducer } from "../../../redux/store";

// /// <reference types="vitest" />


// // Define a custom type for dispatch that includes the mock property
// type MockDispatch<T> = vi.mock<T, any> & {
//   mock: {
//     calls: any[][];
//   };
// };

// // // Mock the Redux store dispatch function with the custom type
// const mockDispatch: MockDispatch<any> = vi.fn();




// Mock the Redux store state
const mockStoreIniValue = {
  user: {
    loading: false,
    error: null,
    currentUser: null
  }
};

// Mock the dispatch function
const mockDispatch = vi.fn();

// Create a mock store with the mock dispatch function
const mockStore = configureStore({
  reducer: rootReducer,
  preloadedState: mockStoreIniValue,
});

// Override the dispatch function with the mockDispatch
mockStore.dispatch = mockDispatch;

export default mockStore;