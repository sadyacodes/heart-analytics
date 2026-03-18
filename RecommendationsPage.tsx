import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Lightbulb, Heart, Apple, Dumbbell, Brain, Moon, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

/**
 * Recommendations Page Component
 * Displays preventive lifestyle recommendations dynamically loaded based on risk assessment
 * Organized by category: Diet, Exercise, Mental Health, and Sleep
 */
export default function RecommendationsPage() {
  const [assessment, setAssessment] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<any>({
    diet: [],
    exercise: [],
    mental: [],
    sleep: [],
  });

  useEffect(() => {
    // Load current assessment and generate recommendations
    const current = localStorage.getItem('currentAssessment');
    if (current) {
      const data = JSON.parse(current);
      setAssessment(data);
      generateRecommendations(data);
    }
  }, []);

  /**
   * Generate Recommendations Function
   * Creates personalized recommendations based on user's risk factors
   * Recommendations are categorized and tailored to the assessment results
   */
  const generateRecommendations = (data: any) => {
    const recs: any = {
      diet: [],
      exercise: [],
      mental: [],
      sleep: [],
    };

    // Diet recommendations
    recs.diet.push({
      title: 'Heart-Healthy Diet',
      description: 'Focus on fruits, vegetables, whole grains, and lean proteins. Limit saturated fats, trans fats, and sodium.',
      priority: 'high',
    });
    
    if (data.riskLevel === 'High' || data.riskLevel === 'Medium') {
      recs.diet.push({
        title: 'Reduce Sodium Intake',
        description: 'Aim for less than 2,300mg of sodium per day. Read food labels and avoid processed foods.',
        priority: 'high',
      });
      recs.diet.push({
        title: 'Increase Omega-3 Fatty Acids',
        description: 'Include fatty fish (salmon, mackerel) at least twice a week or consider supplements after consulting your doctor.',
        priority: 'medium',
      });
    }
    
    recs.diet.push({
      title: 'Stay Hydrated',
      description: 'Drink at least 8 glasses of water daily. Limit sugary drinks and excessive caffeine.',
      priority: 'medium',
    });

    // Exercise recommendations
    if (data.activityLevel === 'low') {
      recs.exercise.push({
        title: 'Start Moving More',
        description: 'Begin with 10-15 minutes of walking daily and gradually increase to 30 minutes most days of the week.',
        priority: 'high',
      });
      recs.exercise.push({
        title: 'Take Regular Breaks',
        description: 'If you have a desk job, stand up and move for 5 minutes every hour.',
        priority: 'medium',
      });
    } else if (data.activityLevel === 'moderate') {
      recs.exercise.push({
        title: 'Increase Intensity',
        description: 'Add 2-3 days of vigorous activity or strength training to your routine.',
        priority: 'medium',
      });
    } else {
      recs.exercise.push({
        title: 'Maintain Your Routine',
        description: 'Excellent! Continue your high activity level and ensure proper rest and recovery.',
        priority: 'low',
      });
    }
    
    recs.exercise.push({
      title: 'Include Strength Training',
      description: 'Add resistance exercises 2-3 times per week to build muscle and support heart health.',
      priority: 'medium',
    });
    
    recs.exercise.push({
      title: 'Try Low-Impact Activities',
      description: 'Swimming, cycling, or yoga are excellent for cardiovascular health with less joint stress.',
      priority: 'low',
    });

    // Mental health recommendations
    recs.mental.push({
      title: 'Stress Management',
      description: 'Practice relaxation techniques like deep breathing, meditation, or mindfulness for 10-15 minutes daily.',
      priority: 'high',
    });
    
    if (data.smokingHabits === 'yes') {
      recs.mental.push({
        title: 'Quit Smoking Support',
        description: 'Consider joining a smoking cessation program. Seek support from friends, family, or professionals.',
        priority: 'high',
      });
    }
    
    recs.mental.push({
      title: 'Social Connections',
      description: 'Maintain strong social relationships. Regular interaction with friends and family supports mental and heart health.',
      priority: 'medium',
    });
    
    recs.mental.push({
      title: 'Limit Alcohol',
      description: 'If you drink, do so in moderation: up to one drink per day for women, two for men.',
      priority: 'medium',
    });

    // Sleep recommendations
    recs.sleep.push({
      title: 'Consistent Sleep Schedule',
      description: 'Aim for 7-9 hours of sleep per night. Go to bed and wake up at the same time every day.',
      priority: 'high',
    });
    
    recs.sleep.push({
      title: 'Create a Sleep-Friendly Environment',
      description: 'Keep your bedroom cool, dark, and quiet. Avoid screens for at least 1 hour before bedtime.',
      priority: 'medium',
    });
    
    recs.sleep.push({
      title: 'Address Sleep Disorders',
      description: 'If you snore loudly or feel tired despite adequate sleep, consult a doctor about sleep apnea.',
      priority: data.riskLevel === 'High' ? 'high' : 'low',
    });

    setRecommendations(recs);
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive">High Priority</Badge>;
      case 'medium':
        return <Badge variant="secondary">Medium Priority</Badge>;
      default:
        return <Badge variant="default">Recommended</Badge>;
    }
  };

  if (!assessment) {
    return (
      <div className="max-w-5xl mx-auto">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            No assessment data available. Please complete an assessment on the Dashboard to receive personalized recommendations.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-foreground flex items-center gap-3">
          <Lightbulb className="w-10 h-10 text-primary" />
          Health Recommendations
        </h1>
        <p className="text-muted-foreground">Personalized lifestyle guidance to improve your heart health</p>
      </div>

      {/* Risk Level Summary */}
      <Card className="shadow-lg border-border/50">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Your Current Risk Level</p>
              <Badge 
                variant={assessment.riskLevel === 'High' ? 'destructive' : assessment.riskLevel === 'Medium' ? 'secondary' : 'default'}
                className="text-lg px-4 py-2"
              >
                {assessment.riskLevel}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground max-w-md">
              These recommendations are tailored to your risk profile and can help you improve your overall heart health.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations Tabs */}
      <Card className="shadow-xl border-border/50">
        <CardHeader>
          <CardTitle>Lifestyle Recommendations</CardTitle>
          <CardDescription>Explore recommendations by category</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="diet" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="diet" className="gap-2">
                <Apple className="w-4 h-4" />
                Diet
              </TabsTrigger>
              <TabsTrigger value="exercise" className="gap-2">
                <Dumbbell className="w-4 h-4" />
                Exercise
              </TabsTrigger>
              <TabsTrigger value="mental" className="gap-2">
                <Brain className="w-4 h-4" />
                Mental Health
              </TabsTrigger>
              <TabsTrigger value="sleep" className="gap-2">
                <Moon className="w-4 h-4" />
                Sleep
              </TabsTrigger>
            </TabsList>

            <TabsContent value="diet" className="space-y-4 mt-6">
              {recommendations.diet.map((rec: any, index: number) => (
                <Card key={index} className="border-border/50">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">{rec.title}</CardTitle>
                      {getPriorityBadge(rec.priority)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">{rec.description}</p>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="exercise" className="space-y-4 mt-6">
              {recommendations.exercise.map((rec: any, index: number) => (
                <Card key={index} className="border-border/50">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">{rec.title}</CardTitle>
                      {getPriorityBadge(rec.priority)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">{rec.description}</p>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="mental" className="space-y-4 mt-6">
              {recommendations.mental.map((rec: any, index: number) => (
                <Card key={index} className="border-border/50">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">{rec.title}</CardTitle>
                      {getPriorityBadge(rec.priority)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">{rec.description}</p>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="sleep" className="space-y-4 mt-6">
              {recommendations.sleep.map((rec: any, index: number) => (
                <Card key={index} className="border-border/50">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">{rec.title}</CardTitle>
                      {getPriorityBadge(rec.priority)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">{rec.description}</p>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Important Notice */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="pt-6 flex items-start gap-3">
          <Heart className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              <strong className="text-foreground">Remember:</strong> These recommendations are general guidelines. 
              Always consult with your healthcare provider before making significant changes to your diet, exercise routine, 
              or lifestyle, especially if you have existing health conditions or are taking medications.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
