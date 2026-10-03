import { useState, useMemo } from 'react';
import './App.css';

const INITIAL_EXPENSES = [
  { id: 1, name: 'College Canteen', category: 'Food', date: '2026-10-01', amount: 80 },
  { id: 2, name: 'Engineering Textbook', category: 'Education', date: '2026-10-02', amount: 650 },
  { id: 3, name: 'Bus Pass', category: 'Transport', date: '2026-10-03', amount: 900 },
  { id: 4, name: 'Movie', category: 'Entertainment', date: '2026-10-05', amount: 250 },
  { id: 5, name: 'Data Recharge', category: 'Recharge & Bills', date: '2026-10-06', amount: 299 },
];

const CATEGORIES = ['Food', 'Transport', 'Education', 'Entertainment', 'Recharge & Bills', 'Other'];
const CATEGORY_COLORS = {
  'Food': '#f59e0b',
  'Transport': '#3b82f6',
  'Education': '#10b981',
  'Entertainment': '#a855f7',
  'Recharge & Bills': '#ec4899',
  'Other': '#64748b'
};

const MONTHLY_BUDGET = 10000;

const formatINR = (amount) => {
  return '₹' + amount.toLocaleString('en-IN', {
    minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
    maximumFractionDigits: 2
  });
};

function App() {
  const [expenses, setExpenses] = useState(INITIAL_EXPENSES);
  const [newExpense, setNewExpense] = useState({ name: '', amount: '', category: 'Food' });

  // Calculations
  const totalSpent = useMemo(() => {
    return expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
  }, [expenses]);

  const remainingBudget = Math.max(0, MONTHLY_BUDGET - totalSpent);
  const budgetPercentage = Math.min(100, (totalSpent / MONTHLY_BUDGET) * 100);

  const getProgressColorClass = () => {
    if (budgetPercentage > 90) return 'danger';
    if (budgetPercentage > 75) return 'warning';
    return 'good';
  };

  const categoryTotals = useMemo(() => {
    const totals = {};
    CATEGORIES.forEach(c => totals[c] = 0);
    expenses.forEach(exp => {
      if (totals[exp.category] !== undefined) {
        totals[exp.category] += parseFloat(exp.amount);
      } else {
        totals['Other'] = (totals['Other'] || 0) + parseFloat(exp.amount);
      }
    });
    return Object.entries(totals)
      .filter(([_, amount]) => amount > 0)
      .sort((a, b) => b[1] - a[1]);
  }, [expenses]);

  const handleAddExpense = (e) => {
    e.preventDefault();
    if (!newExpense.name || !newExpense.amount) return;

    const expense = {
      id: Date.now(),
      name: newExpense.name,
      amount: parseFloat(newExpense.amount),
      category: newExpense.category,
      date: new Date().toISOString().split('T')[0]
    };

    setExpenses([expense, ...expenses]);
    setNewExpense({ name: '', amount: '', category: 'Food' });
  };

  const currentDate = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div>
          <h1>Campus Expense</h1>
          <p>Track your student budget like a pro ✨</p>
        </div>
        <div className="header-date">{currentDate}</div>
      </header>

      {/* Top Cards Grid */}
      <div className="dashboard-grid">
        {/* Total Spent Card */}
        <div className="card total-card">
          <div className="card-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
            Total Spent
          </div>
          <div className="total-amount">{formatINR(totalSpent)}</div>
          <p style={{color: 'var(--text-muted)', fontSize: '0.9rem'}}>This month</p>
        </div>

        {/* Budget Progress Card */}
        <div className="card budget-card">
          <div className="card-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            Monthly Budget
          </div>
          <div className="budget-stats">
            <div className="budget-stat">
              <span className="label">Budget</span>
              <span className="value">{formatINR(MONTHLY_BUDGET)}</span>
            </div>
            <div className="budget-stat" style={{textAlign: 'right'}}>
              <span className="label">Remaining</span>
              <span className="value" style={{color: budgetPercentage > 90 ? 'var(--danger)' : 'inherit'}}>
                {formatINR(remainingBudget)}
              </span>
            </div>
          </div>
          <div className="progress-container">
            <div 
              className={`progress-bar ${getProgressColorClass()}`} 
              style={{width: `${budgetPercentage}%`}}
            ></div>
          </div>
          <p style={{color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.75rem', textAlign: 'right'}}>
            {budgetPercentage.toFixed(1)}% used
          </p>
        </div>
      </div>

      <div className="main-content">
        {/* Left Column: Recent Expenses */}
        <div className="card">
          <div className="card-title" style={{marginBottom: '1.5rem'}}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            Recent Expenses
          </div>
          
          {expenses.length === 0 ? (
            <div className="empty-state">
              <p>No expenses yet. Start adding some!</p>
            </div>
          ) : (
            <div className="transactions-list">
              {expenses.map(expense => (
                <div key={expense.id} className="transaction-item">
                  <div className="transaction-info">
                    <div className="transaction-icon" style={{color: CATEGORY_COLORS[expense.category], background: `${CATEGORY_COLORS[expense.category]}20`}}>
                      {expense.category.charAt(0)}
                    </div>
                    <div className="transaction-details">
                      <h4>{expense.name}</h4>
                      <p>{expense.category} • {expense.date}</p>
                    </div>
                  </div>
                  <div className="transaction-amount">
                    -{formatINR(parseFloat(expense.amount))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Add Form & Categories */}
        <div style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
          
          {/* Quick Add Form */}
          <div className="card">
            <div className="card-title">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              Quick Add
            </div>
            <form className="quick-add-form" onSubmit={handleAddExpense}>
              <div className="form-group">
                <label>What did you buy?</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="e.g. Lunch" 
                  value={newExpense.name}
                  onChange={e => setNewExpense({...newExpense, name: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Amount (₹)</label>
                <input 
                  type="number" 
                  className="form-control" 
                  placeholder="e.g. ₹150" 
                  min="0.01" 
                  step="0.01"
                  value={newExpense.amount}
                  onChange={e => setNewExpense({...newExpense, amount: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select 
                  className="form-control"
                  value={newExpense.category}
                  onChange={e => setNewExpense({...newExpense, category: e.target.value})}
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <button type="submit" className="btn-primary" style={{marginTop: '0.5rem'}}>
                Add Expense
              </button>
            </form>
          </div>

          {/* Categories Summary */}
          <div className="card">
            <div className="card-title">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path><path d="M22 12A10 10 0 0 0 12 2v10z"></path></svg>
              Spending by Category
            </div>
            {categoryTotals.length === 0 ? (
              <p style={{color: 'var(--text-muted)', fontSize: '0.9rem'}}>No data available.</p>
            ) : (
              <div className="category-list">
                {categoryTotals.map(([category, amount]) => (
                  <div key={category} className="category-item">
                    <div className="category-label">
                      <div className="category-dot" style={{backgroundColor: CATEGORY_COLORS[category]}}></div>
                      {category}
                    </div>
                    <div className="category-amount">
                      {formatINR(amount)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default App;
