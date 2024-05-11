import mongoose from "mongoose";
import { isNull_Undefined_emptyString } from "../utils/stringManipulation";
import  envManager  from "../middleware/envManager";




// By implementing graceful shutdown in this manner, your Express.js application ensures that it handles database connections properly when shutting down, reducing the risk of data corruption or resource leaks.
const gracefulShutdown = async () => {
  try {
    await mongoose.disconnect();
    console.log("\n-- DB connection closed gracefully.");
    process.exit(0); // Exit the process with success code
  } catch (error) {
    console.error("Error closing database connection:", error);
    process.exit(1); // Exit the process with failure code
  }
};

// db connection
const connectToDatabase = async () => {
  try {

    await mongoose.connect(envManager.mongoConn as string, {
      dbName: envManager.DBName, // Specify the database name
    });
    console.log("-- DB connected successfully!\n\r");


    // SIGINT: Signal Interrupt. This signal is sent to the process when the user presses Ctrl+C or sends a SIGINT signal to the process. It is used to gracefully stop a running application or server from the command line.
  
    // Graceful shutdown: Close MongoDB connection when the process exits
    process.on('SIGINT', async () => {
      await gracefulShutdown();
    });

    // Graceful shutdown: Close MongoDB connection on uncaught exceptions
    process.on('uncaughtException', async (error) => {
      console.error("Uncaught exception:", error);
      await gracefulShutdown();
    });

    // Graceful shutdown: Close MongoDB connection on unhandled promise rejections
    process.on('unhandledRejection', async (reason, promise) => {
      console.error("Unhandled promise rejection:", reason);
      await gracefulShutdown();
    });




    // // Graceful shutdown.
    // // Handle SIGINT signal.
    // process.on('SIGINT', async () => {  
    //   // By implementing graceful shutdown in this manner, your Express.js application ensures that it handles database connections properly when shutting down, reducing the risk of data corruption or resource leaks.
    //   try {
    //     await mongoose.disconnect();
    //     console.log("-- DB connection closed gracefully");
    //     process.exit(0); // Exit the process with success code
    //   } catch (error) {
    //     console.error("Error closing database connection:", error);
    //     process.exit(1); // Exit the process with failure code
    //   }
    // });

  } catch (error) {
    console.error("Error connecting to database:", error);
  }
};

export { connectToDatabase };
