import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { IAppError } from "../errorHandlers/clientErrorHandler";
import { AppDispatch, RootState } from "../redux/store";
import {
  logIn_End,
  logIn_Start,
  login_Fail,
  login_Success,
} from "../redux/user/userSlice";
import { isNull_Undefined_emptyString } from "../utils/stringManipulation";
import OAuthGoogle from "./OAuthGoogle/OAuthGoogle";
import xss from "xss";
import { fetchHeaders } from "../share/fetchHeaders";
import { BD_fields } from "../share/enums";

type Props = { isRegister: boolean };

export default function SigningForm({ isRegister }: Props) {
  const dispatch: AppDispatch = useDispatch();
  const { loading, error, currentUser } = useSelector(
    (state: RootState) => state.user
  );

  const navigate = useNavigate();

  const [isValid, setIsValid] = useState({
    formState: {},
    isValidEmail: true,
    isValidPassword: true,
    errorMsg: "",
  });

  const onTxtChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;

    //  console.log("Input field ID:", id);
    //  console.log("Input field value:", value);

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
    // const formJson = JSON.stringify(isValid.formState);
    const sanitizedFormJson = xss(JSON.stringify(isValid.formState));
    //
    // console.log("enter: form-Submit-Handler:");
    // console.log("formJson:", formJson);
    console.log("sanitizedFormJson:", sanitizedFormJson);

    try {
      dispatch(logIn_Start());

      const apiPath = "/api/auth/" + (isRegister ? "register" : "login");
      const res = await fetch(apiPath, {
        method: "post",
        body: sanitizedFormJson,
        headers: fetchHeaders
        // body: formJson,
        // headers: {
        //   "Content-Type": "application/json",
        // },
      });
      const data = await res.json();

      if (data.success === false) {
        console.log("fetching data.status fail:", data.success);
        dispatch(login_Fail(data as IAppError));
        return;
      }

      dispatch(login_Success(data));
      console.log("fetching data.success:", data);
      console.log("-------currentUser:", currentUser);

      setTimeout(() => {
        if (isRegister) {
          navigate("../login");
        } else {
          navigate("../home");
        }
      }, 500);
      //
    } catch (error) {
      console.error("Error occurred during fetch:", error);
    } finally {
      dispatch(logIn_End());
      // console.log("finally:  currentUser?.userName;:", currentUser?.userName);
    }
  };

  return (
    <>
      <form onSubmit={formSubmitHandler} className="flex flex-col gap-4">
        <div
          onChange={onTxtChangeHandler}
          id="inputTextBox"
          className="flex flex-col gap-4"
        >
          {isRegister && (
            <input
              id="userName"
              required
              type="text"
              placeholder="User Name"
              className="border p-3 gap-4"
              maxLength={BD_fields.userName_maxlength}
            />
          )}
          <input
            id="eMail"
            data-testid="email-input"
            required
            type="email"
            placeholder="Email"
            className="border p-3 gap-4"
            maxLength={BD_fields.eMail_maxlength}
          />

          <input
            id="password"
            data-testid="password-input"
            required
            type={isRegister ? "text" : "password"}
            placeholder="Password"
            className="border p-3 gap-4"
            maxLength={10}
          />
        </div>

        {!isValid.isValidEmail && (
          <p className="text-red-500">Invalid email format</p>
        )}
        {!isValid.isValidPassword && (
          <p className="text-red-500">Invalid password length</p>
        )}
        <button
          disabled={
            loading || !isValid.isValidEmail || !isValid.isValidPassword
          }
          type="submit"
          className={`${
            loading ||
            ((!isValid.isValidEmail || !isValid.isValidPassword) &&
              "cursor-not-allowed")
          }  'focus:opacity-95 disabled:opacity-80 rounded-lg bg-slate-700 text-white p-3 uppercase'`}
        >
          {isRegister ? "Register" : "Log-In"}
          {loading && " proc..."}
          {currentUser?.userName && " ✅"}
        </button>
        <OAuthGoogle />
      </form>
      <div className=" flex gap-3 my-3 ">
        <p>Have an account?</p>
        <span className="text-blue-700">
          {isRegister ? (
            <Link to={"../login"}>Log-In</Link>
          ) : (
            <Link to={"../register"}>Register</Link>
          )}
        </span>
      </div>
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
