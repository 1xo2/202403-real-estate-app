import express from 'express';
import { deleteUsrListings_controller, getUsrListingById_controller, getUsrListings_controller, setListing_controller, updateListings_controller } from '../controllers/listing.controller';
import { verifyUser_byCookie } from '../utils/verifyUser';


const listingRouter = express.Router();

listingRouter.post('/create',verifyUser_byCookie, setListing_controller) 
listingRouter.post('/update/:id', verifyUser_byCookie, updateListings_controller) 
listingRouter.get("/list/:id", verifyUser_byCookie, getUsrListings_controller);
listingRouter.get("/single/:id", verifyUser_byCookie, getUsrListingById_controller);
listingRouter.delete("/delete/:id", verifyUser_byCookie, deleteUsrListings_controller);

export default listingRouter