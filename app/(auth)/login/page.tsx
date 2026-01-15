"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuthActions } from "@convex-dev/auth/react"
import { Mail, Phone, Lock, Chrome } from "lucide-react"

export default function LoginPage() {
    // Convex Auth actions
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

    // 2. Email Magic Link / OTP via Resend
    const handleEmail = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            await signIn("resend", { email, redirectTo: "/chats" })
            // If magic link, flow ends here (user checks email). 
            // If OTP, we'd verify code. Resend usually sends a link.
        } catch (error) {
            console.error(error)
            setLoading(false)
        }
    }

    // 3. Phone (Placeholder / Simulation using Credentials for now)
    const handlePhone = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        // In a real app with Twilio, we'd call a custom 'sendSms' action here.
        // For this boilerplate, we'll simulate verification UI.
        setTimeout(() => {
            setStep("verify")
            setLoading(false)
        }, 1000)
    }

    const verifyPhone = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        // Simulate OTP check
        if (code === "123456") {
            // We can fake a login or use a credential provider if one was set.
            // For now, we'll just redirect to demonstrate flow success.
            window.location.href = "/chats"
        } else {
            alert("Invalid code (use 123456 for demo)")
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="w-full max-w-md space-y-8 bg-card p-8 rounded-xl border border-border/50 shadow-2xl">
                <div className="text-center">
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Sign In</h1>
                    <p className="text-muted-foreground">Select your preferred login method</p>
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
                            <p className="text-sm text-muted-foreground">Connect with your Google account</p>
                            <Button
                                className="w-full h-12 text-lg"
                                variant="outline"
                                onClick={handleGoogle}
                                disabled={loading}
                            >
                                <Chrome className="mr-2 h-5 w-5" /> Continue with Google
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
                                {loading ? "Sending Link..." : "Send Magic Link"}
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
                                    {loading ? "Sending Code..." : "Send OTP Code"}
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
                                    {loading ? "Verifying..." : "Verify & Login"}
                                </Button>
                            </form>
                        )}
                    </TabsContent>
                </Tabs>

                <p className="text-center text-xs text-muted-foreground mt-6">
                    By signing in, you agree to our Terms of Service and Privacy Policy.
                </p>
            </div>
        </div>
    )
}
