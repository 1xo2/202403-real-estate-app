import express from 'express';
import { listing_controller } from '../controllers/listing.controller';
import { verifyUser_byCookie } from '../utils/verifyUser';


const listingRouter = express.Router();

listingRouter.post('/create',verifyUser_byCookie, listing_controller) 


export default listingRouter