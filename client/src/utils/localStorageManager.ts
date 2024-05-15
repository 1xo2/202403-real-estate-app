import { isNull_Undefined_emptyString } from "./stringManipulation";

type Props = (
    _id: string | null | undefined,
    key: 'Avatar' | 'listing',
    value?: string | object | undefined
) => null | string | void;

const _localStorageKey = 'listingUser_';

//#region data example:

// [{
//     "_id": "663ddfdac26a148b4fdf0496",
//     "name": "Listing--5",
//     "description": "des 5",
//     "address": "address 5",
//     "price": 500, "priceDiscounted": 444,
//     "bathrooms": 1,
//     "bedrooms": 1,
//     "furnished": true,
//     "parking": true,
//     "type": "rent",
//     "offer": true,
//     "imageUrl": ["66325435f974e1389b48d311%2Flisting%2FUntitled_1715507200463.png?alt=media&token=8890804d-57e4-45e9-a92b-b93fe6dcf321"],
//     "FK_User": "66325435f974e1389b48d311", "createdAt": "2024-05-10T08:50:34.849Z", "updatedAt": "2024-05-12T16:04:42.357Z", "__v": 0
// },

//     {
//         "name": "Listing--2",
//         "description": "dddddd",
//         "address": "ddddddddd",
//         "price": 500,
//         "priceDiscounted": 400,
//         "bathrooms": 0,
//         "bedrooms": 0,
//         "furnished": false,
//         "parking": false,
//         "type": "rent",
//         "offer": false,
//         "imageUrl": ["66325435f974e1389b48d311%2Flisting%2F1658303596376_1715784909900.jpg?alt=media&token=1f50f60d-7adc-40a2-aa44-111b4e9e4ab1"],
//         "FK_User": "66325435f974e1389b48d311", "_id": "6644cde46155aa4c55c8a807", "createdAt": "2024-05-15T14:59:48.640Z", "updatedAt": "2024-05-15T14:59:48.640Z", "__v": 0
//     }]
//#endregion


export const set_localStorage: Props = (_id, key, value) => {
    if (isNull_Undefined_emptyString(_id))
        return null
    if (!value) {
        console.error('value is null or undefined. n:sad9jja-ssa-s-3ad');
        throw new Error("value is null or undefined. n:sad9jja-ssa-s-3ad");
    }

    const v = typeof value === 'string' ? value : JSON.stringify(value);
    localStorage.setItem(_localStorageKey + _id + key, v);
}

export const get_localStorage: Props = (_id, key) => {
    if (isNull_Undefined_emptyString(_id))
        return null

    return localStorage.getItem(_localStorageKey + _id + key) || ''
}
