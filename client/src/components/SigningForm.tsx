import React, { useEffect, useState } from "react";
import { IoCloudDone, IoEye, IoShieldCheckmarkSharp } from "react-icons/io5";
import { MdRemoveDone } from "react-icons/md";
import { RxEyeClosed } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import xss from "xss";
import { IAppError } from "../errorHandlers/clientErrorHandler";
import { AppDispatch, RootState } from "../redux/store";
import {
  logIn_End,
  logIn_Start,
  login_Fail,
  login_Success,
} from "../redux/user/userSlice";
import { eBD_fields, eForms } from "../share/enums";
import { fetchHeaders } from "../share/fetchHeaders";
import { isNull_Undefined_emptyString } from "../utils/stringManipulation";
import OAuthGoogle from "./auth/OAuthGoogle/OAuthGoogle";

type Props = { forms: eForms };

export default function SigningForm({ forms }: Props) {
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const { loading, error, currentUser } = useSelector(
    (state: RootState) => state.user
  );
  // const refEmail = useRef<HTMLInputElement | null>(null);
  // const refPassword = useRef<HTMLInputElement | null>(null);
  // const refUserName = useRef<HTMLInputElement | null>(null);

  // form validations //
  const [isValid, setIsValid] = useState({
    formState: {},
    isValidEmail: true,
    isValidPassword: true,
    errorMsg: "",
  });

  // form looks //
  const resetFormLooks = {
    passwordVisible: false,
    execStatus: null,
  }
  const [formLooks, setFormLooks] =
    useState<{ passwordVisible: boolean, execStatus: null | 'Success' | 'Fail' }>(resetFormLooks);


  const onTxtChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;



    setIsValid((prevState) => ({
      ...prevState,
      formState: { ...prevState.formState, [id]: value },
    }));

    if (id === "eMail") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setIsValid((prevState) => ({
        ...prevState,
        isValidEmail: emailRegex.test(value),
      }));
    } else if (id === "password") {
      setIsValid((prevState) => ({
        ...prevState,
        isValidPassword: value.length > 4,
      }));
    }

    console.log("formState:", isValid.formState);
  };

  const formSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const sanitizedFormJson = xss(JSON.stringify(isValid.formState));


    // need to test if default value of 3-party will not raise onChange event: so no value, then use the below code:

    // const sanitizedFormJson2 = xss(JSON.stringify({
    //   userName: refUserName.current?.value,
    //   password: refPassword.current?.value,
    //   eMail: refEmail.current?.value ||''
    // }));
    // console.log('sanitizedFormJson--2:', sanitizedFormJson2)

    try {


      dispatch(logIn_Start());

      const apiPath = forms === eForms.profile ? (`/api/user/update/${currentUser?._id}`) : ("/api/auth/" + forms);
      const res = await fetch(apiPath, {
        method: "post",
        body: sanitizedFormJson,
        headers: fetchHeaders
      });
      const data = await res.json();

      if (data.success === false) {
        console.log("fetching data.status fail:", data.message);
        dispatch(login_Fail(data as IAppError));
        return;
      }

      dispatch(login_Success(data));
      setFormLooks((prev) => ({ ...prev, execStatus: 'Success' }));

      console.log("fetching data.success:", data);
      console.log("-------currentUser:", currentUser);

      setTimeout(() => {
        if (forms === eForms.register) {
          navigate("../login");
        } else if (forms === eForms.login) {
          navigate("../home");
        }
      }, 500);
      //
    } catch (error) {
      console.error("Error occurred during fetch:", error);
      dispatch(login_Fail({ msg: 'Error occurred during fetch' }));
      setFormLooks((prev) => ({ ...prev, execStatus: 'Fail' }));
    } finally {
      dispatch(logIn_End());
    }
  };


  const togglePasswordVisibility = () => {
    setFormLooks((prev) => ({ ...prev, passwordVisible: !prev.passwordVisible }));
  };
  const disableFormChildren = (shouldDisable: boolean) => {
    const form = document.getElementById('formProfile');
    if (form) {
      const elements = form.querySelectorAll('input, select, textarea, button:not(#btnSelectListing)');
      elements.forEach(element => {
        // Type assertion to HTMLInputElement to access disabled property
        (element as HTMLInputElement).disabled = shouldDisable;
        (element as HTMLInputElement).style.cursor = 'no-drop';
      });
    }
  };

  useEffect(() => {

    if (forms === eForms.profile && currentUser?.source === 'google') {
      disableFormChildren(true);
      setIsValid((pre) => ({ ...pre, errorMsg: 'cant update google profile' }));
    }

  }, [currentUser, forms]);


  return (
    <>
      <ul className="ul-msg" >
        {isValid.errorMsg && <li className="msg-err" key='fileMsg.error' >{isValid.errorMsg} </li>}
      </ul>
      <form id='formProfile' onSubmit={formSubmitHandler} className="flex flex-col gap-4">
        <div
          onChange={onTxtChangeHandler}
          id="inputTextBox"
          className="flex flex-col gap-4"
        >
          {(forms === eForms.register || forms === eForms.profile) && (
            <input
              id="userName"
              required
              type="text"
              placeholder="User Name"
              className="border p-3 gap-4"
              maxLength={eBD_fields.userName_maxlength}
              defaultValue={currentUser?.userName}
            // ref={refUserName}            
            />
          )}
          <input
            id="eMail"
            data-testid="email-input"
            required
            type="email"
            placeholder="Email"
            className="border p-3 gap-4"
            maxLength={eBD_fields.eMail_maxlength}
            defaultValue={currentUser?.eMail}
          // ref={refEmail}
          />
          {/* password */}
          <div className="relative flex items-center">
            <input
              id="password"
              data-testid="password-input"
              {...(forms === eForms.register ? { required: true } : {})}
              type={formLooks.passwordVisible ? "text" : "password"}
              placeholder="Password"
              className="border p-3 gap-4 w-full"
              maxLength={10}
            // ref={refPassword}
            />
            {formLooks.passwordVisible ? (
              <IoEye
                className="absolute right-7 cursor-pointer"
                onMouseDown={togglePasswordVisibility}
              />
            ) : (
              <RxEyeClosed
                className="absolute right-7 cursor-pointer"
                onMouseDown={togglePasswordVisibility}
              />
            )}
          </div>

        </div>
        {/* USER MESSAGE */}
        {!isValid.isValidEmail && (
          <p className="text-red-500">Invalid email format</p>
        )}
        {!isValid.isValidPassword && (
          <p className="text-red-500">Invalid password length</p>
        )}

        {/* BTN reg/log/ update */}
        <button
          disabled={loading || !isValid.isValidEmail || !isValid.isValidPassword}
          type="submit"
          className={`${loading || ((!isValid.isValidEmail || !isValid.isValidPassword) && "cursor-not-allowed")}  
           bg-slate-700 btnBig `}>

          {/* button text */}
          {/* {forms} */}
          {loading ? 'LOADING...' : forms}
          {/* button ico */}
          {forms === eForms.profile && formLooks.execStatus === 'Success' && <IoCloudDone className='btnIco' />}
          {forms === eForms.profile && formLooks.execStatus === 'Fail' && <MdRemoveDone className='btnIco' />}
          {currentUser?.userName && forms !== eForms.profile && <IoShieldCheckmarkSharp className='btnIco' />}
        </button>

        {/* BTN Create listing */}
        {(forms === eForms.register || forms === eForms.login) ? <OAuthGoogle /> : (
          <Link to={'../listings-create'} id='btnSelectListing'           
            className="btnBig bg-green-800 hover:no-underline" type="button" >create listings</Link>
        )}
      </form>


      {/* LINKS */}
      {forms !== eForms.profile && (
        <div className=" flex gap-3 my-3 ">
          <p>Have an account?</p>
          <span className="text-blue-700">

            {forms === eForms.register ? (
              <Link to={"../login"}>Log-In</Link>
            ) : (
              <Link to={"../register"}>Register</Link>
            )}
          </span>
        </div>
      )}
      {!isNull_Undefined_emptyString(error?.msg) && (
        <p className="text-red-700 p-3 border-l-4 border-red-700 ">
          {error?.msg}
        </p>
      )}
      {/* loading:{loading || "non"}
      error:{error || "non"} */}
      {/* currentUser: {currentUser?.userName || "non"} */}
    </>
  );
}
