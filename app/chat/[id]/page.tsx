import ChatComponent  from "@/components/Chat"
import { auth } from "@/lib/auth"
import { getCOversationById, loadChat } from "@/lib/chat"
import { getUserInfo } from "@/server/user"
// import { getUserInfo } from "@/server/user"
import { UIMessage } from "ai"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

interface PageProps{
    params:Promise<{id:string}>
}

const DynamicPage = async({params}:PageProps) => {
    const  {id}=await params

        // const session=await auth.api.getSession({
        //           headers:await headers()
        //       })

        const session=await getUserInfo()

    if(!session) redirect("/chat")


        // validate the conversation
        const checkConversationId= await getCOversationById({conversa_id:id, user_id:session.user.id})
        if(!checkConversationId) redirect("/chat")

            // console.log(checkConversationId)

        const initialMessages=await loadChat(id) 
        // console.log(initialMessages)
        
  return (
    <ChatComponent initialMessages={initialMessages} conversa_id={id}/>
  )
}

export default DynamicPage