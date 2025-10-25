"use server"

import { auth, ErrorCode } from "@/lib/auth"
import { APIError } from "better-auth"
import { headers } from "next/headers"



export async function SignUp({email, password, name}:{email:string, password:string, name:string}) {

    if(!name.trim()) return {error:"Please provide us name"}
    if(!email) return {error:"Email is required"}
    if(!password.trim()) return {error:"Password mus be provided"}

    try {
        const user=await auth.api.signUpEmail({
        body:{
            name,
            email,
            password
        }
    })

   return {error:null}
    } catch (err) {
        if(err instanceof APIError){
            const apirErr=err.body?(err.body.code as ErrorCode):"UNKOWN"

            switch (apirErr){
                default:
                    return {error:err.message}
            }


        }

        return {error:"Server internal Error"}
    }
      
  
}

export const signInWithEmail=async({email, password}:{email:string, password:string})=>{
     if(!email) return {error:"Email is required"}
    if(!password.trim()) return {error:"Password mus be provided"}

    try {
        

        const user=await auth.api.signInEmail({
            body:{
                email,
                password
            }

            
        })

        return {error:null}


    } catch (err) {
        if(err instanceof APIError){
            const apirErr=err.body?(err.body.code as ErrorCode):"UNKOWN"

            switch(apirErr){
                default:
                    return{error:err.message}
            }


        }

        return {error:"Enternal server error"}
    }
}


  export const getUserInfo = async () => {
    const headersList=await headers()

  try {
    const session = await auth.api.getSession({
      headers: headersList
    });
    // console.log("session", session)
    
   
    
    return session;
  } catch (error) {
    console.error('Session error:', error);
    throw error;
  }
};