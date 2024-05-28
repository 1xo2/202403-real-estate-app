
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Avatar from "../../components/Avatar";
import PageContainer from "../../components/PageContainer";
import SigningForm from "../../components/SigningForm";
import Card from "../../components/card/Card";
import { loader } from "../../components/dialogs/Loader";
import ModalDialogOkCancel from "../../components/dialogs/ModalDialog/ModalDialogOkCancel";
import UpdateModal from "../../components/dialogs/UpdateModal/UpdateModal";
import { IAppError } from "../../errorHandlers/clientErrorHandler";
import { AppDispatch, RootState } from "../../redux/store";
import { logOutOrDeletion_Success, logOutOrDeletion_fail, profile_updateAvatar } from "../../redux/user/userSlice";
import { eForms } from "../../share/enums";
import { fetchHeaders } from "../../share/fetchHeaders";
import { IFileMsgState, firebase_delete, firebase_fileUploadHandler, validateFilesForUpload } from "../../share/firebase/storage/imageStorageManager";
import { toastBody } from "../../share/toast";
import { IListingFields } from "../../share/types/listings";
import { delete_localStorage, get_localStorage, update_localStorage } from "../../utils/localStorageManager";
import { isNull_Undefined_emptyString } from "../../utils/stringManipulation";
import styles from './ProfilePage.module.css';


