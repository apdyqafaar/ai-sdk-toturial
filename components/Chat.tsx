"use client";

import { useSession } from "@/lib/auth-clent";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, UIMessage } from "ai";
import React, { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Spinner } from "./ui/spinner";
import { Button } from "./ui/button";
import Link from "next/link";
import { Bot, Image, Send, User } from "lucide-react";
import { Input } from "./ui/input";
import { Streamdown } from "streamdown";
import { SidebarTrigger } from "./ui/sidebar";
import LogOutBtn from "./logoutButton";
import { Badge } from "./ui/badge";

interface ChatProp {
  initialMessages?: UIMessage[];
  conversa_id: string;
  tittle?: string;
}

const ChatComponent = ({
  initialMessages = [],
  conversa_id,
  tittle = "New conversation",
}: ChatProp) => {
  const [isImageMode, setIsImageMode] = useState(false);

  return (
    <AtualChatCo
      key={isImageMode ? "image" : "text"}
      initialMessages={initialMessages}
      conversa_id={conversa_id}
      tittle={tittle}
      isImageMode={isImageMode}
      setIsImageMode={setIsImageMode}
    />
  );
};
const AtualChatCo = ({
  initialMessages,
  conversa_id,
  tittle,
  isImageMode,
  setIsImageMode,
}: ChatProp & {
  isImageMode: boolean;
  setIsImageMode: (f: boolean) => void;
}) => {
  const [input, setInput] = useState("");
  const messageRef = useRef<HTMLDivElement>(null);
  const { data: session } = useSession();
  const { messages, sendMessage, status, error, stop } = useChat({
    id: conversa_id,
    messages: initialMessages,
    transport: new DefaultChatTransport({
      api: isImageMode ? "/api/gen-image/" : "/api/new-chat/",
      prepareSendMessagesRequest({ messages, id }) {
        return {
          body: {
            message: messages[messages.length - 1],
            id,
          },
        };
      },
    }),
  });

  const scrollToBottom = () => {
    messageRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, status]);

  if (!session) {
    return (
      <div className="min-h-screen w-full flex justify-center items-center">
        <Spinner className=" text-primary text-3xl" />
      </div>
    );
  }
  console.log("messages", messages);
  return (
    <div className="min-h-screen min-w-full flex flex-col">
      <div className="px-4 py-5 border-b border-gray-300 flex justify-between items-center fixed top-0 z-60 backdrop-blur-2xl right-0 left-0">
        <div className="flex items-center gap-3">
          <Avatar className="bg-primary text-lg text-white text-center flex items-center justify-center">
            {session?.user?.name.charAt(0).toUpperCase() || "U"}
          </Avatar>
          <div className="flex flex-col">
            <h1 className="text-base text-foreground font-medium">{tittle}</h1>
            <p className=" text-sm text-primary">Chat with AI Assistant</p>
          </div>
          <SidebarTrigger />
        </div>

        <div className="flex items-center gap-3">
          <Button variant={"outline"} className="border-primary text-primary">
            <Link href={"/dash"}>Back to Dashboard</Link>
          </Button>
          <LogOutBtn />
        </div>
      </div>

      {/* messages */}
      <div className="flex-1 overflow-y-auto p-6 min-w-full md:-ml-125">
        <div className="max-w-4xl mx-auto space-y-6 py-15">
          {messages.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 mx-auto mb-6 bg-rose-100 rounded-full flex items-center justify-center">
                <Bot className="h-8 w-8 text-rose-500" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">
                Start conversation
              </h3>
              <p className="text-muted-foreground">
                Ask me anything! I'm here to help.
              </p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`flex space-x-3 max-w-2xl ${
                    message.role === "user" &&
                    "flex-row-reverse space-x-reverse"
                  }`}
                >
                  <Avatar className="h-9 w-9 shrink-0 flex">
                    {message.role === "user" ? (
                      <>
                        <AvatarImage src={session.user.image || ""} />
                        <AvatarFallback className="bg-rose-500 text-white text-xs w-full h-full">
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </>
                    ) : (
                      <>
                        <AvatarFallback className="bg-rose-100 text-primary text-xs w-full h-full">
                          <Bot className="h-4 w-4" />
                        </AvatarFallback>
                      </>
                    )}
                  </Avatar>

                  {/*   content */}
                  <div
                    className={`mt-3 rounded-2xl p-5 ${
                      message.role === "user"
                        ? "bg-primary/70 text-white"
                        : "text-gray-700"
                    }`}
                  >
                    <div className="text-sm leading-relaxed font-medium">
                      {message.parts.map((part, i) => {
                        // console.log(message)
                        switch (part.type) {
                          case "text":
                            return message.role === "assistant" ? (
                              <Streamdown isAnimating={status === "streaming"} key={i}>{part.text}</Streamdown>
                            ) : (
                              <span key={i}>{part.text}</span>
                            );
                          case "tool-image_gen":
                               const imgBase64 = part.output?.images?.[0]?.base64Data;
                                      if (!imgBase64) return null;
                            // return <Streamdown isAnimating={status === "streaming"}>
                               return <img
                           src={`data:image/png;base64,${imgBase64}`}
                          alt="AI generated"
                           className="rounded-lg border shadow-md max-w-full"
                           />
                              
                            // </Streamdown>
                        }
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={messageRef} />
        </div>
      </div>

      {/* fixed input at bottom */}
      <div className="bg-white border-t border-primary/15 p-5 fixed bottom-0 left-0 right-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (input.trim() && status === "ready") {
              sendMessage({ text: input });
              setInput("");
            }
          }}
          className="max-w-4xl mx-auto"
        >
          <div className="flex space-x-3 items-center relative">
            <Input
              placeholder={
                isImageMode
                  ? "Describe the image to generate..."
                  : "Type your message here..."
              }
              className="flex-1 py-7 text-2xl pl-16"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={status !== "ready"}
            />
            <Badge
              onClick={() => setIsImageMode(!isImageMode)}
              variant="outline"
              className={`absolute left-2 py-5 cursor-pointer ${
                isImageMode ? "bg-primary" : "bg-primary/60"
              } text-white`}
            >
              <Image className="text-lg" /> Img
            </Badge>
            <Button
              disabled={status !== "ready" || !input}
              type="submit"
              className="p-7 min-w-20 cursor-pointer rounded-2xl"
            >
              <Send className="h-6 w-6" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatComponent;
