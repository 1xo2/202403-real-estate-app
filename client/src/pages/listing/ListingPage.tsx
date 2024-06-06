import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import xss from 'xss';
import PageContainer from '../../components/PageContainer';
import CardLandscape from '../../components/card/CardLandscape';
import { loader } from '../../components/dialogs/Loader';
import ModalDialogOkCancel from '../../components/dialogs/ModalDialog/ModalDialogOkCancel';
import UpdateModal from '../../components/dialogs/UpdateModal/UpdateModal';
import { AppDispatch, RootState } from '../../redux/store';
import { loading_start } from '../../redux/user/userSlice';
import { __Client_FirebaseStorageDomain } from '../../share/consts';
import { fetchHeaders } from '../../share/fetchHeaders';
import { IFileMsgState, firebase_delete, firebase_fileUploadHandler, validateFilesForUpload } from '../../share/firebase/storage/imageStorageManager';
import { toastBody } from '../../share/toast';
import { IListingFields } from '../../share/types/listings';
import { update_localStorage } from '../../utils/localStorageManager';
import styles from './ListingPage.module.css';



type Props = {
    isCreate: boolean
}

export default function ListingPage({ isCreate }: Props) {

    const navigate = useNavigate();
    const { listingId } = useParams()
    const { state } = useLocation();
    const singleListing: IListingFields = state?.singleListing;

    const { currentUser, loading } = useSelector((state: RootState) => state.user);
    const dispatch: AppDispatch = useDispatch();


    const [fileMsgArr, setFileMsgArr] = useState<IFileMsgState[]>(singleListing ? singleListing.imageUrl.map(url => ({ downloadURL: __Client_FirebaseStorageDomain + url })) : []);
    const [fileArr, setFileArr] = useState<File[]>([])


    const [formData, setFormData] = useState<IListingFields>(singleListing || {
        name: "",
        description: "",
        address: "",
        price: 1,
        priceDiscounted: 0,
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

    let totalImages: number = (fileMsgArr && fileMsgArr?.length || 0) + fileArr?.length // max 6 constant

    const [uploadsComplete, setUploadsComplete] = useState(false); // State to track if firebase uploads/delete are complete - fb promise not working, and b4 db update
    const [isOpenDialog, setIsOpenDialog] = useState(false)

    const [isFileDeleted, setIsFileDeleted] = useState(false)
    const [fileMsgArr_index, setFileMsgArr_index] = useState(0)  // for inserting on existing images in fileMsgArr
    const isUploadsCompleteRef = useRef(false);

    // image delete
    useEffect(() => {
        if (isFileDeleted)
            submitForm(true)
    }, [isFileDeleted]);

    // client file select
    useEffect(() => {
        if (fileArr.length > 0) {
            const allFilesUploaded = fileMsgArr.filter(fileMsg => fileMsg.downloadURL).length === fileArr.length + fileMsgArr_index;
            if (allFilesUploaded) {
                toast.success('File Uploaded Successfully', toastBody);
                setUploadsComplete(true);
                isUploadsCompleteRef.current = true;
            }
        }
    }, [fileMsgArr, fileArr.length, fileMsgArr_index]);

    // submit ready  
    useEffect(() => {
        if (fileArr.length > 0 && (uploadsComplete || isUploadsCompleteRef.current)) {
            const allFilesUploaded = fileMsgArr.filter(fileMsg => fileMsg.downloadURL).length >= fileArr.length;
            if (allFilesUploaded) {
                setFileArr([]);
                submitForm();
            }
        }
    }, [uploadsComplete, fileMsgArr, fileArr.length]);


    const removeSelectedFile_eh_Bubble = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {

        const target = e.target as HTMLElement
        let id = target.ariaLabel
        if (!id) {
            // svg from react-icons library
            const parent = target.parentElement as HTMLElement;
            id = parent.ariaLabel
        }

        if (!id || id.indexOf('btnRemoveSelectedFile_') === -1) return

        const index = Number(target.id.split('_')[1]);

        const newFiles = [...fileArr];
        newFiles.splice(index, 1);
        setFileArr(newFiles);
    };

    const uploadImages_eh = async () => {
        // image urls will be set on setFileMsgArr

        if (!fileArr.length) return;
        setFileMsgArr_index(fileMsgArr.length); // for update on existing record


        const promises = fileArr.map((file, fileIndex) => {
            return firebase_fileUploadHandler({
                currentFile: file, currentUserID: currentUser?._id, setFileMsgArr, dirName: 'listing', fileIndex: (fileIndex + fileMsgArr.length)
            });
        });

        try {
            // the firebase promise not working.
            await Promise.all(promises)
            console.log('firebase Promise.all is done.')
        } catch (error) {
            console.log('error:', error);
            toast.error('File upload failed. Please try again.', toastBody);
        }
    };

    const fileOnChange_eh = async (e: React.ChangeEvent<HTMLInputElement> | undefined): Promise<void> => {

        // loader(async () => {

        try {

            const isOk: string = await validateFilesForUpload(e, 6 - (fileArr?.length ?? 0))
            if (isOk !== 'ok') {
                toast.error(isOk, toastBody);
                return
            }

            if (!e?.target.files) return


            setFileArr(prev =>
                [...prev, ...Array.from(e.target.files || [])]);

        } catch (error) {
            console.log('error:', error)
            toast.error('Error uploading file. Please try again.', toastBody);
        }

        // }, dispatch)


    };
    const firebaseFileDelete_eh_Bubble = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {

        const target = e.target as HTMLElement
        let id = target.ariaLabel
        if (!id) {
            // svg from react-icons library
            const parent = target.parentElement as HTMLElement;
            id = parent.ariaLabel
        }
        if (!id || id.indexOf('btnRemoveSelectedFile_') === -1) {
            toast.error('Internal client error.', toastBody);
            throw new Error('Internal server error. nu: 9s-fad8790ak-sd-fm;lf-sd0');
        }


        loader(async () => {

            const fileIndex: number = Number(id.split('_')[1]);

            if (!fileMsgArr) { throw new Error("error: id: sa9df80kkj-l "); }


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



            if (result.error) {
                toast.error(result.error, toastBody);
                console.error('result.error: nu:sa09fkl8nsf8da-dk-sd8 ', result.error)
                return
            }

            setIsFileDeleted(true)

            toast.success('file deleted successfully', toastBody)
        }, dispatch)
    }
    


    const formOnChange_eh_Bubble = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        try {
            const target = e.target as HTMLInputElement

            const { id, value, type, name, checked } = target;
            let fieldName = name || id.replace('txt', '').replace('chb_', '').toLowerCase();
            let fieldValue: string | number | boolean =
                type === 'checkbox' ?
                    checked :
                    type === 'number' ?
                        Number(value) :
                        value.toLocaleLowerCase();

            if (type === 'checkbox' && (fieldName === 'sell' || fieldName === 'rent')) {
                fieldValue = checked ? fieldName : (fieldName === 'rent' ? 'sell' : 'rent');
                fieldName = 'type';
            }

            if (fieldName === 'priceDiscounted' && (Number(formData.price) < Number(fieldValue))) {
                toast.error('Discounted price cant be more than original price', toastBody)
                return
            }

            setFormData(prevState => {
                const updatedState = { ...prevState, [fieldName]: fieldValue };
                // console.log('formData:', updatedState);
                return updatedState;
            });

        } catch (error) {
            console.error('error:', error)
            toast.error((error as Error).message || 'Error deleting file', toastBody)
        }
    }

    const formSubmit_eh = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!formData) {
            throw new Error("error: id: sa9df80kkj-l2 ");
        }
        if (isCreate && fileArr.length == 0) {
            toast.warning('execution Aborted: Please select at least one image, when ready upload it.', toastBody)
            return false;
        }


        if (isCreate) {
            dispatch(loading_start())
            delete formData._id
        }

        if (fileArr.length > 0) {
            uploadImages_eh();
        } else {
            submitForm()
        }

    }

    const submitForm = (isImgDeletion = false) => {

        if (fileMsgArr?.length == 0) {
            toast.error('Please upload at least one image.')
            return false
        }

        // DB - space optimization: removing url domain.
        loader(async () => {

            let path;
            if (isCreate) {
                path = 'create';
                delete formData._id
                uploadImages_eh();
            } else {
                path = `update/${listingId}`;
            }

            // if (formData.type === 'rent') {
            //     delete formData.priceDiscounted
            //     delete formData.offer
            // }



            const imageUrl = fileMsgArr.map((file: IFileMsgState) => {
                if (!file.downloadURL) throw new Error("error: id: sa9df80kkj-l3 ");
                return file.downloadURL.replace(__Client_FirebaseStorageDomain, '')
            })


            const formDataSpaceOptimized = isImgDeletion ?
                { imageUrl } :
                {
                    ...formData,
                    imageUrl,
                };



            // console.log('formDataSpaceOptimized:', formDataSpaceOptimized)

            const sanitizedFormJson = xss(JSON.stringify({
                ...formDataSpaceOptimized,
                FK_User: currentUser?._id
            }));


            // const res = await fetch("/api/listing/" + path, {

            const env = import.meta.env.VITE_APP_API_ENDPOINT;
            const endPoint = env && env.includes('localhost') ? '' : env;
            // const res = await fetch(`${endPoint}/api/listings/${path}`, {
            const res = await fetch(endPoint + "/api/listing/" + path, {
                method: "post",
                body: sanitizedFormJson,
                headers: fetchHeaders
            });
            const data = await res.json();
            // console.log('fetch success data:', data)

            if (data.success === false) {
                console.error("fetching data.status fail:", data.message);
                // dispatch(general_failure(data as IAppError));
                throw data
            }


            // updating localStorage
            update_localStorage({ _id: currentUser?._id, key: 'listing', value: data });

            toast.success('Listing created successfully', toastBody);


            !isImgDeletion && setTimeout(() => {
                navigate(`/listing-view/${data._id}`, { state: { singleListing: data } });
            }, 1000);

        }, dispatch)
    }




    return (
        <PageContainer h1={`${isCreate ? 'Create' : 'Edit'} Listing Page`} isWide={true} >
            <form onSubmit={formSubmit_eh} id="formListing" className={`${styles.formListing} flex flex-col sm:flex-row gap-7`} >
                <div className={styles['rap-side']} onChange={formOnChange_eh_Bubble} >
                    {/* //////    INPUTS   //////// */}
                    <>
                        <input type="text"
                            placeholder='Title'
                            required
                            id="txtName"
                            maxLength={20}
                            minLength={2}
                            defaultValue={formData.name} />
                        <textarea
                            placeholder='Description'
                            rows={5}
                            required
                            defaultValue={formData.description}
                            id="txtDescription"
                            maxLength={150}
                        />
                        <input type="text"
                            placeholder='Address'
                            required
                            id="txtAddress"
                            maxLength={100}
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
                        <div className="flex gap-3 w-full ">
                            {/* File Input */}
                            <input type="file" disabled={loading} onChange={fileOnChange_eh} className='rounded border border-gray-300 p-3 w-full' id="images"
                                accept='image/*' multiple placeholder='Add images' data-testid="file-input" />
                        </div>
                    </div>
                    {/* IMAGES ARR */}
                    <div className="overflow-auto">
                        {/* File upload msg */}
                        {fileMsgArr.length > 0 &&
                            <div onClick={firebaseFileDelete_eh_Bubble}>
                                {fileMsgArr.map((fileMsg, index) => (
                                    <CardLandscape key={index} index={index} fileUrl={fileMsg.downloadURL} totalImages={fileMsgArr.length} firstCover={true} header={'info.'}
                                        body={
                                            <ul className={styles['ul-msg']}>
                                                {fileMsg.error && <li key={`${index}-error`} className={styles['msg-err']}>{fileMsg.error}</li>}
                                                {fileMsg.progress && <li key={`${index}-progress`} className={styles['msg-prog']}>{fileMsg.progress}</li>}
                                            </ul>
                                        }
                                    />
                                ))}
                            </div>
                        }

                        {/* Selected Files For Upload */}
                        {fileArr.length > 0 &&
                            <div className="overflow-auto h-96 " onClick={removeSelectedFile_eh_Bubble}>
                                <span className="font-light">(6/{totalImages}) Selected Files For Upload:</span >
                                {
                                    fileArr.map((file, index) => (
                                        <CardLandscape key={file.name + index} index={index} file={file}
                                            totalImages={fileArr.length} firstCover={true} header={'info.'}
                                            body={
                                                <p>
                                                    File Name: {file.name}
                                                    <br />
                                                    File Size: {Math.round(file.size / 1024)} kb
                                                </p>
                                            }
                                        />
                                    ))
                                }

                            </div>
                        }


                    </div>


                    <button disabled={loading} type="submit" className='btnBig bg-slate-800 w-full mt-14' >
                        {isCreate ? 'Create' : 'Edit'} Listing {loading && ' ...'} </button>
                </div>

            </form>
            <UpdateModal isOpen={loading} />
            <ModalDialogOkCancel message='When you done with image deletion: Please click the form update button.'
                type='danger' isDialogVisible={isOpenDialog} setIsDialogVisible={setIsOpenDialog} />
        </PageContainer>
    )
}