"use server"
import { db } from "../../db/drizzle"
import { converstion } from "@/db/schema"
import { and, desc, eq } from "drizzle-orm"
import {nanoid} from "nanoid"


export const createConversation=async(user_id:string, tittle?:string)=>{


     const conversa_id= nanoid()
     await db.insert(converstion).values({
        id:conversa_id,
        title:tittle || "New conversation",
        userId:user_id
     })
  return conversa_id
}


// get user conversations by id
export const getUserCOnversations=async(user_id:string)=>{

    return await db.select()
    .from(converstion)
    .where(eq(converstion.userId,user_id))
    .orderBy(desc(converstion.createdAt))

}

// get conversation by id
export const getCOversationById=async({conversa_id, user_id}:{conversa_id:string, user_id:string})=>{

     const result= await db.select()
     .from(converstion)
     .where(and(eq(converstion.id, conversa_id), eq(converstion.userId, user_id)))
     .limit(1)

     const conve=result[0]

     if(!conve || conve.userId !== user_id ){
        return null
     }

     return conve
  
}