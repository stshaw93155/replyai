"use client"

import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { SearchIcon, MoreVerticalIcon, SmileIcon, MicIcon, PaperclipIcon, SendHorizontalIcon } from "lucide-react"
import { MessageBubble } from "./message-bubble"
import { useState } from "react"
import { useSocket } from "@/components/providers/socket-provider"

interface ChatWindowProps {
    chat: {
        id: number
        jid: string
        name: string
        messages: any[]
        aiActive: boolean
    }
}

export function ChatWindow({ chat }: ChatWindowProps) {
    const { socket } = useSocket()
    const [inputText, setInputText] = useState("")

    const handleSendMessage = () => {
        if (!inputText.trim() || !socket || !chat) return

        socket.emit("sendMessage", {
            jid: chat.jid,
            text: inputText
        })

        // Optimistically add message (optional, or rely on upsert)
        // For now, let's rely on the upsert event to keep state consistent.

        setInputText("")
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleSendMessage()
        }
    }

    if (!chat) return (
        <div className="flex-1 flex items-center justify-center bg-muted border-b-[6px] border-primary">
            <div className="text-center text-muted-foreground">
                <h1 className="text-3xl font-light mb-4">WhatsApp Web</h1>
                <p>Send and receive messages without keeping your phone online.</p>
            </div>
        </div>
    )

    return (
        <div className="flex-1 flex flex-col h-full bg-[var(--chat-background)] relative">
            {/* Background Pattern Overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.06]"
                style={{ backgroundImage: "url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')" }}
            />

            {/* Header */}
            <header className="h-[60px] bg-sidebar px-4 flex items-center justify-between shrink-0 z-10 border-l border-sidebar-border">
                <div className="flex items-center gap-4 cursor-pointer">
                    <Avatar className="h-10 w-10">
                        <AvatarFallback>{chat.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <span className="text-sidebar-foreground font-normal text-[16px]">{chat.name}</span>
                        <span className="text-xs text-sidebar-foreground/60">
                            {chat.aiActive ? "AI Active" : "click here for contact info"}
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-6 text-sidebar-foreground/60">
                    <SearchIcon className="w-5 h-5 cursor-pointer" />
                    <MoreVerticalIcon className="w-5 h-5 cursor-pointer" />
                </div>
            </header>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 z-10 custom-scrollbar flex flex-col">
                {chat.messages.map((msg, idx) => (
                    <MessageBubble key={idx} message={msg} />
                ))}
            </div>

            {/* Input Area */}
            <footer className="bg-sidebar min-h-[62px] px-4 py-2 flex items-center gap-4 shrink-0 z-10">
                <div className="flex items-center gap-4 text-sidebar-foreground/60">
                    <SmileIcon className="w-6 h-6 cursor-pointer hover:text-sidebar-foreground transition-colors" />
                    <PaperclipIcon className="w-6 h-6 cursor-pointer hover:text-sidebar-foreground transition-colors" />
                </div>

                <div className="flex-1">
                    <input
                        placeholder="Type a message"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyDown={handleKeyPress}
                        className="w-full bg-sidebar-accent rounded-lg h-10 px-4 focus:outline-none text-sidebar-foreground placeholder:text-sidebar-foreground/50"
                    />
                </div>

                <div className="text-sidebar-foreground/60">
                    {inputText ? (
                        <SendHorizontalIcon
                            onClick={handleSendMessage}
                            className="w-6 h-6 cursor-pointer text-sidebar-primary hover:scale-110 transition-transform"
                        />
                    ) : (
                        <MicIcon className="w-6 h-6 cursor-pointer hover:text-sidebar-foreground transition-colors" />
                    )}
                </div>
            </footer>
        </div>
    )
}
