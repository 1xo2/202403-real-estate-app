import express, { NextFunction } from 'express';
import { Router, Request, Response } from 'express';
import { ParsedQs } from 'qs';
import ListingModel from '../../models/listing.model';

const publicRouter = express.Router();

function parseQueryParameter(value: string | undefined, trueValue: any, falseValue: any): any {
    if (value === undefined || value === 'false') {
        return { $in: [false, true] };
    } else if (value === 'true') {
        return trueValue;
    } else {
        return falseValue;
    }
}

publicRouter.get('/search', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const orderBy = req.query.sort as string || 'createdAt';
        const ascending = 1;
        const limit = parseInt(req.query.limit as string) || 9;
        const page = parseInt(req.query.page as string) || 1;
        const startIndex = (page - 1) * limit;

        let listingQuery: { [key: string]: any } = {};

        listingQuery.offer = parseQueryParameter(req.query.offer as string, true, false);
        listingQuery.furnished = parseQueryParameter(req.query.furnished as string, true, false);
        listingQuery.parking = parseQueryParameter(req.query.parking as string, true, false);
        // to select both rent and sale -> kip it false or undefined
        listingQuery.type = parseQueryParameter(req.query.type as string, { $in: ['rent', 'sale'] }, req.query.type);


        
        const searchTerm = req.query.search as string || '';
        if (searchTerm) {
            const regex = new RegExp(searchTerm, 'i');
            listingQuery.$or = [
                { name: regex },
                { description: regex },
                { address: regex },
            ];
        }

        const listings =
            await ListingModel.find(listingQuery)
                .sort({ [orderBy]: ascending })
                .limit(limit)
                .skip(startIndex);



        return res.status(200).json(listings);
    } catch (error) {
        console.error('error:', error);
        next(error);
    }
});

export default publicRouter;