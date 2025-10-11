import User from "../../../models/user"
import connectionToDatabase from "../../../lib/mongo-connection"
import { NextResponse } from "next/server"


export async function GET() {
     
    try {
         await connectionToDatabase()
        const users=await User.find()
        return NextResponse.json(users)
    } catch (error) {
        console.log('Error fetching users', error)
        return NextResponse.json({error:"Failed to fecth users"}, {status:500})
    }
}






export async function POST(req:Request) {
    
    try {
        await connectionToDatabase()
        const {email, name, age}:{email:string, name:string, age:number}=await req.json()
     

        if(!email || !name || age <1){
        //  console.log("age", age)
        
        return NextResponse.json({error:"Missing details"}, {status:400})
        }

        const newUser=new User({name,email, age})
        //    console.log("newUser", newUser)
        await newUser.save()
         
        return NextResponse.json({newUser}, {status:201})
    } catch (error) {
        console.log('Error Posting user', error)
        return NextResponse.json({error:"Failed to Posting user"}, {status:500})
    }
}