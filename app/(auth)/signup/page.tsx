"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useMutation } from "convex/react"
import { api } from "../../../convex/_generated/api"

export default function SignupPage() {
    const router = useRouter()
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(false)

    const createUser = useMutation(api.users.createUser)

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            await createUser({ name, email })
            localStorage.setItem("user_email", email)
            router.push("/connect")
        } catch (error) {
            console.error("Signup failed", error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen grid lg:grid-cols-2">
            <div className="hidden lg:flex flex-col justify-between bg-zinc-900 p-12 text-white">
                <div className="flex items-center gap-2 font-bold text-xl">
                    ReplyAI
                </div>
                <div className="max-w-md">
                    <h2 className="text-4xl font-bold mb-4">Join thousands of users automating their workflow.</h2>
                </div>
                <div className="text-sm text-zinc-500">
                    &copy; 2024 ReplyAI Inc.
                </div>
            </div>
            <div className="flex items-center justify-center p-8 bg-background">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold tracking-tight">Create an account</h1>
                        <p className="text-muted-foreground mt-2">Enter your details below to create your account</p>
                    </div>

                    <form onSubmit={handleSignup} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                                id="name"
                                type="text"
                                placeholder="John Doe"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="h-11"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="h-11"
                            />
                        </div>

                        <Button type="submit" className="w-full h-11" disabled={loading}>
                            {loading ? "Creating account..." : "Create Account"}
                        </Button>
                    </form>

                    <p className="text-center text-sm text-muted-foreground">
                        Already have an account? <Link href="/login" className="underline hover:text-primary">Log in</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
