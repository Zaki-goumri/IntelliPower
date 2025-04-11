import SystemSettings from "@/components/system-settings"
import NotificationSettings from "@/components/notification-settings"
import SecuritySettings from "@/components/security-settings"
import MaintenanceSettings from "@/components/maintenance-settings"

export default function SettingsPage() {
  return (
    <main className="flex min-h-screen flex-col p-6">
      <h1 className="text-3xl font-bold mb-6">System Settings</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SystemSettings />
        <NotificationSettings />
        <MaintenanceSettings />
      </div>
    </main>
  )
}
