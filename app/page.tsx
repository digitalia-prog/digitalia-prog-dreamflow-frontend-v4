import Link from "next/link";

export default function Home() {
  return (
    <main style={{ padding: 24 }}>
      <h1 style={{ fontSize: 34, fontWeight: 800 }}>UGC Growth</h1>
      <p style={{ marginTop: 8, opacity: 0.8 }}>
        Home clean. Clique pour aller au dashboard.
      </p>

      <div style={{ marginTop: 16 }}>
        <Link
          href="/dashboard"
          style={{
            display: "inline-block",
            padding: "10px 14px",
            borderRadius: 10,
            border: "1px solid rgba(255,255,255,0.15)",
            textDecoration: "none",
            fontWeight: 600,
          }}
        >
          → Aller au Dashboard
        </Link>
      </div>
    </main>
  );
}
