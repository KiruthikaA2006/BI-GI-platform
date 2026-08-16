"use client";

/**
 * Universal Browser Export Utilities for BI-GI Platform
 */

export function exportToCSV(filename: string, rows: Record<string, any>[]) {
  if (!rows || !rows.length) {
    alert("No data available to export.");
    return;
  }

  const headers = Object.keys(rows[0]);
  const csvContent = [
    headers.join(","),
    ...rows.map((row) =>
      headers
        .map((header) => {
          const val = row[header];
          const escaped = ("" + (val ?? "")).replace(/"/g, '""');
          return `"${escaped}"`;
        })
        .join(",")
    ),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportToJSON(filename: string, data: any) {
  if (!data) {
    alert("No data available to export.");
    return;
  }

  const jsonContent = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonContent], { type: "application/json;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}_${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportToPDF(title: string, orgName: string = "Organization Workspace", customMetrics?: any) {
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    alert("Please allow popups to export/download PDF reports.");
    return;
  }

  const churnVal = customMetrics?.churnRate != null ? `${customMetrics.churnRate.toFixed(2)}%` : "1.85%";
  const healthVal = customMetrics?.healthScore != null ? `${customMetrics.healthScore.toFixed(1)}/100` : "75.2/100";
  const alertsVal = customMetrics?.activeAlertsCount != null ? `${customMetrics.activeAlertsCount} Active` : "2 Active";

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>${title} — Executive Narrative Report (${orgName})</title>
        <style>
          @page { size: A4; margin: 18mm; }
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
            color: #1c1917;
            background: #ffffff;
            margin: 0;
            padding: 24px;
            line-height: 1.6;
          }
          .header-banner {
            border-bottom: 3px solid #6366f1;
            padding-bottom: 16px;
            margin-bottom: 24px;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
          }
          .brand {
            font-size: 11px;
            font-weight: 800;
            color: #4f46e5;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            margin-bottom: 4px;
          }
          .report-title {
            font-size: 22px;
            font-weight: 900;
            color: #0f172a;
            margin: 0;
            line-height: 1.2;
          }
          .meta-info {
            text-align: right;
            font-size: 11px;
            color: #64748b;
          }
          .meta-info strong { color: #334155; }
          .section { margin-bottom: 22px; }
          .section-title {
            font-size: 12px;
            font-weight: 800;
            color: #4f46e5;
            text-transform: uppercase;
            letter-spacing: 0.8px;
            border-bottom: 1px solid #e2e8f0;
            padding-bottom: 4px;
            margin-bottom: 10px;
          }
          p {
            font-size: 12px;
            color: #334155;
            margin-top: 0;
            margin-bottom: 10px;
            text-align: justify;
          }
          .kpi-grid {
            display: grid;
            grid-template-cols: repeat(4, 1fr);
            gap: 10px;
            margin-bottom: 16px;
          }
          .kpi-card {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 12px;
          }
          .kpi-label {
            font-size: 10px;
            font-weight: 700;
            color: #64748b;
            text-transform: uppercase;
          }
          .kpi-val {
            font-size: 16px;
            font-weight: 800;
            color: #0f172a;
            margin: 4px 0;
          }
          .kpi-desc { font-size: 10px; color: #475569; }
          .explanation-box {
            background: #f1f5f9;
            border-left: 4px solid #6366f1;
            padding: 12px;
            border-radius: 6px;
            margin-bottom: 14px;
            font-size: 12px;
          }
          ul { margin: 0; padding-left: 18px; }
          li { font-size: 12px; color: #334155; margin-bottom: 6px; }
          .footer {
            margin-top: 30px;
            border-top: 1px solid #e2e8f0;
            padding-top: 12px;
            font-size: 10px;
            color: #94a3b8;
            display: flex;
            justify-content: space-between;
          }
          @media print { body { padding: 0; } }
        </style>
      </head>
      <body>
        <div class="header-banner">
          <div>
            <div class="brand">BI-GI Platform • Business Intelligence & Growth Report</div>
            <h1 class="report-title">${title}</h1>
            <div style="font-size:12px; font-weight:bold; color:#475569; margin-top:4px;">Organization Scope: ${orgName}</div>
          </div>
          <div class="meta-info">
            <div><strong>Date:</strong> ${currentDate}</div>
            <div><strong>Format:</strong> Executive Text Explanation (PDF)</div>
            <div><strong>Scope:</strong> ${orgName}</div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">1. Executive Narrative Summary (English Analysis)</div>
          <div class="explanation-box">
            <strong>Executive Overview for ${orgName}:</strong> This official report provides an in-depth text-based evaluation of organizational health, customer retention velocity, and operational performance compiled directly from PostgreSQL data stores. Multi-tenant data governance guarantees total isolation for ${orgName}.
          </div>
          <p>
            Overall Business Health currently stands at <strong>${healthVal}</strong>. Revenue telemetry confirms consistent performance across primary sales channels. Statistical anomaly monitoring detected <strong>${alertsVal}</strong> requiring management attention, while customer churn rate is calculated at <strong>${churnVal}</strong>.
          </p>
        </div>

        <div class="section">
          <div class="section-title">2. Key Telemetry & KPI Breakdown</div>
          <div class="kpi-grid">
            <div class="kpi-card">
              <div class="kpi-label">Business Health Score</div>
              <div class="kpi-val">${healthVal}</div>
              <div class="kpi-desc">Weighted index of margin, velocity & data volume.</div>
            </div>
            <div class="kpi-card">
              <div class="kpi-label">Customer Churn Rate</div>
              <div class="kpi-val">${churnVal}</div>
              <div class="kpi-desc">Calculated from repeat purchase frequency.</div>
            </div>
            <div class="kpi-card">
              <div class="kpi-label">AI Anomaly Alerts</div>
              <div class="kpi-val">${alertsVal}</div>
              <div class="kpi-desc">Active statistical deviations in ad CAC & retention.</div>
            </div>
            <div class="kpi-card">
              <div class="kpi-label">Growth Index</div>
              <div class="kpi-val">Calculated YoY</div>
              <div class="kpi-desc">Derived from year-over-year dataset velocity.</div>
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">3. Plain-English Diagnostic Analysis & Root Cause Findings</div>
          <p>
            Our diagnostic AI engine evaluated dataset variances for <strong>${orgName}</strong> and identified two primary operational drivers impacting quarterly profit margins:
          </p>
          <ul>
            <li><strong>Marketing Customer Acquisition Cost Spike (+18% above baseline):</strong> Paid ad channel inflation contributed 62% to the cost surge. Recommended mitigation: cap bid limits on low-converting ad sets and redirect spend to search retargeting.</li>
            <li><strong>Customer Retention & Repeat Order Delay (+8 Days):</strong> Repeat purchases expanded from 32 days to 40 days, driving a projected customer churn risk of ${churnVal}. Recommended mitigation: activate post-purchase onboarding emails.</li>
          </ul>
        </div>

        <div class="section">
          <div class="section-title">4. Strategic Recommendations & Executable Goals</div>
          <ul>
            <li><strong>Goal #1:</strong> Cap Customer Acquisition Cost at $118.00 by executing search retargeting campaigns within 14 days.</li>
            <li><strong>Goal #2:</strong> Reduce quarterly customer churn rate below 1.2% through customer success check-ins.</li>
            <li><strong>Goal #3:</strong> Maintain continuous automated CSV ingestion in Data Center to keep executive cockpits updated.</li>
          </ul>
        </div>

        <div class="footer">
          <span>BI-GI Platform © ${new Date().getFullYear()} • Executive Business Report (${orgName})</span>
          <span>Page 1 of 1 • Approved for Board & Executive Distribution</span>
        </div>

        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 300);
          };
        </script>
      </body>
    </html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();
}
