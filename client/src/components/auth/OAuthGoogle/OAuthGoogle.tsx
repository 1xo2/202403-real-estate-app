import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "./firebase";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../redux/store";
import { login_Success } from "../../../redux/user/userSlice";
import { fetchHeaders } from "../../../share/fetchHeaders";
import { useNavigate } from "react-router-dom";

export default function OAuthGoogle() {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();

  const googleSigning = async () => {
    try {
      //
      const provider = new GoogleAuthProvider(),
        auth = getAuth(app),
        result = await signInWithPopup(auth, provider),
        res = await fetch("/api/auth/google", {
          method: "POST",
          headers: fetchHeaders,
          body: JSON.stringify({
            userName: result.user.displayName,
            eMail: result.user.email,
            userPhoto: result.user.photoURL,
          }),
        });
      //
      const data = await res.json();
      console.log("google data:", data);
      dispatch(login_Success({ ...data, userPhoto: result.user.photoURL }));

      localStorage.setItem("userImg", JSON.stringify({
        eMail: result.user.email,
        userPhoto: result.user.photoURL,
      }));

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
      className="bg-red-700 text-white rounded-lg p-3 uppercase hover:opacity-95"
    >
      continue with google
    </button>
  );
}
