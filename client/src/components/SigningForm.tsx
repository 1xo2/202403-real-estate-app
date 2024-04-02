import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

type Props = { isRegister: boolean };

export default function SigningForm({ isRegister }: Props) {
  const [formState, setFormState] = useState({});
  const navigate = useNavigate();

  const [isValid, setIsValid] = useState({
    isLoading: false,
    isLogInOK: false,
    isValidEmail: true,
    errorMsg: "",
  });

  const onTxtChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState((prevState) => {
      return {
        ...prevState,
        [e.target.id]: e.target.value,
      };
    });

    if (e.target.id === "eMail") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      // setIsValidEmail(emailRegex.test(e.target.value));
      setIsValid((prevState) => ({
        ...prevState,
        isValidEmail: emailRegex.test(e.target.value),
      }));
    }

    console.log("formState:", formState);
  };

  const formSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formJson = JSON.stringify(formState);
    console.log("formJson:", formJson);
    try {
      setIsValid((prev) => ({
        ...prev,
        isLoading: true,
      }));

      const unitTestingEnvironment =
        process.env.NODE_ENV === "test" && "http://localhost:8000";
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
        setIsValid((prev) => ({
          ...prev,
          errorMsg: data.msg,
        }));

        return;
      }

      setIsValid((prev) => ({
        ...prev,
        isLogInOK: true,
        errorMsg: "",
      }));

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
      setIsValid((prev) => ({
        ...prev,
        isLoading: false,
      }));
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
        {/* {!isValidEmail && <p className="text-red-500">Invalid email format</p>} */}
        {!isValid.isValidEmail && (
          <p className="text-red-500">Invalid email format</p>
        )}
        <button
          disabled={isValid.isLoading || !isValid.isValidEmail}
          type="submit"
          className={`${
            isValid.isLoading || (!isValid.isValidEmail && "cursor-not-allowed")
          }  'focus:opacity-95 disabled:opacity-80 rounded-lg bg-slate-700 text-white p-3 uppercase'`}
        >
          {isRegister ? "Register" : "Log-In"}
          {isValid.isLoading && " proc..."}
          {isValid.isLogInOK && " ✅"}
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
      {isValid.errorMsg !== "" && (
        <p className="text-red-700 p-3 border-l-4 border-red-700 ">
          {isValid.errorMsg}
        </p>
      )}
    </>
  );
}
