document.addEventListener('DOMContentLoaded', function() {
    const currentPage = getCurrentPage();
    
    switch(currentPage) {
        case 'dashboard':
            initDashboard();
            break;
        case 'prediction_history':
            initPredictionHistory();
            break;
        case 'reports':
            initReports();
            break;
        case 'health_analytics':
            initHealthAnalytics();
            break;
        case 'recommendations':
            initRecommendations();
            break;
    }
});

// Get current page name from URL
function getCurrentPage() {
    const path = window.location.pathname;
    const page = path.substring(path.lastIndexOf('/') + 1);
    
    if (page === '' || page === 'index.html') return 'dashboard';
    return page.replace('.html', '');
}

// ============================================
// DASHBOARD PAGE
// ============================================
function initDashboard() {
    const reportStatus = document.getElementById('report-status');
    const additionalQuestions = document.getElementById('additional-questions');
    const generateBtn = document.getElementById('generate-btn');
    const btnText = document.getElementById('btn-text');
    const btnLoader = document.getElementById('btn-loader');
    
    const ageGroup = document.getElementById('age-group');
    const activityLevel = document.getElementById('activity-level');
    const smoking = document.getElementById('smoking');
    
    // Show additional questions when report status is selected
    reportStatus.addEventListener('change', function() {
        if (this.value) {
            additionalQuestions.classList.remove('hidden');
            additionalQuestions.classList.add('fade-in');
            checkFormCompletion();
        }
    });
    
    // Check form completion
    function checkFormCompletion() {
        const isComplete = reportStatus.value && ageGroup.value && activityLevel.value && smoking.value;
        generateBtn.disabled = !isComplete;
    }
    
    ageGroup.addEventListener('change', checkFormCompletion);
    activityLevel.addEventListener('change', checkFormCompletion);
    smoking.addEventListener('change', checkFormCompletion);
    
    // Generate button click handler
    generateBtn.addEventListener('click', function() {
        if (!reportStatus.value || !ageGroup.value || !activityLevel.value || !smoking.value) {
            alert('Please answer all questions before analyzing');
            return;
        }
        
        // Show loading state
        generateBtn.disabled = true;
        btnText.textContent = 'Analyzing Your Health Data...';
        btnLoader.classList.remove('hidden');
        
        // Simulate analysis with animation
        setTimeout(() => {
            analyzeHealth();
        }, 2000);
    });
    
    /**
     * GEMINI API INTEGRATION POINT #1
     * 
     * This function performs health risk analysis based on user responses.
     * Replace the simulation below with actual Gemini API call.
     * 
     * Example Gemini API Integration:
     * 
     * async function analyzeHealth() {
     *     const apiKey = 'YOUR_GEMINI_API_KEY';
     *     const endpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
     *     
     *     const prompt = `Analyze health risk for a person with the following profile:
     *         - Report Status: ${reportStatus.value}
     *         - Age Group: ${ageGroup.value}
     *         - Activity Level: ${activityLevel.value}
     *         - Smoking Habits: ${smoking.value}
     *         
     *         Provide a risk assessment (Low/Medium/High) and brief explanation.`;
     *     
     *     try {
     *         const response = await fetch(`${endpoint}?key=${apiKey}`, {
     *             method: 'POST',
     *             headers: { 'Content-Type': 'application/json' },
     *             body: JSON.stringify({
     *                 contents: [{
     *                     parts: [{ text: prompt }]
     *                 }]
     *             })
     *         });
     *         
     *         const data = await response.json();
     *         const analysis = data.candidates[0].content.parts[0].text;
     *         
     *         // Parse the analysis and extract risk level
     *         // Store results and navigate to health analytics
     *     } catch (error) {
     *         console.error('Gemini API Error:', error);
     *         alert('Error analyzing health data. Please try again.');
     *     }
     * }
     */
    
    function analyzeHealth() {
        // Calculate basic risk score (placeholder logic)
        let riskScore = 0;
        
        // Report status impact
        if (reportStatus.value === 'none') riskScore += 2;
        else if (reportStatus.value === 'partial') riskScore += 1;
        
        // Age impact
        if (ageGroup.value === '55+') riskScore += 3;
        else if (ageGroup.value === '45-54') riskScore += 2;
        else if (ageGroup.value === '35-44') riskScore += 1;
        
        // Activity impact
        if (activityLevel.value === 'low') riskScore += 3;
        else if (activityLevel.value === 'moderate') riskScore += 1;
        
        // Smoking impact
        if (smoking.value === 'yes') riskScore += 4;
        else if (smoking.value === 'occasionally') riskScore += 2;
        
        const riskLevel = riskScore >= 6 ? 'High' : riskScore >= 3 ? 'Medium' : 'Low';
        
        // Create assessment object
        const assessment = {
            timestamp: new Date().toISOString(),
            reportStatus: reportStatus.value,
            ageGroup: ageGroup.value,
            activityLevel: activityLevel.value,
            smokingHabits: smoking.value,
            riskLevel: riskLevel,
            riskScore: riskScore
        };
        
        // Save to localStorage
        const history = JSON.parse(localStorage.getItem('predictionHistory') || '[]');
        history.unshift(assessment);
        localStorage.setItem('predictionHistory', JSON.stringify(history.slice(0, 10)));
        localStorage.setItem('currentAssessment', JSON.stringify(assessment));
        
        // Navigate to health analytics
        window.location.href = 'health_analytics.html';
    }
}

