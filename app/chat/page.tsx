"use server"

import {  createConversation, getUserCOnversations } from "@/lib/chat"
import { getUserInfo } from "@/server/user"
import { redirect } from "next/navigation"

const NewCaht = async() => {
    //   const session=await auth.api.getSession({
    //         headers:await headers()
    //     })
  const session=await getUserInfo()
    if(!session){
        redirect("/signin")
    }

    const converSations=await getUserCOnversations(session.user.id)
    let conve=converSations[0]

    if(!conve){
        const newCoversa_id=await createConversation(session.user.id)
        redirect(`/chat/${newCoversa_id}`)
    }else{
    redirect(`/chat/${conve.id}`)
  }
  
}

export default NewCaht