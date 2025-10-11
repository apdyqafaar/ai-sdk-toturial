
import { openai } from "@ai-sdk/openai"
import {streamText , UIMessage, convertToModelMessages, tool, stepCountIs} from "ai"
import z from "zod"
import dotenv from "dotenv"
dotenv.config()

export async function POST(req:Request){
  const {messages}:{messages:UIMessage[]}=await req.json()

  const result=await streamText({
    model:openai("gpt-4.1-mini"),
    messages:convertToModelMessages(messages),
    stopWhen:stepCountIs(5),
    system:"you help full assitent that generates codes spicielly fullstack apps , so gove the users codes that they can understand",
    tools:{
      users: tool({
        description:"Get the all users data from the local database, and answer every question about database/users-data",
        inputSchema: z.object({
          questionDatabaseUsers:z.string().describe("The questionDAtabaseUsers to get the weather for")
        }),
        execute:async({questionDatabaseUsers})=>{
          const response=await fetch(`http://localhost:3000/api/users`,{
            method:"GET",
              headers:{ "Content-Type":"application/json"}
          })
          const data=await response.json()
          // console.log(data)
          // const temp=Math.round(Math.random() * (22+99)+77)
          return {
            usersData:data
          }
        }
      }),

      movies:tool({
       description:"Get or search any movie on the api that users will ask you and answer waht ever they ask you to know about the movies ",
       inputSchema: z.object({
        movieName: z.string().describe("this what the name that you will search the movie on the api")
       }),
       execute :async({movieName})=>{
        const res=await fetch(`https://www.omdbapi.com/?t=${movieName}&apikey=2a383d6a`)
        const data =await res.json()
        console.log("movies", data)
         return {
            movieData:data
          }
       }
      }),
      joke: tool({
        description:"get jok sentences on this api and give them user wants",
         inputSchema: z.object({
        jokeQ: z.string().describe("this is jok sentence")
       }),
        execute:async ({})=>{
          const response=await fetch(`https://icanhazdadjoke.com/`,{
            method:"GET",
              headers:{ "Content-Type":"application/json"}
          })
            const joke_res=await response.json()
          //  console.log("joke", joke_res)
         return {
            movieData:joke_res
          }
        }
      })
      
    }
  })

  return result.toUIMessageStreamResponse()
} 