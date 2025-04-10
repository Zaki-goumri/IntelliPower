import TemperatureMonitor from "@/components/temperature-monitor"
import PowerConsumption from "@/components/power-consumption"
import HVACControl from "@/components/hvac-control"

export default function DashboardPage() {
  return (
    <main className="flex min-h-screen flex-col p-6 w-full">
      <h1 className="text-3xl font-bold mb-6 w-full">Intelligent Power & Security System</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <TemperatureMonitor />
        <PowerConsumption />
        <HVACControl />
      </div>
    </main>
  )
}
