"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { 
  Brain, 
  Trophy, 
  BarChart3, 
  Clock, 
  AlertTriangle,
  CheckCircle2,
  XCircle
} from "lucide-react"

interface TrainingScenario {
  id: string
  title: string
  description: string
  difficulty: "beginner" | "intermediate" | "advanced"
  status: "completed" | "in-progress" | "locked"
  score?: number
  time?: string
}

export default function AITrainingModule() {
  const [activeTab, setActiveTab] = useState("scenarios")
  const [currentScenario, setCurrentScenario] = useState<TrainingScenario | null>(null)
  const [performance, setPerformance] = useState({
    overallScore: 75,
    scenariosCompleted: 8,
    averageResponseTime: "2.5s",
    accuracy: 85
  })

  const scenarios: TrainingScenario[] = [
    {
      id: "1",
      title: "Unauthorized Access Attempt",
      description: "Respond to a suspicious individual attempting to gain access to the server room",
      difficulty: "beginner",
      status: "completed",
      score: 90,
      time: "1:45"
    },
    {
      id: "2",
      title: "Fire Emergency Protocol",
      description: "Coordinate evacuation and emergency response for a fire outbreak",
      difficulty: "intermediate",
      status: "in-progress"
    },
    {
      id: "3",
      title: "Cyber Attack Response",
      description: "Handle a coordinated cyber attack on critical systems",
      difficulty: "advanced",
      status: "locked"
    }
  ]

  const startScenario = (scenario: TrainingScenario) => {
    setCurrentScenario(scenario)
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">AI Security Training</CardTitle>
          <Badge variant="default" className="text-xs py-1">
            <Brain className="h-3 w-3 mr-1" />
            AI-Powered
          </Badge>
        </div>
        <CardDescription>Practice and improve your security response skills</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="scenarios">Scenarios</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
          </TabsList>

          <TabsContent value="scenarios" className="mt-4">
            <div className="space-y-4">
              {scenarios.map((scenario) => (
                <div
                  key={scenario.id}
                  className="p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium">{scenario.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {scenario.description}
                      </p>
                      <div className="flex items-center mt-2 space-x-2">
                        <Badge variant="outline" className="text-xs">
                          {scenario.difficulty}
                        </Badge>
                        {scenario.status === "completed" && (
                          <Badge variant="secondary" className="text-xs">
                            Score: {scenario.score}%
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {scenario.status === "completed" && (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      )}
                      {scenario.status === "in-progress" && (
                        <Clock className="h-5 w-5 text-blue-500" />
                      )}
                      {scenario.status === "locked" && (
                        <XCircle className="h-5 w-5 text-muted-foreground" />
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={scenario.status === "locked"}
                        onClick={() => startScenario(scenario)}
                      >
                        {scenario.status === "completed" ? "Retry" : "Start"}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="performance" className="mt-4">
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Overall Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <Trophy className="h-5 w-5 text-yellow-500" />
                    <span className="text-2xl font-bold">{performance.overallScore}%</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Scenarios Completed</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <span className="text-2xl font-bold">{performance.scenariosCompleted}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Average Response Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-blue-500" />
                    <span className="text-2xl font-bold">{performance.averageResponseTime}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Accuracy</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5 text-purple-500" />
                    <span className="text-2xl font-bold">{performance.accuracy}%</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="progress" className="mt-4">
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Training Progress</span>
                  <span className="text-sm text-muted-foreground">60%</span>
                </div>
                <Progress value={60} className="h-2" />
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Skill Level</span>
                  <span className="text-sm text-muted-foreground">Intermediate</span>
                </div>
                <Progress value={75} className="h-2" />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Response Time</span>
                  <span className="text-sm text-muted-foreground">Improving</span>
                </div>
                <Progress value={85} className="h-2" />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
} 