// ============================================
// PREDICTION HISTORY PAGE
// ============================================
function initPredictionHistory() {
    const historyContainer = document.getElementById('history-container');
    const recordCount = document.getElementById('record-count');
    const clearBtn = document.getElementById('clear-history-btn');
    const infoCard = document.getElementById('info-card');
    
    const history = JSON.parse(localStorage.getItem('predictionHistory') || '[]');
    
    if (history.length === 0) {
        historyContainer.innerHTML = `
            <div class="alert">
                <span class="alert-icon">⚠️</span>
                <p>No prediction history available. Complete an assessment on the Dashboard to see your results here.</p>
            </div>
        `;
    } else {
        clearBtn.classList.remove('hidden');
        infoCard.classList.remove('hidden');
        recordCount.textContent = `${history.length} assessment${history.length !== 1 ? 's' : ''} recorded`;
        
        const tableHTML = `
            <div class="table-container">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Date & Time</th>
                            <th>Report Status</th>
                            <th>Age Group</th>
                            <th>Activity Level</th>
                            <th>Smoking</th>
                            <th>Risk Score</th>
                            <th>Risk Level</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${history.map(record => `
                            <tr>
                                <td>${formatDate(record.timestamp)}</td>
                                <td class="capitalize">${record.reportStatus || 'N/A'}</td>
                                <td>${record.ageGroup}</td>
                                <td class="capitalize">${record.activityLevel}</td>
                                <td class="capitalize">${record.smokingHabits}</td>
                                <td><strong>${record.riskScore}/10</strong></td>
                                <td><span class="badge badge-${record.riskLevel.toLowerCase()}">${record.riskLevel}</span></td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
        
        historyContainer.innerHTML = tableHTML;
    }
    
    clearBtn.addEventListener('click', function() {
        if (confirm('Are you sure you want to clear all prediction history?')) {
            localStorage.removeItem('predictionHistory');
            window.location.reload();
        }
    });
}

