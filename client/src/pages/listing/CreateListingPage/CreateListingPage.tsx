import { useState } from 'react';
import { FaDeleteLeft } from 'react-icons/fa6';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PageContainer from '../../../components/PageContainer';
import UpdateModal from '../../../components/dialogs/UpdateModal/UpdateModal';
import { AppDispatch, RootState } from '../../../redux/store';
import { loading_end, loading_start } from '../../../redux/user/userSlice';
import { IFileMsgState, firebase_delete, firebase_fileUploadHandler, firebase_getDirUrls, validateFilesForUpload } from '../../../share/firebase/storage/imageStorageManager';
import { toastBody } from '../../../share/toast';
import { isNull_Undefined_emptyString } from '../../../utils/stringManipulation';
import './CreateListingPage.css';

export default function CreateListingPage() {


    const { currentUser, loading } = useSelector((state: RootState) => state.user);
    const dispatch: AppDispatch = useDispatch();


    const [fileMsgArr, setFileMsgArr] = useState<IFileMsgState[] | null>(null);
    // const [fileMsgArr, setFileMsgArr] = useState<IFileMsgState[] | undefined>([{ error: '', progress: '', downloadURL: '' }]);

    const eventHandler_loadFireBaseImages = async () => {

        if (isNull_Undefined_emptyString(currentUser?._id)) {
            throw new Error('currentUser._id is null or undefined');
        }
        dispatch(loading_start())

        const result = await firebase_getDirUrls(currentUser?._id, 'listing');
        console.log('result:', result)
        setFileMsgArr(result.map((fullPath) => ({ error: '', progress: '', downloadURL: fullPath })));
        dispatch(loading_end())
    }

    const eventHandler_fileDelete = async (fileIndex: number) => {
        try {
            dispatch(loading_start())
            const result = await firebase_delete(currentUser?._id, 'listing', fileMsgArr[fileIndex].downloadURL);

            setFileMsgArr(prevState => {
                const updatedFileMsgArr = [...prevState];
                if (result.error) {
                    updatedFileMsgArr[fileIndex].error = result.error;
                } else {
                    updatedFileMsgArr.splice(fileIndex, 1);
                }
                return updatedFileMsgArr;
            });
            toast.success('file deleted successfully', toastBody)
        } catch (error) {
            console.error('error:', error)
            toast.error((error as Error).message || 'Error deleting file', toastBody)
        } finally {
            dispatch(loading_end())
        }
    }

    const eventBubble_liClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const id = (e.target as HTMLDivElement).id;
        console.log('id:', id);
    }


    const eventHandler_fileOnChange = async (e: React.ChangeEvent<HTMLInputElement> | undefined) => {

        try {
            // setFileMsgArr([]) // reset
            dispatch(loading_start())
            const isOk: string = validateFilesForUpload(e, 6 - (fileMsgArr?.length ?? 0))
            if (isOk !== 'ok') {
                // setFileMsgArr([{
                //     error: isOk,
                //     progress: '',
                //     downloadURL: ''
                // }])
                toast.error(isOk, toastBody);
                return
            }

            if (!e?.target.files) return
            const fileArr: File[] = Array.from(e.target.files)

            // dispatch(loading_start())

            await Promise.all(fileArr.map(async (file, fileIndex) => await firebase_fileUploadHandler(
                { currentFile: file, currentUserID: currentUser?._id, setFileMsgArr, dirName: 'listing', fileIndex })))


            toast.success('File Uploaded Successfully', toastBody);


        } catch (error) {
            console.error('error:', error)
            toast.error((error as Error)?.message || 'File Upload Failed', toastBody);
        } finally {
            dispatch(loading_end())
        }

    };



    return (
        <PageContainer h1={"Create Listing Page"} isWide={true} >
            <form id="formListing" className='flex flex-col sm:flex-row gap-7' >
                <div className='rap-side' >
                    {/* //////    INPUTS   //////// */}
                    <input type="text"
                        placeholder='Name'
                        required
                        id="txtName"
                        maxLength={62}
                        minLength={10} />
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
                    />
                    {/* //////    OPTIONS   //////// */}
                    <div onClick={eventBubble_liClick} className='section mt-6' >
                        {
                            Array.from(["Sell", "Rent", "Parking_Spot", "Furnished", "Offer"]).map((option) => (
                                <div key={option} id={`div_${option}`} className='ctrl-warper' >
                                    <input type="checkbox" value={option} id={`chb_${option}`} title={option} className='w-5 h-5 mr-1' />
                                    <label htmlFor={`chb_${option}`}> {option} </label>
                                </div>
                            ))
                        }
                    </div>
                    {/* //////    NUMBERS   //////// */}

                    <div className='section' >
                        <div className="ctrl-warper">
                            <input type="number" placeholder='Beds' id="txtBeds" min={0} max={10} required defaultValue={1} />
                            <span>Beds</span>
                        </div>
                        <div className="ctrl-warper">
                            <input type="number" placeholder='Baths' id="txtBaths" min={0} max={10} required defaultValue={1} />
                            <span>Baths</span>
                        </div>
                        <div className="ctrl-warper">
                            <input type="number" placeholder='Price' id="txtPrice" min={0} required />
                            <p className='flex flex-col'>Price
                                <span className='text-xs'>($ / Month)</span>
                            </p>
                        </div>
                        <div className="ctrl-warper">
                            <input type="number" placeholder='Discounted Price' id="txtDiscountedPrice" min={0} required />
                            <p className='flex flex-col' >Discounted Price
                                <span className='text-xs'>($ / Month)</span>
                            </p>

                        </div>
                    </div>

                </div>
                <div className="rap-side">

                    <div className="section">
                        <p className="font-semibold">Images:
                            <span className="font-normal font-gray-600">&nbsp;The first image will be the cover (max 6)</span></p>

                        <div className="flex gap-3">
                            <input disabled={loading || (fileMsgArr === null) || (fileMsgArr.length > 5)} onChange={eventHandler_fileOnChange} type="file" className='rounded border border-gray-300 p-3 w-full' id="images"
                                accept='image/*' multiple placeholder='Add images' />
                            <button onClick={eventHandler_loadFireBaseImages} className='p-3 border border-green-700 text-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80 ' type="button">Load Images</button>
                        </div>
                    </div>

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
                    <button type="button" className='btnBig bg-slate-800 w-full mt-14' >Create Listing</button>
                </div>

            </form>
            <UpdateModal isOpen={loading} />
        </PageContainer>
    )
}