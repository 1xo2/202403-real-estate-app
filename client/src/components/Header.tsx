import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import Avatar from "./Avatar";
import { RootState } from "../redux/store";
import { useSelector } from "react-redux";

export default function Header() {
  const { currentUser } = useSelector((state: RootState) => state.user);
  return (
    <header className="bg-slate-200 shadow-md">
      <div className="flex justify-between items-center max-w-7xl mx-auto p-3">
        {/*  LOGO  */}
        <h1 className="font-bold text-sm ms:text-xl flex flex-wrap ">
          <Link to={"/home"}>
            <span className="text-slate-500">X:</span>
            <span className="text-slate-700">Estate</span>
          </Link>
        </h1>
        {/*  SEARCH-BOX  */}
        <form action="" className="bg-slate-100 p-3 rounded-s ">
          {/* <div className="flex justify-center items-center"> */}
          <div className="center-flex">
            <input
              id='searchBox'
              type="text"
              placeholder="Search..."
              className="w-24 sm:w-64 bg-transparent mr-2 outline-none"
            // className="w-24 sm:w-64 bg-transparent mr-2 border-r border-solid border-slate-400 outline-none"
            />
            {/* divider */}
            {/* <div className="h-7 w-1 bg-gray-300  mx-3"></div> */}
            <div className="divider"></div>
            <FaSearch className="text-slate-600 cursor-pointer "></FaSearch>
          </div>
        </form>
        {/*  LINKS  */}
        <ul className="flex gap-4 text-slate-700">
          <li className="hidden sm:inline">
            <Link to={"/home"}>Home</Link>
          </li>
          <li className="hidden sm:inline">
            <Link to={"/about"}>About</Link>
          </li>
          <li>
            <Link to={"/profile"}>
              {currentUser ? (<Avatar user={currentUser} />) : (
                'Log-In')
              }</Link>
          </li>
        </ul>


      </div>
    </header>
  );
}
