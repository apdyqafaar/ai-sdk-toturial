"use server"
import { db } from "../../db/drizzle";
import { converstion, message } from "@/db/schema";
import { UIMessage } from "ai";
import { asc, desc, eq } from "drizzle-orm";



// asve chat
export const saveChat =async({chatId, messages}:{chatId:string, messages:UIMessage[]}):Promise<void>=>{
     let titleCOnver=messages[0].role==="user"&&messages[0].parts.find((p)=>p.type==="text")?.text 

    // get the conversation
    const conve=await db.select({userId:converstion.userId})
    .from(converstion)
    .where(eq(converstion.id, chatId))
    .limit(1)



    if(conve.length ===0){
        throw new Error("Conversation not found")
    }

    const exisitingMwessages=await db.select()
    .from(message)
    .where(eq(message.conversation_id, chatId))


    const exisitingMessageIds=exisitingMwessages.map((m)=> m.id)


    // filtering
    const newMessages=messages.filter((m)=> !exisitingMessageIds.includes(m.id))

    if(newMessages.length>1){

        // transforming
        const dbMessages= newMessages.map((msg)=>{
            const textPart=msg.parts.find(part=> part.type==="text")
            const content=textPart?.text || ""

            return {
                id:msg.id,
                contemt:content,
                role:msg.role ,
                conversation_id:chatId,
                user_id:conve[0].userId 
            }
        }

     
    
    )
  const MakeTitle=(text:string, leng=10)=>{
    const words=text.trim().split(/\s+/)
    const short=words.slice(0, leng).join(" ")
    return words.length>leng? short+"...":short
}




       await db.insert(message).values(dbMessages)

       if(newMessages.length<3){

        console.log("tit", MakeTitle(titleCOnver as string))
             await db.update(converstion)
       .set({updatedAt: new Date(), title:MakeTitle(titleCOnver as string)})
       .where(eq(converstion.id, chatId))

       }else{
           await db.update(converstion)
       .set({updatedAt: new Date()})
       .where(eq(converstion.id, chatId))
       }

    
    }
}





// load chat
export async function loadChat(conversation_id:string):Promise<UIMessage[]> {
 
    const messages=await db.select()
    .from(message)
    .where(eq(message.conversation_id, conversation_id))
    .orderBy(asc(message.createdAt))


  
 
    return messages.map((m)=>({
        id:m.id,
        role:m.role as "user" | "assistant",
        parts:[{type:"text", text:m.contemt}]
    }))
}