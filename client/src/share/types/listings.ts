export interface IListingFields {
    name: string;
    description: string;
    address: string;
    price: number;
    priceDiscounted?: number;
    bedrooms: number;
    bathrooms: number;
    furnished: boolean;
    parking: boolean;
    type: 'rent' | 'sale';
    offer: boolean;
    imageUrl: Array<string>;
    userRef: string;
    createdAt?: Date;
    updatedAt?: Date;
}
