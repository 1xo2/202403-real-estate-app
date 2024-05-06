import Header from "./components/Header";
import PrivateRoute from "./components/auth/PrivateRoute";
import AboutPage from "./pages/AboutPage";
import HomePage from "./pages/HomePage";
import LogInPage from "./pages/LogInPage";
import ProfilePage from "./pages/ProfilePage";
import RegisterPage from "./pages/RegisterPage";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import CreateListingPage from "./pages/listing/CreateListingPage/CreateListingPage";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/login" element={<LogInPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route element={<PrivateRoute />} >
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/listings-create" element={<CreateListingPage />} />
        </Route>
      </Routes>
        <ToastContainer />
      {/* <ModalDialog_PortalRendering_OkCancel /> */}
    </BrowserRouter>
  );
}

export default App;
