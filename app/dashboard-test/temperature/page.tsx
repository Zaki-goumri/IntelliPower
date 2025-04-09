import TemperatureMonitor from "@/components/temperature-monitor"
import HVACControl from "@/components/hvac-control"
import TemperatureHistory from "@/components/temperature-history"
import TemperatureAlerts from "@/components/temperature-alerts"

export default function TemperaturePage() {
  return (
    <main className="flex min-h-screen flex-col p-6">
      <h1 className="text-3xl font-bold mb-6">Temperature Management</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TemperatureMonitor />
        <HVACControl />
        <TemperatureHistory />
        <TemperatureAlerts />
      </div>
    </main>
  )
}
