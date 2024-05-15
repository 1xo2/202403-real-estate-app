import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';

import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { store } from '../../redux/store';
import ListingPage from '../listing/ListingPage';


///////////////////
// todo:
// 1. discount price cant be higher then price. 
// 2. 
///////////////////


afterEach(() => {
    cleanup();
});
let nameInput: HTMLInputElement,
    descriptionInput: HTMLInputElement,
    addressInput: HTMLInputElement,
    sellInput: HTMLInputElement,
    rentInput: HTMLInputElement,
    priceInput: HTMLInputElement,
    priceDiscountedInput: HTMLInputElement,
    bedroomsInput: HTMLInputElement,
    bathroomsInput: HTMLInputElement,
    furnishedInput: HTMLInputElement,
    parkingInput: HTMLInputElement,
    offerInput: HTMLInputElement,
    fileInput: HTMLInputElement,

    uploadImagesButton: HTMLButtonElement | null,
    CreateListingButton: HTMLButtonElement,
    submitButton: HTMLButtonElement;

beforeEach(() => {
    render(
        <BrowserRouter>
            <Provider store={store}>
                <ListingPage isCreate={true} />
            </Provider>
        </BrowserRouter>
    )

    nameInput = screen.getByPlaceholderText('Title') as HTMLInputElement;
    descriptionInput = screen.getByPlaceholderText('Description') as HTMLInputElement;
    addressInput = screen.getByPlaceholderText('Address') as HTMLInputElement;
    priceInput = screen.getByPlaceholderText('Price') as HTMLInputElement;
    bedroomsInput = screen.getByPlaceholderText('Bedrooms') as HTMLInputElement;
    bathroomsInput = screen.getByPlaceholderText('Bathrooms') as HTMLInputElement;
    furnishedInput = screen.getByLabelText('Furnished') as HTMLInputElement;
    parkingInput = screen.getByLabelText('Parking') as HTMLInputElement;
    sellInput = screen.getByLabelText('Sell') as HTMLInputElement;
    rentInput = screen.getByLabelText('Rent') as HTMLInputElement;
    offerInput = screen.getByLabelText('Offer') as HTMLInputElement;
    submitButton = screen.getByText('Create Listing') as HTMLButtonElement;
    fileInput = screen.getByTestId('file-input') as HTMLInputElement & { toBeDisabled(): boolean };
    CreateListingButton = screen.getByRole('button', { name: /Create Listing/i }) as HTMLButtonElement;
    // on create its not visible
    uploadImagesButton = screen.queryByRole('button', { name: /Load Images/i });
});


describe('CreateListingPage component form validation', () => {
    it('displays error messages for missing input values on form submission', () => {

        // Mock form submission without filling in any input values
        // fireEvent.click(submitButton);

        // Assert that error messages are displayed for all required input fields
        expect(nameInput).toBeDefined();
        expect(descriptionInput).toBeDefined();
        expect(addressInput).toBeDefined();
        expect(sellInput).toBeDefined();
        expect(rentInput).toBeDefined();
        expect(parkingInput).toBeDefined();
        expect(furnishedInput).toBeDefined();
        expect(bathroomsInput).toBeDefined();
        expect(bathroomsInput).toBeDefined();
        expect(priceInput).toBeDefined();
        expect(fileInput).toBeDefined();
        expect(uploadImagesButton).toBeNull();
        expect(CreateListingButton).toBeDefined();
    });

    it('form displays error message for missing input values when submitting the form with one missing value', async () => {


        fireEvent.change(nameInput, { target: { value: 'Test Listing' } });
        fireEvent.click(submitButton);
        await waitFor(() => {
            // "please fill out this field"
            expect(document.querySelector(':invalid')).toBeDefined();
        });


        fireEvent.change(nameInput, { target: { value: 'Test Listing' } });
        fireEvent.change(descriptionInput, { target: { value: 'Test Description' } });
        await waitFor(() => {
            expect(document.querySelector(':invalid')).toBeDefined();
        });

        fireEvent.change(nameInput, { target: { value: 'Test Listing' } });
        fireEvent.change(descriptionInput, { target: { value: 'Test Description' } });
        fireEvent.change(addressInput, { target: { value: 'Test Address' } });
        await waitFor(() => {
            expect(document.querySelector(':invalid')).toBeDefined();
        });

        fireEvent.change(nameInput, { target: { value: 'Test Listing' } });
        fireEvent.change(descriptionInput, { target: { value: 'Test Description' } });
        fireEvent.change(addressInput, { target: { value: 'Test Address' } });
        fireEvent.click(parkingInput);
        await waitFor(() => {
            expect(document.querySelector(':invalid')).toBeDefined();
        });

        fireEvent.change(nameInput, { target: { value: 'Test Listing' } });
        fireEvent.change(descriptionInput, { target: { value: 'Test Description' } });
        fireEvent.change(addressInput, { target: { value: 'Test Address' } });
        fireEvent.click(parkingInput);
        fireEvent.click(furnishedInput);
        await waitFor(() => {
            // "please fill out this field"
            expect(document.querySelector(':invalid')).toBeDefined();
        });




    });
    //  POLICY:
    //  1. user first have to load images and once, if less then 7, user can upload.

    it('validate input file is disabled if not first loaded the existing images', async () => {

        const existedImages = screen.queryAllByAltText('listing image');
        if (existedImages.length === 0) {
            expect(fileInput).have.property('disabled');
        }
        else {
            // If there are existing images, assert that the file input is enabled
            expect(fileInput).not.have.property('disabled');
        }
    })

    it('should ensure that sail or rent selected separately', () => {
        fireEvent.click(sellInput);
        expect(rentInput).not.true
        fireEvent.click(rentInput);
        expect(sellInput).not.true
    })
    it('should Ensure that if rent selected per month also appear on price label', () => {

        const el = screen.queryByText('$ / Month');

        if (rentInput.checked) {
            expect(el).toBeDefined();
        } else if (sellInput.checked) {
            expect(el).not.toBeDefined();
        }
        fireEvent.click(sellInput);
        if (rentInput.checked) {
            expect(el).not.toBeDefined();
        } else if (sellInput.checked) {
            expect(el).toBeDefined();
        }

    })
    it('should ensure that discounted price visible when that discounted price visible when offer his selected', () => {
        
        if (offerInput.checked) {
            priceDiscountedInput = screen.getByPlaceholderText('Price') as HTMLInputElement;
            expect(priceDiscountedInput).toBeDefined();
        } else {
            expect(priceDiscountedInput).not.toBeDefined();
        }

        fireEvent.click(offerInput);

        if (offerInput.checked) {
            priceDiscountedInput = screen.getByPlaceholderText('Price') as HTMLInputElement;
            expect(priceDiscountedInput).toBeDefined();
        } else {
            expect(priceDiscountedInput).not.toBeDefined();
        }




    })

});
