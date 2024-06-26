import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { FaGoogle } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AppDispatch } from "../../../redux/store";
import { login_Success } from "../../../redux/user/userSlice";
import { apiManager } from "../../../share/apiManager";
import { update_localStorage } from "../../../utils/localStorageManager";
import { app } from "./firebase";

export default function OAuthGoogle() {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();

  const googleSigning = async () => {
    try {
      //
      const provider = new GoogleAuthProvider(),
        auth = getAuth(app),
        result = await signInWithPopup(auth, provider),

        { data } = await apiManager({
          urlPath: "/api/auth/google",
          apiParam: {
            userName: result.user.displayName,
            eMail: result.user.email,
            userPhoto: result.user.photoURL,
          },
          httpMethod: 'post',
        });



      dispatch(login_Success({ ...data, userPhoto: result.user.photoURL, source: 'google' }));


      if (data._id && result.user.photoURL)
        update_localStorage({ _id: data._id, key: "Avatar", value: result.user.photoURL, isArray: false });


      navigate('/home')
      //
    } catch (error) {
      console.error("error: \nCould not sign in with google", error);
    }
  };

  return (
    <button
      onClick={googleSigning}
      type="button"
      className="bg-red-700 text-white rounded-lg p-3 uppercase hover:opacity-95 relative"
    >
      continue with google
      <FaGoogle className='btnIco' />
    </button>
  );
}
