
import Avatar from "../components/Avatar";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import PageContainer from "../components/PageContainer";
import SigningForm from "../components/SigningForm";
import { eForms } from "../share/enums";
import { useEffect, useRef, useState } from "react";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { app } from "../components/auth/OAuthGoogle/firebase";
import '../pages/ProfilePage.css'

export default function ProfilePage() {
  const { currentUser } = useSelector((state: RootState) => state.user);
  const refFile = useRef<HTMLInputElement>(null)

  const fileIniState = { error: '', progress: '', downloadURL: '' }
  const [fileMsg, setFileMsg] = useState(fileIniState)
  const [file, setFile] = useState<File | undefined>(undefined);


  const eventHandler_FileOnClick = () => {
    setFile(undefined)
    setFileMsg(fileIniState)  //  file msg reset
    refFile.current?.click()
  }

  const eventHandler_fileOnChange = (e: React.ChangeEvent<HTMLInputElement> | undefined) => {

    if (e?.target.files && e?.target.files.length > 0 && e.target.files[0].type.startsWith('image/')) {

      setFile(e.target.files[0]);      
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


  const fileUploadHandler = (currentFile: File) => {
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

      const
        storage = getStorage(app),               
        fileName = (`${currentFile.name.split('.')[0]}_${new Date().getTime()}.${currentFile.name.split('.')[1]}`).replace(/\s+/g, '_'),
        storageRef = ref(storage, 'theFolder/'+fileName),
        uploadTask = uploadBytesResumable(storageRef, currentFile);
        console.log('storage:', storage)


      uploadTask.on('state_changed', (snapshot) => {
        const prog = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        console.log('Upload Progress:', prog.toFixed(0) + '%');

        setFileMsg((state) => {
          return {
            ...state,
            progress: 'Upload Progress: ' + prog.toFixed(0) + '%'
          }
        })
      }, (err) => {
        console.log('error:', err)

        setFileMsg((state) => {
          return {
            ...state,
            error: 'Error: ' + err.message
          }
        })
        setFile(undefined)
      }, () => {

        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFileMsg((state) => {
            return {
              ...state,
              downloadURL
            }
          })
        }).catch((error) => {
          console.error('Firebase Storage Error:', error);
          setFileMsg((state) => ({
            ...state,
            error: 'Error: ' + error.message  // Include the error message in the state
          }));
        });

      });

    } catch (error) {
      console.error('fileUploadHandler | error:', error)
      setFileMsg((state) => {
        return {
          ...state,
          error: 'Error: ' + error
        }
      })
      setFile(undefined)
    }
  }

  useEffect(() => {
    console.log('useEffect:')
    file && fileUploadHandler(file)
  }, [file])


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
      <input type="file" ref={refFile} hidden accept="image/*" onChange={eventHandler_fileOnChange} ></input>
    </PageContainer>



  )
}