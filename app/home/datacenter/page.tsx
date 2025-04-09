import DataCenterMap from "@/components/datacenter-map"

export default function DataCenterPage() {
  return (
    <main className="flex min-h-screen flex-col p-6">
      <h1 className="text-3xl font-bold mb-6">Data Center Monitoring</h1>
      <div className="h-[calc(100vh-150px)]">
        <DataCenterMap />
      </div>
    </main>
  )
}
