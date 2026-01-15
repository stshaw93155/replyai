"use client"

import { SearchIcon, MessageSquarePlusIcon, MoreVerticalIcon, CircleDashedIcon } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface Chat {
    id: number
    jid: string
    name: string
    lastMessage: string
    time: string
    unread: number
    avatar?: string
}

interface ChatSidebarProps {
    chats: Chat[]
    selectedChatId: number
    onSelectChat: (chat: Chat) => void
}

export function ChatSidebar({ chats, selectedChatId, onSelectChat }: ChatSidebarProps) {
    return (
        <aside className="w-full md:w-[400px] flex flex-col border-r border-sidebar-border bg-sidebar h-full">
            {/* Header */}
            <header className="h-[60px] bg-sidebar-accent px-4 flex items-center justify-between shrink-0">
                <Avatar className="h-10 w-10 cursor-pointer">
                    <AvatarImage src="/avatar-placeholder.png" alt="User" />
                    <AvatarFallback>ME</AvatarFallback>
                </Avatar>
                <div className="flex items-center gap-6 text-sidebar-foreground/60">
                    <button title="Status">
                        <CircleDashedIcon className="w-5 h-5" />
                    </button>
                    <button title="New Chat">
                        <MessageSquarePlusIcon className="w-5 h-5" />
                    </button>
                    <button title="Menu">
                        <MoreVerticalIcon className="w-5 h-5" />
                    </button>
                </div>
            </header>

            {/* Search */}
            <div className="p-2 bg-sidebar border-b border-sidebar-border">
                <div className="relative flex items-center bg-sidebar-accent rounded-lg h-9 px-4">
                    <SearchIcon className="w-4 h-4 text-sidebar-foreground/50 mr-4" />
                    <input
                        placeholder="Search or start new chat"
                        className="bg-transparent border-none outline-none text-sm w-full placeholder:text-sidebar-foreground/50 text-sidebar-foreground"
                    />
                </div>
            </div>

            {/* Chat List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {chats.map((chat) => (
                    <div
                        key={chat.id}
                        onClick={() => onSelectChat(chat)}
                        className={cn(
                            "flex items-center gap-3 p-3 cursor-pointer hover:bg-sidebar-accent transition-colors relative group",
                            selectedChatId === chat.id && "bg-sidebar-accent"
                        )}
                    >
                        <Avatar className="h-12 w-12 shrink-0">
                            <AvatarImage src={chat.avatar} alt={chat.name} />
                            <AvatarFallback>{chat.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0 flex flex-col justify-center border-b border-sidebar-border/50 pb-3 group-last:border-none h-full">
                            <div className="flex justify-between items-baseline mb-1">
                                <span className="text-sidebar-foreground font-normal text-[17px] truncate max-w-[70%]">
                                    {chat.name}
                                </span>
                                <span className={cn("text-xs", chat.unread > 0 ? "text-sidebar-primary" : "text-sidebar-foreground/50")}>
                                    {chat.time}
                                </span>
                            </div>
                            <div className="flex-1 flex justify-between items-center h-5">
                                <span className="text-sm text-sidebar-foreground/60 truncate pr-2 w-full block">
                                    {chat.lastMessage}
                                </span>
                                {chat.unread > 0 && (
                                    <span className="bg-sidebar-primary text-sidebar-primary-foreground text-[10px] font-bold h-5 min-w-[20px] px-1 rounded-full flex items-center justify-center shrink-0">
                                        {chat.unread}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </aside>
    )
}
