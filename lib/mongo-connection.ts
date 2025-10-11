
import mongoose, { Mongoose } from "mongoose";

const connectionToDatabase=async()=>{
    try {
      await mongoose.connect(process.env.DATABASE_URL as string)  
      console.log("connected to db")
    } catch (error) {
        console.error(error)
    }
}

export default connectionToDatabase