"use client"

import { cn } from "@/lib/utils"
import { CheckIcon, CheckCheckIcon } from "lucide-react"

interface MessageBubbleProps {
    message: {
        sender: "contact" | "ai" | "me"
        text: string
        time: string
        status?: "sent" | "delivered" | "read"
    }
}

export function MessageBubble({ message }: MessageBubbleProps) {
    const isMe = message.sender === "me" || message.sender === "ai" // Treat AI as "me" side for now or distinguish?
    // Actually, usually AI replies are "incoming" from the bot, but if it's acting on user's behalf, it might be "outgoing".
    // In the existing app: sender: "ai" was right aligned (outgoing/me), sender: "contact" was left aligned.
    // Let's stick to that: AI = Outgoing style.

    const isOutgoing = message.sender === "ai" || message.sender === "me"

    return (
        <div className={cn("flex w-full mb-1", isOutgoing ? "justify-end" : "justify-start")}>
            <div
                className={cn(
                    "relative max-w-[65%] rounded-lg p-2 text-sm shadow-sm",
                    isOutgoing ? "bg-[var(--outgoing-background)] rounded-tr-none" : "bg-[var(--incoming-background)] rounded-tl-none"
                )}
            >
                {/* Tail */}
                <span
                    className={cn(
                        "absolute top-0 w-3 h-3",
                        isOutgoing ? "-right-2 bg-[var(--outgoing-background)]" : "-left-2 bg-[var(--incoming-background)]"
                    )}
                    style={{
                        clipPath: isOutgoing
                            ? "polygon(0 0, 100% 0, 0 100%)" // Right tail
                            : "polygon(0 0, 100% 0, 100% 100%)" // Left tail
                    }}
                />

                <div className="px-1 pt-1 pb-4 min-w-[80px]">
                    {/* AI Label if AI */}
                    {message.sender === "ai" && (
                        <div className="text-[10px] font-bold text-primary mb-1 uppercase tracking-wider flex items-center gap-1">
                            AI Assistant
                        </div>
                    )}
                    <span className="text-foreground leading-relaxed">
                        {message.text}
                    </span>
                </div>

                {/* Metadata (Time & Status) */}
                <div className="absolute bottom-1 right-2 flex items-center gap-1 opacity-70">
                    <span className="text-[10px] text-muted-foreground/80 lowercase">
                        {message.time}
                    </span>
                    {isOutgoing && (
                        <span className={cn("text-primary")}>
                            <CheckCheckIcon className="w-3.5 h-3.5" />
                        </span>
                    )}
                </div>
            </div>
        </div>
    )
}
