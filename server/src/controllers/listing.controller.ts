import { NextFunction, Request, Response } from "express";
import errorHandler from "../middleware/errorHandling/errorHandler";
import ListingModel, { IListingFields } from './../models/listing.model';
import { isNull_Undefined_emptyString } from "../utils/stringManipulation";

export const setListing_controller = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        // // #region -- SECURITY.

        // const userParamID_sanitized = xss(req?.params?.id)
        // console.log('userParamID_sanitized:', userParamID_sanitized)
        // console.log('req.userTokenCookie:', req.userTokenCookie)
        // if (req.userTokenCookie !== userParamID_sanitized) return next(errorHandler('Unauthenticated account owner create request', '', 401))

        // // Sanitize the req.body object using xss


        // const body_sanitized: string = xss(JSON.stringify(req.body));
        // // sanitizedBody object        
        // const listingBody: IListingFields = JSON.parse(body_sanitized) as IListingFields;
        // // #endregion

        // const listing = await ListingModel.create(listingBody);


        // getBodyParams_sanitized_verifyUser(req, res, next);

        // console.log('\n\nreq?.params:', req?.params)
        // console.log('\n\nreq.userTokenCookie:', req.userTokenCookie)
        // console.log('\n\nreq.body:', req.body,'\n\n')


        const listing = await ListingModel.create(req.body);
        res.status(200).json(listing);


    } catch (error) {
        console.error('error:', error)
        next(error);
    }
}


export const getUsrListings_controller = async (req: Request, res: Response, next: NextFunction) => {
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
export const getUsrListingById_controller = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const listingID = req?.params?.id
        // console.log('listingID:', listingID)

        if (isNull_Undefined_emptyString(listingID)) return next(errorHandler('User not found', 'N:s9f8dhh0si-us7d', 404))

        const listings = await ListingModel.findOne({
            _id: listingID,
            // FK_User: req.userTokenCookie
        })

        if (!listings) return next(errorHandler('Listing not found', 'N:fd9jsd-fa49-f', 404))
        res.status(200).json(listings)

    } catch (error) {
        console.error('error:\n', error, '\n\n')
        next(error)
    }

}
export const deleteUsrListings_controller = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // getBodyParams_sanitized_verifyUser(req, res, next)
        const userID = req.userTokenCookie
        const listingID = req.params.id;
        console.log('userID:', userID)
        console.log('listingID:', listingID)

        const listings = await ListingModel.deleteOne({ FK_User: userID, _id: listingID })

        if (listings.deletedCount === 0) {
            res.status(404).json({ message: 'Listing not found' })
        }
        return res.status(200).json({ message: 'Listing deleted successfully' })

    } catch (error) {
        console.error('error:\n', error, '\n\n')
        next(error)
    }

}
export const updateListings_controller = async (req: Request, res: Response, next: NextFunction) => {
    // console.log('\nupdateListings_controller:', req.body,'\n\n')

    try {
        const listingID = req.params.id
        const body: IListingFields = req.body
        const userID = req.userTokenCookie

        const listing = await ListingModel.findOneAndUpdate({
            _id: listingID,
            FK_User: userID
        }, body, { new: true });

        if (!listing) return next(errorHandler('Listing not found', 'not permuted: n-sd9879sdh-n-s', 404))

        res.status(200).json(listing)
    } catch (error) {
        console.error('error:\n', error, '\n\n')
        next(error)
    }
}