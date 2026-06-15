import { useEffect, useState } from 'react';
import { accountAPI, transactionAPI } from '../services/api';
import AccountCard from '../components/AccountCard';
import { PlusCircle, ArrowDownLeft, ArrowUpRight, Wallet } from 'lucide-react';

export default function Accounts() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('list');
  const [newAccountType, setNewAccountType] = useState('checking');
  const [actionForm, setActionForm] = useState({
    account_id: '',
    amount: '',
    description: '',
  });

  const loadAccounts = async () => {
    try {
      const data = await accountAPI.getAll();
      setAccounts(data.accounts || []);
      if (data.accounts?.length > 0 && !actionForm.account_id) {
        setActionForm((prev) => ({ ...prev, account_id: String(data.accounts[0].id) }));
      }
    } catch (err) {
      setError(err.message || 'Failed to load accounts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAccounts();
  }, []);

  const totalBalance = accounts.reduce((sum, acc) => sum + Number(acc.balance || 0), 0);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount || 0);

  const resetMessages = () => {
    setError('');
    setSuccess('');
  };

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    resetMessages();

    try {
      await accountAPI.create({ account_type: newAccountType });
      setSuccess('New account created successfully.');
      setActiveTab('list');
      await loadAccounts();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeposit = async (e) => {
    e.preventDefault();
    resetMessages();

    try {
      await transactionAPI.deposit({
        account_id: parseInt(actionForm.account_id, 10),
        amount: parseFloat(actionForm.amount),
        description: actionForm.description,
      });
      setSuccess('Deposit successful.');
      setActionForm((prev) => ({ ...prev, amount: '', description: '' }));
      await loadAccounts();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleWithdraw = async (e) => {
    e.preventDefault();
    resetMessages();

    try {
      await transactionAPI.withdraw({
        account_id: parseInt(actionForm.account_id, 10),
        amount: parseFloat(actionForm.amount),
        description: actionForm.description,
      });
      setSuccess('Withdrawal successful.');
      setActionForm((prev) => ({ ...prev, amount: '', description: '' }));
      await loadAccounts();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="loading">Loading accounts...</div>;

  return (
    <div className="page" style={{ background: '#f4f7fb', minHeight: '100vh' }}>
      <div className="container">
        <div
          style={{
            background: 'linear-gradient(135deg,#111827,#1d4ed8,#2563eb)',
            color: 'white',
            padding: '2rem',
            borderRadius: '24px',
            marginBottom: '2rem',
            boxShadow: '0 15px 35px rgba(37,99,235,.25)',
          }}
        >
          <h1 style={{ margin: 0 }}>My Accounts</h1>
          <p style={{ opacity: 0.85, marginTop: '.5rem' }}>
            Manage deposits, withdrawals and banking accounts in one place.
          </p>

          <div className="grid-3" style={{ marginTop: '1.5rem' }}>
            <SummaryCard icon={<Wallet />} label="Total Balance" value={formatCurrency(totalBalance)} />
            <SummaryCard icon={<PlusCircle />} label="Accounts" value={accounts.length} />
            <SummaryCard icon={<ArrowUpRight />} label="Bank Status" value="Active" />
          </div>
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <div
          style={{
            display: 'flex',
            gap: '.8rem',
            flexWrap: 'wrap',
            marginBottom: '2rem',
          }}
        >
          <TabButton text="My Accounts" active={activeTab === 'list'} onClick={() => setActiveTab('list')} />
          <TabButton text="Open Account" active={activeTab === 'create'} onClick={() => setActiveTab('create')} />
          <TabButton text="Deposit" active={activeTab === 'deposit'} onClick={() => setActiveTab('deposit')} />
          <TabButton text="Withdraw" active={activeTab === 'withdraw'} onClick={() => setActiveTab('withdraw')} />
        </div>

        {activeTab === 'list' && (
          accounts.length === 0 ? (
            <div className="empty-state card">
              <p>You have no accounts yet.</p>
            </div>
          ) : (
            <div className="grid-2">
              {accounts.map((account) => (
                <AccountCard key={account.id} account={account} />
              ))}
            </div>
          )
        )}

        {activeTab === 'create' && (
          <FormCard
            title="Open New Account"
            subtitle="Create another savings or checking account instantly."
            icon={<PlusCircle />}
          >
            <form onSubmit={handleCreateAccount}>
              <div className="form-group">
                <label>Account Type</label>
                <select value={newAccountType} onChange={(e) => setNewAccountType(e.target.value)}>
                  <option value="savings">Savings Account</option>
                  <option value="checking">Checking Account</option>
                </select>
              </div>
              <button type="submit" className="btn btn-primary">Create Account</button>
            </form>
          </FormCard>
        )}

        {activeTab === 'deposit' && (
          <FormCard
            title="Deposit Funds"
            subtitle="Add money to your selected bank account."
            icon={<ArrowDownLeft />}
          >
            <ActionForm
              accounts={accounts}
              actionForm={actionForm}
              setActionForm={setActionForm}
              onSubmit={handleDeposit}
              buttonText="Deposit Money"
              buttonClass="btn btn-accent"
              formatCurrency={formatCurrency}
            />
          </FormCard>
        )}

        {activeTab === 'withdraw' && (
          <FormCard
            title="Withdraw Funds"
            subtitle="Withdraw money safely from your account."
            icon={<ArrowUpRight />}
          >
            <ActionForm
              accounts={accounts}
              actionForm={actionForm}
              setActionForm={setActionForm}
              onSubmit={handleWithdraw}
              buttonText="Withdraw Money"
              buttonClass="btn btn-danger"
              formatCurrency={formatCurrency}
            />
          </FormCard>
        )}
      </div>
    </div>
  );
}

function SummaryCard({ icon, label, value }) {
  return (
    <div
      style={{
        background: 'rgba(255,255,255,.14)',
        border: '1px solid rgba(255,255,255,.18)',
        padding: '1rem',
        borderRadius: '18px',
        backdropFilter: 'blur(8px)',
      }}
    >
      <div style={{ marginBottom: '.5rem' }}>{icon}</div>
      <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>{value}</div>
      <div style={{ opacity: 0.8 }}>{label}</div>
    </div>
  );
}

function TabButton({ text, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '.8rem 1.2rem',
        border: 0,
        borderRadius: '999px',
        cursor: 'pointer',
        fontWeight: 700,
        background: active ? '#1d4ed8' : 'white',
        color: active ? 'white' : '#334155',
        boxShadow: active ? '0 10px 20px rgba(37,99,235,.25)' : '0 6px 15px rgba(15,23,42,.08)',
      }}
    >
      {text}
    </button>
  );
}

function FormCard({ title, subtitle, icon, children }) {
  return (
    <div
      className="card"
      style={{
        maxWidth: '520px',
        padding: '2rem',
        borderRadius: '22px',
        boxShadow: '0 12px 30px rgba(15,23,42,.08)',
      }}
    >
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div
          style={{
            width: 54,
            height: 54,
            borderRadius: '16px',
            background: '#e0ecff',
            color: '#1d4ed8',
            display: 'grid',
            placeItems: 'center',
          }}
        >
          {icon}
        </div>
        <div>
          <h2 style={{ margin: 0 }}>{title}</h2>
          <p style={{ margin: 0, color: '#64748b' }}>{subtitle}</p>
        </div>
      </div>

      {children}
    </div>
  );
}

function ActionForm({ accounts, actionForm, setActionForm, onSubmit, buttonText, buttonClass, formatCurrency }) {
  return (
    <form onSubmit={onSubmit}>
      <div className="form-group">
        <label>Account</label>
        <select
          value={actionForm.account_id}
          onChange={(e) => setActionForm({ ...actionForm, account_id: e.target.value })}
          required
        >
          {accounts.map((acc) => (
            <option key={acc.id} value={acc.id}>
              {acc.account_number} ({acc.account_type}) — {formatCurrency(acc.balance)}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Amount (₹)</label>
        <input
          type="number"
          min="1"
          step="1"
          value={actionForm.amount}
          onChange={(e) => setActionForm({ ...actionForm, amount: e.target.value })}
          placeholder="Enter amount"
          required
        />
      </div>

      <div className="form-group">
        <label>Description</label>
        <input
          type="text"
          value={actionForm.description}
          onChange={(e) => setActionForm({ ...actionForm, description: e.target.value })}
          placeholder="Example: Salary, ATM withdrawal"
        />
      </div>

      <button type="submit" className={buttonClass}>{buttonText}</button>
    </form>
  );
}