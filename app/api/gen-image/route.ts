import { loadChat } from "@/lib/chat";
import { openai } from "@ai-sdk/openai";
import { convertToModelMessages, stepCountIs, streamText, tool, UIMessage , experimental_generateImage as genearetImage, validateUIMessages, createIdGenerator} from "ai";
import { Console } from "console";
import z from "zod";


export async function POST(req:Request) {
    //  const {messages}:{messages:UIMessage[]}=await req.json()

    try {
        
         const body=await req.json()

      const {messages, message:singleMessage, id:conversa_id}=body
    //    console.log(messages)


      
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
   
    
          let validatedMessages: UIMessage[]
          try {
            validatedMessages= await validateUIMessages({
                messages:allMessages
          })
          } catch (error) {
             console.error(error)
            return Response.json({error:"Invalid messages"}, {status:500})
          }
    
    
    

     const result=await streamText({
        model:openai("gpt-4.1-mini"),
        messages:convertToModelMessages(validatedMessages),
        stopWhen:stepCountIs(5),
        system:"You are help full assistance that allows the users to generate images they want and you will you the tool i will give you",
        tools:{
            image_gen:tool({
                description:"generate any image that the user wants try the best and greatest way ",
                inputSchema:z.object({
                    prompt_image:z.string().describe('this the prompt the is discribing the image generation')
                }),

                execute:async({prompt_image})=>{
                    const response_image=await genearetImage({
                        model:openai.image("gpt-image-1-mini"),
                        prompt:prompt_image
                    })

                    return response_image
                }
            })
        }
     })

     



     return result.toUIMessageStreamResponse({
        originalMessages:validatedMessages,
        generateMessageId:createIdGenerator({
            prefix:"msg_",
            size:16

        }),
     })

    } catch (error) {
         console.log(error);
         return Response.json({error:"Internal server"}, {status:500})
    }
        
}