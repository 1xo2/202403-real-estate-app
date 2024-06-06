import { deleteObject, getDownloadURL, getStorage, listAll, ref, uploadBytesResumable } from "firebase/storage";
import { app } from "../../../components/auth/OAuthGoogle/firebase";
import { isNull_Undefined_emptyString } from "../../../utils/stringManipulation";

export interface IFileMsgState {
    error?: string;
    progress?: string;
    downloadURL?: string;
}
interface IFilePath {
    currentUserID: string | undefined | null;
    currentFile: File;
    dirName: 'avatar' | 'listing' | 'root';
}
interface IFileUploadHandler {
    setFileMsgArr: React.Dispatch<React.SetStateAction<IFileMsgState[]>>
    fileIndex: number
}
interface IFireBaseFileUploadHandler extends IFilePath, IFileUploadHandler { }

interface IFileMsgUpdater extends IFileUploadHandler, IFileMsgState { }

/**
 * Validates images (2mb, amount) for upload.
 *
 * @param {React.ChangeEvent<HTMLInputElement> | undefined} e - The event object.
 * @param {number} maxUpload - The maximum number of files allowed for upload. Default is 6.
 * @return {string} The validation result.
 */
export const validateFilesForUpload = async (e: React.ChangeEvent<HTMLInputElement> | undefined, maxUpload: number = 6): Promise<string> => {
    if (!e || !e.target.files) return "No files selected";

    const fileArr = Array.from(e?.target.files || [])
    const isQuantity = fileArr.length <= maxUpload
    if (isQuantity) {
        // const allFilesAreImages = fileArr.every(file => file.type.startsWith('image/'));
        const allFilesAreImages = await Promise.all(fileArr.map(async file => await getMimeTypeFromFile(file)));

        if (allFilesAreImages) {
            const isSize = fileArr.every(file => file.size < 2 * 1024 * 1024);
            if (isSize) {
                return 'ok'
            } else {
                return 'Error: file size exceeding the 2mb limit'
            }
        } else {
            return 'Upload is cancel: Only images are allowed.'
        }
    } else {
        return `Upload is cancel: Max of ${maxUpload} images are allowed.`
    }

};

const createFileName = ({ currentUserID, currentFile, dirName }: IFilePath) => {

    const fileName = `${currentFile.name.split('.')[0]}_${new Date().getTime()}.${currentFile.name.split('.')[1]}`.replace(/\s+/g, '_');
    const filePath = `user_${currentUserID || 'noUserID'}/${dirName}/${fileName}`;
    return filePath;
}

const updateFileMsg = ({ fileIndex, setFileMsgArr, error = undefined, progress = undefined, downloadURL = undefined }: IFileMsgUpdater
) => {

    setFileMsgArr(prevState => {
        const updatedFileMsgArr = [...prevState || []];

        if (updatedFileMsgArr[fileIndex] === undefined) {
            updatedFileMsgArr[fileIndex] = {}; // Initialize if not already defined
        }

        if (error !== undefined) {
            updatedFileMsgArr[fileIndex].error = error;
        }
        if (progress !== undefined) {
            updatedFileMsgArr[fileIndex].progress = progress;
        }
        if (downloadURL !== undefined) {
            updatedFileMsgArr[fileIndex].downloadURL = downloadURL;
        }

        return updatedFileMsgArr;
    });
};

/**
 * Deletes a directory OR file of uploaded images from Firebase storage.
 * 
 *
 * @param {string | undefined} _id - The ID of the user whose images are being deleted.
 * @param {IFilePath['dirName']} dirName - The name of the directory to delete.
 * @param {string} [fileName] - The name of the file to delete within the directory.
 * @return {Promise<{ error: string, progress: string } | { error: string }>} - A promise that resolves to an object with an error message if an error occurred, or a progress message if the deletion was successful.
 */
export const firebase_delete = async (_id: string | undefined, dirName: IFilePath['dirName'], fileUrl?: string) => {
    // Delete directory of uploaded images
    try {
        console.log('_id:', _id)
        if (isNull_Undefined_emptyString(_id)) {
            return {
                error: 'Error deleting Images directory - _id is null or undefined'
            }
        }

        const storage = getStorage(app);
        if (fileUrl) {

            const storageRef = ref(storage, fileUrl);
            await deleteObject(storageRef);

        } else {

            const directoryRef = ref(storage, 'user_' + _id || 'noUserID');
            const listResult = await listAll(directoryRef);

            for (const itemRef of listResult.items) {
                if (itemRef.fullPath.includes(dirName)) {
                    await deleteObject(itemRef);
                }
            }
        }

        // Delete the directory itself
        // await deleteObject(directoryRef);

        console.log('Images directory deleted successfully');

        return {
            error: '',
            progress: 'Images directory deleted successfully'
        }


    } catch (error) {
        console.error('Error deleting Images directory:', error);
        return {
            error: 'Error deleting Images directory'
        }
    }
}

