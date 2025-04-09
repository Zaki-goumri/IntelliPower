"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Bell, Mail, MessageSquare, Save } from "lucide-react"

export default function NotificationSettings() {
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [smsNotifications, setSmsNotifications] = useState(false)
  const [pushNotifications, setPushNotifications] = useState(true)
  const [emailAddress, setEmailAddress] = useState("admin@example.com")
  const [phoneNumber, setPhoneNumber] = useState("")

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center">
          <Bell className="h-5 w-5 mr-2 text-amber-500" />
          <CardTitle className="text-xl">Notification Settings</CardTitle>
        </div>
        <CardDescription>Configure how you receive alerts</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div className="space-y-0.5">
                  <Label htmlFor="email-notifications">Email Notifications</Label>
                  <div className="text-sm text-muted-foreground">Receive alerts via email</div>
                </div>
              </div>
              <Switch id="email-notifications" checked={emailNotifications} onCheckedChange={setEmailNotifications} />
            </div>

            {emailNotifications && (
              <div className="ml-6 space-y-2">
                <Label htmlFor="email-address">Email Address</Label>
                <Input
                  id="email-address"
                  type="email"
                  value={emailAddress}
                  onChange={(e) => setEmailAddress(e.target.value)}
                />
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                <div className="space-y-0.5">
                  <Label htmlFor="sms-notifications">SMS Notifications</Label>
                  <div className="text-sm text-muted-foreground">Receive alerts via SMS</div>
                </div>
              </div>
              <Switch id="sms-notifications" checked={smsNotifications} onCheckedChange={setSmsNotifications} />
            </div>

            {smsNotifications && (
              <div className="ml-6 space-y-2">
                <Label htmlFor="phone-number">Phone Number</Label>
                <Input
                  id="phone-number"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bell className="h-4 w-4 text-muted-foreground" />
              <div className="space-y-0.5">
                <Label htmlFor="push-notifications">Push Notifications</Label>
                <div className="text-sm text-muted-foreground">Receive alerts on your devices</div>
              </div>
            </div>
            <Switch id="push-notifications" checked={pushNotifications} onCheckedChange={setPushNotifications} />
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
