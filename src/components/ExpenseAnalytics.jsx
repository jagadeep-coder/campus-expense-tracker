import React, { useMemo } from 'react';
import './ExpenseAnalytics.css';

const MOCK_TRANSACTIONS = [
  { id: 1, date: '2023-10-01', amount: 120, category: 'Food' },
  { id: 2, date: '2023-10-01', amount: 50, category: 'Transport' },
  { id: 3, date: '2023-10-02', amount: 400, category: 'Education' },
  { id: 4, date: '2023-10-03', amount: 150, category: 'Food' },
  { id: 5, date: '2023-10-04', amount: 300, category: 'Entertainment' },
  { id: 6, date: '2023-10-05', amount: 80, category: 'Transport' },
  { id: 7, date: '2023-10-06', amount: 499, category: 'Recharge & Bills' },
  { id: 8, date: '2023-10-07', amount: 250, category: 'Food' },
  { id: 9, date: '2023-10-07', amount: 60, category: 'Other' },
];

const CATEGORY_COLORS = {
  'Food': '#f59e0b',
  'Transport': '#3b82f6',
  'Education': '#10b981',
  'Entertainment': '#a855f7',
  'Recharge & Bills': '#ec4899',
  'Other': '#64748b'
};

const formatINR = (amount) => {
  return '₹' + amount.toLocaleString('en-IN', { maximumFractionDigits: 0 });
};

export default function ExpenseAnalytics() {
  const {
    totalSpent,
    avgDaily,
    numTransactions,
    categoryTotals,
    highestCategory,
    dailyTrends
  } = useMemo(() => {
    let total = 0;
    const catTotals = {};
    const dayTotals = {};

    MOCK_TRANSACTIONS.forEach(t => {
      total += t.amount;
      catTotals[t.category] = (catTotals[t.category] || 0) + t.amount;
      dayTotals[t.date] = (dayTotals[t.date] || 0) + t.amount;
    });

    const numTx = MOCK_TRANSACTIONS.length;
    const uniqueDays = Object.keys(dayTotals).length || 1;
    const avg = total / uniqueDays;

    let maxCat = { name: '', amount: 0 };
    const catArray = [];
    for (const [name, amount] of Object.entries(catTotals)) {
      catArray.push({ name, amount });
      if (amount > maxCat.amount) {
        maxCat = { name, amount };
      }
    }

    // Sort descending
    catArray.sort((a, b) => b.amount - a.amount);

    // Prepare daily trend data for chart
    const sortedDays = Object.keys(dayTotals).sort();
    const trendArray = sortedDays.map(date => ({
      date: date.substring(5), // e.g. "10-01"
      amount: dayTotals[date]
    }));

    return {
      totalSpent: total,
      avgDaily: avg,
      numTransactions: numTx,
      categoryTotals: catArray,
      highestCategory: maxCat.name,
      dailyTrends: trendArray
    };
  }, []);

  const maxTrendAmount = Math.max(...dailyTrends.map(d => d.amount), 1);

  return (
    <div className="analytics-container">
      <header className="analytics-header">
        <h1>Expense Analytics</h1>
        <p>Understand where your money is going.</p>
      </header>

      {/* Overview Cards */}
      <div className="metrics-grid">
        <div className="metric-card">
          <h3>Total Spending</h3>
          <div className="metric-value">{formatINR(totalSpent)}</div>
          <p>Over {dailyTrends.length} days</p>
        </div>
        <div className="metric-card">
          <h3>Average Daily</h3>
          <div className="metric-value">{formatINR(avgDaily)}</div>
          <p>Per day</p>
        </div>
        <div className="metric-card">
          <h3>Transactions</h3>
          <div className="metric-value">{numTransactions}</div>
          <p>Total purchases</p>
        </div>
      </div>

      {/* Student-Friendly Insights */}
      <div className="insights-card">
        <h3>💡 Quick Insights</h3>
        <ul>
          <li><strong>{highestCategory}</strong> is your highest spending category.</li>
          <li>Your average daily spending is <strong>{formatINR(avgDaily)}</strong>.</li>
          {avgDaily > 200 ? (
            <li>You're spending a bit high daily, maybe cut back on {highestCategory}?</li>
          ) : (
            <li>Your daily spending is well managed. Keep it up!</li>
          )}
        </ul>
      </div>

      <div className="charts-grid">
        {/* Category Breakdown (Simple Progress Bars) */}
        <div className="chart-card">
          <h3>Category Analysis</h3>
          <div className="category-list">
            {categoryTotals.map(cat => {
              const percentage = ((cat.amount / totalSpent) * 100).toFixed(1);
              return (
                <div key={cat.name} className="category-item">
                  <div className="category-header">
                    <span className="cat-name">
                      <span className="dot" style={{ backgroundColor: CATEGORY_COLORS[cat.name] }}></span>
                      {cat.name}
                    </span>
                    <span className="cat-amount">{formatINR(cat.amount)} ({percentage}%)</span>
                  </div>
                  <div className="progress-bg">
                    <div 
                      className="progress-fill" 
                      style={{ 
                        width: `${percentage}%`,
                        backgroundColor: CATEGORY_COLORS[cat.name] 
                      }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Spending Trend (Simple Bar Chart) */}
        <div className="chart-card">
          <h3>Spending Trend</h3>
          <div className="bar-chart">
            {dailyTrends.map(day => {
              const heightPct = (day.amount / maxTrendAmount) * 100;
              return (
                <div key={day.date} className="bar-container" title={`${day.date}: ${formatINR(day.amount)}`}>
                  <div className="bar-value">{formatINR(day.amount)}</div>
                  <div className="bar" style={{ height: `${heightPct}%` }}></div>
                  <div className="bar-label">{day.date}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
