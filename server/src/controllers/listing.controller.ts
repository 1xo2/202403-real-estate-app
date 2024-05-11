import { NextFunction, Request, Response } from "express";
import errorHandler from "../middleware/errorHandling/errorHandler";
import ListingModel from './../models/listing.model';

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
        

        // const body_sanitized: string = xss(JSON.stringify(req.body));
        // // sanitizedBody object        
        // const listingBody: IListingFields = JSON.parse(body_sanitized) as IListingFields;
        //#endregion

        // const listing = await ListingModel.create(listingBody);


        // getBodyParams_sanitized_verifyUser(req, res, next);

        const listing = await ListingModel.create(req.body);
        res.status(200).json(listing);


    } catch (error) {
        console.error('error:', error)
        next(error);
    }
}


export const getUsrListings = async (req: Request, res: Response, next: NextFunction) => {
    try {

        // getBodyParams_sanitized_verifyUser(req, res, next)
        // const userParamID_sanitized = xss(req?.params?.id)
        // if (userParamID_sanitized !== req.userTokenCookie) return next(errorHandler(__SERVER_ERROR_UNAUTHORIZED, 'n: sd-sfk-kl36', 401))

        const listings = await ListingModel.find({ FK_User: req?.params?.id })
        

        if (!listings) return next(errorHandler('User not found', '', 404))
        res.status(200).json(listings)

    } catch (error) {
        console.error('error:\n', error, '\n\n')
        next(error)
    }

}
export const deleteUsrListings = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // getBodyParams_sanitized_verifyUser(req, res, next)
        const userID = req.userTokenCookie
        const listingID = req.params.id;

        const listings = await ListingModel.deleteOne({ FK_User: userID, _id: listingID })

        if (listings.deletedCount === 0) {
            res.status(404).json({ message: 'Listing not found' })
        }
        res.status(200).json({ message: 'Listing deleted successfully' })

    } catch (error) {
        console.error('error:\n', error, '\n\n')
        next(error)
    }

}
