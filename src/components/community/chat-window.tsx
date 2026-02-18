"use client"

import { useState, useEffect, useRef } from "react"
import { useSession } from "next-auth/react"
import { Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"

interface Message {
    id: string
    content: string
    userId: string
    user: {
        name: string | null
        image: string | null
    }
    createdAt: string
}

export function ChatWindow() {
    const { data: session } = useSession()
    const [messages, setMessages] = useState<Message[]>([])
    const [inputValue, setInputValue] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const scrollRef = useRef<HTMLDivElement>(null)

    const fetchMessages = async () => {
        try {
            const res = await fetch("/api/messages?channel=general")
            if (res.ok) {
                const data = await res.json()
                setMessages(data)
            }
        } catch (error) {
            console.error("Failed to load messages", error)
        }
    }

    // Poll for new messages every 3 seconds (simple implementation)
    useEffect(() => {
        fetchMessages()
        const interval = setInterval(fetchMessages, 3000)
        return () => clearInterval(interval)
    }, [])

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" })
        }
    }, [messages])

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!inputValue.trim() || !session) return

        setIsLoading(true)
        const formData = new FormData()
        formData.append("content", inputValue)
        formData.append("channel", "general")

        try {
            // Optimistic update
            const tempId = Date.now().toString()
            const newMessage: Message = {
                id: tempId,
                content: inputValue,
                userId: session.user?.id || "",
                user: {
                    name: session.user?.name || "User",
                    image: session.user?.image || null
                },
                createdAt: new Date().toISOString()
            }

            setMessages(prev => [...prev, newMessage])
            setInputValue("")

            // Call Server Action (dynamically imported to avoid build issues in client component if not careful, 
            // but here we used API route for fetch and can use Server Action for post, 
            // or just use API route for consistency. Let's use the Server Action we created if possible, 
            // but actually for client components usually we import the action. 
            // Let's use a fetch POST to a create route OR import the action. 
            // Since I created src/lib/actions/chat.ts, let's try to use it if configured correctly, 
            // otherwise fallback to API.)

            // Actually, importing server actions in client components is fine in Next.js 14+.
            // But for simplicity and to match the 'fetch' pattern above, let's just make a POST endpoint or use the action.
            // I'll stick to the action pattern I started.

            const { sendMessage } = await import("@/lib/actions/chat")
            const result = await sendMessage(formData)

            if (result?.error) {
                toast.error(result.error)
                // Revert optimistic update?
            } else {
                // Success
                fetchMessages() // Sync real ID
            }
        } catch (error) {
            toast.error("Failed to send message")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Card className="h-[600px] flex flex-col">
            <CardHeader className="py-3 px-4 border-b">
                <CardTitle className="text-lg font-medium flex items-center">
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-2" />
                    General Chat
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
                <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                        {messages.map((msg, index) => {
                            const isMe = msg.userId === session?.user?.id
                            const isSequent = index > 0 && messages[index - 1].userId === msg.userId

                            return (
                                <div
                                    key={msg.id}
                                    className={`flex items-end gap-2 ${isMe ? "justify-end" : "justify-start"}`}
                                >
                                    {!isMe && !isSequent && (
                                        <Avatar className="w-6 h-6">
                                            <AvatarImage src={msg.user.image || ""} />
                                            <AvatarFallback>{msg.user.name?.[0] || "?"}</AvatarFallback>
                                        </Avatar>
                                    )}
                                    {!isMe && isSequent && <div className="w-6" />}

                                    <div
                                        className={`max-w-[75%] px-3 py-2 rounded-lg text-sm ${isMe
                                            ? "bg-primary text-primary-foreground rounded-br-none"
                                            : "bg-muted text-foreground rounded-bl-none"
                                            }`}
                                    >
                                        {!isMe && !isSequent && (
                                            <p className="text-[10px] opacity-70 mb-1">{msg.user.name}</p>
                                        )}
                                        <p>{msg.content}</p>
                                    </div>
                                </div>
                            )
                        })}
                        <div ref={scrollRef} />
                    </div>
                </ScrollArea>
                <div className="p-3 border-t bg-background">
                    <form onSubmit={handleSendMessage} className="flex gap-2">
                        <Input
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Type a message..."
                            disabled={isLoading}
                            className="flex-1"
                        />
                        <Button type="submit" size="icon" disabled={isLoading || !inputValue.trim()}>
                            <Send className="w-4 h-4" />
                        </Button>
                    </form>
                </div>
            </CardContent>
        </Card>
    )
}
