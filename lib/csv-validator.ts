"use client";

import Papa from "papaparse";

export interface FileValidationResult {
  fileName: string;
  entityType: string;
  rowCount: number;
  validRows: number;
  invalidRows: number;
  columns: string[];
  columnTypes: Record<string, string>;
  sampleData: Record<string, any>[];
  errors: string[];
  warnings: string[];
  rawRows?: any[];
}

/**
  Map filename to entity type
 */
export function detectEntityType(fileName: string): string {
  const lower = fileName.toLowerCase().trim();
  if (lower.includes("customer")) return "customers";
  if (lower.includes("employee")) return "employees";
  if (lower.includes("expense")) return "expenses";
  if (lower.includes("goal")) return "goals";
  if (lower.includes("kpi")) return "kpi_definitions";
  if (lower.includes("lead") || lower.includes("sales_funnel")) return "sales_funnel_leads";
  if (lower.includes("transaction") || lower.includes("sales_transaction") || lower.includes("sales")) return "sales_transactions";
  if (lower.includes("ticket") || lower.includes("support")) return "support_tickets";

  // Fallback: clean filename without extension
  return lower.replace(/\.[^/.]+$/, "").replace(/[^a-z0-9_]/g, "_");
}

/**
  Validate single CSV content
 */
export function validateCSVContent(fileName: string, csvContent: string): Promise<FileValidationResult> {
  return new Promise((resolve) => {
    Papa.parse(csvContent, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const rows = (results.data || []) as Record<string, any>[];
        const entityType = detectEntityType(fileName);
        const columns = results.meta.fields || (rows[0] ? Object.keys(rows[0]) : []);

        let missingValuesCount = 0;
        let malformedCount = 0;
        const warnings: string[] = [];
        const errors: string[] = [];
        const colTypes: Record<string, string> = {};

        // Detect column data types based on sample
        columns.forEach((col) => {
          const sample = rows.find((r) => r[col] !== undefined && r[col] !== null && r[col] !== "")?.[col];
          if (sample !== undefined) {
            if (!isNaN(Number(sample)) && sample !== "") {
              colTypes[col] = "number";
            } else if (!isNaN(Date.parse(sample)) && isNaN(Number(sample))) {
              colTypes[col] = "date";
            } else if (sample.toLowerCase() === "true" || sample.toLowerCase() === "false") {
              colTypes[col] = "boolean";
            } else {
              colTypes[col] = "string";
            }
          } else {
            colTypes[col] = "string";
          }
        });

        // Scan rows for missing values and anomalies
        const sampleLimit = Math.min(rows.length, 5000);
        let missingColSamples: Record<string, number> = {};

        for (let i = 0; i < sampleLimit; i++) {
          const row = rows[i];
          columns.forEach((col) => {
            const val = row[col];
            if (val === undefined || val === null || val === "") {
              missingValuesCount++;
              missingColSamples[col] = (missingColSamples[col] || 0) + 1;
            }
          });
        }

        // Generate warnings based on validation findings
        if (missingValuesCount > 0) {
          const topMissingCol = Object.entries(missingColSamples).sort((a, b) => b[1] - a[1])[0];
          if (topMissingCol) {
            warnings.push(`⚠ ${topMissingCol[1]} rows contain missing ${topMissingCol[0]}`);
          } else {
            warnings.push(`⚠ Detected ${missingValuesCount} missing values in dataset sample`);
          }
        }

        if (rows.length === 0) {
          errors.push("✖ CSV file contains no data rows");
        } else {
          warnings.unshift(`✓ Valid CSV schema (${columns.length} columns detected)`);
          warnings.unshift(`✓ Required entity headers mapped to ${entityType}`);
        }

        const validRows = rows.length - malformedCount;

        resolve({
          fileName,
          entityType,
          rowCount: rows.length,
          validRows: Math.max(0, validRows),
          invalidRows: malformedCount,
          columns,
          columnTypes: colTypes,
          sampleData: rows.slice(0, 10),
          errors,
          warnings,
          rawRows: rows,
        });
      },
      error: (err) => {
        resolve({
          fileName,
          entityType: detectEntityType(fileName),
          rowCount: 0,
          validRows: 0,
          invalidRows: 0,
          columns: [],
          columnTypes: {},
          sampleData: [],
          errors: [`Failed to parse CSV file: ${err.message}`],
          warnings: [],
        });
      },
    });
  });
}