export const firebase_getDirUrls = async (_id: string | undefined, dirName: IFilePath['dirName']) => {
    if (isNull_Undefined_emptyString(_id)) {
        throw new Error('id is null or undefined');
    }

    try {
        const storage = getStorage(app);
        const directoryRef = ref(storage, `user_${_id}/${dirName}`);

        const listResult = await listAll(directoryRef);
        const fileUrls: string[] = [];

        for (const item of listResult.items) {
            // Get download URL for each file
            const downloadURL = await getDownloadURL(item);
            fileUrls.push(downloadURL);
        }

        return fileUrls;
    } catch (error) {
        console.error("Error fetching directory URLs:", error);
        throw error; // Rethrow the error
    }
}



// this is not a pure function since it modifies the state.
export const firebase_fileUploadHandler = async ({ currentFile, currentUserID, setFileMsgArr, dirName, fileIndex }: IFireBaseFileUploadHandler) => {
    return new Promise<void>((resolve, reject) => {
    try {
        const storage = getStorage(app);
        const filePath = createFileName({ currentUserID, currentFile, dirName });
        const storageRef = ref(storage, filePath);
        const uploadTask = uploadBytesResumable(storageRef, currentFile);

        uploadTask.on('state_changed', (snapshot) => {
            // Handle upload progress
            const progress = `Upload Progress: ${(snapshot.bytesTransferred / snapshot.totalBytes) * 100}%`;
            updateFileMsg({ fileIndex, setFileMsgArr, progress });
            console.log(`Upload is ${progress}% done for fileIndex ${fileIndex}`);
            
        }, (err) => {
            updateFileMsg({ fileIndex, setFileMsgArr, error: getError(err) });
            reject(err);
        }, () => {
            getDownloadURL(uploadTask.snapshot.ref)
                .then((downloadURL) => {
                    updateFileMsg({ fileIndex, setFileMsgArr, downloadURL });
                    resolve();
                })
                .catch((error) => {
                    console.error('Firebase Storage Error:', error);
                    updateFileMsg({ fileIndex, setFileMsgArr, error: getError(error) });
                    reject(error);
                });
        });

    } catch (error) {
        console.error('fileUploadHandler | error:', error);
        updateFileMsg({ fileIndex, setFileMsgArr, error: getError(error) });
        }
    });
}

// export const firebase_fileUploadHandler = async ({ currentFile, currentUserID, setFileMsgArr, dirName, fileIndex }: IFireBaseFileUploadHandler) => {

//     try {
//         const storage = getStorage(app);
//         const filePath = createFileName({ currentUserID, currentFile, dirName });
//         const storageRef = ref(storage, filePath);
//         const uploadTask = uploadBytesResumable(storageRef, currentFile);

//         uploadTask.on('state_changed', (snapshot) => {
//             // Handle upload progress
//             const progress = `Upload Progress: ${(snapshot.bytesTransferred / snapshot.totalBytes) * 100}%`;
//             updateFileMsg({ fileIndex, setFileMsgArr, progress });
//             console.log(`Upload is ${progress}% done for fileIndex ${fileIndex}`);
//         }, (err) => {
//             updateFileMsg({ fileIndex, setFileMsgArr, error: getError(err) });
//         }, () => {
//             getDownloadURL(uploadTask.snapshot.ref)
//                 .then((downloadURL) => {
//                     updateFileMsg({ fileIndex, setFileMsgArr, downloadURL });
//                 })
//                 .catch((error) => {
//                     console.error('Firebase Storage Error:', error);
//                     updateFileMsg({ fileIndex, setFileMsgArr, error: getError(error) });
//                 });
//         });

//     } catch (error) {
//         console.error('fileUploadHandler | error:', error);
//         updateFileMsg({ fileIndex, setFileMsgArr, error: getError(error) });
//     }
// }


export function getMimeTypeFromFile(file: File): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
        const reader = new FileReader();

        // Set up event listeners for when file reading is complete
        reader.onloadend = () => {
            const arrayBuffer = reader.result as ArrayBuffer;
            const uint8Array = new Uint8Array(arrayBuffer);

            // Check the magic number to determine the MIME type
            if (uint8Array.length < 2) {
                // File is too short to have a valid signature
                reject(new Error('File is too short.'));
            } else {
                const signature = uint8Array[0] << 8 | uint8Array[1];
                let mimeType: string;

                switch (signature) {
                    case 0xFFD8:
                        mimeType = 'image/jpeg';
                        break;
                    case 0x8950:
                        mimeType = 'image/png';
                        break;
                    case 0x4749:
                        mimeType = 'image/gif';
                        break;
                    case 0x424D:
                        mimeType = 'image/bmp';
                        break;
                    case 0x5249:
                        mimeType = 'image/webp';
                        break;
                    default:
                        mimeType = 'application/octet-stream'; // Default MIME type for unknown files type
                        break;
                }

                // resolve(mimeType);
                resolve(mimeType.startsWith('image/'));
            }
        };

        // Read the file as an ArrayBuffer
        reader.readAsArrayBuffer(file);
    });
}

export function isURL_ImageFileExtension(url: string): boolean {
    // List of known image file extensions
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.svg', '.webp', '.avif'];

    // Check if the URL contains any of the known image file extensions
    return imageExtensions.some(extension => url.toLowerCase().indexOf(extension) !== -1);
}



const getError = (error: any) => {
    return (error instanceof Error && error.message) ? error.message : String(error);
}