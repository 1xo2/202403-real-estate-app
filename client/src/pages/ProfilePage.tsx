
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Avatar from "../components/Avatar";
import PageContainer from "../components/PageContainer";
import SigningForm from "../components/SigningForm";
import ModalDialogOkCancel from "../components/dialogs/ModalDialog/ModalDialogOkCancel";
import UpdateModal from "../components/dialogs/UpdateModal/UpdateModal";
import '../pages/ProfilePage.css';
import { AppDispatch, RootState } from "../redux/store";
import { loading_end, loading_start, logOutOrDeletion_Success, logOutOrDeletion_fail, profile_updateAvatar } from "../redux/user/userSlice";
import { eForms } from "../share/enums";
import { fetchHeaders } from "../share/fetchHeaders";
import { firebase_deleteDirectory, firebase_fileUploadHandler } from "../share/firebase/storage/imageStorageManager";
import { setAvatar_localStorage } from "../utils/localStorageManager";
import { IAppError } from "../errorHandlers/clientErrorHandler";
import { loader } from "../components/dialogs/Loader";



export default function ProfilePage() {

  const { currentUser } = useSelector((state: RootState) => state.user);
  const dispatch: AppDispatch = useDispatch();
  const { loading } = useSelector((state: RootState) => state.user);
  const refFile = useRef<HTMLInputElement>(null)

  const fileIniState = { error: '', progress: '', downloadURL: '' }
  const [fileMsg, setFileMsg] = useState(fileIniState)

  const [isDialogVisible, setIsDialogVisible] = useState(false);

  // async function loader(fun: () => Promise<void>) {
  //   try {
  //     dispatch(loading_start())
  //     await fun()
  //   } catch (error) {
  //     console.error('error:', error)
  //     dispatch(logOutOrDeletion_fail(error as IAppError))
  //   } finally {
  //     console.log('loader: finally:')
  //     dispatch(loading_end())
  //   }
  // }



  const handleOK_dialogBox_DELETION = async () => {
    console.log("OK clicked");
    await loader(async () => {
      // try {
      // setIsUpdateModalVisible(true);
      // dispatch(loading_start());

      // delete firedatabase images directory
      const result_firebaseDelete = await firebase_deleteDirectory(currentUser?._id)
      setFileMsg((state) => {
        return {
          ...state,
          ...result_firebaseDelete
        }
      })

      // delete DB account
      const res = await fetch('/api/user/delete/' + currentUser?._id, {
        method: "delete",
        headers: fetchHeaders
      });

      const data = await res.json();
      console.log('data:', data)
      if (data.success === false) {
        dispatch(logOutOrDeletion_fail(data as IAppError))
      } else {
        dispatch(logOutOrDeletion_Success())
      }

      // delete localstorage
      localStorage.clear()
    }, dispatch, logOutOrDeletion_fail,);
    // dispatch(loading_end());
    window.location.reload();


    // } catch (error) {
    //   console.log('error:', error)

    //   dispatch(loading_end());
    //   dispatch(logOutOrDeletion_fail(error as IAppError));
    // }
  };



  const eventBabel_clickHandler = async (e: React.MouseEvent<HTMLUListElement, MouseEvent>) => {
    try {
      const id = (e.target as HTMLLIElement).id;
      console.log('id:', id);

      if (id === 'deleteAccount') {
        setIsDialogVisible(true);
      } else if (id === 'logOut') {

        // try {

        //   dispatch(loading_start());
        await loader(async () => {

          const res = await fetch('/api/auth/logout', {
            method: "get",
            headers: fetchHeaders
          });
          const data = await res.json();
          console.log('data:', data)
          if (data.success === false) {
            dispatch(logOutOrDeletion_fail(data.error as IAppError))
          } else {
            dispatch(logOutOrDeletion_Success())
          }

          // dispatch(loading_end());
          // window.location.reload();
        }, dispatch, logOutOrDeletion_fail,)

        // } catch (error) {
        //   console.error('error:', error)
        //   dispatch(logOutOrDeletion_fail(error as IAppError))
        //   dispatch(loading_end());
        // }


      } else if (id === 'showListings') {
        // navigate('/listings')
      }

    } catch (error) {
      console.error('error:', error)

    }



  };



  const eventHandler_FileOnClick = () => {
    // setFile(undefined)
    setFileMsg(fileIniState)  //  file msg reset
    refFile.current?.click()
  }

  const eventHandler_fileOnChange = (e: React.ChangeEvent<HTMLInputElement> | undefined) => {

    if (e?.target.files && e?.target.files.length > 0 && e.target.files[0].type.startsWith('image/')) {

      // setFile(e.target.files[0]);
      fileUploadHandler(e.target.files[0])
    } else {
      setFileMsg(
        (state) => {
          return {
            ...state,
            error: 'Upload is cancel: Only images are allowed.'
          }
        })

    }
  };


  const fileUploadHandler = async (currentFile: File) => {
    try {
      if (currentFile.size >= 2 * 1024 * 1024) {
        setFileMsg((state) => {
          return {
            ...state,
            error: 'Error: file size exceeding the 2mb limit'
          }
        })
        return;
      }

      await firebase_fileUploadHandler({ currentFile, currentUserID: currentUser?._id, setFileMsg, dispatch });

    } catch (error) {
      console.error('fileUploadHandler | error:', error)
      setFileMsg((state) => {
        return {
          ...state,
          error: 'Error: ' + error
        }
      })
      // setFile(undefined)
    }
  }


  useEffect(() => {
    if (fileMsg.error === '' && fileMsg.downloadURL !== '') {
      // set local storage
      currentUser?._id && setAvatar_localStorage(currentUser._id, fileMsg.downloadURL)
      dispatch(profile_updateAvatar(fileMsg.downloadURL))
      // reset state
      // setFileMsg(fileIniState)
      // setFile(undefined)

    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileMsg?.downloadURL]);





  return (


    <PageContainer h1={"Profile Page"}>
      <div className="flex flex-col">

        <ul className="ul-msg" >
          {fileMsg.error && <li className="msg-err" key='fileMsg.error' >{fileMsg.error} </li>}
          {fileMsg.progress && <li className="msg-prog" key='fileMsg.progress' >{fileMsg.progress} </li>}
          {fileMsg.downloadURL && <li key='fileMsg.downloadURL'> <img src={fileMsg.downloadURL} alt='new image' /></li>}
        </ul>

        <Avatar user={currentUser}
          onClick={eventHandler_FileOnClick}
          cssClass="rounded-full self-center h-24 w-24 object-cover cursor-pointer mb-4 " />

        <SigningForm forms={eForms.profile} />
      </div>

      <ul id='ulProfile' className="my-3 gap-3" onClick={eventBabel_clickHandler}>
        <li className="border-b-2 " ><span id="showListings"> Show Listing</span> </li>
        <li className="text-right li-rtl"><span id="logOut">Log-Out</span></li>
        <li className="text-right li-rtl" ><span id="deleteAccount" >Delete Account</span></li>
      </ul>

      //  OverlayDialog
      <input type="file" ref={refFile} hidden accept="image/*" onChange={eventHandler_fileOnChange} ></input>
      {
        isDialogVisible && <ModalDialogOkCancel message={'Are you sure you want to delete your account?'}
          onOK={handleOK_dialogBox_DELETION} type="danger" isDialogVisible={isDialogVisible} setIsDialogVisible={setIsDialogVisible} />
      }

      <UpdateModal isOpen={loading} />
    </PageContainer>



  )
}