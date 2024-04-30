import { deleteObject, getDownloadURL, getStorage, listAll, ref, uploadBytesResumable } from "firebase/storage";
import { app } from "../../../components/auth/OAuthGoogle/firebase";
import { AppDispatch } from "../../../redux/store";
import { profile_updateAvatar } from "../../../redux/user/userSlice";
import { setAvatar_localStorage } from "../../../utils/localStorageManager";
import { isNull_Undefined_emptyString } from "../../../utils/stringManipulation";

type FileMsgState = {
    error: string;
    progress: string;
    downloadURL: string;
};
type FirebaseFileUploadHandlerParams = {
    currentFile: File;
    currentUserID: string | undefined | null;
    setFileMsg: React.Dispatch<React.SetStateAction<FileMsgState>>;
    dispatch: AppDispatch;
};


export const firebase_deleteDirectory = async (_id: string | undefined) => {
    // Delete directory of uploaded images
    try {
        console.log('_id:', _id)
        if (isNull_Undefined_emptyString(_id)) {
            return {
                error: 'Error deleting Images directory - _id is null or undefined'
            }
        }

        const storage = getStorage(app);
        // const directoryRef = ref(storage, 'user_' + _id || 'noUserID');
        const directoryRef = ref(storage, 'user_' + _id || 'noUserID');


        const listResult = await listAll(directoryRef);        
        for (const itemRef of listResult.items) {
            await deleteObject(itemRef);
        }

        // Delete the directory itself
        // await deleteObject(directoryRef);

        console.log('Images directory deleted successfully');

        return {
            error: '',
            progress: 'Images directory deleted successfully'
        }

        // setFileMsg((state) => {
        //     return {
        //         ...state,
        //         progress: 'Images directory deleted successfully'
        //     }
        // })

    } catch (error) {
        console.error('Error deleting Images directory:', error);
        return {
            error: 'Error deleting Images directory'
        }


        // setFileMsg((state) => {
        //     return {
        //         ...state,
        //         error: 'Error deleting Images directory'
        //     }
        // })

    }
}

// this is not a pure function since it modifies the state.
export const firebase_fileUploadHandler = async ({currentFile, currentUserID, setFileMsg, dispatch}: FirebaseFileUploadHandlerParams) => {
    try {
        const storage = getStorage(app);
        const fileName = `${currentFile.name.split('.')[0]}_${new Date().getTime()}.${currentFile.name.split('.')[1]}`.replace(/\s+/g, '_');
        const storageRef = ref(storage, `user_${currentUserID || 'noUserID'}/${fileName}`);
        const uploadTask = uploadBytesResumable(storageRef, currentFile);

        uploadTask.on('state_changed', (snapshot) => {
            // Handle upload progress
            const progress = `Upload Progress: ${(snapshot.bytesTransferred / snapshot.totalBytes) * 100}%`;
            setFileMsg((state) => ({
                ...state,
                progress,
            }));
        }, (err) => {
            // Handle upload error
            setFileMsg((state) => ({
                ...state,
                error: 'Error: ' + err.message,
            }));
        }, () => {
            getDownloadURL(uploadTask.snapshot.ref)
                .then((downloadURL) => {
                    currentUserID && setAvatar_localStorage(currentUserID, downloadURL);
                    // Dispatch action to update avatar in Redux store
                    dispatch(profile_updateAvatar(downloadURL));
                    // Reset file message state
                    setFileMsg((state) => ({
                        ...state,
                        downloadURL,
                    }));
                })
                .catch((error) => {
                    console.error('Firebase Storage Error:', error);
                    setFileMsg((state) => ({
                        ...state,
                        error: 'Error: ' + error.message,
                    }));
                });
        });

    } catch (error) {
        console.error('fileUploadHandler | error:', error);
        setFileMsg((state) => ({
            ...state,
            error: 'Error: ' + error,
        }));
    }
}




// await firebase_fileUploadHandler(currentFile, currentUser?._id, setFileMsg, dispatch);

// return

// const
//   storage = getStorage(app),
//   fileName = (`${currentFile.name.split('.')[0]}_${new Date().getTime()}.${currentFile.name.split('.')[1]}`).replace(/\s+/g, '_'),
//   storageRef = ref(storage, ('user_' + currentUser?._id || 'noUserID') + '/' + fileName),
//   uploadTask = uploadBytesResumable(storageRef, currentFile);


// console.log('user_ + currentUser?._id:', 'user_' + currentUser?._id)


// uploadTask.on('state_changed', (snapshot) => {
//   const prog = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
//   console.log('Upload Progress:', prog.toFixed(0) + '%');

//   setFileMsg((state) => {
//     return {
//       ...state,
//       progress: 'Upload Progress: ' + prog.toFixed(0) + '%'
//     }
//   })
// }, (err) => {
//   console.log('error:', err)

//   setFileMsg((state) => {
//     return {
//       ...state,
//       error: 'Error: ' + err.message
//     }
//   })
//   setFile(undefined)
// }, () => {

//   getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
//     setFileMsg((state) => {
//       return {
//         ...state,
//         downloadURL
//       }
//     })
//   }).catch((error) => {
//     console.error('Firebase Storage Error:', error);
//     setFileMsg((state) => ({
//       ...state,
//       error: 'Error: ' + error.message  // Include the error message in the state
//     }));
//   });

// });