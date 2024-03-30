
// type Props = {};
// {}: Props


import { Link } from "react-router-dom";

export default function SignInPage() {
  return (
    <div className="mx-auto p-3 max-w-lg">
      <h1 className="text-center text-3xl my-10">SignIn</h1>
      <form className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="User Name"
          className="border p-3 gap-4"
        />
        <input type="text" placeholder="Email" className="border p-3 gap-4" />
        <input
          type="text"
          placeholder="Password"
          className="border p-3 gap-4"
        />
        <button
          type="button"
          className="focus:opacity-95 disabled:opacity-80 rounded-lg bg-slate-700 text-white p-3 uppercase"
        >
          Sign-In
        </button>
      </form>
      <div className=" flex gap-3 my-3 ">
        <p>Have an account?</p>
        <span className="text-blue-700">
          <Link to={"./RegisterPage"}>Register</Link>
        </span>
      </div>
    </div>
  );
}
