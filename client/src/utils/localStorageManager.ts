import { isNull_Undefined_emptyString } from "./stringManipulation";


interface ILocalStorageManager {
    _id: string | null | undefined;
    key: 'Avatar' | 'listing' | 'search';
}

interface ILocalStorageManager_Delete extends ILocalStorageManager {
    isLazy?: boolean;
    value?: object | undefined;
}
interface ILocalStorageManager_update extends ILocalStorageManager {
    value?: string | object | undefined;
    isArray?: boolean;
}
interface ILocalStorageManager_update_delete extends ILocalStorageManager_update {
    isDelete: boolean;
    isArray?: boolean;
}

interface StorageItem {
    _id: string;
    FK_User: string;
    [key: string]: any;
}


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



/**
 * Retrieves a value from the local storage based on the provided key and id.
 *
 * @param {string | null | undefined} _id - The id associated with the value in the local storage.
 * @param {string} key - The key used to identify the value in the local storage.
 * @return {null | string} - Returns the value from the local storage if found, otherwise null.
 */
export const get_localStorage = ({ _id, key }: ILocalStorageManager): string => {
    if (isNull_Undefined_emptyString(_id)) {
        console.error('LocalStorage getter: no _id provided. n:sad9jja-ssa-s-3ad');
        throw 'LocalStorage getter: no _id provided. n:sad9jja-ssa-s-3ad'
    }
    if (isNull_Undefined_emptyString(key)) {
        console.error('LocalStorage getter: no key provided. n:sad9jja-ssa-s-3ad');
        throw 'LocalStorage getter: no key provided. n:sad9jja-ssa-s-3ad'
    }

    return localStorage.getItem(_localStorageKey + _id + key) || ''
}

/**
 * Deletes a value from the local storage based on the provided key and id.
 *
 * @param {ILocalStorageManager_Delete} param - An object containing the id, key, and a flag indicating if the deletion should be lazy.
 * @param {string | null | undefined} param._id - the User _ID
 * @param {string} param.key - The key used to identify the value in the local storage.
 * @param {boolean} [param.isLazy=false] - A flag indicating if the deletion should be lazy.
 * @return {void} This function does not return anything.
 */
export const delete_localStorage = ({ _id, key, isLazy, value }: ILocalStorageManager_Delete): void => {

    if (isLazy) {
        setTimeout(() => {
            update_delete_LocalStorage({ _id, key, value, isDelete: true });
        }, 0);
    } else {
        update_delete_LocalStorage({ _id, key, value, isDelete: true });
    }
}

/**
 * Updates the local storage with the provided data.
 *
 * @param {string | null | undefined} _id - CurrentUser._ID
 * @param {'Avatar' | 'listing'} key - The key used to identify the data in local storage.
 * @param {string | object | undefined} value - for update give the all object !
 */
export const update_localStorage = ({ _id, key, value, isArray = true }: ILocalStorageManager_update) => {
    update_delete_LocalStorage({ _id, key, value, isDelete: false, isArray  });
}

const set_localStorage = ({ _id, key, value }: ILocalStorageManager_update) => {
    if (isNull_Undefined_emptyString(_id))
        return null
    if (!value) {
        console.error('value is null or undefined. n:sad9jja-ssa-s-3ad');
        throw new Error("value is null or undefined. n:sad9jja-ssa-s-3ad");
    }

    const v = typeof value === 'string' ? value : JSON.stringify(value);
    localStorage.setItem(_localStorageKey + _id + key, v);
}



