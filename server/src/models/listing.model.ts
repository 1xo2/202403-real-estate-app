import mongoose from "mongoose";


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
    type: string;
    offer: boolean;
    imageUrl: Array<string>;
    FK_User: string;
    createdAt?: Date;
    updatedAt?: Date;
}

// Interface for user document METHODS
export interface IListingDocument extends IListingFields, mongoose.Document { }

// Interface for Listing MODEL methods
export interface IListingModel extends mongoose.Model<IListingDocument> { }

const listingSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    price: {
        type: Number
    },
    priceDiscounted: {
        type: Number,
        required: true
    },
    bathrooms: {
        type: Number,
        required: true
    },
    bedrooms: {
        type: Number,
        required: true
    },
    furnished: {
        type: Boolean,
        required: true
    }, parking: {
        type: Boolean,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    offer: {
        type: Boolean,
        required: true
    },
    imageUrl: {
        type: Array,
        required: true
    },
    FK_User: {
        type: String,
        required: true
    }
},
    {
        timestamps: true,
    }
)


const ListingModel: IListingModel = mongoose.model<IListingDocument, IListingModel>("Listing", listingSchema)

export default ListingModel


// const s: IListingFields = {
//     "name": "Listing",
//     "description": "description",
//     "address": "address",
//     "price": 500,
//     "priceDiscounted": 400,
//     "bathrooms": 4,
//     "bedrooms": 3,
//     "furnished": true,
//     "parking": true,
//     "type": "house",
//     "offer": true,
//     "imageUrl": ["url1", "url2"],
//     "FK_User": "user id"
// }