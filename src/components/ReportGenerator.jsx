import React from 'react';
import './ReportGenerator.css';

const ReportGenerator = ({ testResults = [], screenshots = {}, videos = {} }) => {
  const generateHTMLReport = () => {
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

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Todo App Test Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
        .container { max-width: 1000px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; }
        .header { text-align: center; border-bottom: 2px solid #007bff; padding-bottom: 20px; margin-bottom: 20px; }
        .summary { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin: 20px 0; }
        .summary-card { padding: 15px; border-radius: 6px; color: white; text-align: center; }
        .total { background: #007bff; }
        .passed { background: #28a745; }
        .failed { background: #dc3545; }
        .duration { background: #ffc107; color: #000; }
        .test-case { border: 1px solid #ddd; margin: 10px 0; padding: 15px; border-radius: 5px; border-left: 4px solid #ddd; }
        .test-case.passed { background: #d4edda; border-left-color: #28a745; }
        .test-case.failed { background: #f8d7da; border-left-color: #dc3545; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Todo App Test Report</h1>
            <p>Generated: ${new Date().toLocaleString()}</p>
        </div>
        <div class="summary">
            <div class="summary-card total">Total: ${report.summary.total}</div>
            <div class="summary-card passed">Passed: ${report.summary.passed}</div>
            <div class="summary-card failed">Failed: ${report.summary.failed}</div>
            <div class="summary-card duration">Duration: ${report.summary.duration}ms</div>
        </div>
        ${report.details.map(test => `
            <div class="test-case ${test.status}">
                <h3>${test.title}</h3>
                <p>Status: <strong>${test.status}</strong></p>
                <p>Duration: ${test.duration || 0}ms</p>
                <p>Time: ${new Date(test.timestamp).toLocaleString()}</p>
                ${test.error ? `<p style="color: red;">Error: ${test.error}</p>` : ''}
            </div>
        `).join('')}
    </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `todo-app-test-report-${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const generateJSONReport = () => {
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

    const data = JSON.stringify(report, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `todo-app-test-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const clearReports = () => {
    localStorage.removeItem('testResults');
    window.location.reload();
  };

  return (
    <div className="report-generator">
      <h2>📊 Test Report Generator</h2>
      
      <div className="report-actions">
        <button onClick={generateHTMLReport} className="btn btn-primary">
          📄 Generate HTML Report
        </button>
        <button onClick={generateJSONReport} className="btn btn-secondary">
          📋 Generate JSON Report
        </button>
        <button onClick={clearReports} className="btn btn-danger">
          🗑️ Clear Reports
        </button>
      </div>
      
      <div className="report-preview">
        <h3>Latest Test Results</h3>
        {testResults.length === 0 ? (
          <p className="no-results">No test results available. Run tests to see results here.</p>
        ) : (
          testResults.map((test, index) => (
            <div key={index} className={`test-result ${test.status}`}>
              <div className="test-header">
                <h4>{test.title}</h4>
                <span className={`status-badge ${test.status}`}>
                  {test.status}
                </span>
              </div>
              <div className="test-details">
                <p><strong>Duration:</strong> {test.duration || 0}ms</p>
                <p><strong>Time:</strong> {new Date(test.timestamp).toLocaleString()}</p>
                {test.error && (
                  <div className="error-details">
                    <strong>Error:</strong>
                    <code>{test.error}</code>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReportGenerator;