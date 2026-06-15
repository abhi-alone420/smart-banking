import { useEffect, useState } from 'react';
import { accountAPI, transactionAPI } from '../services/api';
import {
  Send,
  Wallet,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  IndianRupee,
} from 'lucide-react';

export default function Transfer() {
  const [accounts, setAccounts] = useState([]);
  const [form, setForm] = useState({
    from_account_id: '',
    to_account_number: '',
    amount: '',
    description: '',
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    async function loadAccounts() {
      try {
        const data = await accountAPI.getAll();
        setAccounts(data.accounts || []);
        if (data.accounts?.length > 0) {
          setForm((prev) => ({ ...prev, from_account_id: String(data.accounts[0].id) }));
        }
      } catch (err) {
        setError(err.message || 'Failed to load accounts');
      } finally {
        setLoading(false);
      }
    }
    loadAccounts();
  }, []);

  const selectedAccount = accounts.find(
    (acc) => String(acc.id) === String(form.from_account_id)
  );

  const amount = Number(form.amount || 0);
  const isHighRisk = amount >= 50000;

  const formatCurrency = (value) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(value || 0);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!form.to_account_number.trim()) {
      setError('Enter recipient account number.');
      return;
    }

    if (!form.amount || Number(form.amount) <= 0) {
      setError('Enter valid transfer amount.');
      return;
    }

    if (selectedAccount && amount > Number(selectedAccount.balance)) {
      setError('Insufficient balance.');
      return;
    }

    setShowConfirm(true);
  };

  const confirmTransfer = async () => {
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const data = await transactionAPI.transfer({
        from_account_id: parseInt(form.from_account_id, 10),
        to_account_number: form.to_account_number.trim(),
        amount: parseFloat(form.amount),
        description: form.description,
      });

      setSuccess(
        `Transfer successful. Sent ${formatCurrency(form.amount)} to ${data.recipient || form.to_account_number}.`
      );

      setForm((prev) => ({
        ...prev,
        to_account_number: '',
        amount: '',
        description: '',
      }));

      const accountsData = await accountAPI.getAll();
      setAccounts(accountsData.accounts || []);
      setShowConfirm(false);
    } catch (err) {
      setError(err.message || 'Transfer failed');
      setShowConfirm(false);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="loading">Loading transfer page...</div>;

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
            boxShadow: '0 15px 35px rgba(37,99,235,.25)',
          }}
        >
          <h1 style={{ margin: 0 }}>Transfer Money</h1>
          <p style={{ opacity: 0.85, marginTop: '.5rem' }}>
            Send money instantly and securely to another Smart Banking account.
          </p>

          <div className="grid-3" style={{ marginTop: '1.5rem' }}>
            <MiniCard icon={<Wallet />} label="Selected Balance" value={formatCurrency(selectedAccount?.balance)} />
            <MiniCard icon={<ShieldCheck />} label="Security Status" value="Protected" />
            <MiniCard icon={<Send />} label="Transfer Mode" value="Instant" />
          </div>
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        {accounts.length === 0 ? (
          <div className="empty-state card">
            <p>You need an account before you can transfer money.</p>
          </div>
        ) : (
          <div className="grid-2">
            <div
              className="card"
              style={{
                padding: '2rem',
                borderRadius: '22px',
                boxShadow: '0 12px 30px rgba(15,23,42,.08)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
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
                  <Send />
                </div>
                <div>
                  <h2 style={{ margin: 0 }}>Transfer Details</h2>
                  <p style={{ margin: 0, color: '#64748b' }}>Enter recipient and amount details.</p>
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>From Account</label>
                  <select
                    name="from_account_id"
                    value={form.from_account_id}
                    onChange={handleChange}
                    required
                  >
                    {accounts.map((acc) => (
                      <option key={acc.id} value={acc.id}>
                        {acc.account_number} — {formatCurrency(acc.balance)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Recipient Account Number</label>
                  <input
                    name="to_account_number"
                    type="text"
                    value={form.to_account_number}
                    onChange={handleChange}
                    placeholder="Example: SB12345678901"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Amount (₹)</label>
                  <input
                    name="amount"
                    type="number"
                    min="1"
                    step="1"
                    value={form.amount}
                    onChange={handleChange}
                    placeholder="Enter amount"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Note</label>
                  <input
                    name="description"
                    type="text"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Example: Rent, fees, shopping"
                  />
                </div>

                {isHighRisk && (
                  <div
                    style={{
                      background: '#fff7ed',
                      color: '#c2410c',
                      padding: '1rem',
                      borderRadius: '14px',
                      marginBottom: '1rem',
                      display: 'flex',
                      gap: '.7rem',
                      alignItems: 'center',
                    }}
                  >
                    <AlertTriangle />
                    High value transfer. This will be marked for fraud review.
                  </div>
                )}

                <button type="submit" className="btn btn-accent btn-block" disabled={submitting}>
                  Continue Transfer <ArrowRight size={18} />
                </button>
              </form>
            </div>

            <div
              className="card"
              style={{
                padding: '2rem',
                borderRadius: '22px',
                boxShadow: '0 12px 30px rgba(15,23,42,.08)',
              }}
            >
              <h2 style={{ marginTop: 0 }}>Transfer Preview</h2>

              <PreviewRow label="From Account" value={selectedAccount?.account_number || '-'} />
              <PreviewRow label="Recipient" value={form.to_account_number || 'Not entered'} />
              <PreviewRow label="Amount" value={form.amount ? formatCurrency(form.amount) : '₹0.00'} />
              <PreviewRow label="Note" value={form.description || 'No note'} />

              <div
                style={{
                  marginTop: '1.5rem',
                  padding: '1rem',
                  background: isHighRisk ? '#fff7ed' : '#ecfdf5',
                  color: isHighRisk ? '#c2410c' : '#047857',
                  borderRadius: '16px',
                  display: 'flex',
                  gap: '.7rem',
                  alignItems: 'center',
                }}
              >
                {isHighRisk ? <AlertTriangle /> : <ShieldCheck />}
                {isHighRisk ? 'Fraud alert will be generated.' : 'Secure transfer verified.'}
              </div>

              <div style={{ marginTop: '2rem' }}>
                <h3>Your Accounts</h3>
                {accounts.map((acc) => (
                  <div
                    key={acc.id}
                    style={{
                      padding: '1rem',
                      borderRadius: '14px',
                      background: '#f8fafc',
                      marginBottom: '.8rem',
                    }}
                  >
                    <b>{acc.account_number}</b>
                    <div style={{ color: '#64748b', textTransform: 'capitalize' }}>
                      {acc.account_type} — {formatCurrency(acc.balance)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {showConfirm && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(15,23,42,.55)',
              display: 'grid',
              placeItems: 'center',
              zIndex: 999,
              padding: '1rem',
            }}
          >
            <div
              style={{
                background: 'white',
                borderRadius: '24px',
                padding: '2rem',
                width: '100%',
                maxWidth: '430px',
                boxShadow: '0 25px 60px rgba(0,0,0,.25)',
              }}
            >
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: '20px',
                  background: isHighRisk ? '#fff7ed' : '#ecfdf5',
                  color: isHighRisk ? '#c2410c' : '#047857',
                  display: 'grid',
                  placeItems: 'center',
                  marginBottom: '1rem',
                }}
              >
                {isHighRisk ? <AlertTriangle size={34} /> : <CheckCircle2 size={34} />}
              </div>

              <h2>Confirm Transfer</h2>
              <p style={{ color: '#64748b' }}>
                Send <b>{formatCurrency(form.amount)}</b> to account{' '}
                <b>{form.to_account_number}</b>?
              </p>

              <div style={{ display: 'flex', gap: '.8rem', marginTop: '1.5rem' }}>
                <button
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                  onClick={confirmTransfer}
                  disabled={submitting}
                >
                  {submitting ? 'Processing...' : 'Confirm'}
                </button>

                <button
                  className="btn"
                  style={{ flex: 1, background: '#e5e7eb' }}
                  onClick={() => setShowConfirm(false)}
                  disabled={submitting}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
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
        backdropFilter: 'blur(8px)',
      }}
    >
      <div style={{ marginBottom: '.5rem' }}>{icon}</div>
      <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>{value}</div>
      <div style={{ opacity: 0.8 }}>{label}</div>
    </div>
  );
}

function PreviewRow({ label, value }) {
  return (
    <div
      style={{
        padding: '1rem 0',
        borderBottom: '1px solid #e5e7eb',
      }}
    >
      <div style={{ color: '#64748b', marginBottom: '.25rem' }}>{label}</div>
      <div style={{ fontWeight: 700 }}>{value}</div>
    </div>
  );
}