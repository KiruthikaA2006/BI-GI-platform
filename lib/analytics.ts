export interface BusinessRow {
  date?: string;
  revenue?: number;
  expense?: number;
  profit?: number;
  region?: string;
  department?: string;
  product?: string;
  customer?: string;
  salesperson?: string;
  status?: string;
  [key: string]: any;
}

export interface AnalyticsFilter {
  timeRange?: string; // "7D" | "30D" | "90D" | "YTD" | "ALL"
  region?: string;
  department?: string;
  product?: string;
}

export function filterRows(rows: BusinessRow[], filters: AnalyticsFilter): BusinessRow[] {
  if (!rows || rows.length === 0) return [];

  return rows.filter((r) => {
    // Region Filter
    if (filters.region && filters.region !== "All Regions") {
      const reg = String(r.region || "").toLowerCase();
      if (!reg.includes(filters.region.toLowerCase().split(" ")[0])) {
        return false;
      }
    }

    // Department Filter
    if (filters.department && filters.department !== "All Departments") {
      const dept = String(r.department || "").toLowerCase();
      if (!dept.includes(filters.department.toLowerCase().split(" ")[0])) {
        return false;
      }
    }

    // Product Filter
    if (filters.product && filters.product !== "All Products") {
      const prod = String(r.product || "").toLowerCase();
      if (!prod.includes(filters.product.toLowerCase())) {
        return false;
      }
    }

    return true;
  });
}

export function calculateExecutiveMetrics(rows: BusinessRow[], filters: AnalyticsFilter = {}) {
  const filtered = filterRows(rows, filters);

  if (filtered.length === 0) {
    return {
      totalRevenue: 0,
      revenueGrowth: 0,
      totalExpenses: 0,
      netProfit: 0,
      profitGrowth: 0,
      activeCustomers: 0,
      customerGrowth: 0,
      conversionRate: 0,
      totalSales: 0,
    };
  }

  let totalRevenue = 0;
  let totalExpenses = 0;
  const uniqueCustomers = new Set<string>();
  let closedSales = 0;

  filtered.forEach((r) => {
    // Detect expenses vs revenues from CSV fields
    const isExpenseRow = Boolean(r.expense_id || r.category || r.approved_by || r.expense || r.cost);
    const amountVal = Number(r.amount_inr || r.amount || r.deal_value_inr || r.revenue || r.expense || 0);

    if (isExpenseRow) {
      totalExpenses += isNaN(amountVal) ? 0 : amountVal;
    } else {
      totalRevenue += isNaN(amountVal) ? 0 : amountVal;
      if (amountVal > 0) closedSales++;
    }

    if (r.customer || r.customer_id) {
      uniqueCustomers.add(String(r.customer || r.customer_id));
    }
  });

  const netProfit = totalRevenue - totalExpenses;
  const customerCount = uniqueCustomers.size || (closedSales > 0 ? closedSales : filtered.length);

  // Month-over-month or sequence-based growth calculation
  const half = Math.floor(filtered.length / 2);
  const firstHalfVal = filtered.slice(0, half).reduce((sum, r) => {
    const val = Number(r.amount_inr || r.amount || r.deal_value_inr || r.revenue || 0);
    return sum + (isNaN(val) ? 0 : val);
  }, 0);

  const secondHalfVal = filtered.slice(half).reduce((sum, r) => {
    const val = Number(r.amount_inr || r.amount || r.deal_value_inr || r.revenue || 0);
    return sum + (isNaN(val) ? 0 : val);
  }, 0);

  const revenueGrowth = firstHalfVal > 0 ? Number((((secondHalfVal - firstHalfVal) / firstHalfVal) * 100).toFixed(1)) : 0.0;
  const conversionRate = filtered.length > 0 ? Number(((closedSales / filtered.length) * 100).toFixed(1)) : 0.0;

  return {
    totalRevenue,
    revenueGrowth,
    totalExpenses,
    netProfit,
    profitGrowth: revenueGrowth,
    activeCustomers: customerCount,
    customerGrowth: 0.0,
    conversionRate,
    totalSales: closedSales || filtered.length,
  };
}

