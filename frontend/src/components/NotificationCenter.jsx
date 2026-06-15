import { Bell, CheckCircle2, ShieldAlert, X } from 'lucide-react';
import { useState } from 'react';

export default function NotificationCenter() {
  const [open, setOpen] = useState(false);

  const notifications = [
    { icon: <CheckCircle2 />, title: 'Account active', text: 'Your banking account is working properly.' },
    { icon: <CheckCircle2 />, title: 'Transfer ready', text: 'Money transfer system is enabled.' },
    { icon: <ShieldAlert />, title: 'Security enabled', text: 'JWT protected login is active.' },
  ];

  return (
    <div style={{ position: 'relative' }}>
      <button className="btn btn-outline btn-sm" onClick={() => setOpen(!open)}>
        <Bell size={18} />
      </button>

      {open && (
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: 45,
            width: 330,
            background: 'white',
            color: '#0f172a',
            borderRadius: 18,
            boxShadow: '0 20px 50px rgba(15,23,42,.25)',
            padding: '1rem',
            zIndex: 999,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <b>Notifications</b>
            <X size={18} onClick={() => setOpen(false)} style={{ cursor: 'pointer' }} />
          </div>

          {notifications.map((n, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                gap: '.8rem',
                padding: '.8rem',
                background: '#f8fafc',
                borderRadius: 14,
                marginBottom: '.7rem',
              }}
            >
              <div style={{ color: '#2563eb' }}>{n.icon}</div>
              <div>
                <b>{n.title}</b>
                <p style={{ margin: 0, fontSize: '.85rem', color: '#64748b' }}>{n.text}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}