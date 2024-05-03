import ListingModel, { IListingFields } from './../models/listing.model';
import { NextFunction, Request, Response } from "express";
import xss from "xss";
import errorHandler from "../middleware/errorHandling/errorHandler";
import { ISanitizedUser, IUserResponse } from "../../typings/userTypes";


export const listing_controller = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        //#region -- SECURITY.
        
        // const userParamID_sanitized = xss(req?.params?.id)
        // console.log('userParamID_sanitized:', userParamID_sanitized)
        // console.log('req.userTokenCookie:', req.userTokenCookie)
        // if (req.userTokenCookie !== userParamID_sanitized) return next(errorHandler('Unauthenticated account owner create request', '', 401))

        // Sanitize the req.body object using xss
        const body_sanitized: string = xss(JSON.stringify(req.body));
        // sanitizedBody object        
        const listingBody: IListingFields = JSON.parse(body_sanitized) as IListingFields;
        //#endregion

        const listing = await ListingModel.create(listingBody);
        res.status(200).json(listing);




    } catch (error) {
        console.error('error:', error)
        next(error);
    }


}