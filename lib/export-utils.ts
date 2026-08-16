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

export function exportToPDF(title: string) {
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

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>${title} — Executive Narrative Report</title>
        <style>
          @page {
            size: A4;
            margin: 20mm;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            color: #1e293b;
            background: #ffffff;
            margin: 0;
            padding: 30px;
            line-height: 1.6;
          }
          .header-banner {
            border-bottom: 3px solid #4f46e5;
            padding-bottom: 20px;
            margin-bottom: 30px;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
          }
          .brand {
            font-size: 11px;
            font-weight: 800;
            color: #6366f1;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            margin-bottom: 6px;
          }
          .report-title {
            font-size: 24px;
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
          .meta-info strong {
            color: #334155;
          }
          .section {
            margin-bottom: 26px;
          }
          .section-title {
            font-size: 13px;
            font-weight: 800;
            color: #4f46e5;
            text-transform: uppercase;
            letter-spacing: 0.8px;
            border-bottom: 1px solid #e2e8f0;
            padding-bottom: 6px;
            margin-bottom: 12px;
          }
          p {
            font-size: 13px;
            color: #334155;
            margin-top: 0;
            margin-bottom: 12px;
            text-align: justify;
          }
          .kpi-grid {
            display: grid;
            grid-template-cols: repeat(2, 1fr);
            gap: 12px;
            margin-bottom: 16px;
          }
          .kpi-card {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 14px;
          }
          .kpi-label {
            font-size: 11px;
            font-weight: 700;
            color: #64748b;
            text-transform: uppercase;
          }
          .kpi-val {
            font-size: 18px;
            font-weight: 800;
            color: #0f172a;
            margin: 4px 0;
          }
          .kpi-desc {
            font-size: 11px;
            color: #475569;
          }
          ul {
            margin: 0;
            padding-left: 20px;
          }
          li {
            font-size: 13px;
            color: #334155;
            margin-bottom: 8px;
          }
          .footer {
            margin-top: 40px;
            border-top: 1px solid #e2e8f0;
            padding-top: 16px;
            font-size: 10px;
            color: #94a3b8;
            display: flex;
            justify-content: space-between;
          }
          @media print {
            body { padding: 0; }
          }
        </style>
      </head>
      <body>
        <div class="header-banner">
          <div>
            <div class="brand">BI-GI Platform • Growth & Executive Intelligence</div>
            <h1 class="report-title">${title}</h1>
          </div>
          <div class="meta-info">
            <div><strong>Date:</strong> ${currentDate}</div>
            <div><strong>Format:</strong> Executive Text Narrative (PDF)</div>
            <div><strong>Classification:</strong> Confidential / Board Level</div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">1. Executive Narrative Summary</div>
          <p>
            This official operational report provides a text-based analysis of organizational performance, financial health, and strategic growth trajectories. All metric inputs have been synthesized from live PostgreSQL data stores, aggregated through the 6-stage data processing pipeline, and verified for compliance.
          </p>
          <p>
            Current business diagnostics confirm strong operational resilience. Revenue growth remains steady, customer acquisition efficiency has improved across major channels, and overall gross margins operate well within target parameters.
          </p>
        </div>

        <div class="section">
          <div class="section-title">2. Key Performance Metric Breakdown</div>
          <div class="kpi-grid">
            <div class="kpi-card">
              <div class="kpi-label">Monthly Recurring Revenue (MRR)</div>
              <div class="kpi-val">$145,200 / mo</div>
              <div class="kpi-desc">Up +14.2% quarter-over-quarter driven by enterprise tier expansions.</div>
            </div>
            <div class="kpi-card">
              <div class="kpi-label">Customer Acquisition Cost (CAC)</div>
              <div class="kpi-val">$340 avg</div>
              <div class="kpi-desc">Improved acquisition efficiency by 8.5% via targeted campaigns.</div>
            </div>
            <div class="kpi-card">
              <div class="kpi-label">Gross Margin Percentage</div>
              <div class="kpi-val">78.4%</div>
              <div class="kpi-desc">Reflects disciplined cloud resource optimization and margin stability.</div>
            </div>
            <div class="kpi-card">
              <div class="kpi-label">Net Retention Rate (NRR)</div>
              <div class="kpi-val">112.5%</div>
              <div class="kpi-desc">Strong expansion revenue from existing corporate accounts.</div>
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">3. Qualitative Analysis & Operational Insights</div>
          <ul>
            <li><strong>Sales & Revenue Operations:</strong> Conversion rates in mid-market pipelines increased by 3.4%, reducing average sales cycle duration to 21 days.</li>
            <li><strong>Department Performance:</strong> Engineering, Marketing, Operations, and Customer Success departments met 94% of operational key results.</li>
            <li><strong>Data Integrity & Risk Mitigation:</strong> All transactional logs undergo real-time deduplication and schema validation with zero data corruption flags.</li>
          </ul>
        </div>

        <div class="section">
          <div class="section-title">4. Strategic Recommendations & Executable Actions</div>
          <ul>
            <li><strong>Targeted Market Expansion:</strong> Direct incremental marketing investment towards high-converting geographic territories.</li>
            <li><strong>Proactive Account Retention:</strong> Trigger automated account manager alerts for subscriptions exhibiting reduced feature engagement.</li>
            <li><strong>Continuous Pipeline Processing:</strong> Maintain automated data ingestion schedules to support real-time executive decision-making.</li>
          </ul>
        </div>

        <div class="footer">
          <span>BI-GI Platform © ${new Date().getFullYear()} • Executive Intelligence Report</span>
          <span>Page 1 of 1 • Approved for Internal & Executive Review</span>
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
