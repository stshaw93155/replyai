"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuthActions } from "@convex-dev/auth/react"
import { Mail, Chrome } from "lucide-react"
import Link from "next/link"

export default function SignupPage() {
    const { signIn } = useAuthActions()
    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(false)

    const handleGoogle = () => {
        setLoading(true)
        void signIn("google", { redirectTo: "/chats" })
    }

    const handleEmail = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            await signIn("resend", { email, redirectTo: "/chats" })
        } catch (error) {
            console.error(error)
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="w-full max-w-md space-y-8 bg-card p-8 rounded-xl border border-border/50 shadow-2xl">
                <div className="text-center">
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Create Account</h1>
                    <p className="text-muted-foreground">Get started with ReplyAI today</p>
                </div>

                <Tabs defaultValue="google" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-6">
                        <TabsTrigger value="google"><Chrome className="w-4 h-4 mr-2" /> Google</TabsTrigger>
                        <TabsTrigger value="email"><Mail className="w-4 h-4 mr-2" /> Email</TabsTrigger>
                    </TabsList>

                    <TabsContent value="google" className="space-y-4">
                        <div className="text-center py-8 space-y-4">
                            <p className="text-sm text-muted-foreground">Sign up with your Google account</p>
                            <Button
                                className="w-full h-12 text-lg"
                                variant="outline"
                                onClick={handleGoogle}
                                disabled={loading}
                            >
                                <Chrome className="mr-2 h-5 w-5" /> Sign up with Google
                            </Button>
                        </div>
                    </TabsContent>

                    <TabsContent value="email">
                        <form onSubmit={handleEmail} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <Button type="submit" className="w-full h-11" disabled={loading}>
                                {loading ? "Sending Link..." : "Sign up with Email"}
                            </Button>
                        </form>
                    </TabsContent>
                </Tabs>

                <div className="text-center mt-6">
                    <p className="text-sm text-muted-foreground">
                        Already have an account?{" "}
                        <Link href="/login" className="text-primary hover:underline">
                            Log in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