export function calculateMonthlyTrends(rows: BusinessRow[], filters: AnalyticsFilter = {}) {
  const filtered = filterRows(rows, filters);
  const monthlyMap: Record<string, { revenue: number; expenses: number; profit: number; sales: number }> = {};

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  filtered.forEach((r) => {
    let month = "Jan";
    if (r.date || r.created_date) {
      const dateStr = String(r.date || r.created_date);
      const d = new Date(dateStr);
      if (!isNaN(d.getTime())) {
        month = monthNames[d.getMonth()];
      }
    }

    if (!monthlyMap[month]) {
      monthlyMap[month] = { revenue: 0, expenses: 0, profit: 0, sales: 0 };
    }

    const isExpenseRow = Boolean(r.expense_id || r.category || r.approved_by || r.expense || r.cost);
    const amountVal = Number(r.amount_inr || r.amount || r.deal_value_inr || r.revenue || r.expense || 0);

    if (isExpenseRow) {
      monthlyMap[month].expenses += isNaN(amountVal) ? 0 : amountVal;
    } else {
      monthlyMap[month].revenue += isNaN(amountVal) ? 0 : amountVal;
    }

    monthlyMap[month].profit = monthlyMap[month].revenue - monthlyMap[month].expenses;
    monthlyMap[month].sales += 1;
  });

  return monthNames.map((m) => {
    const data = monthlyMap[m] || { revenue: 0, expenses: 0, profit: 0, sales: 0 };
    return {
      month: m,
      revenue: Math.round(data.revenue),
      expenses: Math.round(data.expenses),
      profit: Math.round(data.profit),
      sales: data.sales,
      target: Math.round(data.revenue * 1.1),
    };
  });
}

export function calculateRegionalBreakdown(rows: BusinessRow[], filters: AnalyticsFilter = {}) {
  const filtered = filterRows(rows, filters);
  const regionMap: Record<string, { revenue: number; sales: number }> = {};

  let grandTotalRev = 0;

  filtered.forEach((r) => {
    const region = r.region || "General";
    if (!regionMap[region]) {
      regionMap[region] = { revenue: 0, sales: 0 };
    }
    const val = Number(r.amount_inr || r.amount || r.deal_value_inr || r.revenue || 0);
    regionMap[region].revenue += isNaN(val) ? 0 : val;
    regionMap[region].sales += 1;
    grandTotalRev += isNaN(val) ? 0 : val;
  });

  const regions = Object.keys(regionMap);
  if (regions.length === 0) {
    return [];
  }

  return regions.map((reg) => {
    const data = regionMap[reg];
    const share = grandTotalRev > 0 ? Number(((data.revenue / grandTotalRev) * 100).toFixed(1)) : 0;
    return {
      region: reg,
      sales: data.sales,
      revenue: Math.round(data.revenue),
      growth: 0.0,
      share,
    };
  });
}

export function calculateStatisticalForecast(rows: BusinessRow[]) {
  const monthlyData = calculateMonthlyTrends(rows);
  const activeMonths = monthlyData.filter((m) => m.revenue > 0 || m.expenses > 0);

  if (activeMonths.length === 0) {
    return [];
  }

  const avgRev = activeMonths.reduce((sum, m) => sum + (m.revenue || m.expenses), 0) / activeMonths.length;

  return monthlyData.slice(0, 8).map((m, idx) => {
    const isHistorical = idx < activeMonths.length;
    const predicted = Math.round(avgRev * (1 + idx * 0.05));
    return {
      period: `${m.month} 2026`,
      actual: isHistorical ? (m.revenue || m.expenses) : null,
      predicted,
      lowerBound: Math.round(predicted * 0.9),
      upperBound: Math.round(predicted * 1.1),
    };
  });
}