const update_delete_LocalStorage = ({ _id, key, value, isDelete, isArray = true }: ILocalStorageManager_update_delete) => {
    if (isNull_Undefined_emptyString(_id) || isNull_Undefined_emptyString(key)) {
        console.error('Invalid _id or key provided. n:sad9jja-ssa-s-3ad');
        throw new Error('Invalid _id or key provided. n:sad9jja-ssa-s-3ad');
    }

    const storageKey = _localStorageKey + _id + key;
    let existingDataString = get_localStorage({ _id, key });
    let existingData: StorageItem[];

    try {
        existingData = existingDataString ? JSON.parse(existingDataString) : [];
    } catch (error) {
        console.error('Failed to parse existing data.', error);
        throw new Error('Failed to parse existing data.');
    }

    if (!isArray) {
        // Not an array, directly update or delete
        if (isDelete) {
            localStorage.removeItem(storageKey);
        } else {
            set_localStorage({ _id, key, value });
        }
        return;
    }

    if (!Array.isArray(existingData)) {
        // If existing data is not an array, convert it to an array
        existingData = existingData ? [existingData] : [];
    }

    if (isDelete) {
        // Delete the item from the array
        existingData = existingData.filter((item: StorageItem) => {
            // Include logic to match items with two keys for deletion
            if (typeof value === 'object' && value !== null && 'FK_User' in value && 'FK_User' in item && '_id' in value && '_id' in item) {
                return !(item._id === value._id && item.FK_User === value.FK_User);
            } else if (typeof value === 'object' && value !== null && '_id' in value && '_id' in item) {
                return item._id !== value._id;
            }
            return true;
        });
    } else {
        // Add or update the item in the array
        if (!Array.isArray(value)) {
            // If new data is not an array, convert it to an array
            value = [value];
        }

        // Iterate over each new value to add or update it in the existing data array
        (value as StorageItem[]).forEach((newValue) => {
            const index = existingData.findIndex((item: StorageItem) => {
                if ('FK_User' in newValue && 'FK_User' in item && '_id' in newValue && '_id' in item) {
                    return item._id === newValue._id && item.FK_User === newValue.FK_User;
                } else if ('_id' in newValue && '_id' in item) {
                    return item._id === newValue._id;
                }
                return false;
            });

            if (index !== -1) {
                existingData[index] = newValue;
            } else {
                existingData.push(newValue);
            }
        });
    }

    set_localStorage({ _id, key, value: existingData });
};


// const update_delete_LocalStorage = ({ _id, key, value, isDelete, isArray = true }: ILocalStorageManager_update_delete) => {
//     if (isNull_Undefined_emptyString(_id)) {
//         console.error('value is null or undefined. n:sad9jja-ssa-s-3ad');
//         throw new Error("value is null or undefined. n:sad9jja-ssa-sc-3ad");
//     }
//     if (isNull_Undefined_emptyString(key)) {
//         console.error('LocalStorage: no key provided. n:sad9jd5ja-ss5ax-s-3ad');
//         throw new Error('LocalStorage: no key provided. n:sad9jd5ja-ss5ax-s-3ad')
        
//     }
//     if (value === undefined || value === null) {
//         console.error('value is null or undefined. n:sad9jja-ssa-s-3ad');
//         throw new Error("value is null or undefined. n:sad9jja-ssa-s-3ad");
//     }

//     // Retrieve the existing data
//     if (!isArray) {        
//         set_localStorage({ _id, key, value });
//         return;
//     }

//     const existingDataString = get_localStorage({ _id, key });

//     // Parse the existing data if it's not already a string
//     let existingData: object[];
//     try {
//         existingData = existingDataString?.length > 0 ? JSON.parse(existingDataString) : existingDataString;
//     } catch (error) {
//         console.error('Failed to parse existing data. n:sad9jja-ssa-s-3ad');
//         throw new Error("Failed to parse existing data. n:sad9jja-ssa-s-3ad");
//     }
//     try {
//         if (Array.isArray(existingData) && existingData.length > 0) {
//             // array existingData

//             const index = existingData.findIndex((item: any) => {
//                 if (
//                     typeof value === 'object' && value !== null &&
//                     'FK_User' in value &&
//                     '_id' in value
//                 ) {
//                     return item._id === value._id && item.FK_User === value.FK_User;
//                 } else {
//                     return item._id === _id;
//                 }
//             });

//             let updatedData;
//             if (index !== -1) {
//                 updatedData = isDelete
//                     ? [...existingData.slice(0, index), ...existingData.slice(index + 1)]         // Removing item
//                     : [...existingData.slice(0, index), value, ...existingData.slice(index + 1)]; // Adding new item
//             } else {
//                 updatedData = isDelete
//                     ? existingData                  // Removing item
//                     : [...existingData, value];     // Adding new item
//             }
//             set_localStorage({ _id, key, value: updatedData });
//         } else {
//             // not i array existingData
//             isDelete ?
//                 localStorage.removeItem(_localStorageKey + _id + key) :
//                 set_localStorage({ _id, key, value: [value] });
//             // this part have to be checked
//         }


//     } catch (error) {
//         console.log('error:', error)
//         throw new Error('error in update_localStorage n:sad93jja-ssa-s-3ad');
//     }

// };
