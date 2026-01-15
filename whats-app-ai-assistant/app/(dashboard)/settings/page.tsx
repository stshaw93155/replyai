"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { CoffeeIcon, BriefcaseIcon, UsersIcon, HeartIcon } from "@/components/icons"

export default function SettingsPage() {
  const [userStyle, setUserStyle] = useState({
    language: "english",
    tone: "calm",
    emojiUsage: "medium",
    replyLength: "short",
  })

  const [modes, setModes] = useState({
    away: true,
    client: false,
    personal: false,
    gf: false,
  })

  const [safetyKeywords, setSafetyKeywords] = useState("we need to talk, call me, serious, urgent, emergency")

  const toggleMode = (mode: keyof typeof modes) => {
    setModes((prev) => ({ ...prev, [mode]: !prev[mode] }))
  }

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">Configure your AI assistant preferences</p>
      </div>

      <div className="space-y-6">
        {/* User Style */}
        <Card>
          <CardHeader>
            <CardTitle>Your Communication Style</CardTitle>
            <CardDescription>Help the AI match your natural way of texting</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="language">Primary Language</Label>
                <select
                  id="language"
                  value={userStyle.language}
                  onChange={(e) => setUserStyle({ ...userStyle, language: e.target.value })}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="english">English</option>
                  <option value="hindi">Hindi</option>
                  <option value="hinglish">Hinglish</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tone">Tone</Label>
                <select
                  id="tone"
                  value={userStyle.tone}
                  onChange={(e) => setUserStyle({ ...userStyle, tone: e.target.value })}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="calm">Calm</option>
                  <option value="emotional">Emotional</option>
                  <option value="formal">Formal</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="emoji">Emoji Usage</Label>
                <select
                  id="emoji"
                  value={userStyle.emojiUsage}
                  onChange={(e) => setUserStyle({ ...userStyle, emojiUsage: e.target.value })}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="length">Reply Length</Label>
                <select
                  id="length"
                  value={userStyle.replyLength}
                  onChange={(e) => setUserStyle({ ...userStyle, replyLength: e.target.value })}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="short">Short</option>
                  <option value="medium">Medium</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reply Modes */}
        <Card>
          <CardHeader>
            <CardTitle>Reply Modes</CardTitle>
            <CardDescription>Enable modes for different types of conversations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <ModeToggle
              label="Away Mode"
              description="For short absences - calm, brief replies"
              icon={<CoffeeIcon className="w-5 h-5" />}
              enabled={modes.away}
              onToggle={() => toggleMode("away")}
            />
            <ModeToggle
              label="Client Mode"
              description="Professional chats - formal, safe, neutral tone"
              icon={<BriefcaseIcon className="w-5 h-5" />}
              enabled={modes.client}
              onToggle={() => toggleMode("client")}
            />
            <ModeToggle
              label="Personal Mode"
              description="Friends - casual tone, slang allowed"
              icon={<UsersIcon className="w-5 h-5" />}
              enabled={modes.personal}
              onToggle={() => toggleMode("personal")}
            />
            <ModeToggle
              label="GF Mode"
              description="Sensitive - light replies only, no deep emotions"
              icon={<HeartIcon className="w-5 h-5" />}
              enabled={modes.gf}
              onToggle={() => toggleMode("gf")}
            />
          </CardContent>
        </Card>

        {/* Safety Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Safety Settings</CardTitle>
            <CardDescription>Configure when the AI should pause and let you take over</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="keywords">Escalation Keywords</Label>
              <Input
                id="keywords"
                value={safetyKeywords}
                onChange={(e) => setSafetyKeywords(e.target.value)}
                placeholder="we need to talk, call me, serious..."
              />
              <p className="text-sm text-muted-foreground">AI will pause when it detects these keywords in messages</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="maxReplies">Max AI Replies per Chat</Label>
                <Input id="maxReplies" type="number" defaultValue={5} min={1} max={20} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="delay">Reply Delay (seconds)</Label>
                <Input id="delay" type="number" defaultValue={4} min={2} max={10} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-destructive/30">
          <CardHeader>
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
            <CardDescription>Irreversible actions for your account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg border border-border">
              <div>
                <p className="font-medium">Disconnect WhatsApp</p>
                <p className="text-sm text-muted-foreground">End your current WhatsApp session</p>
              </div>
              <Button variant="outline">Disconnect</Button>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg border border-border">
              <div>
                <p className="font-medium">Delete All Data</p>
                <p className="text-sm text-muted-foreground">Remove all your data and chat history</p>
              </div>
              <Button variant="destructive">Delete</Button>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button size="lg">Save Settings</Button>
        </div>
      </div>
    </div>
  )
}
