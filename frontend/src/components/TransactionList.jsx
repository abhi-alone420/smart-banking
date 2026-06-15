import {
  ArrowDownLeft,
  ArrowUpRight,
  Repeat,
  Wallet,
} from "lucide-react";

export default function TransactionList({
  transactions,
  showAccount = true,
}) {
  const formatAmount = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleString("en-IN", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const getIcon = (type) => {
    switch (type) {
      case "deposit":
        return <ArrowDownLeft size={20} />;
      case "withdraw":
        return <ArrowUpRight size={20} />;
      case "transfer":
        return <Repeat size={20} />;
      default:
        return <Wallet size={20} />;
    }
  };

  const getColor = (type) => {
    switch (type) {
      case "deposit":
        return "#16a34a";
      case "withdraw":
        return "#dc2626";
      case "transfer":
        return "#2563eb";
      default:
        return "#64748b";
    }
  };

  if (!transactions || transactions.length === 0) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "3rem",
          color: "#64748b",
        }}
      >
        <Wallet size={50} />
        <h3>No Transactions Yet</h3>
      </div>
    );
  }

  return (
    <div>
      {transactions.map((tx) => (
        <div
          key={tx.id}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "1rem",
            marginBottom: "1rem",
            background: "#fff",
            borderRadius: "16px",
            boxShadow: "0 4px 12px rgba(0,0,0,.06)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            <div
              style={{
                width: 50,
                height: 50,
                borderRadius: "14px",
                display: "grid",
                placeItems: "center",
                background: `${getColor(tx.type)}20`,
                color: getColor(tx.type),
              }}
            >
              {getIcon(tx.type)}
            </div>

            <div>
              <h4 style={{ margin: 0, textTransform: "capitalize" }}>
                {tx.type}
              </h4>

              <div
                style={{
                  fontSize: ".85rem",
                  color: "#64748b",
                }}
              >
                {tx.description || "No description"}
              </div>

              {showAccount && (
                <div
                  style={{
                    fontSize: ".8rem",
                    color: "#94a3b8",
                    marginTop: "4px",
                  }}
                >
                  {tx.from_account || "—"} → {tx.to_account || "—"}
                </div>
              )}
            </div>
          </div>

          <div style={{ textAlign: "right" }}>
            <div
              style={{
                fontWeight: "bold",
                fontSize: "1rem",
                color:
                  tx.type === "withdraw"
                    ? "#dc2626"
                    : "#16a34a",
              }}
            >
              {tx.type === "withdraw" ? "-" : "+"}
              {formatAmount(tx.amount)}
            </div>

            <div
              style={{
                fontSize: ".8rem",
                color: "#64748b",
              }}
            >
              {formatDate(tx.created_at)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}