import { ActionCreatorWithPayload } from "@reduxjs/toolkit";
import { IAppError } from "../../errorHandlers/clientErrorHandler";
import { AppDispatch } from "../../redux/store";
import { general_failure, loading_end, loading_start } from "../../redux/user/userSlice";


export async function loader(fun: () => Promise<void>, dispatch: AppDispatch, failRedux: ActionCreatorWithPayload<IAppError>) {
    try {
        dispatch(loading_start())
        await fun()
    } catch (error) {
        console.error('error:', error)
        dispatch(failRedux && failRedux(error as IAppError) || general_failure(error as IAppError))
    } finally {
        console.log('loader: finally:')
        dispatch(loading_end())
    }
    // usage
    // await loader(dispatch, async () => {})
}