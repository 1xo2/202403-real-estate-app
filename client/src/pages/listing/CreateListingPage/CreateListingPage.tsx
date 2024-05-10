import { useState } from 'react';
import { FaDeleteLeft } from 'react-icons/fa6';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import xss from 'xss';
import PageContainer from '../../../components/PageContainer';
import { loader } from '../../../components/dialogs/Loader';
import UpdateModal from '../../../components/dialogs/UpdateModal/UpdateModal';
import { IAppError } from '../../../errorHandlers/clientErrorHandler';
import { AppDispatch, RootState } from '../../../redux/store';
import { general_failure, loading_start } from '../../../redux/user/userSlice';
import { __Client_FirebaseStorageDomain } from '../../../share/consts';
import { fetchHeaders } from '../../../share/fetchHeaders';
import { IFileMsgState, firebase_delete, firebase_fileUploadHandler, firebase_getDirUrls, validateFilesForUpload } from '../../../share/firebase/storage/imageStorageManager';
import { toastBody } from '../../../share/toast';
import { IListingFields } from '../../../share/types/listings';
import { isNull_Undefined_emptyString } from '../../../utils/stringManipulation';
import './CreateListingPage.css';

export default function CreateListingPage() {
    //  POLICY: 
    //  1. user first have to load images and once, if less then 7, user can upload.

    const navigate = useNavigate();
    const { currentUser, loading } = useSelector((state: RootState) => state.user);
    const dispatch: AppDispatch = useDispatch();
    const [fileMsgArr, setFileMsgArr] = useState<IFileMsgState[] | null>(null);

    const [formData, setFormData] = useState<IListingFields>({
        name: "",
        description: "",
        address: "",
        price: 500,
        priceDiscounted: 400,
        bedrooms: 0,
        bathrooms: 0,
        furnished: false,
        parking: false,
        type: "rent",
        offer: false,
        imageUrl: [],
        FK_User: ""
    })
    const optionArr = ["Sell", "Rent", "Parking", "Furnished", "Offer"]

    const eventHandler_loadFireBaseImages = async () => {

        loader(async () => {

            if (isNull_Undefined_emptyString(currentUser?._id)) {
                throw new Error('currentUser._id is null or undefined');
            }

            const result = await firebase_getDirUrls(currentUser?._id, 'listing');
            console.log('result:', result)
            setFileMsgArr(result.map((fullPath) => ({ error: '', progress: '', downloadURL: fullPath })));
        }, dispatch)
    }

    const eventHandler_fileDelete = async (fileIndex: number) => {
        loader(async () => {

            if (!fileMsgArr) { throw new Error("error: id: sa9df80kkj-l "); }

            dispatch(loading_start())
            const result = await firebase_delete(currentUser?._id, 'listing', fileMsgArr[fileIndex].downloadURL);

            setFileMsgArr(prevState => {
                if (prevState === null) { throw new Error("error: id: s3a9d3f80kkj-l3 "); }

                const updatedFileMsgArr = [...prevState];
                if (result.error) {
                    updatedFileMsgArr[fileIndex].error = result.error;
                } else {
                    updatedFileMsgArr.splice(fileIndex, 1);
                }
                return updatedFileMsgArr;
            });
            toast.success('file deleted successfully', toastBody)
        }, dispatch)
    }

    /**
     * Handles the eventBubble form change and updates the form data state accordingly.
     *
     * @param {React.MouseEvent<HTMLDivElement, MouseEvent>} e - The form change event.
     */
    const eventBubble_formOnChange = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        try {

            const target = e.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
            const { id, value, type, name } = target;
            let fieldName: string, fieldValue: string | number | boolean;

            if (type === 'checkbox') {
                const isChecked = (e.target as HTMLInputElement).checked;
                fieldValue = isChecked;

                fieldName = id.replace('chb_', '').toLowerCase();

                // convert rent and sell to type
                if (fieldName === 'rent' || fieldName === 'sell') {
                    if (isChecked) {
                        fieldValue = fieldName
                    } else {
                        fieldValue = fieldName === 'rent' ? 'sell' : 'rent';
                    }

                    fieldName = 'type'
                }

            } else {
                fieldName = name || id.replace('txt', '').toLowerCase()
                fieldValue = type === 'number' ? Number(value) : value
            }
            setFormData(prevState => {
                const updatedState = { ...prevState, [fieldName]: fieldValue };
                console.log('formData:', updatedState); // Log the updated state
                return updatedState; // Return the updated state
            });

        } catch (error) {
            console.error('error:', error)
            toast.error((error as Error).message || 'Error deleting file', toastBody)
        }
    }


    /**
     * Handles the file change event and uploads the selected files to Firebase storage.
     *
     * @param {React.ChangeEvent<HTMLInputElement> | undefined} e - The event object representing the file change event.
     * @return {Promise<void>} A promise that resolves when all the files have been uploaded successfully.
     */
    const eventHandler_fileOnChange = async (e: React.ChangeEvent<HTMLInputElement> | undefined): Promise<void> => {

        loader(async () => {


            const isOk: string = validateFilesForUpload(e, 6 - (fileMsgArr?.length ?? 0))
            if (isOk !== 'ok') {
                toast.error(isOk, toastBody);
                return
            }

            if (!e?.target.files) return
            const fileArr: File[] = Array.from(e.target.files)



            await Promise.all(fileArr.map(async (file, fileIndex) => await firebase_fileUploadHandler(
                { currentFile: file, currentUserID: currentUser?._id, setFileMsgArr, dirName: 'listing', fileIndex })))


            toast.success('File Uploaded Successfully', toastBody);

        }, dispatch)


    };

    const onFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('formData:', formData);


        loader(async () => {

            //#region formData: verifying, sanitizing and DB - space optimization

            if (!fileMsgArr || fileMsgArr?.length == 0 || !formData) {
                throw new Error("error: id: sa9df80kkj-l2 ");
            }

            // DB - space optimization: removing url domain.
            const formDataSpaceOptimized = {
                ...formData,
                imageUrl: fileMsgArr.map((file: IFileMsgState) => {
                    if (!file.downloadURL) throw new Error("error: id: sa9df80kkj-l3 ");
                    return file.downloadURL.replace(__Client_FirebaseStorageDomain, '')
                })
            }
            // console.log('formDataSpaceOptimized:', formDataSpaceOptimized)

            if (formData.priceDiscounted && (formData.priceDiscounted > formData.price)) {
                toast.warning('execution Aborted:\n\rDiscounted price cant be more than original price', toastBody)
                return false;
            }
            if (!fileMsgArr || fileMsgArr?.length == 0) {
                toast.warning('execution Aborted:\n\rPlease upload at least one image', toastBody)
                return false;
            }
            const sanitizedFormJson = xss(JSON.stringify({
                ...formDataSpaceOptimized,
                FK_User: currentUser?._id
            }));

            //#endregion


            const res = await fetch('/api/listing/create', {
                method: "post",
                body: sanitizedFormJson,
                headers: fetchHeaders
            });
            const data = await res.json();
            console.log('data:', data)

            if (data.success === false) {
                console.log("fetching data.status fail:", data.success);
                dispatch(general_failure(data as IAppError));
                return;
            }

            toast.success('Listing created successfully', toastBody);
            
            setTimeout(() => {
                navigate(`./listing/${data._id}`);
            }, 1000);

        }, dispatch)


    }

    return (
        <PageContainer h1={"Create Listing Page"} isWide={true} >
            <form onSubmit={onFormSubmit} id="formListing" className='flex flex-col sm:flex-row gap-7' >
                <div className='rap-side' onChange={eventBubble_formOnChange} >
                    {/* //////    INPUTS   //////// */}
                    <>
                        <input type="text"
                            placeholder='Title'
                            required
                            id="txtName"
                            maxLength={10}
                            minLength={2}
                            defaultValue={formData.name} />
                        <textarea
                            placeholder='Description'
                            rows={5}
                            required
                            // className='p-3'
                            id="txtDescription"
                            maxLength={62}
                        />
                        <input type="text"
                            placeholder='Address'
                            required
                            id="txtAddress"
                            maxLength={62}
                            defaultValue={formData.address}
                        />
                    </>
                    {/* //////    OPTIONS   //////// */}
                    <div className='section mt-6' >
                        {
                            optionArr.map((option: string, index: number) => (
                                <div key={option} id={`div_${option}`} className='ctrl-warper' >
                                    {/* eslint-disable-next-line react/jsx-props-no-spreading */}
                                    <input type="checkbox"
                                        checked={
                                            optionArr[index] === "Sell" || option === "Rent" ?
                                                (formData.type === option.toLowerCase()) :
                                                (formData[optionArr[index].toLowerCase() as keyof typeof formData] as boolean)
                                        }
                                        value={option} id={`chb_${option}`} title={option} className='w-5 h-5 mr-1' />

                                    <label htmlFor={`chb_${option}`}> {option} </label>
                                </div>
                            ))
                        }
                    </div>
                    {/* //////    NUMBERS   //////// */}
                    <div className='section' >
                        <div className="ctrl-warper">
                            <input type="number" placeholder='Bedrooms' id="txtBedrooms" min={0} max={10} required defaultValue={formData.bedrooms} />
                            <span>Bedrooms</span>
                        </div>
                        <div className="ctrl-warper">
                            <input type="number" placeholder='Bathrooms' id="txtBathrooms" min={0} max={10} required defaultValue={formData.bathrooms} />
                            <span>Bathrooms</span>
                        </div>
                        <div className="ctrl-warper">
                            <input type="number" placeholder='Price' id="txtPrice" min={0} required defaultValue={formData.price} />
                            <p className='flex flex-col'>Price
                                {
                                    formData.type === 'rent' && (
                                        <span className='text-xs'>($ / Month)</span>
                                    )
                                }
                            </p>
                        </div>
                        {
                            formData.offer && (
                                <div className="ctrl-warper">
                                    <input type="number" placeholder='Discounted Price' id="txtPriceDiscounted" name='priceDiscounted' min={0} required />
                                    <p className='flex flex-col' >Discounted Price
                                        {
                                            formData.type === 'rent' && (
                                                <span className='text-xs'>($ / Month)</span>
                                            )
                                        }
                                    </p>

                                </div>
                            )
                        }

                    </div>

                </div>
                <div className="rap-side">
                    {/* IMAGES CTRL */}
                    <div className="section">
                        <p className="font-semibold">Images:
                            <span className="font-normal font-gray-600">&nbsp;The first image will be the cover (max 6)</span></p>

                        <div className="flex gap-3">
                            <input type="file" disabled={loading || (fileMsgArr === null) || (fileMsgArr.length > 5)} onChange={eventHandler_fileOnChange} className='rounded border border-gray-300 p-3 w-full' id="images"
                                accept='image/*' multiple placeholder='Add images' data-testid="file-input" />
                            {/* POLICY: user first have to load images and once, if less then 7, user can upload */}
                            <button disabled={loading || (fileMsgArr !== null)} onClick={eventHandler_loadFireBaseImages} className='p-3 border border-green-700 text-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80 ' type="button">Load Images</button>
                        </div>
                    </div>
                    {/* IMAGES ARR */}
                    {fileMsgArr && fileMsgArr.map((fileMsg, index) => (
                        <div key={index}>
                            <ul className="ul-msg">
                                {fileMsg.error && <li key={`${index}-error`} className="msg-err">{fileMsg.error}</li>}
                                {fileMsg.progress && <li key={`${index}-progress`} className="msg-prog">{fileMsg.progress}</li>}
                                {fileMsg.downloadURL && <li key={`${index}-downloadURL`}>
                                    <div className="flex justify-between">
                                        <img src={fileMsg.downloadURL} className='object-cover rounded-sm' alt='listing image' />
                                        <FaDeleteLeft onClick={() => eventHandler_fileDelete(index)} className='cursor-pointer hover:text-red-500 text-2xl ' />
                                    </div>

                                </li>}
                            </ul>
                        </div>
                    ))}



                    {/* <img height={30} onClick={eventBubble_imgClick} src="https://firebasestorage.googleapis.com/v0/b/real-estate-app-b86a6.appspot.com/o/user_6634c000f5f9d3ffe20baba4%2Flisting%2FUntitled_1714989240996.png?alt=media&token=8ece5137-1723-42e2-9636-4828b9bab5ae" alt="image to delete" /> */}
                    <button disabled={loading} type="submit" className='btnBig bg-slate-800 w-full mt-14' >Create Listing {loading && ' ...'} </button>
                </div>

            </form>
            <UpdateModal isOpen={loading} />
        </PageContainer>
    )
}