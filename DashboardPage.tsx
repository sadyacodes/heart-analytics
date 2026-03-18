import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Activity, Loader2 } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';

/**
 * Dashboard Page Component
 * Main entry point for health assessment with three key health questions
 * Collects user data and triggers health analysis
 */
export default function DashboardPage() {
  const navigate = useNavigate();
  const [ageGroup, setAgeGroup] = useState('');
  const [activityLevel, setActivityLevel] = useState('');
  const [smokingHabits, setSmoking] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  /**
   * Health Analysis Function
   * This function processes the user's health data and performs risk assessment
   * 
   * TODO: GEMINI API INTEGRATION POINT
   * Replace the setTimeout simulation below with actual Gemini API call
   * Example structure:
   * 
   * const response = await fetch('GEMINI_API_ENDPOINT', {
   *   method: 'POST',
   *   headers: { 'Content-Type': 'application/json' },
   *   body: JSON.stringify({
   *     ageGroup,
   *     activityLevel,
   *     smokingHabits,
   *     prompt: 'Analyze health risk based on these factors...'
   *   })
   * });
   * const data = await response.json();
   * 
   * Store the analysis result in localStorage for use in other pages
   */
  const handleAnalyze = async () => {
    if (!ageGroup || !activityLevel || !smokingHabits) {
      alert('Please answer all questions before analyzing');
      return;
    }

    setIsAnalyzing(true);

    // Simulate API call - Replace with actual Gemini API integration
    setTimeout(() => {
      // Calculate basic risk score
      let riskScore = 0;
      
      if (ageGroup === '55+') riskScore += 3;
      else if (ageGroup === '45-54') riskScore += 2;
      else if (ageGroup === '35-44') riskScore += 1;
      
      if (activityLevel === 'low') riskScore += 3;
      else if (activityLevel === 'moderate') riskScore += 1;
      
      if (smokingHabits === 'yes') riskScore += 4;
      
      const riskLevel = riskScore >= 6 ? 'High' : riskScore >= 3 ? 'Medium' : 'Low';
      
      // Store assessment result
      const assessment = {
        timestamp: new Date().toISOString(),
        ageGroup,
        activityLevel,
        smokingHabits,
        riskLevel,
        riskScore,
      };
      
      // Save to localStorage for prediction history
      const history = JSON.parse(localStorage.getItem('predictionHistory') || '[]');
      history.unshift(assessment);
      localStorage.setItem('predictionHistory', JSON.stringify(history.slice(0, 10)));
      
      // Save current assessment
      localStorage.setItem('currentAssessment', JSON.stringify(assessment));
      
      setIsAnalyzing(false);
      
      // Navigate to health analytics page
      navigate({ to: '/health-analytics' });
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-foreground">Health Assessment Dashboard</h1>
        <p className="text-muted-foreground">Answer three quick questions to get your personalized health risk analysis</p>
      </div>

      {/* Assessment Card */}
      <Card className="shadow-xl border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-6 h-6 text-primary" />
            Quick Health Assessment
          </CardTitle>
          <CardDescription>
            Provide your information below to receive an AI-powered health risk evaluation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Question 1: Age Group */}
          <div className="space-y-2">
            <Label htmlFor="age-group" className="text-base font-semibold">
              1. What is your age group?
            </Label>
            <Select value={ageGroup} onValueChange={setAgeGroup}>
              <SelectTrigger id="age-group" className="w-full">
                <SelectValue placeholder="Select your age group" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="18-34">18-34 years</SelectItem>
                <SelectItem value="35-44">35-44 years</SelectItem>
                <SelectItem value="45-54">45-54 years</SelectItem>
                <SelectItem value="55+">55+ years</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Question 2: Activity Level */}
          <div className="space-y-2">
            <Label htmlFor="activity-level" className="text-base font-semibold">
              2. What is your physical activity level?
            </Label>
            <Select value={activityLevel} onValueChange={setActivityLevel}>
              <SelectTrigger id="activity-level" className="w-full">
                <SelectValue placeholder="Select your activity level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low (Sedentary, little to no exercise)</SelectItem>
                <SelectItem value="moderate">Moderate (Exercise 2-3 times per week)</SelectItem>
                <SelectItem value="high">High (Exercise 4+ times per week)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Question 3: Smoking Habits */}
          <div className="space-y-2">
            <Label htmlFor="smoking" className="text-base font-semibold">
              3. Do you smoke?
            </Label>
            <Select value={smokingHabits} onValueChange={setSmoking}>
              <SelectTrigger id="smoking" className="w-full">
                <SelectValue placeholder="Select your smoking status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Yes, I smoke regularly</SelectItem>
                <SelectItem value="occasionally">Occasionally</SelectItem>
                <SelectItem value="no">No, I don't smoke</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Analyze Button */}
          <Button 
            onClick={handleAnalyze} 
            disabled={isAnalyzing || !ageGroup || !activityLevel || !smokingHabits}
            className="w-full h-12 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Analyzing Your Health Data...
              </>
            ) : (
              'Analyze My Health Risk'
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground leading-relaxed">
            <strong className="text-foreground">How it works:</strong> Our AI-powered system analyzes your responses 
            to provide a personalized health risk assessment. After completing the questions, you'll receive detailed 
            insights, risk factors, and recommendations on the Health Analytics page.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
