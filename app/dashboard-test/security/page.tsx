import SecurityDashboard from "@/components/security-dashboard"
import AccessControl from "@/components/access-control"
import AlertsLog from "@/components/alerts-log"

export default function SecurityPage() {
  return (
    <main className="flex min-h-screen flex-col p-6">
      <h1 className="text-3xl font-bold mb-6">Security Management</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SecurityDashboard />
        </div>
        <div className="space-y-6">
          <AccessControl />
          <AlertsLog />
        </div>
      </div>
    </main>
  )
}