// ============================================
// REPORTS PAGE
// ============================================
function initReports() {
    const noDataAlert = document.getElementById('no-data-alert');
    const reportsContent = document.getElementById('reports-content');
    const totalAssessments = document.getElementById('total-assessments');
    const averageRisk = document.getElementById('average-risk');
    const trendContainer = document.getElementById('trend-container');
    const trendIcon = document.getElementById('trend-icon');
    const trendText = document.getElementById('trend-text');
    const trendBox = document.getElementById('trend-box');
    const trendBoxIcon = document.getElementById('trend-box-icon');
    const trendTitle = document.getElementById('trend-title');
    const lastAssessmentBox = document.getElementById('last-assessment-box');
    const lastAssessmentDate = document.getElementById('last-assessment-date');
    const downloadBtn = document.getElementById('download-report-btn');
    
    const history = JSON.parse(localStorage.getItem('predictionHistory') || '[]');
    
    if (history.length === 0) {
        noDataAlert.classList.remove('hidden');
    } else {
        reportsContent.classList.remove('hidden');
        
        // Calculate statistics
        const total = history.length;
        const totalRisk = history.reduce((sum, record) => sum + record.riskScore, 0);
        const avgRisk = (totalRisk / total).toFixed(1);
        
        // Determine trend
        let trend = 'stable';
        let trendEmoji = '➖';
        let trendColor = 'var(--color-warning)';
        let trendMessage = 'Your health risk is stable';
        
        if (history.length >= 2) {
            const latest = history[0].riskScore;
            const previous = history[1].riskScore;
            
            if (latest < previous) {
                trend = 'improving';
                trendEmoji = '📉';
                trendColor = 'var(--color-success)';
                trendMessage = 'Your health risk is improving';
            } else if (latest > previous) {
                trend = 'worsening';
                trendEmoji = '📈';
                trendColor = 'var(--color-danger)';
                trendMessage = 'Your health risk is increasing';
            }
        }
        
        // Update UI
        totalAssessments.textContent = total;
        averageRisk.textContent = `${avgRisk}/10`;
        trendIcon.textContent = trendEmoji;
        trendText.textContent = trend.charAt(0).toUpperCase() + trend.slice(1);
        trendText.style.color = trendColor;
        
        trendBoxIcon.textContent = trendEmoji;
        trendTitle.textContent = trendMessage;
        
        lastAssessmentDate.textContent = formatDate(history[0].timestamp);
        
        // Download report handler
        downloadBtn.addEventListener('click', downloadReport);
    }
}

