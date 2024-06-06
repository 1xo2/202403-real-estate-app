import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { RootState } from "../redux/store";
import Avatar from "./Avatar";

export default function Header() {
  const { currentUser } = useSelector((state: RootState) => state.user);
  const [searchTerm, setSearchTerm] = useState('')
  const _SEARCH_TERM = 'searchTerm';
  const navigate = useNavigate();

  
  const formSubmit_eh = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    

    const urlParams = new URLSearchParams(location.search)
    urlParams.set(_SEARCH_TERM, searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`)
  }


  const searchChange_eh = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }


  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const searchTermFromUrl = urlParams.get(_SEARCH_TERM);
    if (searchTermFromUrl)
      setSearchTerm(searchTermFromUrl)

  }, [location.search])


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
        <form onSubmit={formSubmit_eh} action="" className="bg-slate-100 p-3 rounded-s ">
          {/* <div className="flex justify-center items-center"> */}
          <div className="center-flex">
            <input
              value={searchTerm}
              onChange={searchChange_eh}
              id='searchBox'
              type="text"
              placeholder="Search..."
              className="w-24 sm:w-64 bg-transparent mr-2 outline-none"
            />
            {/* divider */}
            <div className="divider"></div>
            <button type="submit" title='search' >
              <FaSearch className="text-slate-600 cursor-pointer "></FaSearch>
            </button>
          </div>
        </form>
        {/*  LINKS  */}
        {/* <img src="https://lh3.googleusercontent.com/a/ACg8ocLkzlDHeo-03Ix4_leXK9_IJQ08tLJGpfJJcQy8E4vnu775pQ=s96-c" alt="xxx" /> */}
        <ul className="flex gap-4 text-slate-700">
          <li className="hidden sm:inline">
            <Link to={"/home"}>Home</Link>
          </li>
          <li className="hidden sm:inline">
            <Link to={"/about"}>About</Link>
          </li>
          <li>
            {/* its point to profile and profile will redirect to login if not auth */}
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
