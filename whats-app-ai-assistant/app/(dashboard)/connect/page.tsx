"use client"

import { useSocket } from "@/components/providers/socket-provider"
import { useEffect, useState } from "react"
import { QRCodeSVG } from "qrcode.react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react"

export default function ConnectPage() {
  const { socket, isConnected } = useSocket()
  const [qrCode, setQrCode] = useState<string | null>(null)
  const [connectionStatus, setConnectionStatus] = useState("disconnected")

  useEffect(() => {
    if (!socket) return

    socket.on("connection.update", (data: any) => {
      console.log("Connection Update:", data)
      if (data.qr) {
        setQrCode(data.qr)
        setConnectionStatus("scan_qr")
      }
      if (data.connection) {
        setConnectionStatus(data.connection)
        if (data.connection === "open") {
          setQrCode(null) // Clear QR on success
        }
      }
    })

    return () => {
      socket.off("connection.update")
    }
  }, [socket])

  return (
    <div className="flex-1 flex items-center justify-center p-4 bg-muted/30">
      <Card className="w-full max-w-md border-none shadow-lg">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-xl">Connect WhatsApp</CardTitle>
          <CardDescription>
            {connectionStatus === "open"
              ? "Successfully connected!"
              : "Scan the QR code to connect your account"}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-6 min-h-[300px]">
          {!isConnected ? (
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p>Connecting to server...</p>
            </div>
          ) : connectionStatus === "open" ? (
            <div className="flex flex-col items-center gap-4 animate-in zoom-in duration-300">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-primary" />
              </div>
              <p className="text-center text-muted-foreground">
                Your WhatsApp account is now linked and active.
              </p>
            </div>
          ) : qrCode ? (
            <div className="bg-white p-4 rounded-xl shadow-sm animate-in fade-in duration-500">
              <QRCodeSVG value={qrCode} size={250} level="M" />
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <Loader2 className="w-8 h-8 animate-spin" />
              <p>Generating QR Code...</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
