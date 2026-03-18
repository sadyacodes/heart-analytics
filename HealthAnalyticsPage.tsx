import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { Activity, MapPin, Search, AlertCircle, Stethoscope } from 'lucide-react';

/**
 * Health Analytics Page Component
 * Displays visual health risk charts using Recharts library
 * Shows location-based doctor search for high-risk users
 */
export default function HealthAnalyticsPage() {
  const [assessment, setAssessment] = useState<any>(null);
  const [location, setLocation] = useState('');
  const [showDoctorSearch, setShowDoctorSearch] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    // Load current assessment from localStorage
    const current = localStorage.getItem('currentAssessment');
    if (current) {
      const data = JSON.parse(current);
      setAssessment(data);
      
      // Show doctor search if risk is high
      if (data.riskLevel === 'High') {
        setShowDoctorSearch(true);
      }
    }
  }, []);

  /**
   * Doctor Search Function
   * Searches for nearby healthcare providers based on user location
   * 
   * TODO: GOOGLE MAPS API INTEGRATION POINT
   * Replace the simulation below with actual Google Maps Places API call
   * 
   * Example implementation:
   * const response = await fetch(
   *   `https://maps.googleapis.com/maps/api/place/textsearch/json?query=cardiologist+in+${location}&key=YOUR_API_KEY`
   * );
   * const data = await response.json();
   * 
   * Alternative: GEMINI API INTEGRATION
   * Use Gemini to recommend doctors based on location and specialization
   * const response = await fetch('GEMINI_API_ENDPOINT', {
   *   method: 'POST',
   *   body: JSON.stringify({
   *     prompt: `Find cardiologists near ${location}`,
   *     location: location
   *   })
   * });
   */
  const handleDoctorSearch = async () => {
    if (!location.trim()) {
      alert('Please enter your location');
      return;
    }

    setIsSearching(true);

    // Simulate API call - Replace with actual Google Maps or Gemini API
    setTimeout(() => {
      setIsSearching(false);
      alert(`Doctor search for location: ${location}\n\nThis is a placeholder. Integrate Google Maps Places API or Gemini API to show real results.\n\nExample doctors:\n- Dr. Smith - Cardiologist (2.3 mi)\n- Heart Health Center (3.1 mi)\n- Dr. Johnson - Cardiovascular Specialist (4.5 mi)`);
    }, 1500);
  };

  if (!assessment) {
    return (
      <div className="max-w-5xl mx-auto">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            No assessment data available. Please complete an assessment on the Dashboard first.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Prepare chart data
  const riskDistributionData = [
    { name: 'Low Risk', value: assessment.riskLevel === 'Low' ? 1 : 0, color: '#22c55e' },
    { name: 'Medium Risk', value: assessment.riskLevel === 'Medium' ? 1 : 0, color: '#eab308' },
    { name: 'High Risk', value: assessment.riskLevel === 'High' ? 1 : 0, color: '#ef4444' },
  ];

  const factorsData = [
    { factor: 'Age', score: assessment.ageGroup === '55+' ? 3 : assessment.ageGroup === '45-54' ? 2 : 1 },
    { factor: 'Activity', score: assessment.activityLevel === 'low' ? 3 : assessment.activityLevel === 'moderate' ? 1 : 0 },
    { factor: 'Smoking', score: assessment.smokingHabits === 'yes' ? 4 : assessment.smokingHabits === 'occasionally' ? 2 : 0 },
  ];

  const COLORS = ['#22c55e', '#eab308', '#ef4444'];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-foreground flex items-center gap-3">
          <Activity className="w-10 h-10 text-primary" />
          Health Analytics
        </h1>
        <p className="text-muted-foreground">Visual analysis of your health risk assessment</p>
      </div>

      {/* Risk Level Card */}
      <Card className="shadow-xl border-border/50">
        <CardHeader>
          <CardTitle>Current Risk Assessment</CardTitle>
          <CardDescription>Based on your latest health evaluation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Risk Level</p>
              <Badge 
                variant={assessment.riskLevel === 'High' ? 'destructive' : assessment.riskLevel === 'Medium' ? 'secondary' : 'default'}
                className="text-lg px-4 py-2"
              >
                {assessment.riskLevel}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Risk Score</p>
              <p className="text-4xl font-bold text-primary">{assessment.riskScore}/10</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Assessment Date</p>
              <p className="text-sm font-medium">
                {new Date(assessment.timestamp).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Distribution Pie Chart */}
        <Card className="shadow-lg border-border/50">
          <CardHeader>
            <CardTitle>Risk Distribution</CardTitle>
            <CardDescription>Your current risk category</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={riskDistributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => (value > 0 ? name : '')}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {riskDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Risk Factors Bar Chart */}
        <Card className="shadow-lg border-border/50">
          <CardHeader>
            <CardTitle>Risk Factor Breakdown</CardTitle>
            <CardDescription>Individual factor contributions</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={factorsData}>
                <XAxis dataKey="factor" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="score" fill="oklch(var(--primary))" name="Risk Score" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Doctor Search Section - Only shown for High Risk */}
      {showDoctorSearch && (
        <Card className="shadow-xl border-destructive/50 bg-destructive/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <Stethoscope className="w-6 h-6" />
              Recommended: Consult a Healthcare Provider
            </CardTitle>
            <CardDescription>
              Your risk level indicates you should seek professional medical advice
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className="border-primary/50 bg-primary/5">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Based on your high-risk assessment, we strongly recommend scheduling an appointment with a cardiologist 
                or your primary care physician for a comprehensive evaluation.
              </AlertDescription>
            </Alert>

            <div className="space-y-3">
              <Label htmlFor="location" className="text-base font-semibold">
                Find Healthcare Providers Near You
              </Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="location"
                    placeholder="Enter your city or zip code"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button 
                  onClick={handleDoctorSearch} 
                  disabled={isSearching}
                  className="gap-2"
                >
                  <Search className="w-4 h-4" />
                  {isSearching ? 'Searching...' : 'Search'}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                * This feature will search for cardiologists and healthcare providers in your area using Google Maps API
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Info Card */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Understanding Your Analytics:</strong> These visualizations help you 
            understand which factors contribute most to your overall health risk. Use this information to make informed 
            decisions about lifestyle changes and when to seek medical advice.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
