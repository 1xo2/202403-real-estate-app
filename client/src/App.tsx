import Header from "./components/Header";
import PrivateRoute from "./components/auth/PrivateRoute";
// import AboutPage from "./pages/AboutPage";
// import HomePage from './pages/home/HomePage.1';
// import LogInPage from "./pages/LogInPage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
// import RegisterPage from "./pages/RegisterPage";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
// import ListingPage from "./pages/listing/ListingPage";
// import ListingView from "./pages/listing/ListingView";
// import SearchPage from "./pages/SearchPage/SearchPage";
import { Suspense, lazy } from "react";
import HomePage from "./pages/home/HomePage";


function App() {
  const LogInPage = lazy(() => import("./pages/LogInPage"));
  const RegisterPage = lazy(() => import("./pages/RegisterPage"));
  const AboutPage = lazy(() => import("./pages/about/AboutPage"));
  const ListingView = lazy(() => import("./pages/listing/ListingView"));
  const ListingPage = lazy(() => import("./pages/listing/ListingPage"));
  const SearchPage = lazy(() => import("./pages/SearchPage/SearchPage"));
  
  return (
    <BrowserRouter>
      <Header />
      <Suspense fallback={<h1>Loading...</h1>}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/listing-view/:listingId" element={<ListingView />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/login" element={<LogInPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route element={<PrivateRoute />} >
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/listings-edit/:listingId" element={<ListingPage isCreate={false} />} />
            <Route path="/listings-create" element={<ListingPage isCreate={true} />} />
          </Route>
        </Routes>
      </Suspense>
      <ToastContainer />
      {/* <ModalDialog_PortalRendering_OkCancel /> */}
    </BrowserRouter>
  );
}

export default App;