export default function ProfilePage() {

  const { currentUser, loading } = useSelector((state: RootState) => state.user);
  const dispatch: AppDispatch = useDispatch();

  const refFile = useRef<HTMLInputElement>(null)

  const fileIniState: IFileMsgState = { error: '', progress: '', downloadURL: '' }
  // const [fileMsg, setFileMsg] = useState<IFileMsgState[] | null>([fileIniState])
  const [fileMsg, setFileMsg] = useState<IFileMsgState[]>([fileIniState])

  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [listingsList, setListingsList] = useState<IListingFields[]>([])



  const deleteListing_eh = async (item: IListingFields) => {
    loader(async () => {

      if (isNull_Undefined_emptyString(item._id))
        throw new Error("id is null or undefined. n:sad9jja-ssa3ad");

      console.log('id:', item._id)
      const res = await fetch('/api/listing/delete/' + item._id, {
        method: "delete",
        headers: fetchHeaders
      });

      const data = await res.json();
      console.log('data:', data)


      if (res.status === 200) {
        setListingsList((state) => {
          return state.filter((listing) => item._id !== listing._id)
        })
        delete_localStorage({ _id: currentUser?._id, key: "listing", isLazy: true, value: item })

        await firebase_delete(currentUser?._id, 'listing')
        toast.success('The listing Deleted successfully', toastBody)

      } else {
        console.error('res:', data.message)
        toast.error('Error deleting listing', toastBody)
      }


    }, dispatch);
  }

  const handleOK_dialogBox_DELETION = async () => {
    console.log("OK clicked");
    await loader(async () => {

      // delete firedatabase images directory
      const result_firebaseDelete = await firebase_delete(currentUser?._id, 'root')
      setFileMsg((state) => {
        return {
          ...state,
          ...result_firebaseDelete
        };
      });


      // delete DB account
      const res = await fetch('/api/user/delete/' + currentUser?._id, {
        method: "delete",
        headers: fetchHeaders
      });

      const data = await res.json();
      console.log('data:', data)
      if (data.success === false) {
        dispatch(logOutOrDeletion_fail(data.message || data as IAppError))
      } else {
        dispatch(logOutOrDeletion_Success())
      }

      // delete localstorage
      localStorage.clear()
    }, dispatch, logOutOrDeletion_fail,);
    window.location.reload();

  };

  const eventBubble_clickHandler = async (e: React.MouseEvent<HTMLUListElement, MouseEvent>) => {
    try {
      const id = (e.target as HTMLLIElement).id;

      if (id === 'deleteAccount') {
        setIsDialogVisible(true);
      } else if (id === 'logOut') {


        await loader(async () => {

          const res = await fetch('/api/auth/logout', {
            method: "get",
            headers: fetchHeaders
          });
          const data = await res.json();
          console.log('data:', data)
          if (data.success === false) {
            dispatch(logOutOrDeletion_fail(data.message as IAppError))
          } else {
            dispatch(logOutOrDeletion_Success())
          }


          // window.location.reload();
        }, dispatch, logOutOrDeletion_fail,)



      } else if (id === 'showListings') {

        loader(async () => {
          let data;
          // get listings localStorage || fetch
          const storage = get_localStorage({ _id: currentUser?._id, key: 'listing' })
          console.log('data:', storage)
          if (storage) {
            /////////////////////
            // the below code is for Cy testing.
            // keep: 'using localStorage'
            //////////////////////
            console.log('using localStorage:', storage)
            /////////////////////
            // the above code is for Cy testing.
            // keep: 'using localStorage'
            //////////////////////
            data = JSON.parse(storage)
            setListingsList(data)

          } else {
            console.log('using API:')
            const res = await fetch('/api/listing/list/' + currentUser?._id, {
              method: "get",
              headers: fetchHeaders,
            })
            data = (await res.json()).reverse();
            // console.log('api data:', data)

            setListingsList(data)

            update_localStorage({ _id: currentUser?._id, key: 'listing', value: data })
          }

        }, dispatch)
      }

    } catch (error) {
      console.error('error:', error)
    }
  };



  const eventHandler_FileOnClick = () => {
    // setFile(undefined)
    setFileMsg([fileIniState])  //  file msg reset
    refFile.current?.click()
  }

  const eventHandler_fileOnChange = async (e: React.ChangeEvent<HTMLInputElement> | undefined) => {
    const isOK = await validateFilesForUpload(e)

    if (isOK === 'ok') {
      try {
        if (!e?.target.files) return

        await firebase_fileUploadHandler({ currentFile: e.target.files[0], currentUserID: currentUser?._id, setFileMsgArr: setFileMsg, dirName: 'avatar', fileIndex: 0 });
        //will be catch on usEffect

        // if (fileMsg && !isNull_Undefined_emptyString(fileMsg && fileMsg[0].downloadURL)) {
        //   currentUser?._id && update_localStorage({ _id: currentUser?._id, key: "Avatar", value: fileMsg[0].downloadURL, isArray: false });
        //   console.log('update_localStorage:xxxxxxxxxxx')
        //   // Dispatch action to update avatar in Redux store
        //   dispatch(profile_updateAvatar(fileMsg[0].downloadURL as string));
        // }
      } catch (error) {
        console.error('fileUploadHandler | error:', error)
        setFileMsg((prevState) => {
          if (!prevState) {
            // case when prevState is null
            return [{ error: 'Error: ' + error }];
          } else {
            // case when prevState is an array
            return [...prevState, { error: 'Error: ' + error }];
          }
        });

      }
    } else {
      setFileMsg((prevState) => {
        if (!prevState) {
          // If prevState is null, initialize it with an array containing the error message
          return [{ error: isOK }];
        } else {
          // If prevState is an array, create a new array by appending the new error message to it
          return [...prevState, { error: isOK }];
        }
      });

    }
  };





  useEffect(() => {
    // set fileMsg after upload
    if (fileMsg && fileMsg[0].error === '' && fileMsg[0].downloadURL !== '') {
      // set local storage
      currentUser?._id && update_localStorage({ _id: currentUser._id, key: "Avatar", value: fileMsg[0].downloadURL || '', isArray: false });
      console.log('set Avatar to local storage:')
      dispatch(profile_updateAvatar(fileMsg[0].downloadURL || ''));

    }

    // get local storage listing
    setTimeout(async () => {
      const storageListing = get_localStorage({ _id: currentUser?._id, key: 'listing' });
      // console.log('storageListing:', storageListing)
      if (storageListing) {
        // const list = Object.values(JSON.parse(storageListing)) as IListingFields[];
        const list = JSON.parse(storageListing) as IListingFields[];
        // console.log('list:', list)
        // console.log('Array.isArray(list):', Array.isArray(list))
        setListingsList(list);
      }
    }, 0);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileMsg && fileMsg[0].downloadURL]);





  return (
    <PageContainer h1={"Profile Page"}>
      <div className="flex flex-col">

        <ul className={`${styles.ulMsg} ${styles.msgErr} ${styles.msgProg}`} >
          {fileMsg && fileMsg[0].error && <li className={styles.msgErr} key='fileMsg[0].error' >{fileMsg[0].error} </li>}
          {fileMsg && fileMsg[0].progress && <li className={styles.msgProg} key='fileMsg.progress' >{fileMsg[0].progress} </li>}
          {/* {fileMsg && fileMsg[0].downloadURL && <li key='fileMsg[0].downloadURL'> <img src={fileMsg[0].downloadURL} alt='new image' /></li>} */}
        </ul>

        <Avatar user={currentUser}
          onClick={eventHandler_FileOnClick}
          cssClass="rounded-full self-center h-24 w-24 object-cover cursor-pointer mb-4 " />
        {/* data update */}
        <SigningForm forms={eForms.profile} />
      </div>

      <ul id='ulProfile' className={`${styles.ulProfile} my-3 gap-3`} onClick={eventBubble_clickHandler}>
        <li className="border-b-2 " ><span id="showListings"> Show Listing</span> </li>
        <li className={`text-right ${styles['li-rtl']}`}><span id="logOut">Log-Out</span></li>
        <li className={`text-right ${styles['li-rtl']}`}><span id="deleteAccount" >Delete Account</span></li>
      </ul>


      <input type="file" ref={refFile} hidden accept="image/*" onChange={eventHandler_fileOnChange} ></input>
      {
        isDialogVisible && <ModalDialogOkCancel message={'Are you sure you want to delete your account?'}
          onOK={handleOK_dialogBox_DELETION} type="danger" isDialogVisible={isDialogVisible} setIsDialogVisible={setIsDialogVisible} />
      }
      {/* LISTINGS LIST */}
      {
        listingsList.length > 0 ? (<div>
          <>
            <h2>My Listings</h2>
            {listingsList.map((ad, index) => (
              <Card key={index.toString() + (ad._id || index)} item={ad} deleteListing={deleteListing_eh} />
            ))}
          </>

        </div>) : (
          <p>You don't have any listing yet.</p>
        )
      }

      <UpdateModal isOpen={loading} />
    </PageContainer>
  )
}