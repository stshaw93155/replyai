"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuthActions } from "@convex-dev/auth/react"
import { Mail, Phone, Chrome } from "lucide-react"
import Link from "next/link"

export default function SignupPage() {
    const { signIn } = useAuthActions()
    const [step, setStep] = useState<"signIn" | "verify">("signIn")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")
    const [loading, setLoading] = useState(false)
    const [code, setCode] = useState("")

    // 1. Google OAuth
    const handleGoogle = () => {
        setLoading(true)
        void signIn("google", { redirectTo: "/chats" })
    }

    // 2. Email Magic Link
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

    // 3. Phone (Placeholder / Simulation)
    const handlePhone = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setTimeout(() => {
            setStep("verify")
            setLoading(false)
        }, 1000)
    }

    const verifyPhone = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        if (code === "123456") {
            window.location.href = "/chats"
        } else {
            alert("Invalid code (use 123456)")
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
                    <TabsList className="grid w-full grid-cols-3 mb-6">
                        <TabsTrigger value="google"><Chrome className="w-4 h-4 mr-2" /> Google</TabsTrigger>
                        <TabsTrigger value="email"><Mail className="w-4 h-4 mr-2" /> Email</TabsTrigger>
                        <TabsTrigger value="phone"><Phone className="w-4 h-4 mr-2" /> Phone</TabsTrigger>
                    </TabsList>

                    {/* Google Tab */}
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

                    {/* Email Tab */}
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

                    {/* Phone Tab */}
                    <TabsContent value="phone">
                        {step === "signIn" ? (
                            <form onSubmit={handlePhone} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <Input
                                        id="phone"
                                        type="tel"
                                        placeholder="+1 555 000 0000"
                                        required
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                    />
                                </div>
                                <Button type="submit" className="w-full h-11" disabled={loading}>
                                    {loading ? "Sending Code..." : "Sign up with Phone"}
                                </Button>
                            </form>
                        ) : (
                            <form onSubmit={verifyPhone} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="code">Enter OTP</Label>
                                    <Input
                                        id="code"
                                        type="text"
                                        placeholder="123456"
                                        className="tracking-[0.5em] text-center text-xl"
                                        maxLength={6}
                                        required
                                        value={code}
                                        onChange={(e) => setCode(e.target.value)}
                                    />
                                    <p className="text-xs text-muted-foreground text-center">Use 123456 for demo</p>
                                </div>
                                <Button type="submit" className="w-full h-11" disabled={loading}>
                                    {loading ? "Verifying..." : "Verify & Create Account"}
                                </Button>
                            </form>
                        )}
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
