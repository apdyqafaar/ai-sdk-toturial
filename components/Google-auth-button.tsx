"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { toast } from "sonner"
import { signIn } from "@/lib/auth-clent"
import { Spinner } from "./ui/spinner"
import { useRouter } from "next/navigation"

const GoogleAuthButton = ({provider, label}:{provider:string, label:string}) => {
  const [isPending, setIspending]=useState(false)
   const router=useRouter()
  const handleSigninSocial=async()=>{


    await signIn.social({
      provider:"google",
      callbackURL:"/dash",
      fetchOptions:{
        onRequest:()=>{
              setIspending(true)
        },
      
        onError:(err)=>{
          setIspending(false)
          toast.error(err.error.message)
        }
      }
    },
  )

  }
  return (
    <Button onClick={handleSigninSocial} variant={"ghost"} className="py-6 bg-gray-100 cursor-pointer hover:bg-gray-200">{isPending?<Spinner/> :`${label} with ${provider}`}</Button>
  )
}

export default GoogleAuthButton