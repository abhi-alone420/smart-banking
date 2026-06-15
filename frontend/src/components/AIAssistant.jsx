import { useState } from 'react';
import { Bot, Send, X, Sparkles } from 'lucide-react';

export default function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      from: 'ai',
      text: 'Hi! I am your Smart Banking Assistant. Ask about balance, saving tips, fraud alerts, or transactions.',
    },
  ]);
  const [input, setInput] = useState('');

  const getReply = (text) => {
    const msg = text.toLowerCase();

    if (msg.includes('balance')) {
      return 'You can check your total available balance on the Dashboard page.';
    }

    if (msg.includes('transfer')) {
      return 'Go to Transfer page, enter recipient account number, amount, and confirm securely.';
    }

    if (msg.includes('fraud') || msg.includes('alert')) {
      return 'High value transfers above ₹50,000 are marked as risky and shown with fraud alert UI.';
    }

    if (msg.includes('saving') || msg.includes('save')) {
      return 'Tip: Save at least 20% of your monthly income and avoid unnecessary high-value transfers.';
    }

    if (msg.includes('transaction')) {
      return 'You can view, search, and filter all transactions on the Transactions page.';
    }

    return 'I can help with balance, transfers, transactions, savings, and fraud alerts.';
  };

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    const aiReply = getReply(userMessage);

    setMessages((prev) => [
      ...prev,
      { from: 'user', text: userMessage },
      { from: 'ai', text: aiReply },
    ]);

    setInput('');
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        style={{
          position: 'fixed',
          right: 24,
          bottom: 24,
          width: 64,
          height: 64,
          borderRadius: '50%',
          border: 0,
          background: 'linear-gradient(135deg,#0f4c81,#2563eb)',
          color: 'white',
          boxShadow: '0 18px 40px rgba(37,99,235,.35)',
          cursor: 'pointer',
          display: 'grid',
          placeItems: 'center',
          zIndex: 3000,
        }}
      >
        <Bot size={30} />
      </button>

      {open && (
        <div
          style={{
            position: 'fixed',
            right: 24,
            bottom: 100,
            width: 360,
            maxWidth: 'calc(100vw - 2rem)',
            background: 'white',
            borderRadius: 24,
            boxShadow: '0 25px 70px rgba(15,23,42,.25)',
            zIndex: 3000,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              background: 'linear-gradient(135deg,#0f172a,#2563eb)',
              color: 'white',
              padding: '1rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div style={{ display: 'flex', gap: '.7rem', alignItems: 'center' }}>
              <Sparkles />
              <b>AI Banking Assistant</b>
            </div>

            <X style={{ cursor: 'pointer' }} onClick={() => setOpen(false)} />
          </div>

          <div
            style={{
              padding: '1rem',
              height: 330,
              overflowY: 'auto',
              background: '#f8fafc',
            }}
          >
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  justifyContent: m.from === 'user' ? 'flex-end' : 'flex-start',
                  marginBottom: '.75rem',
                }}
              >
                <div
                  style={{
                    maxWidth: '78%',
                    padding: '.75rem .9rem',
                    borderRadius: 16,
                    background: m.from === 'user' ? '#2563eb' : 'white',
                    color: m.from === 'user' ? 'white' : '#0f172a',
                    boxShadow: '0 4px 12px rgba(15,23,42,.08)',
                    fontSize: '.9rem',
                  }}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          <div style={{ padding: '1rem', display: 'flex', gap: '.6rem' }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Ask about banking..."
            />

            <button
              onClick={sendMessage}
              style={{
                border: 0,
                borderRadius: 14,
                background: '#2563eb',
                color: 'white',
                width: 48,
                cursor: 'pointer',
              }}
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}