function downloadReport() {
    const history = JSON.parse(localStorage.getItem('predictionHistory') || '[]');
    
    let reportContent = '=== HEALTH ANALYTICS REPORT ===\n\n';
    reportContent += `Generated: ${new Date().toLocaleString()}\n\n`;
    
    const total = history.length;
    const totalRisk = history.reduce((sum, record) => sum + record.riskScore, 0);
    const avgRisk = (totalRisk / total).toFixed(1);
    
    let trend = 'stable';
    if (history.length >= 2) {
        const latest = history[0].riskScore;
        const previous = history[1].riskScore;
        if (latest < previous) trend = 'improving';
        else if (latest > previous) trend = 'worsening';
    }
    
    reportContent += `Total Assessments: ${total}\n`;
    reportContent += `Average Risk Score: ${avgRisk}/10\n`;
    reportContent += `Trend: ${trend.toUpperCase()}\n\n`;
    reportContent += '--- ASSESSMENT HISTORY ---\n\n';
    
    history.forEach((record, index) => {
        reportContent += `${index + 1}. ${new Date(record.timestamp).toLocaleString()}\n`;
        reportContent += `   Report Status: ${record.reportStatus || 'N/A'}\n`;
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
}

// ============================================
// HEALTH ANALYTICS PAGE
// ============================================
function initHealthAnalytics() {
    const noDataAlert = document.getElementById('no-data-alert');
    const analyticsContent = document.getElementById('analytics-content');
    const riskBadge = document.getElementById('risk-badge');
    const riskScore = document.getElementById('risk-score');
    const assessmentDate = document.getElementById('assessment-date');
    const doctorSearchSection = document.getElementById('doctor-search-section');
    const locationInput = document.getElementById('location-input');
    const searchBtn = document.getElementById('search-doctors-btn');
    
    const assessment = JSON.parse(localStorage.getItem('currentAssessment') || 'null');
    
    if (!assessment) {
        noDataAlert.classList.remove('hidden');
        return;
    }
    
    analyticsContent.classList.remove('hidden');
    
    // Update risk information
    riskBadge.textContent = assessment.riskLevel;
    riskBadge.className = `badge badge-${assessment.riskLevel.toLowerCase()}`;
    riskScore.textContent = `${assessment.riskScore}/10`;
    assessmentDate.textContent = new Date(assessment.timestamp).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
    
    // Show doctor search for high risk
    if (assessment.riskLevel === 'High') {
        doctorSearchSection.classList.remove('hidden');
        doctorSearchSection.classList.add('fade-in');
    }
    
    // Initialize charts
    initCharts(assessment);
    
    // Doctor search handler
    searchBtn.addEventListener('click', function() {
        const location = locationInput.value.trim();
        
        if (!location) {
            alert('Please enter your location');
            return;
        }
        
        searchBtn.disabled = true;
        searchBtn.innerHTML = '<span>🔍</span> Searching...';
        
        /**
         * GEMINI API INTEGRATION POINT #2
         * 
         * This function searches for nearby healthcare providers.
         * Replace the simulation below with actual Gemini API or Google Maps API call.
         * 
         * Example Google Maps Places API Integration:
         * 
         * async function searchDoctors(location) {
         *     const apiKey = 'YOUR_GOOGLE_MAPS_API_KEY';
         *     const endpoint = 'https://maps.googleapis.com/maps/api/place/textsearch/json';
         *     
         *     try {
         *         const response = await fetch(
         *             `${endpoint}?query=cardiologist+in+${encodeURIComponent(location)}&key=${apiKey}`
         *         );
         *         
         *         const data = await response.json();
         *         
         *         if (data.results && data.results.length > 0) {
         *             displayDoctorResults(data.results);
         *         } else {
         *             alert('No doctors found in your area. Please try a different location.');
         *         }
         *     } catch (error) {
         *         console.error('Google Maps API Error:', error);
         *         alert('Error searching for doctors. Please try again.');
         *     }
         * }
         * 
         * Alternative: Gemini API Integration
         * 
         * async function searchDoctors(location) {
         *     const apiKey = 'YOUR_GEMINI_API_KEY';
         *     const endpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
         *     
         *     const prompt = `Find and recommend cardiologists or heart specialists near ${location}. 
         *         Provide names, addresses, and approximate distances if possible.`;
         *     
         *     try {
         *         const response = await fetch(`${endpoint}?key=${apiKey}`, {
         *             method: 'POST',
         *             headers: { 'Content-Type': 'application/json' },
         *             body: JSON.stringify({
         *                 contents: [{
         *                     parts: [{ text: prompt }]
         *                 }]
         *             })
         *         });
         *         
         *         const data = await response.json();
         *         const recommendations = data.candidates[0].content.parts[0].text;
         *         
         *         displayDoctorRecommendations(recommendations);
         *     } catch (error) {
         *         console.error('Gemini API Error:', error);
         *         alert('Error getting doctor recommendations. Please try again.');
         *     }
         * }
         */
        
        // Simulate API call
        setTimeout(() => {
            searchBtn.disabled = false;
            searchBtn.innerHTML = '<span>🔍</span> Search';
            
            alert(`Doctor search for location: ${location}\n\nThis is a placeholder. Integrate Google Maps Places API or Gemini API to show real results.\n\nExample doctors:\n- Dr. Smith - Cardiologist (2.3 mi)\n- Heart Health Center (3.1 mi)\n- Dr. Johnson - Cardiovascular Specialist (4.5 mi)`);
        }, 1500);
    });
}

function initCharts(assessment) {
    // Pie Chart - Risk Distribution
    const pieCtx = document.getElementById('pie-chart');
    if (pieCtx) {
        const pieData = {
            labels: ['Low Risk', 'Medium Risk', 'High Risk'],
            datasets: [{
                data: [
                    assessment.riskLevel === 'Low' ? 1 : 0,
                    assessment.riskLevel === 'Medium' ? 1 : 0,
                    assessment.riskLevel === 'High' ? 1 : 0
                ],
                backgroundColor: ['#22c55e', '#eab308', '#ef4444'],
                borderWidth: 2,
                borderColor: '#1a0808'
            }]
        };
        
        new Chart(pieCtx, {
            type: 'pie',
            data: pieData,
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: '#f5f5f5',
                            font: { size: 12 }
                        }
                    },
                    tooltip: {
                        backgroundColor: '#1a0808',
                        titleColor: '#f5f5f5',
                        bodyColor: '#f5f5f5',
                        borderColor: '#800000',
                        borderWidth: 1
                    }
                },
                animation: {
                    animateRotate: true,
                    animateScale: true,
                    duration: 1000
                }
            }
        });
    }
    
    // Bar Chart - Risk Factors
    const barCtx = document.getElementById('bar-chart');
    if (barCtx) {
        let ageScore = 0;
        if (assessment.ageGroup === '55+') ageScore = 3;
        else if (assessment.ageGroup === '45-54') ageScore = 2;
        else if (assessment.ageGroup === '35-44') ageScore = 1;
        
        let activityScore = 0;
        if (assessment.activityLevel === 'low') activityScore = 3;
        else if (assessment.activityLevel === 'moderate') activityScore = 1;
        
        let smokingScore = 0;
        if (assessment.smokingHabits === 'yes') smokingScore = 4;
        else if (assessment.smokingHabits === 'occasionally') smokingScore = 2;
        
        const barData = {
            labels: ['Age', 'Activity', 'Smoking'],
            datasets: [{
                label: 'Risk Score',
                data: [ageScore, activityScore, smokingScore],
                backgroundColor: '#800000',
                borderColor: '#a52a2a',
                borderWidth: 1
            }]
        };
        
        new Chart(barCtx, {
            type: 'bar',
            data: barData,
            options: {
                responsive: true,
                maintainAspectRatio: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 5,
                        ticks: {
                            color: '#f5f5f5',
                            stepSize: 1
                        },
                        grid: {
                            color: 'rgba(128, 0, 0, 0.1)'
                        }
                    },
                    x: {
                        ticks: {
                            color: '#f5f5f5'
                        },
                        grid: {
                            display: false
                        }
                    }
                },
                plugins: {
                    legend: {
                        labels: {
                            color: '#f5f5f5',
                            font: { size: 12 }
                        }
                    },
                    tooltip: {
                        backgroundColor: '#1a0808',
                        titleColor: '#f5f5f5',
                        bodyColor: '#f5f5f5',
                        borderColor: '#800000',
                        borderWidth: 1
                    }
                },
                animation: {
                    duration: 1000,
                    easing: 'easeOutQuart'
                }
            }
        });
    }
}

// ============================================
// RECOMMENDATIONS PAGE
// ============================================
function initRecommendations() {
    const noDataAlert = document.getElementById('no-data-alert');
    const recommendationsContent = document.getElementById('recommendations-content');
    const riskBadge = document.getElementById('risk-badge');
    
    const assessment = JSON.parse(localStorage.getItem('currentAssessment') || 'null');
    
    if (!assessment) {
        noDataAlert.classList.remove('hidden');
        return;
    }
    
    recommendationsContent.classList.remove('hidden');
    
    // Update risk badge
    riskBadge.textContent = assessment.riskLevel;
    riskBadge.className = `badge badge-${assessment.riskLevel.toLowerCase()}`;
    
    // Generate recommendations
    const recommendations = generateRecommendations(assessment);
    
    // Populate tabs
    populateRecommendationTab('diet', recommendations.diet);
    populateRecommendationTab('exercise', recommendations.exercise);
    populateRecommendationTab('mental', recommendations.mental);
    populateRecommendationTab('sleep', recommendations.sleep);
    
    // Tab switching
    const tabTriggers = document.querySelectorAll('.tab-trigger');
    tabTriggers.forEach(trigger => {
        trigger.addEventListener('click', function() {
            const tabName = this.dataset.tab;
            
            // Update active states
            tabTriggers.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            document.getElementById(`${tabName}-tab`).classList.add('active');
        });
    });
}

