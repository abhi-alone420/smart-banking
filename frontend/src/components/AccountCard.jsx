import { Copy, CheckCircle2, CreditCard } from "lucide-react";
import { useState } from "react";

export default function AccountCard({ account }) {
  const [copied, setCopied] = useState(false);

  const formatBalance = (balance) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(balance);

  const copyAccount = () => {
    navigator.clipboard.writeText(account.account_number);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div
      style={{
        background:
          "linear-gradient(135deg,#0f4c81,#1d4ed8,#2563eb)",
        color: "white",
        borderRadius: "22px",
        padding: "28px",
        boxShadow: "0 15px 35px rgba(0,0,0,.18)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          right: "-60px",
          top: "-60px",
          width: "180px",
          height: "180px",
          borderRadius: "50%",
          background: "rgba(255,255,255,.08)",
        }}
      />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h3 style={{ margin: 0, textTransform: "capitalize" }}>
          {account.account_type} Account
        </h3>

        <CreditCard size={34} />
      </div>

      <p
        style={{
          opacity: ".85",
          marginTop: 25,
          marginBottom: 5,
        }}
      >
        Available Balance
      </p>

      <h1
        style={{
          margin: 0,
          fontSize: "2.2rem",
        }}
      >
        {formatBalance(account.balance)}
      </h1>

      <div
        style={{
          marginTop: 35,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <small style={{ opacity: ".8" }}>
            Account Number
          </small>

          <h3 style={{ marginTop: 6 }}>
            {account.account_number}
          </h3>
        </div>

        <button
          onClick={copyAccount}
          style={{
            background: "rgba(255,255,255,.18)",
            color: "white",
            border: 0,
            borderRadius: "12px",
            padding: "10px 14px",
            cursor: "pointer",
          }}
        >
          {copied ? (
            <CheckCircle2 size={22} />
          ) : (
            <Copy size={22} />
          )}
        </button>
      </div>
    </div>
  );
}