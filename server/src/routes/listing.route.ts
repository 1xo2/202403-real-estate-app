import express from 'express';
import { deleteUsrListings, getUsrListings, listing_controller } from '../controllers/listing.controller';
import { verifyUser_byCookie } from '../utils/verifyUser';


const listingRouter = express.Router();

listingRouter.post('/create',verifyUser_byCookie, listing_controller) 
listingRouter.get("/list/:id", verifyUser_byCookie, getUsrListings);
listingRouter.delete("/delete/:id", verifyUser_byCookie, deleteUsrListings);

export default listingRouter