"use client"

import { useState, useEffect } from "react"
import { ChatSidebar } from "@/components/chat-sidebar"
import { ChatWindow } from "@/components/chat-window"
import { useSocket } from "@/components/providers/socket-provider" // Still used for QR/Connection status
import { useQuery, useMutation } from "convex/react"
import { api } from "../../../convex/_generated/api"


export default function ChatsPage() {
  const { socket, isConnected } = useSocket()

  // Local state for UI selection
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null)

  // Fetch chats from Convex (real-time, reactive)
  const chats = useQuery(api.chats.getChats) || []

  // Format chats for Sidebar
  const sidebarChats = chats.map((c: any) => ({
    ...c,
    id: c.jid, // We use JID as the identifier for selection logic in Sidebar
    jid: c.jid
  }));

  // Auto-select first chat
  useEffect(() => {
    if (sidebarChats.length > 0 && !selectedChatId) {
      setSelectedChatId(sidebarChats[0].id)
    }
  }, [chats.length, selectedChatId])

  // Fetch messages for selected chat (using reactive query)
  // If no chat selected, we can skip or pass null? useQuery checks arguments.
  const activeChatMessages = useQuery(api.chats.getMessages,
    selectedChatId ? { chatId: selectedChatId } : "skip"
  ) || []

  // Construct active chat object for ChatWindow
  const activeChatData = sidebarChats.find(c => c.id === selectedChatId);

  const activeChat = activeChatData ? {
    ...activeChatData,
    messages: activeChatMessages
  } : null;

  return (
    <div className="flex h-[calc(100vh-2rem)] md:h-screen bg-background overflow-hidden">
      <div className="flex w-full max-w-[1600px] mx-auto h-full shadow-lg overflow-hidden md:my-0">
        <ChatSidebar
          chats={sidebarChats}
          selectedChatId={selectedChatId as any}
          onSelectChat={(chat) => setSelectedChatId(chat.id)}
        />
        <ChatWindow chat={activeChat as any} />
      </div>
    </div>
  )
}
