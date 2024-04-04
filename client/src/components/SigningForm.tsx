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
    errorMsg: "",
  });

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
    }
    console.log("formState:", isValid.formState);
  };

  const unitTestingEnvironment =
    process.env.NODE_ENV === "test" && "http://localhost:8000";
  console.log("unitTestingEnvironment:", unitTestingEnvironment);

  const formSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formJson = JSON.stringify(isValid.formState);
    console.log("formJson:", formJson);

    try {
      dispatch(logIn_Start());

      const unitTestingEnvironment =
        process.env.NODE_ENV === "test" ? "http://localhost:8000" : "";

      const apiPath = "/api/auth/" + (isRegister ? "register" : "login");
      const res = await fetch(unitTestingEnvironment + apiPath, {
        method: "post",
        body: formJson,
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();

      if (data.success === false) {
        dispatch(login_Fail(data as IAppError));
        return;
      }

      dispatch(login_Success(data));

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
            />
          )}
          <input
            id="eMail"
            required
            type="text"
            placeholder="Email"
            className="border p-3 gap-4"
          />

          <input
            id="password"
            required
            type={isRegister ? "text" : "password"}
            placeholder="Password"
            className="border p-3 gap-4"
          />
        </div>

        {!isValid.isValidEmail && (
          <p className="text-red-500">Invalid email format</p>
        )}
        <button
          disabled={loading || !isValid.isValidEmail}
          type="submit"
          className={`${
            loading || (!isValid.isValidEmail && "cursor-not-allowed")
          }  'focus:opacity-95 disabled:opacity-80 rounded-lg bg-slate-700 text-white p-3 uppercase'`}
        >
          {isRegister ? "Register" : "Log-In"}
          {loading && " proc..."}
          {currentUser?.userName && " ✅"}
        </button>
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
    </>
  );
}
