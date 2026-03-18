import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { History, Trash2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface PredictionRecord {
  timestamp: string;
  ageGroup: string;
  activityLevel: string;
  smokingHabits: string;
  riskLevel: 'Low' | 'Medium' | 'High';
  riskScore: number;
}

/**
 * Prediction History Page Component
 * Displays a table of past health risk assessments with timestamps
 * Data is stored in localStorage and persists across sessions
 */
export default function PredictionHistoryPage() {
  const [history, setHistory] = useState<PredictionRecord[]>([]);

  useEffect(() => {
    // Load prediction history from localStorage
    const savedHistory = localStorage.getItem('predictionHistory');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  const clearHistory = () => {
    if (confirm('Are you sure you want to clear all prediction history?')) {
      localStorage.removeItem('predictionHistory');
      setHistory([]);
    }
  };

  const getRiskBadgeVariant = (level: string) => {
    switch (level) {
      case 'Low':
        return 'default';
      case 'Medium':
        return 'secondary';
      case 'High':
        return 'destructive';
      default:
        return 'default';
    }
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-foreground flex items-center gap-3">
            <History className="w-10 h-10 text-primary" />
            Prediction History
          </h1>
          <p className="text-muted-foreground">View your past health risk assessments and track changes over time</p>
        </div>
        {history.length > 0 && (
          <Button variant="destructive" onClick={clearHistory} className="gap-2">
            <Trash2 className="w-4 h-4" />
            Clear History
          </Button>
        )}
      </div>

      {/* History Table */}
      <Card className="shadow-xl border-border/50">
        <CardHeader>
          <CardTitle>Assessment Records</CardTitle>
          <CardDescription>
            {history.length} assessment{history.length !== 1 ? 's' : ''} recorded
          </CardDescription>
        </CardHeader>
        <CardContent>
          {history.length === 0 ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                No prediction history available. Complete an assessment on the Dashboard to see your results here.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="rounded-lg border border-border/50 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold">Date & Time</TableHead>
                    <TableHead className="font-semibold">Age Group</TableHead>
                    <TableHead className="font-semibold">Activity Level</TableHead>
                    <TableHead className="font-semibold">Smoking</TableHead>
                    <TableHead className="font-semibold">Risk Score</TableHead>
                    <TableHead className="font-semibold">Risk Level</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {history.map((record, index) => (
                    <TableRow key={index} className="hover:bg-muted/30 transition-colors">
                      <TableCell className="font-medium">{formatDate(record.timestamp)}</TableCell>
                      <TableCell>{record.ageGroup}</TableCell>
                      <TableCell className="capitalize">{record.activityLevel}</TableCell>
                      <TableCell className="capitalize">{record.smokingHabits}</TableCell>
                      <TableCell>
                        <span className="font-semibold">{record.riskScore}/10</span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getRiskBadgeVariant(record.riskLevel)}>
                          {record.riskLevel}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Info Card */}
      {history.length > 0 && (
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground leading-relaxed">
              <strong className="text-foreground">Tracking Your Health:</strong> Regular assessments help you monitor 
              changes in your health risk profile over time. Compare your results to see how lifestyle changes impact 
              your overall health score.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
