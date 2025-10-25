"use client"

import GoogleAuthButton from "@/components/Google-auth-button"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import { SignUp } from "@/server/user"
import { useRouter } from "next/navigation"
import { useState } from "react"
import {useForm} from "react-hook-form"
import { toast } from "sonner"


const signUp = () => {
  const [errorMessage, setError]=useState("")
  const {register, handleSubmit }=useForm()
  const [isPending, setIsPending]=useState(false)
  const router=useRouter()

  const onSubmit=async(data:any)=>{
    const {email, password, name}=data
     setIsPending(true)
        setError("")
 
     const {error}=await SignUp({email, name, password})
     if(error){
      setIsPending(false)
      setError(error)
      // toast.error(error)
      return
     }

     setError("")
     setIsPending(false)
     toast.success("User has been created successfully")
     router.push("/signin")

  }
  return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-7">
      <div className="flex flex-col">

      <h1 className="text-3xl text-foreground font-bold mb-3">Create New Account </h1>
      <p className="text-center text-muted-foreground">We are really happy to Join us..</p>
      </div>
    
          <form onSubmit={handleSubmit(onSubmit)}  className="flex flex-col space-y-6 max-w-sm w-full">
            {errorMessage&& <p className="bg-red-100 text-red-600">{errorMessage}</p>}

            <div className="felex-flex-col space-y-3">
              <Label htmlFor="name">Name</Label>
              <Input required  type="text" id="name" className="py-6" {...register("name",{required:true})}/>
            </div>

            <div className="felex-flex-col space-y-3">
              <Label htmlFor="email">Email</Label>
              <Input required type="email" id="email" className="py-6" {...register("email",{required:true})}/>
            </div>

            <div className="felex-flex-col space-y-3">
              <Label htmlFor="password">Password</Label>
              <Input required  type="password" id="password" className="py-6" {...register("password",{required:true, minLength:5})}/>
            </div>

            <Button className="py-6 rounded-sm cursor-pointer">{isPending? <Spinner/>:"Sign Up"}</Button>

           
          </form>
            <div className="flex flex-col space-y-3 mt-4 max-w-sm w-full">
              <p className="text-center text-sm text-muted-foreground">Or user social</p>
              <GoogleAuthButton label="Sign Up" provider="Google"/>
            </div>
    </div>
  )
}

export default signUp