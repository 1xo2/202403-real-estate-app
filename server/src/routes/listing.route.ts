import express from 'express';
import { getUsrListings, listing_controller } from '../controllers/listing.controller';
import { verifyUser_byCookie } from '../utils/verifyUser';


const listingRouter = express.Router();

listingRouter.post('/create',verifyUser_byCookie, listing_controller) 
listingRouter.get("/list/:id", verifyUser_byCookie, getUsrListings);

export default listingRouter