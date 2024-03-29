import mongoose from "mongoose";

const connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGOconn as string, {
      dbName: process.env.DBname, // Specify the database name
    });
    console.log("Database connected successfully!");
    // console.log("DB conn OK!");
  } catch (error) {
    console.error("Error connecting to database:", error);
  }
};

export { connectToDatabase };
// mongoose
//   .connect(process.env.MONGOconn as string, {
//     dbName: process.env.DBname, // Specify the database name
//   })
//   .then(() => console.log("BD Connected!"))
//   .catch((err) => {
//     console.error("err:", err);
//   });
