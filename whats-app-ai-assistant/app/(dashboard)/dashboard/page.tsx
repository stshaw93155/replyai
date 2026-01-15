"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import {
  CoffeeIcon,
  BriefcaseIcon,
  UsersIcon,
  HeartIcon,
  ActivityIcon,
  MessageSquareIcon,
  SendIcon,
  ClockIcon,
  ZapIcon,
  ChevronRightIcon,
  WhatsAppIcon,
  PowerIcon,
} from "@/components/icons"

export default function DashboardPage() {
  const [modes, setModes] = useState({
    away: true,
    client: false,
    personal: false,
    gf: false,
  })

  const toggleMode = (mode: keyof typeof modes) => {
    setModes((prev) => ({ ...prev, [mode]: !prev[mode] }))
  }

  const stats = [
    { label: "Messages Today", value: "24", icon: MessageSquareIcon },
    { label: "AI Replies Sent", value: "18", icon: SendIcon },
    { label: "Avg Response Time", value: "4s", icon: ClockIcon },
    { label: "Active Chats", value: "7", icon: ZapIcon },
  ]

  const recentActivity = [
    { name: "John Doe", message: "Hey, are you free?", time: "2m ago", aiReplied: true },
    { name: "Sarah", message: "Meeting at 3pm?", time: "5m ago", aiReplied: true },
    { name: "Mom", message: "Call me when you can", time: "12m ago", aiReplied: false },
    { name: "Work Group", message: "Project update needed", time: "18m ago", aiReplied: true },
  ]

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Monitor your AI assistant activity</p>
        </div>
        <Link href="/emergency-stop">
          <Button variant="destructive" size="sm" className="gap-2">
            <PowerIcon className="w-4 h-4" />
            Emergency Stop
          </Button>
        </Link>
      </div>

      {/* Connection Status Banner */}
      <Card className="mb-6 bg-primary/5 border-primary/20">
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <WhatsAppIcon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">WhatsApp Connected</p>
                <p className="text-sm text-muted-foreground">AI assistant is active and monitoring</p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Live
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <stat.icon className="w-5 h-5 text-muted-foreground" />
              </div>
              <p className="text-2xl font-bold mt-2">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Reply Modes */}
        <Card>
          <CardHeader>
            <CardTitle>Reply Modes</CardTitle>
            <CardDescription>Configure how the AI responds in different scenarios</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <ModeToggle
              label="Away Mode"
              description="Short absences - calm, brief replies"
              icon={<CoffeeIcon className="w-5 h-5" />}
              enabled={modes.away}
              onToggle={() => toggleMode("away")}
            />
            <ModeToggle
              label="Client Mode"
              description="Professional chats - formal, safe tone"
              icon={<BriefcaseIcon className="w-5 h-5" />}
              enabled={modes.client}
              onToggle={() => toggleMode("client")}
            />
            <ModeToggle
              label="Personal Mode"
              description="Friends - casual, slang allowed"
              icon={<UsersIcon className="w-5 h-5" />}
              enabled={modes.personal}
              onToggle={() => toggleMode("personal")}
            />
            <ModeToggle
              label="GF Mode"
              description="Sensitive - light replies only"
              icon={<HeartIcon className="w-5 h-5" />}
              enabled={modes.gf}
              onToggle={() => toggleMode("gf")}
            />
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest messages and AI responses</CardDescription>
              </div>
              <Link href="/chats">
                <Button variant="ghost" size="sm" className="gap-1">
                  View All
                  <ChevronRightIcon className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
                    {activity.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium truncate">{activity.name}</p>
                      {activity.aiReplied && (
                        <span className="text-xs px-1.5 py-0.5 rounded bg-primary/10 text-primary">AI Replied</span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{activity.message}</p>
                  </div>
                  <span className="text-xs text-muted-foreground shrink-0">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Activity Log */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ActivityIcon className="w-5 h-5" />
            AI Activity Log
          </CardTitle>
          <CardDescription>Real-time log of AI decisions and actions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 font-mono text-sm">
            <div className="flex gap-4 p-2 rounded bg-muted/50">
              <span className="text-muted-foreground">14:32:18</span>
              <span className="text-primary">[INFO]</span>
              <span>Message received from John Doe</span>
            </div>
            <div className="flex gap-4 p-2 rounded bg-muted/50">
              <span className="text-muted-foreground">14:32:19</span>
              <span className="text-primary">[MODE]</span>
              <span>Using Away Mode - calm tone</span>
            </div>
            <div className="flex gap-4 p-2 rounded bg-muted/50">
              <span className="text-muted-foreground">14:32:21</span>
              <span className="text-primary">[AI]</span>
              <span>Generated response: "Hey! I'm a bit busy right now, will get back to you soon 👍"</span>
            </div>
            <div className="flex gap-4 p-2 rounded bg-muted/50">
              <span className="text-muted-foreground">14:32:24</span>
              <span className="text-primary">[SENT]</span>
              <span>Reply delivered with 3s delay</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
