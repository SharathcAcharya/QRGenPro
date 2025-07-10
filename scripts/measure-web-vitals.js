/**
 * Core Web Vitals Measurement Script
 * 
 * This script measures Core Web Vitals (LCP, FID, CLS) and other
 * performance metrics for QRloop to help optimize performance.
 * 
 * It uses Lighthouse in headless Chrome to analyze the app.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import lighthouse from 'lighthouse';
import puppeteer from 'puppeteer';
import { launch } from 'chrome-launcher';

// ES Module __dirname equivalent
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const reportsDir = path.resolve(__dirname, '../performance-reports');

// Configuration
const config = {
  baseUrl: 'https://qrloop.app', // Use your production URL or local dev server
  routes: [
    '/',
    '/generator',
    '/analytics',
    '/library'
  ],
  outputDir: reportsDir,
  date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
  runs: 3, // Number of runs per page for more reliable results
};

/**
 * Ensure the output directory exists
 */
function ensureOutputDir() {
  if (!fs.existsSync(config.outputDir)) {
    fs.mkdirSync(config.outputDir, { recursive: true });
  }
}

/**
 * Run Lighthouse on a specific URL
 */
async function runLighthouse(url, options) {
  console.log(`🔍 Running Lighthouse on ${url}...`);
  
  const chrome = await launch({
    chromeFlags: ['--headless', '--disable-gpu', '--no-sandbox']
  });
  
  try {
    const runnerResult = await lighthouse(url, {
      port: chrome.port,
      output: 'json',
      logLevel: 'error',
      onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
      ...options
    });
    
    return runnerResult;
  } finally {
    await chrome.kill();
  }
}

/**
 * Extract Core Web Vitals from Lighthouse result
 */
function extractCoreWebVitals(lhr) {
  const audits = lhr.audits;
  
  return {
    lcp: {
      value: audits['largest-contentful-paint'].numericValue,
      score: audits['largest-contentful-paint'].score,
      displayValue: audits['largest-contentful-paint'].displayValue,
    },
    fid: {
      value: audits['max-potential-fid'].numericValue,
      score: audits['max-potential-fid'].score,
      displayValue: audits['max-potential-fid'].displayValue,
    },
    cls: {
      value: audits['cumulative-layout-shift'].numericValue,
      score: audits['cumulative-layout-shift'].score,
      displayValue: audits['cumulative-layout-shift'].displayValue,
    },
    tti: {
      value: audits['interactive'].numericValue,
      score: audits['interactive'].score,
      displayValue: audits['interactive'].displayValue,
    },
    tbt: {
      value: audits['total-blocking-time'].numericValue,
      score: audits['total-blocking-time'].score,
      displayValue: audits['total-blocking-time'].displayValue,
    },
    speedIndex: {
      value: audits['speed-index'].numericValue,
      score: audits['speed-index'].score,
      displayValue: audits['speed-index'].displayValue,
    }
  };
}

/**
 * Run the performance analysis
 */
