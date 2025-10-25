 "use client"
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { signOut } from '@/lib/auth-clent'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { toast } from 'sonner'

const LogOutBtn = () => {
  const [isPending, setIsPending]=useState(false)
  const router=useRouter()

  const habdleSignOut=async()=>{
  
      setIsPending(true)
      await signOut({
        fetchOptions:{
          onRequest:()=>{
            setIsPending(true)
          },
          onSuccess:()=>{
            setIsPending(false)
            router.push("/signin")
          },
          onError:(error)=>{
            setIsPending(false)
            toast.error(error.error.message)
          }
        }
      })
  
  }
  return (
    <div>
      <Button onClick={habdleSignOut} variant={"destructive"}>{isPending? <Spinner/>:"Log out"}</Button>
    </div>
  )
}

export default LogOutBtn