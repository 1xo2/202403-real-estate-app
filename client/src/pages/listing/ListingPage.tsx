import { useState } from 'react';
import { FaDeleteLeft } from 'react-icons/fa6';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import xss from 'xss';
import PageContainer from '../../components/PageContainer';
import { loader } from '../../components/dialogs/Loader';
import UpdateModal from '../../components/dialogs/UpdateModal/UpdateModal';
import { IAppError } from '../../errorHandlers/clientErrorHandler';
import { AppDispatch, RootState } from '../../redux/store';
import { general_failure, loading_start } from '../../redux/user/userSlice';
import { __Client_FirebaseStorageDomain } from '../../share/consts';
import { fetchHeaders } from '../../share/fetchHeaders';
import { IFileMsgState, firebase_delete, firebase_fileUploadHandler, firebase_getDirUrls, validateFilesForUpload } from '../../share/firebase/storage/imageStorageManager';
import { toastBody } from '../../share/toast';
import { IListingFields } from '../../share/types/listings';
import { get_localStorage, set_localStorage } from '../../utils/localStorageManager';
import { isNull_Undefined_emptyString } from '../../utils/stringManipulation';
import styles from './ListingPage.module.css';


type Props = {
    isCreate: boolean
}

export default function ListingPage({ isCreate }: Props) {
    // console.log('isCreate:', isCreate)
    //  POLICY: 
    //  1. user first have to load images and once, if less then 7, user can upload.
    const { listingId } = useParams()

    const navigate = useNavigate();
    const { currentUser, loading } = useSelector((state: RootState) => state.user);
    const dispatch: AppDispatch = useDispatch();

    const { state } = useLocation();
    const singleListing: IListingFields = state?.singleListing;

    const [fileMsgArr, setFileMsgArr] = useState<IFileMsgState[] | null>(singleListing ? singleListing.imageUrl.map(url => ({ downloadURL: __Client_FirebaseStorageDomain + url })) : null);
    const [formData, setFormData] = useState<IListingFields>(singleListing || {
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
        FK_User: "",
        _id: ''
    })
    const optionArr = ["Sell", "Rent", "Parking", "Furnished", "Offer"]




    // useEffect(() => {
    //     // console.log('enter useEffect: listingId:', listingId);
    //     if (!isCreate && listingId) {
    //         const fetchData = async () => {
    //             try {
    //                 const res = await fetch('/api/listing/single/' + listingId, {
    //                     method: "get",
    //                     headers: fetchHeaders
    //                 });

    //                 if (res.status === 200) {
    //                     const data = await res.json();
    //                     // console.log('useEffect data:', data)
    //                     setFormData(() => {
    //                         // console.log('useEffect prev:', prev)
    //                         return data
    //                     });

    //                 }
    //             } catch (error) {
    //                 console.error('error:', error);
    //             }
    //         };

    //         eventHandler_loadFireBaseImages();
    //         fetchData();
    //     }

    // }, [listingId]);

    const eventHandler_loadFireBaseImages = async () => {
        console.log('useCallback:  eventHandler_loadFireBaseImages')
        loader(async () => {

            if (isNull_Undefined_emptyString(currentUser?._id)) {
                throw new Error('currentUser._id is null or undefined');
            }

            const result = await firebase_getDirUrls(currentUser?._id, 'listing');
            // console.log('result:', result)
            setFileMsgArr(result.map((fullPath) => ({ error: '', progress: '', downloadURL: fullPath })));
            if (result.length = 0) {
                toast.info('No images found, \nPlease upload', toastBody)
            }
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
                // console.log('formData:', updatedState); // Log the updated state
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


            const isOk: string = await validateFilesForUpload(e, 6 - (fileMsgArr?.length ?? 0))
            if (isOk !== 'ok') {
                toast.error(isOk, toastBody);
                return
            }

            if (!e?.target.files) return
            const fileArr: File[] = Array.from(e.target.files)


            await Promise.all(fileArr.map(async (file, fileIndex) =>
                await firebase_fileUploadHandler({
                    currentFile: file, currentUserID: currentUser?._id, setFileMsgArr, dirName: 'listing', fileIndex
                })))


            toast.success('File Uploaded Successfully', toastBody);

        }, dispatch)


    };

    const onFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // console.log('formData:', formData);


        loader(async () => {


            //#region -- formData: verifying, sanitizing and DB - space optimization


            if (!formData) {
                throw new Error("error: id: sa9df80kkj-l2 ");
            }
            if (!fileMsgArr || fileMsgArr?.length == 0) {
                toast.warning('execution Aborted:\n\rPlease upload at least one image', toastBody)
                return false;
            }

            let path;
            if (isCreate) {
                path = 'create';
                delete formData._id
            } else {
                path = `update/${listingId}`;
            }


            // DB - space optimization: removing url domain.
            const formDataSpaceOptimized = {
                ...formData,
                imageUrl: fileMsgArr.map((file: IFileMsgState) => {
                    if (!file.downloadURL) throw new Error("error: id: sa9df80kkj-l3 ");
                    return file.downloadURL.replace(__Client_FirebaseStorageDomain, '')
                })
            }


            if (formData.priceDiscounted && (formData.priceDiscounted > formData.price)) {
                toast.warning('execution Aborted:\n\rDiscounted price cant be more than original price', toastBody)
                return false;
            }

            const sanitizedFormJson = xss(JSON.stringify({
                ...formDataSpaceOptimized,
                FK_User: currentUser?._id
            }));


            //#endregion




            // const path = isCreate ? 'create' : `update/${listingId}`;

            const res = await fetch("/api/listing/" + path, {
                method: "post",
                body: sanitizedFormJson,
                headers: fetchHeaders
            });
            const data = await res.json();
            // console.log('fetch success data:', data)

            if (data.success === false) {
                console.error("fetching data.status fail:", data.message);
                dispatch(general_failure(data as IAppError));
                return;
            }


            // updating localStorage
            let storage = JSON.parse(get_localStorage(currentUser?._id, 'listing') || '');
            if (storage && Array.isArray(storage)) {
                storage.push(data);
            } else {
                storage = [data];
            }
            set_localStorage(currentUser?._id, 'listing', JSON.stringify(storage));






            toast.success('Listing created successfully', toastBody);

            // setTimeout(() => {
            //     navigate(`./listings-edit/${data._id}`);
            // }, 1000);

        }, dispatch)


    }

    return (
        <PageContainer h1={`${isCreate ? 'Create' : 'Edit'} Listing Page`} isWide={true} >
            <form onSubmit={onFormSubmit} id="formListing" className={`${styles.formListing} flex flex-col sm:flex-row gap-7`} >
                <div className={styles['rap-side']} onChange={eventBubble_formOnChange} >
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
                            defaultValue={formData.description}
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
                    <div className={`${styles['section']} mt-6`}>
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
                    <div className={styles['section']} >
                        <div className={styles['ctrl-warper']}>
                            <input type="number" placeholder='Bedrooms' id="txtBedrooms" min={0} max={10} required
                                defaultValue={formData.bedrooms} value={formData.bedrooms} />
                            <span>Bedrooms</span>
                        </div>
                        <div className={styles['ctrl-warper']}>
                            <input type="number" placeholder='Bathrooms' id="txtBathrooms" min={0} max={10} required
                                defaultValue={formData.bathrooms} value={formData.bathrooms} />
                            <span>Bathrooms</span>
                        </div>
                        <div className={styles['ctrl-warper']}>
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
                                <div className={styles['ctrl-warper']}>
                                    <input type="number" placeholder='Discounted Price' id="txtPriceDiscounted" name='priceDiscounted' min={0} required
                                        defaultValue={formData.priceDiscounted} value={formData.priceDiscounted} />
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
                <div className={styles['rap-side']}>
                    {/* IMAGES CTRL */}
                    <div className={styles['section']}>
                        <p className="font-semibold">Images:
                            <span className="font-normal font-gray-600">&nbsp;The first image will be the cover (max 6)</span></p>
                        {fileMsgArr && fileMsgArr.length == 0 && <p className="font-semibold">No images please upload.</p>}
                        <div className="flex gap-3 w-full ">
                            {/* File Input */}
                            <input type="file" disabled={loading || !isCreate && ((fileMsgArr === null) || (fileMsgArr.length > 5))} onChange={eventHandler_fileOnChange} className='rounded border border-gray-300 p-3 w-full' id="images"
                                accept='image/*' multiple placeholder='Add images' data-testid="file-input" />
                            {/* Load Images */}
                            {!isCreate &&
                                <button disabled={loading || (fileMsgArr !== null)} onClick={eventHandler_loadFireBaseImages} className='p-3 border border-green-700 text-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80 ' type="button">Load Images</button>
                            }
                        </div>
                    </div>
                    {/* IMAGES ARR */}
                    {fileMsgArr && fileMsgArr.map((fileMsg, index) => (
                        <div key={index}>
                            <ul className={styles['ul-msg']}>
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



                    <button disabled={loading} type="submit" className='btnBig bg-slate-800 w-full mt-14' >
                        {isCreate ? 'Create' : 'Edit'} Listing {loading && ' ...'} </button>
                </div>

            </form>
            <UpdateModal isOpen={loading} />
        </PageContainer>
    )
}