async function runPerformanceAnalysis() {
  console.log('🚀 Starting Core Web Vitals analysis...');
  ensureOutputDir();
  
  const results = {};
  
  for (const route of config.routes) {
    const url = `${config.baseUrl}${route}`;
    const routeName = route === '/' ? 'home' : route.replace(/\//g, '-').substring(1);
    
    results[routeName] = {
      url,
      runs: [],
      average: {},
    };
    
    // Multiple runs for more reliable results
    for (let i = 0; i < config.runs; i++) {
      console.log(`📊 Run ${i + 1}/${config.runs} for ${routeName}`);
      
      const { lhr } = await runLighthouse(url);
      const vitals = extractCoreWebVitals(lhr);
      
      results[routeName].runs.push({
        timestamp: new Date().toISOString(),
        performanceScore: lhr.categories.performance.score * 100,
        seoScore: lhr.categories.seo.score * 100,
        accessibilityScore: lhr.categories.accessibility.score * 100,
        bestPracticesScore: lhr.categories['best-practices'].score * 100,
        vitals
      });
    }
    
    // Calculate averages
    const runs = results[routeName].runs;
    results[routeName].average = {
      performanceScore: runs.reduce((sum, run) => sum + run.performanceScore, 0) / runs.length,
      seoScore: runs.reduce((sum, run) => sum + run.seoScore, 0) / runs.length,
      accessibilityScore: runs.reduce((sum, run) => sum + run.accessibilityScore, 0) / runs.length,
      bestPracticesScore: runs.reduce((sum, run) => sum + run.bestPracticesScore, 0) / runs.length,
      vitals: {
        lcp: runs.reduce((sum, run) => sum + run.vitals.lcp.value, 0) / runs.length,
        fid: runs.reduce((sum, run) => sum + run.vitals.fid.value, 0) / runs.length,
        cls: runs.reduce((sum, run) => sum + run.vitals.cls.value, 0) / runs.length,
        tti: runs.reduce((sum, run) => sum + run.vitals.tti.value, 0) / runs.length,
        tbt: runs.reduce((sum, run) => sum + run.vitals.tbt.value, 0) / runs.length,
        speedIndex: runs.reduce((sum, run) => sum + run.vitals.speedIndex.value, 0) / runs.length,
      }
    };
  }
  
  // Generate JSON report
  const reportPath = path.join(config.outputDir, `core-web-vitals-${config.date}.json`);
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
  console.log(`✅ Performance report saved to ${reportPath}`);
  
  // Generate HTML report
  const htmlReportPath = path.join(config.outputDir, `core-web-vitals-${config.date}.html`);
  generateHtmlReport(results, htmlReportPath);
  console.log(`✅ HTML report saved to ${htmlReportPath}`);
  
  // Print summary
  console.log('\n📊 Performance Summary:');
  for (const [routeName, data] of Object.entries(results)) {
    console.log(`\n${routeName} (${data.url}):`);
    console.log(`  Performance: ${data.average.performanceScore.toFixed(1)}%`);
    console.log(`  SEO: ${data.average.seoScore.toFixed(1)}%`);
    console.log(`  LCP: ${(data.average.vitals.lcp / 1000).toFixed(2)}s`);
    console.log(`  CLS: ${data.average.vitals.cls.toFixed(3)}`);
    console.log(`  FID (potential): ${data.average.vitals.fid.toFixed(1)}ms`);
  }
}

/**
 * Generate an HTML report
 */
function generateHtmlReport(results, outputPath) {
  const routeNames = Object.keys(results);
  
  // Create HTML content
  let html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>QRloop Core Web Vitals Report - ${config.date}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.6;
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
      color: #333;
    }
    h1, h2, h3 {
      color: #1a202c;
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 1px solid #e2e8f0;
    }
    .card {
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      padding: 20px;
      margin-bottom: 20px;
    }
    .metric-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 20px;
      margin-top: 20px;
    }
    .metric-card {
      background: #f7fafc;
      border-radius: 6px;
      padding: 16px;
      border-left: 4px solid #3182ce;
    }
    .metric-value {
      font-size: 24px;
      font-weight: bold;
      margin-top: 8px;
      margin-bottom: 4px;
    }
    .good { color: #38a169; border-left-color: #38a169; }
    .average { color: #dd6b20; border-left-color: #dd6b20; }
    .poor { color: #e53e3e; border-left-color: #e53e3e; }
    .chart-container {
      height: 300px;
      margin-top: 30px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
    }
    th, td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #e2e8f0;
    }
    th {
      background-color: #f7fafc;
      font-weight: 600;
    }
    .summary {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 20px;
      margin-bottom: 30px;
    }
    .summary-card {
      flex: 1;
      min-width: 200px;
      background: #f7fafc;
      border-radius: 8px;
      padding: 16px;
      text-align: center;
    }
    .summary-value {
      font-size: 28px;
      font-weight: bold;
      margin: 10px 0;
    }
  </style>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body>
  <div class="header">
    <h1>QRloop Core Web Vitals Report</h1>
    <p>Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
  </div>
  
  <div class="card">
    <h2>Overview</h2>
    <div class="summary">
      <div class="summary-card">
        <h3>Performance</h3>
        <div class="summary-value">${(
          Object.values(results).reduce((sum, data) => sum + data.average.performanceScore, 0) / 
          Object.values(results).length
        ).toFixed(1)}%</div>
      </div>
      <div class="summary-card">
        <h3>SEO Score</h3>
        <div class="summary-value">${(
          Object.values(results).reduce((sum, data) => sum + data.average.seoScore, 0) / 
          Object.values(results).length
        ).toFixed(1)}%</div>
      </div>
      <div class="summary-card">
        <h3>Accessibility</h3>
        <div class="summary-value">${(
          Object.values(results).reduce((sum, data) => sum + data.average.accessibilityScore, 0) / 
          Object.values(results).length
        ).toFixed(1)}%</div>
      </div>
      <div class="summary-card">
        <h3>Best Practices</h3>
        <div class="summary-value">${(
          Object.values(results).reduce((sum, data) => sum + data.average.bestPracticesScore, 0) / 
          Object.values(results).length
        ).toFixed(1)}%</div>
      </div>
    </div>
  </div>`;

  // Add sections for each route
  for (const routeName of routeNames) {
    const data = results[routeName];
    const { average } = data;
    
    const lcpClass = average.vitals.lcp < 2500 ? 'good' : average.vitals.lcp < 4000 ? 'average' : 'poor';
    const fidClass = average.vitals.fid < 100 ? 'good' : average.vitals.fid < 300 ? 'average' : 'poor';
    const clsClass = average.vitals.cls < 0.1 ? 'good' : average.vitals.cls < 0.25 ? 'average' : 'poor';
    
    html += `
  <div class="card">
    <h2>${routeName}</h2>
    <p>${data.url}</p>
    
    <div class="metric-grid">
      <div class="metric-card ${lcpClass}">
        <h3>Largest Contentful Paint</h3>
        <div class="metric-value">${(average.vitals.lcp / 1000).toFixed(2)}s</div>
        <div>${lcpClass === 'good' ? 'Good' : lcpClass === 'average' ? 'Needs Improvement' : 'Poor'}</div>
      </div>
      
      <div class="metric-card ${fidClass}">
        <h3>First Input Delay (Potential)</h3>
        <div class="metric-value">${average.vitals.fid.toFixed(0)}ms</div>
        <div>${fidClass === 'good' ? 'Good' : fidClass === 'average' ? 'Needs Improvement' : 'Poor'}</div>
      </div>
      
      <div class="metric-card ${clsClass}">
        <h3>Cumulative Layout Shift</h3>
        <div class="metric-value">${average.vitals.cls.toFixed(3)}</div>
        <div>${clsClass === 'good' ? 'Good' : clsClass === 'average' ? 'Needs Improvement' : 'Poor'}</div>
      </div>
      
      <div class="metric-card">
        <h3>Time to Interactive</h3>
        <div class="metric-value">${(average.vitals.tti / 1000).toFixed(2)}s</div>
      </div>
      
      <div class="metric-card">
        <h3>Total Blocking Time</h3>
        <div class="metric-value">${average.vitals.tbt.toFixed(0)}ms</div>
      </div>
      
      <div class="metric-card">
        <h3>Speed Index</h3>
        <div class="metric-value">${(average.vitals.speedIndex / 1000).toFixed(2)}s</div>
      </div>
    </div>
    
    <h3>Scores</h3>
    <div class="chart-container">
      <canvas id="chart-${routeName}"></canvas>
    </div>
    
    <h3>Individual Runs</h3>
    <table>
      <thead>
        <tr>
          <th>Run</th>
          <th>Performance</th>
          <th>SEO</th>
          <th>Accessibility</th>
          <th>Best Practices</th>
          <th>LCP</th>
          <th>FID (Potential)</th>
          <th>CLS</th>
        </tr>
      </thead>
      <tbody>
        ${data.runs.map((run, index) => `
        <tr>
          <td>Run ${index + 1}</td>
          <td>${run.performanceScore.toFixed(1)}%</td>
          <td>${run.seoScore.toFixed(1)}%</td>
          <td>${run.accessibilityScore.toFixed(1)}%</td>
          <td>${run.bestPracticesScore.toFixed(1)}%</td>
          <td>${(run.vitals.lcp.value / 1000).toFixed(2)}s</td>
          <td>${run.vitals.fid.value.toFixed(0)}ms</td>
          <td>${run.vitals.cls.value.toFixed(3)}</td>
        </tr>
        `).join('')}
      </tbody>
    </table>
  </div>`;
  }

  // Add JavaScript for charts
  html += `
  <script>
    document.addEventListener('DOMContentLoaded', () => {
      // Create charts for each route
      ${routeNames.map(routeName => `
      new Chart(document.getElementById('chart-${routeName}'), {
        type: 'bar',
        data: {
          labels: ['Performance', 'SEO', 'Accessibility', 'Best Practices'],
          datasets: [{
            label: 'Scores',
            data: [
              ${results[routeName].average.performanceScore.toFixed(1)},
              ${results[routeName].average.seoScore.toFixed(1)},
              ${results[routeName].average.accessibilityScore.toFixed(1)},
              ${results[routeName].average.bestPracticesScore.toFixed(1)}
            ],
            backgroundColor: [
              'rgba(66, 153, 225, 0.7)',
              'rgba(72, 187, 120, 0.7)',
              'rgba(237, 137, 54, 0.7)',
              'rgba(113, 128, 150, 0.7)'
            ],
            borderColor: [
              'rgba(66, 153, 225, 1)',
              'rgba(72, 187, 120, 1)',
              'rgba(237, 137, 54, 1)',
              'rgba(113, 128, 150, 1)'
            ],
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
              max: 100
            }
          },
          plugins: {
            legend: {
              display: false
            }
          }
        }
      });
      `).join('')}
    });
  </script>
</body>
</html>`;

  fs.writeFileSync(outputPath, html);
}

// Execute
runPerformanceAnalysis().catch(error => {
  console.error('❌ Performance analysis failed:', error);
  process.exit(1);
});
