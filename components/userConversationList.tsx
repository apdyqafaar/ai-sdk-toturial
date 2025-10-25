"use server"

import Link from "next/link";

 interface Conversation {
  id: string;
  title: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserConversationList = async({
  links,
}: {
  links: Conversation[];
}) => {
  // console.log(links)

  return (
    // <Link href={`chat/${}`}>userConversationList</div>
    
      
        links.map((link)=>(
         <div key={link.id} className="flex flex-col items-start p-3 rounded-md bg-primary/10">
           <Link className="text-foreground" key={link.id} href={`/chat/${link.id}`}>{link.title}</Link>
           <small className="text-xs text-gray-600">{link.createdAt.toLocaleDateString()}</small> 
         </div>
        ))
      
      
 
    )
}

export default UserConversationList