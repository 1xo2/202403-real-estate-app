import { Bounce, ToastPosition } from 'react-toastify';


// import 'react-toastify/dist/ReactToastify.css';
// import { toastBody } from '../../../share/toast';
//            <ToastContainer />
// Type: info, success, warning, error, default
export type ToastType = 'info' | 'success' | 'warning' | 'error' | 'default';
export const toastBody = {
    position: 'bottom-left' as ToastPosition,
    autoClose: 5000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    // theme: "light",
    theme: "colored",
    transition: Bounce,
};
