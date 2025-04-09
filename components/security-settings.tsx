"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Shield, Save, Key, Lock, Clock } from "lucide-react"

export default function SecuritySettings() {
  const [jwtExpiry, setJwtExpiry] = useState("24")
  const [autoLogout, setAutoLogout] = useState(true)
  const [sessionTimeout, setSessionTimeout] = useState("30")
  const [passwordExpiry, setPasswordExpiry] = useState("90")
  const [refreshTokenEnabled, setRefreshTokenEnabled] = useState(true)

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center">
          <Shield className="h-5 w-5 mr-2 text-green-500" />
          <CardTitle className="text-xl">Security Settings</CardTitle>
        </div>
        <CardDescription>Configure system security options</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Key className="h-4 w-4 text-muted-foreground" />
              <Label htmlFor="jwt-expiry">JWT Token Expiry (hours)</Label>
            </div>
            <Select value={jwtExpiry} onValueChange={setJwtExpiry}>
              <SelectTrigger id="jwt-expiry">
                <SelectValue placeholder="Select expiry time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 hour</SelectItem>
                <SelectItem value="6">6 hours</SelectItem>
                <SelectItem value="12">12 hours</SelectItem>
                <SelectItem value="24">24 hours</SelectItem>
                <SelectItem value="48">48 hours</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Key className="h-4 w-4 text-muted-foreground" />
              <div className="space-y-0.5">
                <Label htmlFor="refresh-token">Refresh Token</Label>
                <div className="text-sm text-muted-foreground">Enable JWT refresh tokens</div>
              </div>
            </div>
            <Switch id="refresh-token" checked={refreshTokenEnabled} onCheckedChange={setRefreshTokenEnabled} />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div className="space-y-0.5">
                  <Label htmlFor="auto-logout">Automatic Logout</Label>
                  <div className="text-sm text-muted-foreground">Log out inactive sessions</div>
                </div>
              </div>
              <Switch id="auto-logout" checked={autoLogout} onCheckedChange={setAutoLogout} />
            </div>

            {autoLogout && (
              <div className="ml-6 space-y-2">
                <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                <Select value={sessionTimeout} onValueChange={setSessionTimeout}>
                  <SelectTrigger id="session-timeout">
                    <SelectValue placeholder="Select timeout" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="120">2 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Lock className="h-4 w-4 text-muted-foreground" />
              <Label htmlFor="password-expiry">Password Expiry (days)</Label>
            </div>
            <Select value={passwordExpiry} onValueChange={setPasswordExpiry}>
              <SelectTrigger id="password-expiry">
                <SelectValue placeholder="Select expiry period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">30 days</SelectItem>
                <SelectItem value="60">60 days</SelectItem>
                <SelectItem value="90">90 days</SelectItem>
                <SelectItem value="180">180 days</SelectItem>
                <SelectItem value="never">Never</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit">
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
