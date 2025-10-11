"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useChat } from "@ai-sdk/react";
import { useState } from "react";

export default function Home() {
  const [input, setInput]=useState("")
  const {messages, sendMessage}=useChat()

  const handleClick=(e: any)=>{
   e.preventDefault()
    sendMessage({text:input})
    setInput("")
   
  }

   console.log(messages)
  return (
  <div className="min-h-screen  relative ">
 
      {/* header */}
      <div className="fixed top-0 right-0 left-0 border-gray-300 border-b z-10 backdrop-blur-2xl">
        <div className="flex flex-col my-4  blu">
           <h1 className="text-foreground font-bold text-3xl text-center">AI-SDK-CHAT-BOT</h1>
        </div>
      </div>
     {
      messages.map((message)=>(
         <div className={`my-25 flex max-w-2xl  mx-auto ${message.role==="user"?"justify-end" :"justify-start"}`}> 
          <div className={`px-4 py-4 rounded-lg ${message.role==="user"?"bg-pink-400 text-white":"bg-gray-100 text-foreground"}`}>
           
           {
            message.parts.map((part, i)=>{
              switch (part.type){
                case "text":
                  return <div key={message.id}>{part.text}</div>
                // case "tool-weather":
                //   return <div>Temperature is {part.output?.location} is{part.output?.temperature }</div>
              }
            })
           }

          </div>
         </div>
      ))
     }

      {/* form */}
      <div className=" fixed bottom-0 right-0 left-0  z-10">
        <form onSubmit={handleClick} className="max-w-2xl mx-auto p-2 my-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            <Input onChange={(e)=>setInput(e.target.value)} value={input} className="py-6"  id='prompt' placeholder='e.g. Explain quantum ..'/>
                        <Button className="py-6" type='submit' disabled={ !input.trim()} variant={"default"}>Generate Text</Button>
          </div>
        </form>
       
    </div>
  </div>
  );
}
