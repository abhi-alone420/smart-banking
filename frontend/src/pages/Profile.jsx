import { useAuth } from '../context/AuthContext';
import { User, Mail, Phone, ShieldCheck, Landmark, Bell, Moon, LogOut } from 'lucide-react';

export default function Profile() {
  const { user, logout } = useAuth();

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
          <h1 style={{ margin: 0 }}>Profile & Settings</h1>
          <p style={{ opacity: 0.85 }}>Manage your smart banking profile and security settings.</p>
        </div>

        <div className="grid-2">
          <div className="card" style={cardStyle}>
            <div style={{ textAlign: 'center' }}>
              <div style={avatar}>{user?.full_name?.charAt(0)?.toUpperCase() || 'U'}</div>
              <h2>{user?.full_name || 'User'}</h2>
              <p style={{ color: '#64748b' }}>Smart Banking Customer</p>
            </div>

            <Info icon={<User />} label="Full Name" value={user?.full_name || '-'} />
            <Info icon={<Mail />} label="Email" value={user?.email || '-'} />
            <Info icon={<Phone />} label="Phone" value={user?.phone || 'Not added'} />
            <Info icon={<Landmark />} label="Customer Status" value="Active" />
          </div>

          <div className="card" style={cardStyle}>
            <h2>Security Settings</h2>

            <Setting icon={<ShieldCheck />} title="Two-Factor Authentication" value="Enabled UI" />
            <Setting icon={<Bell />} title="Transaction Notifications" value="Active" />
            <Setting icon={<Moon />} title="Dark Mode" value="Coming Soon" />

            <button
              onClick={logout}
              className="btn btn-danger btn-block"
              style={{ marginTop: '2rem', display: 'flex', gap: '.5rem', justifyContent: 'center' }}
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Info({ icon, label, value }) {
  return (
    <div style={infoRow}>
      <div style={iconBox}>{icon}</div>
      <div>
        <div style={{ color: '#64748b', fontSize: '.9rem' }}>{label}</div>
        <b>{value}</b>
      </div>
    </div>
  );
}

function Setting({ icon, title, value }) {
  return (
    <div style={settingRow}>
      <div style={iconBox}>{icon}</div>
      <div>
        <b>{title}</b>
        <p style={{ margin: 0, color: '#64748b' }}>{value}</p>
      </div>
    </div>
  );
}

const cardStyle = {
  padding: '2rem',
  borderRadius: '22px',
  boxShadow: '0 12px 30px rgba(15,23,42,.08)',
};

const avatar = {
  width: 95,
  height: 95,
  borderRadius: '50%',
  background: 'linear-gradient(135deg,#1d4ed8,#2563eb)',
  color: 'white',
  display: 'grid',
  placeItems: 'center',
  fontSize: '2.5rem',
  fontWeight: 800,
  margin: '0 auto 1rem',
};

const infoRow = {
  display: 'flex',
  gap: '1rem',
  alignItems: 'center',
  padding: '1rem',
  borderRadius: '16px',
  background: '#f8fafc',
  marginTop: '1rem',
};

const settingRow = {
  display: 'flex',
  gap: '1rem',
  alignItems: 'center',
  padding: '1rem',
  borderRadius: '16px',
  background: '#f8fafc',
  marginTop: '1rem',
};

const iconBox = {
  width: 45,
  height: 45,
  borderRadius: '14px',
  background: '#e0ecff',
  color: '#1d4ed8',
  display: 'grid',
  placeItems: 'center',
};