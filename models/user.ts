
import mongoose, { Mongoose } from "mongoose";

const userSchema=new mongoose.Schema({
    name:{type:String},
    email:{type:String, required:true},
    age:{type:Number}
})

const User=mongoose.models.User || mongoose.model("User", userSchema)

export default User