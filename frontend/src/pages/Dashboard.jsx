import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { accountAPI, transactionAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Wallet,
  CreditCard,
  ArrowUpRight,
  ArrowDownLeft,
  ShieldAlert,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

export default function Dashboard() {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const [accountsData, txData] = await Promise.all([
          accountAPI.getAll(),
          transactionAPI.getAll(),
        ]);

        setAccounts(accountsData.accounts || []);
        setTransactions(txData.transactions || []);
      } catch (err) {
        setError(err.message || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const totalBalance = accounts.reduce(
    (sum, acc) => sum + Number(acc.balance || 0),
    0
  );

  const stats = useMemo(() => {
    let income = 0;
    let expense = 0;
    let transfer = 0;

    transactions.forEach((tx) => {
      const amount = Number(tx.amount || 0);

      if (tx.type === 'deposit') income += amount;
      if (tx.type === 'withdraw') expense += amount;
      if (tx.type === 'transfer') transfer += amount;
    });

    return { income, expense, transfer };
  }, [transactions]);

  const chartData = [
    { name: 'Income', amount: stats.income },
    { name: 'Withdraw', amount: stats.expense },
    { name: 'Transfer', amount: stats.transfer },
  ];

  const pieData = chartData.filter((item) => item.amount > 0);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount || 0);

  if (loading) return <div className="loading">Loading dashboard...</div>;

  return (
    <div className="page" style={{ background: '#f4f7fb', minHeight: '100vh' }}>
      <div className="container">
        <div
          style={{
            background: 'linear-gradient(135deg, #0f4c81, #2563eb)',
            color: 'white',
            padding: '2rem',
            borderRadius: '22px',
            marginBottom: '2rem',
            boxShadow: '0 12px 30px rgba(37,99,235,0.25)',
          }}
        >
          <h1 style={{ marginBottom: '.4rem' }}>
            Welcome back, {user?.full_name || 'User'} 👋
          </h1>
          <p style={{ opacity: 0.9 }}>
            Here is your smart banking overview.
          </p>

          <h2 style={{ fontSize: '2.3rem', marginTop: '1.5rem' }}>
            {formatCurrency(totalBalance)}
          </h2>
          <p style={{ opacity: 0.85 }}>Total Available Balance</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <div className="grid-3" style={{ marginBottom: '2rem' }}>
          <StatCard
            icon={<Wallet />}
            title="Total Balance"
            value={formatCurrency(totalBalance)}
          />
          <StatCard
            icon={<CreditCard />}
            title="Active Accounts"
            value={accounts.length}
          />
          <StatCard
            icon={<ArrowUpRight />}
            title="Total Transactions"
            value={transactions.length}
          />
        </div>

        <div className="grid-3" style={{ marginBottom: '2rem' }}>
          <StatCard
            icon={<ArrowDownLeft />}
            title="Money Received"
            value={formatCurrency(stats.income)}
          />
          <StatCard
            icon={<ArrowUpRight />}
            title="Money Sent"
            value={formatCurrency(stats.transfer + stats.expense)}
          />
          <StatCard
            icon={<ShieldAlert />}
            title="Risk Check"
            value={stats.transfer > 50000 ? 'Alert' : 'Safe'}
          />
        </div>

        <div className="grid-2" style={{ marginBottom: '2rem' }}>
          <div className="card" style={{ padding: '1.5rem' }}>
            <h2 style={{ marginBottom: '1rem' }}>Income vs Expense</h2>
            <div style={{ width: '100%', height: 280 }}>
              <ResponsiveContainer>
                <BarChart data={chartData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="amount" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card" style={{ padding: '1.5rem' }}>
            <h2 style={{ marginBottom: '1rem' }}>Transaction Split</h2>
            <div style={{ width: '100%', height: 280 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={pieData.length ? pieData : [{ name: 'No Data', amount: 1 }]}
                    dataKey="amount"
                    nameKey="name"
                    outerRadius={95}
                    label
                  >
                    {(pieData.length ? pieData : [{ name: 'No Data' }]).map(
                      (_, index) => (
                        <Cell key={index} />
                      )
                    )}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem',
            }}
          >
            <h2>Recent Transactions</h2>
            <Link to="/transactions">View all →</Link>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', color: '#64748b' }}>
                <th style={th}>Type</th>
                <th style={th}>Amount</th>
                <th style={th}>Description</th>
                <th style={th}>Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.slice(0, 6).map((tx) => (
                <tr key={tx.id} style={{ borderTop: '1px solid #e5e7eb' }}>
                  <td style={td}>{tx.type}</td>
                  <td style={td}>{formatCurrency(tx.amount)}</td>
                  <td style={td}>{tx.description || '-'}</td>
                  <td style={td}>
                    {tx.created_at
                      ? new Date(tx.created_at).toLocaleDateString()
                      : '-'}
                  </td>
                </tr>
              ))}

              {transactions.length === 0 && (
                <tr>
                  <td style={td} colSpan="4">
                    No transactions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Link to="/transfer" className="btn btn-accent">
            Make Transfer
          </Link>
          <Link to="/accounts" className="btn btn-primary">
            Manage Accounts
          </Link>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, title, value }) {
  return (
    <div
      className="card stat-card"
      style={{
        padding: '1.5rem',
        borderRadius: '18px',
        boxShadow: '0 8px 22px rgba(15,23,42,0.08)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: '14px',
            background: '#e0ecff',
            color: '#1d4ed8',
            display: 'grid',
            placeItems: 'center',
          }}
        >
          {icon}
        </div>
        <div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>{value}</div>
          <div style={{ color: '#64748b' }}>{title}</div>
        </div>
      </div>
    </div>
  );
}

const th = {
  padding: '12px',
  fontSize: '.9rem',
};

const td = {
  padding: '14px 12px',
};