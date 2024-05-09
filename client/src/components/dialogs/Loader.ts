import { ActionCreatorWithPayload } from "@reduxjs/toolkit";
import { IAppError } from "../../errorHandlers/clientErrorHandler";
import { AppDispatch } from "../../redux/store";
import { general_failure, loading_end, loading_start } from "../../redux/user/userSlice";
import { toastBody } from "../../share/toast";
import { toast } from "react-toastify";


export async function loader(fun: () =>
    Promise<false | void | undefined>,
    dispatch: AppDispatch,
    failRedux?: ActionCreatorWithPayload<IAppError>): Promise<false | void | undefined> {

    try {
        dispatch(loading_start())
        await fun()
    } catch (error) {
        console.error('error:', error)
        dispatch(failRedux && failRedux(error as IAppError) || general_failure(error as IAppError))
        toast.error((error as Error).message || 'Error deleting file', toastBody)
    } finally {
        console.log('loader: finally:')
        dispatch(loading_end())
    }
    // usage
    // await loader(dispatch, async () => {})
}