import AIInsights from "@/components/ai-insights"
import PredictiveAnalytics from "@/components/predictive-analytics"
import AnomalyDetection from "@/components/anomaly-detection"

export default function AnalyticsPage() {
  return (
    <main className="flex min-h-screen flex-col p-6">
      <h1 className="text-3xl font-bold mb-6">AI Analytics</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AIInsights />
        <div className="space-y-6">
          <PredictiveAnalytics />
          <AnomalyDetection />
        </div>
      </div>
    </main>
  )
}
