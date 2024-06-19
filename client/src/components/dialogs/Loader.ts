import { ActionCreatorWithPayload } from "@reduxjs/toolkit";
import { IAppError } from "../../errorHandlers/clientErrorHandler";
import { AppDispatch } from "../../redux/store";
import { general_failure, loading_end, loading_start } from "../../redux/user/userSlice";
import { toastBody } from "../../share/toast";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export async function loader(fun: () =>
    Promise<false | void | undefined>,
    dispatch: AppDispatch,
    failRedux?: ActionCreatorWithPayload<IAppError>): Promise<false | void | undefined> {

    try {
        dispatch(loading_start())
        await fun()
    } catch (error) {
        console.error('error:', error)
        const appError = error as IAppError;
        dispatch(failRedux ? failRedux(appError) : general_failure(appError));
        const errorMessage = appError.message || 'Error deleting file';
        toast.error(errorMessage, toastBody);
    } finally {
        dispatch(loading_end())
    }
}