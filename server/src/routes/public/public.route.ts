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
        const sortBy = req.query.sort as string || 'createdAt';        
        const order = req.query.order === 'Descending' ? -1 : 1;
        const limit = parseInt(req.query.limit as string) || 9;
        const page = parseInt(req.query.page as string) || 1;
        const startIndex = (page - 1) * limit;

        let listingQuery: { [key: string]: any } = {};

        if (req.query.offer !== undefined) {
            listingQuery.offer = parseQueryParameter(req.query.offer as string, true, false);
        }
        if (req.query.furnished !== undefined) {
            listingQuery.furnished = parseQueryParameter(req.query.furnished as string, true, false);
        }
        if (req.query.parking !== undefined) {
            listingQuery.parking = parseQueryParameter(req.query.parking as string, true, false);
        }
        if (req.query.type !== undefined) {
            // to select both rent and sale -> kip it false or undefined
            listingQuery.type = parseQueryParameter(req.query.type as string, { $in: ['rent', 'sale'] }, req.query.type);
        }



        
        // const search = req.query.search as string || '';
        console.log('req.query:', req.query)
        const searchTerm = req.query.searchTerm as string || '';
        
        if (searchTerm) {
            const regex = new RegExp(searchTerm, 'i');
            listingQuery.$or = [
                { name: regex },
                { description: regex },
                { address: regex },
            ];            
        }

        console.log('listingQuery:', listingQuery)
         const listings =
            await ListingModel.find(listingQuery)                             
                .sort({ [sortBy]: order }) 
                .limit(limit)
                .skip(startIndex);

        // await ListingModel.find({ $or: [{ name: /island/i }, { description: /island/i }, { address: /island/i }] })


        return res.status(200).json(listings);
    } catch (error) {
        console.error('error:', error);
        next(error);
    }
});

export default publicRouter;