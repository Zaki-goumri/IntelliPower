"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PenToolIcon as Tool, Save, Calendar, RefreshCw, Download } from "lucide-react"

export default function MaintenanceSettings() {
  const [autoBackup, setAutoBackup] = useState(true)
  const [backupFrequency, setBackupFrequency] = useState("daily")
  const [maintenanceMode, setMaintenanceMode] = useState(false)
  const [autoUpdate, setAutoUpdate] = useState(true)

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center">
          <Tool className="h-5 w-5 mr-2 text-orange-500" />
          <CardTitle className="text-xl">Maintenance Settings</CardTitle>
        </div>
        <CardDescription>Configure system maintenance options</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Download className="h-4 w-4 text-muted-foreground" />
                <div className="space-y-0.5">
                  <Label htmlFor="auto-backup">Automatic Backups</Label>
                  <div className="text-sm text-muted-foreground">Schedule regular system backups</div>
                </div>
              </div>
              <Switch id="auto-backup" checked={autoBackup} onCheckedChange={setAutoBackup} />
            </div>

            {autoBackup && (
              <div className="ml-6 space-y-2">
                <Label htmlFor="backup-frequency">Backup Frequency</Label>
                <Select value={backupFrequency} onValueChange={setBackupFrequency}>
                  <SelectTrigger id="backup-frequency">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hourly">Hourly</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <RefreshCw className="h-4 w-4 text-muted-foreground" />
              <div className="space-y-0.5">
                <Label htmlFor="auto-update">Automatic Updates</Label>
                <div className="text-sm text-muted-foreground">Install updates automatically</div>
              </div>
            </div>
            <Switch id="auto-update" checked={autoUpdate} onCheckedChange={setAutoUpdate} />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div className="space-y-0.5">
                <Label htmlFor="maintenance-mode">Maintenance Mode</Label>
                <div className="text-sm text-muted-foreground">Temporarily disable system access</div>
              </div>
            </div>
            <Switch id="maintenance-mode" checked={maintenanceMode} onCheckedChange={setMaintenanceMode} />
          </div>

          <div className="flex justify-between pt-2">
            <Button variant="outline" type="button">
              <Download className="h-4 w-4 mr-2" />
              Backup Now
            </Button>
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
