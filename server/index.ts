import dotenv from "dotenv";
import express, { Application } from "express";
import mongoose from "mongoose";
import authRouter from "./src/routes/auth.route";
import userRouter from "./src/routes/user.route";

//For env File
dotenv.config();

mongoose
  .connect(process.env.MONGOconn as string, {
    dbName: process.env.DBname, // Specify the database name
  })
  .then(() => console.log("BD Connected!"))
  .catch((err) => {
    console.error("err:", err);
  }); 

const app: Application = express();
app.use(express.json());

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server is Fire at http://localhost:${port}`);
});

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);

// app.get("/", (req: Request, res: Response) => {
//   res.send("Welcome to Express & TypeScript Server");
// });

// const { MongoClient, ServerApiVersion } = require("mongodb");
// const uri =
//   "mongodb+srv://yanivsfreelance:36S0lj5zCC1pbXgA@realestate-cluster.qoptais.mongodb.net/?retryWrites=true&w=majority&appName=RealEstate-Cluster";

// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   },
// });

// async function run() {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     await client.connect();
//     // Send a ping to confirm a successful connection
//     await client.db("admin").command({ ping: 1 });
//     console.log(
//       "Pinged your deployment. You successfully connected to MongoDB!"
//     );
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }
// run().catch(console.dir);
