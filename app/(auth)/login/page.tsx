"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuthActions } from "@convex-dev/auth/react"
import { useMutation } from "convex/react"
import { api } from "../../../convex/_generated/api"
import { Mail, Phone, Chrome } from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
    const { signIn } = useAuthActions()
    const sendOTP = useMutation(api.twilio.sendOTP)
    const verifyOTP = useMutation(api.twilio.verifyOTP)

    const [step, setStep] = useState<"signIn" | "verify">("signIn")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")
    const [code, setCode] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const handleGoogle = () => {
        setLoading(true)
        void signIn("google", { redirectTo: "/chats" })
    }

    const handleEmail = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")
        try {
            await signIn("resend", { email, redirectTo: "/chats" })
        } catch (error: any) {
            console.error(error)
            setError(error.message || "Failed to send email")
            setLoading(false)
        }
    }

    const handlePhone = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")
        try {
            await sendOTP({ phoneNumber: phone })
            setStep("verify")
        } catch (error: any) {
            setError(error.message || "Failed to send SMS")
        } finally {
            setLoading(false)
        }
    }

    const handleVerifyPhone = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")
        try {
            const result = await verifyOTP({ phoneNumber: phone, code })
            if (result.success) {
                // Create a session for the phone user
                await signIn("password", {
                    id: phone,
                    password: code,
                    flow: "signIn"
                })
                window.location.href = "/chats"
            } else {
                setError(result.error || "Invalid code")
            }
        } catch (error: any) {
            setError(error.message || "Verification failed")
        } finally {
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
                            {error && <p className="text-sm text-destructive">{error}</p>}
                            <Button type="submit" className="w-full h-11" disabled={loading}>
                                {loading ? "Sending Link..." : "Send Magic Link"}
                            </Button>
                        </form>
                    </TabsContent>

                    <TabsContent value="phone">
                        {step === "signIn" ? (
                            <form onSubmit={handlePhone} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <Input
                                        id="phone"
                                        type="tel"
                                        placeholder="+1 234 567 8900"
                                        required
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                    />
                                    <p className="text-xs text-muted-foreground">Include country code (e.g. +1)</p>
                                </div>
                                {error && <p className="text-sm text-destructive">{error}</p>}
                                <Button type="submit" className="w-full h-11" disabled={loading}>
                                    {loading ? "Sending Code..." : "Send OTP"}
                                </Button>
                            </form>
                        ) : (
                            <form onSubmit={handleVerifyPhone} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="code">Enter 6-Digit Code</Label>
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
                                    <p className="text-xs text-muted-foreground text-center">
                                        Code sent to {phone}
                                    </p>
                                </div>
                                {error && <p className="text-sm text-destructive">{error}</p>}
                                <Button type="submit" className="w-full h-11" disabled={loading}>
                                    {loading ? "Verifying..." : "Verify & Login"}
                                </Button>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    className="w-full"
                                    onClick={() => setStep("signIn")}
                                >
                                    Change Number
                                </Button>
                            </form>
                        )}
                    </TabsContent>
                </Tabs>

                <div className="text-center mt-6">
                    <p className="text-sm text-muted-foreground">
                        Don't have an account?{" "}
                        <Link href="/signup" className="text-primary hover:underline">
                            Sign up
                        </Link>
                    </p>
                    <p className="text-xs text-muted-foreground mt-4">
                        By signing in, you agree to our Terms of Service and Privacy Policy.
                    </p>
                </div>
            </div>
        </div>
    )
}
