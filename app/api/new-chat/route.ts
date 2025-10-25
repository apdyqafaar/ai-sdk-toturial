import { loadChat, saveChat } from "@/lib/chat"
import { getUserInfo } from "@/server/user"
import { openai } from "@ai-sdk/openai"
import { convertToModelMessages, createIdGenerator, streamText, UIMessage, validateUIMessages } from "ai"

export const maxDuration=30

export async function POST(req:Request) {
    try {
      const user=await getUserInfo() 

      if(!user){
        return Response.json({error:"Unauthorized user"}, {status:401})

      }


      const body=await req.json()

      const {messages, message:singleMessage, id:conversa_id}=body
       console.log(messages)


      
      if(!conversa_id){
        return Response.json({error:"Conversation id is required"}, {status:400})
      }


      let allMessages: UIMessage[]

      if(singleMessage){
        const previosMessages=await loadChat(conversa_id)

        allMessages=[...previosMessages, singleMessage]
      }else if(messages){
        allMessages=messages
      }else{
        return Response.json({error:"Np message provided"}, {status:400})
      }
//  console.log("All messages: ", allMessages)
// return

      let validatedMessages: UIMessage[]
      try {
        validatedMessages= await validateUIMessages({
            messages:allMessages
      })
      } catch (error) {
         console.error(error)
        return Response.json({error:"Invalid messages"}, {status:500})
      }



    //   strimg the response

    const result= streamText({
        model:openai("gpt-4.1-mini"),
        messages:convertToModelMessages(validatedMessages)
    })
     result.consumeStream()

     return result.toUIMessageStreamResponse({
        originalMessages:validatedMessages,
        generateMessageId: createIdGenerator({
            prefix:"msg_",
            size:16
        }),
        onFinish:async({messages})=>{
           try {
             await saveChat({chatId:conversa_id, messages,})
           } catch (error) {
            console.error(error)
           }
        }
     })

    } catch (error) {
        console.error(error)
        return Response.json({error:"Internal server error"}, {status:500})
    }
}