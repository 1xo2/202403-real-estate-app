import { __Client_AvatarLocalStorage } from "../share/consts";
import { isNull_Undefined_emptyString } from "./stringManipulation";


export const setAvatar_localStorage = (_id: string, photoURL: string) => {

    localStorage.setItem(__Client_AvatarLocalStorage + _id, photoURL);
}
export const getAvatar_localStorage = (_id: string | '' | null | undefined) => {
    if (isNull_Undefined_emptyString(_id))
        return null
    return localStorage.getItem(__Client_AvatarLocalStorage + _id) || ''
}
// the avatar is associate with the by client email + key
// export const updateAvatar_localStorage = (oldEmail: string, newEmail: string) => {
//     try {
//         if (isNull_Undefined_emptyString(oldEmail) || isNull_Undefined_emptyString(newEmail)) {
//             console.error("email cant be null, nr:7as9d8gsd9f+n")
//             return false
//         }
//         if (oldEmail === newEmail) {
//             console.error("Old email and new email cannot be the same.");
//             return false;
//         }

//         const imgUrl = getAvatar_localStorage(oldEmail)
//         if (isNull_Undefined_emptyString(imgUrl)) {
//             console.error("No avatar found for the old email:", oldEmail);
//             return false
//         }

//         localStorage.removeItem(__Client_AvatarLocalStorage + oldEmail)

//         setAvatar_localStorage(newEmail, imgUrl)
     
//         const updatedUrl = getAvatar_localStorage(newEmail);
//         if (imgUrl === updatedUrl) {
//             console.log("Avatar URL updated successfully.");
//             return true;
//         } else {
//             console.error("Failed to update avatar URL.");
//             return false;
//         }        
        
//     } catch (error) {
//         console.log('error:', error)
//         return false;
//     }
// }
