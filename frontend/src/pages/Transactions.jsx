import { useEffect, useMemo, useState } from 'react';
import { accountAPI, transactionAPI } from '../services/api';
import TransactionList from '../components/TransactionList';
import { Search, Wallet, ArrowDownLeft, ArrowUpRight, FileDown } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function Transactions() {
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadTransactions = async (accountId) => {
    try {
      const data = await transactionAPI.getAll(accountId || undefined);
      setTransactions(data.transactions || []);
    } catch (err) {
      setError(err.message || 'Failed to load transactions');
    }
  };

  useEffect(() => {
    async function init() {
      try {
        const data = await accountAPI.getAll();
        setAccounts(data.accounts || []);
        await loadTransactions('');
      } catch (err) {
        setError(err.message || 'Failed to load page');
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      const matchesType = typeFilter === 'all' || tx.type === typeFilter;
      const text = `${tx.type} ${tx.description || ''} ${tx.from_account || ''} ${tx.to_account || ''}`.toLowerCase();
      return matchesType && text.includes(searchText.toLowerCase());
    });
  }, [transactions, typeFilter, searchText]);

  const stats = useMemo(() => {
    let income = 0;
    let expense = 0;
    let transfer = 0;

    filteredTransactions.forEach((tx) => {
      const amount = Number(tx.amount || 0);
      if (tx.type === 'deposit') income += amount;
      if (tx.type === 'withdraw') expense += amount;
      if (tx.type === 'transfer') transfer += amount;
    });

    return { total: filteredTransactions.length, income, expense, transfer };
  }, [filteredTransactions]);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount || 0);

  const handleAccountFilter = async (e) => {
    const value = e.target.value;
    setSelectedAccount(value);
    setLoading(true);
    await loadTransactions(value);
    setLoading(false);
  };

  const downloadPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text('Smart Banking Statement', 14, 18);

    doc.setFontSize(10);
    doc.text(`Generated On: ${new Date().toLocaleString('en-IN')}`, 14, 27);
    doc.text(`Total Transactions: ${stats.total}`, 14, 34);
    doc.text(`Total Income: ${formatCurrency(stats.income)}`, 14, 41);
    doc.text(`Total Withdraw/Transfer: ${formatCurrency(stats.expense + stats.transfer)}`, 14, 48);

    autoTable(doc, {
      startY: 58,
      head: [['Date', 'Type', 'From', 'To', 'Description', 'Amount']],
      body: filteredTransactions.map((tx) => [
        tx.created_at ? new Date(tx.created_at).toLocaleString('en-IN') : '-',
        tx.type,
        tx.from_account || '-',
        tx.to_account || '-',
        tx.description || '-',
        formatCurrency(tx.amount),
      ]),
    });

    doc.save('Smart_Banking_Statement.pdf');
  };

  if (loading && transactions.length === 0) {
    return <div className="loading">Loading transactions...</div>;
  }

  return (
    <div className="page" style={{ background: '#f4f7fb', minHeight: '100vh' }}>
      <div className="container">
        <div
          style={{
            background: 'linear-gradient(135deg,#0f172a,#1d4ed8,#2563eb)',
            color: 'white',
            padding: '2rem',
            borderRadius: '24px',
            marginBottom: '2rem',
          }}
        >
          <h1>Transaction History</h1>
          <p>Track deposits, withdrawals, transfers and download bank statement.</p>

          <div className="grid-3" style={{ marginTop: '1.5rem' }}>
            <MiniCard icon={<Wallet />} label="Total Records" value={stats.total} />
            <MiniCard icon={<ArrowDownLeft />} label="Money Received" value={formatCurrency(stats.income)} />
            <MiniCard icon={<ArrowUpRight />} label="Money Sent" value={formatCurrency(stats.expense + stats.transfer)} />
          </div>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <div className="card" style={{ borderRadius: '22px', padding: '1.5rem' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: '1rem',
              flexWrap: 'wrap',
              marginBottom: '1.5rem',
            }}
          >
            <div>
              <h2>All Transactions</h2>
              <p style={{ color: '#64748b' }}>Search, filter and export your banking activity.</p>
            </div>

            <button className="btn btn-primary" onClick={downloadPDF}>
              <FileDown size={18} />
              Download PDF
            </button>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1.5fr 1fr 1fr',
              gap: '1rem',
              marginBottom: '1.5rem',
            }}
          >
            <div style={{ position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', left: 14, top: 14, color: '#64748b' }} />
              <input
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search transaction..."
                style={{ paddingLeft: 42 }}
              />
            </div>

            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
              <option value="all">All Types</option>
              <option value="deposit">Deposit</option>
              <option value="withdraw">Withdraw</option>
              <option value="transfer">Transfer</option>
            </select>

            <select value={selectedAccount} onChange={handleAccountFilter}>
              <option value="">All Accounts</option>
              {accounts.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.account_number} ({acc.account_type})
                </option>
              ))}
            </select>
          </div>

          {loading ? (
            <div className="loading">Loading...</div>
          ) : (
            <TransactionList transactions={filteredTransactions} />
          )}
        </div>
      </div>
    </div>
  );
}

function MiniCard({ icon, label, value }) {
  return (
    <div
      style={{
        background: 'rgba(255,255,255,.14)',
        border: '1px solid rgba(255,255,255,.18)',
        padding: '1rem',
        borderRadius: '18px',
      }}
    >
      <div style={{ marginBottom: '.5rem' }}>{icon}</div>
      <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>{value}</div>
      <div style={{ opacity: 0.8 }}>{label}</div>
    </div>
  );
}