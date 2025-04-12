import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { HelpCircle, Beaker, History, Sparkles, Clock, CheckCircle2, XCircle, AlertTriangle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import AITrainingModule from "@/components/ai-training-module"
import Image from "next/image"

interface ChallengeLog {
  id: string
  scenario: string
  date: string
  duration: string
  score: number
  status: "completed" | "failed" | "in-progress"
  aiRecommendations: string[]
}

const mockChallengeLogs: ChallengeLog[] = [
  {
    id: "1",
    scenario: "Unauthorized Access Attempt",
    date: "2024-04-12 14:30",
    duration: "2:15",
    score: 85,
    status: "completed",
    aiRecommendations: [
      "Consider implementing additional access control measures in high-security areas",
      "Response time could be improved by 15% with better coordination",
      "Excellent use of surveillance systems during the incident"
    ]
  },
  {
    id: "2",
    scenario: "Fire Emergency Protocol",
    date: "2024-04-11 09:45",
    duration: "3:45",
    score: 65,
    status: "completed",
    aiRecommendations: [
      "Evacuation procedures need to be more efficient",
      "Communication with emergency services was delayed",
      "Good handling of critical systems shutdown"
    ]
  },
  {
    id: "3",
    scenario: "Cyber Attack Response",
    date: "2024-04-10 16:20",
    duration: "4:30",
    score: 92,
    status: "completed",
    aiRecommendations: [
      "Excellent incident response time",
      "Consider implementing additional network segmentation",
      "Documentation of the incident was thorough and detailed"
    ]
  }
]

export default function ChallengePage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-2xl">AI Security Challenge</CardTitle>
          <CardDescription>
            Test your security response skills with AI-generated scenarios
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AITrainingModule />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <History className="h-5 w-5" />
              <CardTitle>Challenge History</CardTitle>
            </div>
            <Badge variant="outline" className="flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              AI Analysis
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {mockChallengeLogs.map((log) => (
              <div key={log.id} className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="font-medium">{log.scenario}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{log.date}</span>
                      <span>•</span>
                      <span>{log.duration}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={log.score >= 80 ? "default" : log.score >= 60 ? "secondary" : "destructive"}>
                      Score: {log.score}%
                    </Badge>
                    {log.status === "completed" ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : log.status === "failed" ? (
                      <XCircle className="h-5 w-5 text-red-500" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <span>AI Recommendations</span>
                  </div>
                  <ul className="space-y-2 pl-6">
                    {log.aiRecommendations.map((rec, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-primary">•</span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-dashed">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-2 rounded-full bg-primary/10">
              <HelpCircle className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">About AI Security Challenge</h3>
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Beaker className="h-3 w-3" />
                  Development Mode
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                The AI Security Challenge is an innovative training platform that uses artificial intelligence to create dynamic security scenarios. 
                Our AI system generates realistic security threats and adapts to your responses, providing a unique learning experience that evolves with your skills.
              </p>
              <div className="pt-2">
                <h4 className="text-sm font-medium mb-2">Key Features:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• AI-generated security scenarios that adapt to your performance</li>
                  <li>• Real-time feedback and performance analytics</li>
                  <li>• Gamified learning experience with progress tracking</li>
                  <li>• Integration with your facility's digital twin</li>
                </ul>
              </div>
              <div className="pt-4">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                      <HelpCircle className="h-4 w-4" />
                      Learn More
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                      <DialogTitle>AI Security Challenge Overview</DialogTitle>
                    </DialogHeader>
                    <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                      <Image
                        src="/challenge.svg"
                        alt="AI Security Challenge Overview"
                        fill
                        className="object-cover"
                        priority
                      />
                    </div>
                    <div className="mt-4 space-y-2">
                      <p className="text-sm text-muted-foreground">
                        Our AI Security Challenge platform provides an immersive training environment where security teams can practice responding to various threats in a safe, controlled setting.
                      </p>
                      <p className="text-sm text-muted-foreground">
                        The system uses advanced AI to generate realistic scenarios and provide personalized feedback, helping teams improve their response times and decision-making skills.
                      </p>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 