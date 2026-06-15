import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, ShieldCheck, Landmark } from 'lucide-react';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await authAPI.login(form);
      login(data.token, data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={page}>
      <div style={leftPanel}>
        <div style={brand}>
          <Landmark size={34} />
          <span>Smart Banking</span>
        </div>

        <h1 style={{ fontSize: '3rem', marginTop: '3rem' }}>
          Secure Banking Starts Here
        </h1>

        <p style={{ fontSize: '1.1rem', opacity: 0.88, lineHeight: 1.7 }}>
          Manage accounts, transfer money, track transactions and detect fraud
          with a modern smart banking system.
        </p>

        <div style={featureBox}>
          <ShieldCheck />
          <div>
            <b>Protected Login</b>
            <p style={{ margin: 0, opacity: 0.8 }}>
              JWT authentication and secure backend APIs.
            </p>
          </div>
        </div>
      </div>

      <div style={rightPanel}>
        <div style={card}>
          <h1 style={{ marginBottom: '.4rem' }}>Welcome back</h1>
          <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
            Sign in to your Smart Banking account
          </p>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <InputBox
              icon={<Mail size={19} />}
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
            />

            <InputBox
              icon={<Lock size={19} />}
              label="Password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
            />

            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p style={{ marginTop: '1.5rem', textAlign: 'center', color: '#64748b' }}>
            Don&apos;t have an account? <Link to="/register">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function InputBox({ icon, label, ...props }) {
  return (
    <div className="form-group">
      <label>{label}</label>
      <div style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', left: 14, top: 14, color: '#64748b' }}>
          {icon}
        </div>
        <input {...props} required style={{ paddingLeft: 44 }} />
      </div>
    </div>
  );
}

const page = {
  minHeight: '100vh',
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  background: '#f4f7fb',
};

const leftPanel = {
  background: 'linear-gradient(135deg,#0f172a,#1d4ed8,#2563eb)',
  color: 'white',
  padding: '4rem',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
};

const rightPanel = {
  display: 'grid',
  placeItems: 'center',
  padding: '2rem',
};

const card = {
  width: '100%',
  maxWidth: 430,
  background: 'white',
  padding: '2.2rem',
  borderRadius: '24px',
  boxShadow: '0 20px 50px rgba(15,23,42,.12)',
};

const brand = {
  display: 'flex',
  alignItems: 'center',
  gap: '.8rem',
  fontSize: '1.4rem',
  fontWeight: 800,
};

const featureBox = {
  marginTop: '2rem',
  background: 'rgba(255,255,255,.14)',
  padding: '1.2rem',
  borderRadius: '18px',
  display: 'flex',
  gap: '1rem',
};