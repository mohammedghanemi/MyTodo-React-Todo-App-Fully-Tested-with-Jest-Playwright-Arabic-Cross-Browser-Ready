import React, { useState, useEffect } from 'react';
import ReportGenerator from './ReportGenerator';
import './TestResultsDashboard.css';

const TestResultsDashboard = () => {
  const [testResults, setTestResults] = useState([]);

  useEffect(() => {
    const savedResults = localStorage.getItem('testResults');
    if (savedResults) {
      try {
        const parsed = JSON.parse(savedResults);
        setTestResults(parsed.details || []);
      } catch (error) {
        console.error('Error parsing test results:', error);
      }
    }
  }, []);

  const runSampleTests = () => {
    const sampleTests = [
      {
        title: 'Add Todo Item',
        status: 'passed',
        duration: 1200,
        timestamp: new Date().toISOString()
      },
      {
        title: 'Complete Todo',
        status: 'passed',
        duration: 800,
        timestamp: new Date().toISOString()
      },
      {
        title: 'Delete Todo Item',
        status: 'failed',
        duration: 1500,
        error: 'Delete button not found',
        timestamp: new Date().toISOString()
      },
      {
        title: 'Filter Active Todos',
        status: 'passed',
        duration: 600,
        timestamp: new Date().toISOString()
      }
    ];

    sampleTests.forEach((test, index) => {
      setTimeout(() => {
        setTestResults(prev => {
          const newResults = [...prev, test];
          const report = {
            summary: {
              total: newResults.length,
              passed: newResults.filter(t => t.status === 'passed').length,
              failed: newResults.filter(t => t.status === 'failed').length,
              duration: newResults.reduce((acc, curr) => acc + (curr.duration || 0), 0),
              timestamp: new Date().toISOString()
            },
            details: newResults
          };
          localStorage.setItem('testResults', JSON.stringify(report));
          return newResults;
        });
      }, index * 800);
    });
  };

  const clearResults = () => {
    setTestResults([]);
    localStorage.removeItem('testResults');
  };

  const passedTests = testResults.filter(t => t.status === 'passed').length;
  const failedTests = testResults.filter(t => t.status === 'failed').length;
  const totalDuration = testResults.reduce((acc, curr) => acc + (curr.duration || 0), 0);

  return (
    <div className="test-dashboard">
      <div className="dashboard-header">
        <h1>🎯 Todo App Test Dashboard</h1>
        <p>Monitor test executions and generate detailed reports</p>
      </div>
      
      <div className="dashboard-controls">
        <button onClick={runSampleTests} className="control-btn run-tests-btn">
          🚀 Run Sample Tests
        </button>
        <button onClick={clearResults} className="control-btn clear-results-btn">
          🗑️ Clear Results
        </button>
      </div>

      <div className="test-summary">
        <h2>Test Summary</h2>
        <div className="summary-cards">
          <div className="summary-card total">
            <div className="card-content">
              <h3>Total Tests</h3>
              <p className="card-value">{testResults.length}</p>
            </div>
          </div>
          <div className="summary-card passed">
            <div className="card-content">
              <h3>Passed</h3>
              <p className="card-value">{passedTests}</p>
            </div>
          </div>
          <div className="summary-card failed">
            <div className="card-content">
              <h3>Failed</h3>
              <p className="card-value">{failedTests}</p>
            </div>
          </div>
          <div className="summary-card duration">
            <div className="card-content">
              <h3>Duration</h3>
              <p className="card-value">{totalDuration}ms</p>
            </div>
          </div>
        </div>
      </div>

      <ReportGenerator testResults={testResults} />
    </div>
  );
};

export default TestResultsDashboard;