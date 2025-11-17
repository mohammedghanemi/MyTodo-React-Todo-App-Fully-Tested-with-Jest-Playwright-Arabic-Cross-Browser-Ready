class TestReporter {
  static async takeScreenshot(page, testName) {
    try {
      // Ensure test-results directory exists
      const fs = require('fs');
      const path = require('path');
      const screenshotsDir = path.join(process.cwd(), 'test-results', 'screenshots');
      
      if (!fs.existsSync(screenshotsDir)) {
        fs.mkdirSync(screenshotsDir, { recursive: true });
      }

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const screenshotPath = path.join(screenshotsDir, `${testName}-${timestamp}.png`);
      
      await page.screenshot({ 
        path: screenshotPath,
        fullPage: true 
      });
      
      console.log(`Screenshot saved: ${screenshotPath}`);
      return screenshotPath;
    } catch (error) {
      console.error('Failed to take screenshot:', error);
      return null;
    }
  }

  static generateTestReport(testResults) {
    const report = {
      summary: {
        total: testResults.length,
        passed: testResults.filter(t => t.status === 'passed').length,
        failed: testResults.filter(t => t.status === 'failed').length,
        duration: testResults.reduce((acc, curr) => acc + (curr.duration || 0), 0),
        timestamp: new Date().toISOString()
      },
      details: testResults
    };

    // Save to localStorage for React components to access
    if (typeof window !== 'undefined') {
      localStorage.setItem('testResults', JSON.stringify(report));
    }

    // Also save to file system for Playwright tests
    try {
      const fs = require('fs');
      const path = require('path');
      const reportsDir = path.join(process.cwd(), 'test-results');
      
      if (!fs.existsSync(reportsDir)) {
        fs.mkdirSync(reportsDir, { recursive: true });
      }
      
      fs.writeFileSync(
        path.join(reportsDir, 'test-report.json'), 
        JSON.stringify(report, null, 2)
      );
    } catch (error) {
      console.error('Error saving report to file system:', error);
    }

    return report;
  }

  static downloadReport(report, format = 'json') {
    if (typeof window === 'undefined') {
      console.log('Cannot download report in non-browser environment');
      return;
    }

    const data = format === 'json' 
      ? JSON.stringify(report, null, 2)
      : this.generateHTMLReport(report);

    const blob = new Blob([data], { 
      type: format === 'json' ? 'application/json' : 'text/html' 
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `test-report-${new Date().toISOString().split('T')[0]}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  static generateHTMLReport(report) {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Todo App Test Execution Report</title>
    <style>
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            margin: 0; 
            padding: 20px; 
            background-color: #f5f5f5; 
        }
        .container { 
            max-width: 1200px; 
            margin: 0 auto; 
            background: white; 
            padding: 30px; 
            border-radius: 10px; 
            box-shadow: 0 2px 10px rgba(0,0,0,0.1); 
        }
        .header { 
            text-align: center; 
            margin-bottom: 30px; 
            border-bottom: 2px solid #007bff; 
            padding-bottom: 20px; 
        }
        .summary-cards { 
            display: grid; 
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); 
            gap: 20px; 
            margin-bottom: 30px; 
        }
        .card { 
            padding: 20px; 
            border-radius: 8px; 
            text-align: center; 
            color: white; 
        }
        .card.total { background: linear-gradient(135deg, #007bff, #0056b3); }
        .card.passed { background: linear-gradient(135deg, #28a745, #1e7e34); }
        .card.failed { background: linear-gradient(135deg, #dc3545, #c82333); }
        .card.duration { background: linear-gradient(135deg, #ffc107, #e0a800); color: #212529; }
        .test-case { 
            border: 1px solid #ddd; 
            margin: 15px 0; 
            padding: 20px; 
            border-radius: 8px; 
            border-left: 5px solid #ddd; 
        }
        .test-case.passed { 
            background-color: #d4edda; 
            border-left-color: #28a745; 
        }
        .test-case.failed { 
            background-color: #f8d7da; 
            border-left-color: #dc3545; 
        }
        .screenshot { 
            max-width: 100%; 
            max-height: 400px; 
            margin: 10px 0; 
            border: 1px solid #ddd; 
            border-radius: 4px; 
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .timestamp { 
            color: #6c757d; 
            font-size: 0.9em; 
        }
        .error-message {
            background: #fff5f5;
            border: 1px solid #f5c6cb;
            padding: 10px;
            border-radius: 4px;
            margin: 10px 0;
            font-family: 'Courier New', monospace;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📝 Todo App Test Execution Report</h1>
            <p class="timestamp">Generated on: ${new Date().toLocaleString()}</p>
        </div>
        
        <div class="summary-cards">
            <div class="card total">
                <h3>Total Tests</h3>
                <p style="font-size: 2em; margin: 10px 0;">${report.summary.total}</p>
            </div>
            <div class="card passed">
                <h3>Passed</h3>
                <p style="font-size: 2em; margin: 10px 0;">${report.summary.passed}</p>
            </div>
            <div class="card failed">
                <h3>Failed</h3>
                <p style="font-size: 2em; margin: 10px 0;">${report.summary.failed}</p>
            </div>
            <div class="card duration">
                <h3>Total Duration</h3>
                <p style="font-size: 2em; margin: 10px 0;">${report.summary.duration}ms</p>
            </div>
        </div>

        <h2>Test Execution Details</h2>
        ${report.details.map(test => `
            <div class="test-case ${test.status}">
                <h3>${test.title}</h3>
                <p><strong>Status:</strong> 
                    <span style="color: ${test.status === 'passed' ? '#28a745' : '#dc3545'}; 
                    font-weight: bold;">${test.status.toUpperCase()}</span>
                </p>
                <p><strong>Duration:</strong> ${test.duration || 0}ms</p>
                <p class="timestamp"><strong>Executed:</strong> ${new Date(test.timestamp).toLocaleString()}</p>
                ${test.error ? `
                    <div class="error-message">
                        <strong>Error Details:</strong><br>
                        <code>${test.error}</code>
                    </div>
                ` : ''}
                ${test.screenshot ? `
                    <div>
                        <strong>Screenshot Evidence:</strong><br>
                        <img src="file://${test.screenshot}" alt="${test.title}" class="screenshot">
                    </div>
                ` : ''}
            </div>
        `).join('')}
    </div>
</body>
</html>`;
  }
}

// For Node.js environment
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { TestReporter };
}

// For browser environment
if (typeof window !== 'undefined') {
  window.TestReporter = TestReporter;
}