function generateRecommendations(assessment) {
    const recs = {
        diet: [],
        exercise: [],
        mental: [],
        sleep: []
    };
    
    // Diet recommendations
    recs.diet.push({
        title: 'Heart-Healthy Diet',
        description: 'Focus on fruits, vegetables, whole grains, and lean proteins. Limit saturated fats, trans fats, and sodium.',
        priority: 'high'
    });
    
    if (assessment.riskLevel === 'High' || assessment.riskLevel === 'Medium') {
        recs.diet.push({
            title: 'Reduce Sodium Intake',
            description: 'Aim for less than 2,300mg of sodium per day. Read food labels and avoid processed foods.',
            priority: 'high'
        });
        recs.diet.push({
            title: 'Increase Omega-3 Fatty Acids',
            description: 'Include fatty fish (salmon, mackerel) at least twice a week or consider supplements after consulting your doctor.',
            priority: 'medium'
        });
    }
    
    recs.diet.push({
        title: 'Stay Hydrated',
        description: 'Drink at least 8 glasses of water daily. Limit sugary drinks and excessive caffeine.',
        priority: 'medium'
    });
    
    // Exercise recommendations
    if (assessment.activityLevel === 'low') {
        recs.exercise.push({
            title: 'Start Moving More',
            description: 'Begin with 10-15 minutes of walking daily and gradually increase to 30 minutes most days of the week.',
            priority: 'high'
        });
        recs.exercise.push({
            title: 'Take Regular Breaks',
            description: 'If you have a desk job, stand up and move for 5 minutes every hour.',
            priority: 'medium'
        });
    } else if (assessment.activityLevel === 'moderate') {
        recs.exercise.push({
            title: 'Increase Intensity',
            description: 'Add 2-3 days of vigorous activity or strength training to your routine.',
            priority: 'medium'
        });
    } else {
        recs.exercise.push({
            title: 'Maintain Your Routine',
            description: 'Excellent! Continue your high activity level and ensure proper rest and recovery.',
            priority: 'low'
        });
    }
    
    recs.exercise.push({
        title: 'Include Strength Training',
        description: 'Add resistance exercises 2-3 times per week to build muscle and support heart health.',
        priority: 'medium'
    });
    
    recs.exercise.push({
        title: 'Try Low-Impact Activities',
        description: 'Swimming, cycling, or yoga are excellent for cardiovascular health with less joint stress.',
        priority: 'low'
    });
    
    // Mental health recommendations
    recs.mental.push({
        title: 'Stress Management',
        description: 'Practice relaxation techniques like deep breathing, meditation, or mindfulness for 10-15 minutes daily.',
        priority: 'high'
    });
    
    if (assessment.smokingHabits === 'yes') {
        recs.mental.push({
            title: 'Quit Smoking Support',
            description: 'Consider joining a smoking cessation program. Seek support from friends, family, or professionals.',
            priority: 'high'
        });
    }
    
    recs.mental.push({
        title: 'Social Connections',
        description: 'Maintain strong social relationships. Regular interaction with friends and family supports mental and heart health.',
        priority: 'medium'
    });
    
    recs.mental.push({
        title: 'Limit Alcohol',
        description: 'If you drink, do so in moderation: up to one drink per day for women, two for men.',
        priority: 'medium'
    });
    
    // Sleep recommendations
    recs.sleep.push({
        title: 'Consistent Sleep Schedule',
        description: 'Aim for 7-9 hours of sleep per night. Go to bed and wake up at the same time every day.',
        priority: 'high'
    });
    
    recs.sleep.push({
        title: 'Create a Sleep-Friendly Environment',
        description: 'Keep your bedroom cool, dark, and quiet. Avoid screens for at least 1 hour before bedtime.',
        priority: 'medium'
    });
    
    recs.sleep.push({
        title: 'Address Sleep Disorders',
        description: 'If you snore loudly or feel tired despite adequate sleep, consult a doctor about sleep apnea.',
        priority: assessment.riskLevel === 'High' ? 'high' : 'low'
    });
    
    return recs;
}

function populateRecommendationTab(tabName, recommendations) {
    const tabContent = document.getElementById(`${tabName}-tab`);
    
    const html = recommendations.map(rec => `
        <div class="recommendation-card fade-in">
            <div class="recommendation-header">
                <h3 class="recommendation-title">${rec.title}</h3>
                <span class="priority-badge priority-${rec.priority}">
                    ${rec.priority === 'high' ? 'High Priority' : rec.priority === 'medium' ? 'Medium Priority' : 'Recommended'}
                </span>
            </div>
            <p class="recommendation-description">${rec.description}</p>
        </div>
    `).join('');
    
    tabContent.innerHTML = html;
}

// ============================================
// UTILITY FUNCTIONS
// ============================================
function formatDate(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Add capitalize class support
document.addEventListener('DOMContentLoaded', function() {
    const style = document.createElement('style');
    style.textContent = '.capitalize { text-transform: capitalize; }';
    document.head.appendChild(style);
});