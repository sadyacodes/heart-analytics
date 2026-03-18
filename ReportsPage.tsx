import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, TrendingUp, TrendingDown, Minus, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

/**
 * Reports Page Component
 * Displays summary reports and downloadable health insights
 * Provides trend analysis and exportable data
 */
export default function ReportsPage() {
  const [hasData, setHasData] = useState(false);
  const [summary, setSummary] = useState({
    totalAssessments: 0,
    averageRisk: 0,
    trend: 'stable' as 'improving' | 'worsening' | 'stable',
    lastAssessment: null as string | null,
  });

  useEffect(() => {
    // Load data from localStorage
    const history = JSON.parse(localStorage.getItem('predictionHistory') || '[]');
    
    if (history.length > 0) {
      setHasData(true);
      
      // Calculate summary statistics
      const totalRisk = history.reduce((sum: number, record: any) => sum + record.riskScore, 0);
      const avgRisk = totalRisk / history.length;
      
      // Determine trend (compare first and last assessment)
      let trend: 'improving' | 'worsening' | 'stable' = 'stable';
      if (history.length >= 2) {
        const latest = history[0].riskScore;
        const previous = history[1].riskScore;
        if (latest < previous) trend = 'improving';
        else if (latest > previous) trend = 'worsening';
      }
      
      setSummary({
        totalAssessments: history.length,
        averageRisk: avgRisk,
        trend,
        lastAssessment: history[0].timestamp,
      });
    }
  }, []);

  /**
   * Download Report Function
   * Generates and downloads a summary report in text format
   * 
   * TODO: Enhancement - Add PDF generation capability
   * Consider using libraries like jsPDF or html2pdf for professional reports
   */
  const handleDownloadReport = () => {
    const history = JSON.parse(localStorage.getItem('predictionHistory') || '[]');
    
    let reportContent = '=== HEALTH ANALYTICS REPORT ===\n\n';
    reportContent += `Generated: ${new Date().toLocaleString()}\n\n`;
    reportContent += `Total Assessments: ${summary.totalAssessments}\n`;
    reportContent += `Average Risk Score: ${summary.averageRisk.toFixed(1)}/10\n`;
    reportContent += `Trend: ${summary.trend.toUpperCase()}\n\n`;
    reportContent += '--- ASSESSMENT HISTORY ---\n\n';
    
    history.forEach((record: any, index: number) => {
      reportContent += `${index + 1}. ${new Date(record.timestamp).toLocaleString()}\n`;
      reportContent += `   Age Group: ${record.ageGroup}\n`;
      reportContent += `   Activity: ${record.activityLevel}\n`;
      reportContent += `   Smoking: ${record.smokingHabits}\n`;
      reportContent += `   Risk Level: ${record.riskLevel} (Score: ${record.riskScore}/10)\n\n`;
    });
    
    reportContent += '\n--- DISCLAIMER ---\n';
    reportContent += 'This report is for informational purposes only and should not be considered medical advice.\n';
    reportContent += 'Always consult with qualified healthcare professionals for proper diagnosis and treatment.\n';
    
    // Create and download file
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `health-report-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getTrendIcon = () => {
    switch (summary.trend) {
      case 'improving':
        return <TrendingDown className="w-6 h-6 text-green-500" />;
      case 'worsening':
        return <TrendingUp className="w-6 h-6 text-red-500" />;
      default:
        return <Minus className="w-6 h-6 text-yellow-500" />;
    }
  };

  const getTrendText = () => {
    switch (summary.trend) {
      case 'improving':
        return 'Your health risk is improving';
      case 'worsening':
        return 'Your health risk is increasing';
      default:
        return 'Your health risk is stable';
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-foreground flex items-center gap-3">
          <FileText className="w-10 h-10 text-primary" />
          Health Reports
        </h1>
        <p className="text-muted-foreground">Summary reports and downloadable insights from your health assessments</p>
      </div>

      {!hasData ? (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            No assessment data available. Complete an assessment on the Dashboard to generate reports.
          </AlertDescription>
        </Alert>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="shadow-lg border-border/50">
              <CardHeader className="pb-3">
                <CardDescription>Total Assessments</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-primary">{summary.totalAssessments}</p>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-border/50">
              <CardHeader className="pb-3">
                <CardDescription>Average Risk Score</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-primary">{summary.averageRisk.toFixed(1)}/10</p>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-border/50">
              <CardHeader className="pb-3">
                <CardDescription>Health Trend</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center gap-3">
                {getTrendIcon()}
                <p className="text-lg font-semibold capitalize">{summary.trend}</p>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Report Card */}
          <Card className="shadow-xl border-border/50">
            <CardHeader>
              <CardTitle>Summary Report</CardTitle>
              <CardDescription>
                Overview of your health assessment data and trends
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg">
                  {getTrendIcon()}
                  <div>
                    <h3 className="font-semibold text-lg">{getTrendText()}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Based on comparison of your recent assessments
                    </p>
                  </div>
                </div>

                {summary.lastAssessment && (
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <h3 className="font-semibold mb-2">Last Assessment</h3>
                    <p className="text-sm text-muted-foreground">
                      {new Date(summary.lastAssessment).toLocaleString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                )}
              </div>

              <Button onClick={handleDownloadReport} className="w-full gap-2 h-12 text-lg shadow-lg">
                <Download className="w-5 h-5" />
                Download Full Report
              </Button>
            </CardContent>
          </Card>

          {/* Info Card */}
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground leading-relaxed">
                <strong className="text-foreground">About Your Reports:</strong> These reports summarize your health 
                assessment history and provide insights into trends over time. Download your report to share with 
                healthcare providers or keep for your personal records.
              </p>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
