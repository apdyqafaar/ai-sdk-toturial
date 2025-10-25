"use client"
import { Loader, Plus } from "lucide-react"
import { Button } from "./ui/button"
import { useRouter } from "next/navigation"
import { createConversation } from "@/lib/chat"
import { useState } from "react"
// import { useRouter } from "next/router"

const CreateNewConver = ({user_id}:{user_id:string}) => {
    const [isPending, setIspending]=useState(false)
    const router=useRouter()

    const createNewCon=async()=>{
        try {
            setIspending(true)
             const newCoversa_id=await createConversation(user_id)

        if(newCoversa_id) return  router.push(`/chat/${newCoversa_id}`)

        } catch (error) {
            console.error(error)
        }finally{
            setIspending(false)
        }
       
    }
  return (
    <Button onClick={createNewCon}  className="p-2 rounded-lg bg-primary/4 cursor-pointer hover:bg-primary/10 transition-colors text-gray-600  flex items-center gap-2 font-bold text-lg">
           {
            isPending?(
               <Loader className=" animate-spin"/>
            ):(
                <>
                <Plus/> <p >Create New Chat</p>
                </>
            )
           }
           </Button>
  )
}

export default CreateNewConver