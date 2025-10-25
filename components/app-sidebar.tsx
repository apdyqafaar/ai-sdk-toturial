"use server"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { getUserInfo } from "@/server/user"
import UserConversationList from "./userConversationList"
import { redirect } from "next/navigation"
import { getUserCOnversations } from "@/lib/chat"
import CreateNewConver from "./CreateNewConver"

export async function AppSidebar() {


 const session =await getUserInfo()


 if(!session) redirect("/signin")
  let imag=session.user.image as string
 console.log(imag)

 
      const result=await getUserCOnversations(session.user.id)
      // console.log(result)
  
  
  return (
    <Sidebar className="z-80 ">
      <SidebarHeader /> 
       <div className="flex items-center gap-3 p-2">
          <Avatar className="bg-primary text-lg text-primary text-center flex items-center justify-center">
            <AvatarImage src={imag}/>

            <AvatarFallback>
               {session?.user?.name.charAt(0).toUpperCase() || "U"} 
            </AvatarFallback>
            
          </Avatar>
          <div className="flex flex-col">
            <p className=" text-sm text-primary">Chat with Ai Assistant</p>
          </div>
        </div>
      
      <SidebarContent>
        <SidebarGroup className="mt-5">
           <CreateNewConver user_id={session?.user.id}/>
        </SidebarGroup>
        <UserConversationList links={result}/>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  )
}