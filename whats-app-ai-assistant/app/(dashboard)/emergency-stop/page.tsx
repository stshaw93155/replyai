"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { OctagonAlertIcon, PowerIcon, CheckCircleIcon, WhatsAppIcon } from "@/components/icons"

export default function EmergencyStopPage() {
  const [isStopped, setIsStopped] = useState(false)
  const router = useRouter()

  const handleEmergencyStop = () => {
    setIsStopped(true)
  }

  const handleResume = () => {
    setIsStopped(false)
    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        {!isStopped ? (
          <Card className="border-destructive/30">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
                  <OctagonAlertIcon className="w-8 h-8 text-destructive" />
                </div>
              </div>
              <CardTitle className="text-xl">Emergency Stop</CardTitle>
              <CardDescription>Immediately stop all AI activity and disconnect WhatsApp</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-lg bg-muted text-sm space-y-2">
                <p>This action will:</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Stop all AI replies immediately</li>
                  <li>Pause monitoring of all chats</li>
                  <li>Keep your session active for manual use</li>
                </ul>
              </div>
              <Button variant="destructive" size="lg" className="w-full gap-2" onClick={handleEmergencyStop}>
                <PowerIcon className="w-5 h-5" />
                Stop All AI Activity
              </Button>
              <Button variant="ghost" className="w-full" onClick={() => router.push("/dashboard")}>
                Cancel
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <CheckCircleIcon className="w-8 h-8 text-primary" />
                </div>
              </div>
              <CardTitle className="text-xl">AI Activity Stopped</CardTitle>
              <CardDescription>All AI replies have been paused. You are now in full control.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-lg bg-muted">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center">
                    <WhatsAppIcon className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">WhatsApp Connected</p>
                    <p className="text-sm text-muted-foreground">AI is paused, session still active</p>
                  </div>
                </div>
              </div>
              <Button size="lg" className="w-full gap-2" onClick={handleResume}>
                Resume AI Assistant
              </Button>
              <Button variant="outline" className="w-full bg-transparent" onClick={() => router.push("/dashboard")}>
                Go to Dashboard
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
