"use client";

export default function LanguageSwitcher() {
  return (
    <div
      style={{
        display: "flex",
        gap: "8px",
        background: "#111",
        padding: "8px 12px",
        borderRadius: "12px",
        border: "1px solid #333",
      }}
    >
      <button>FR</button>
      <button>EN</button>
      <button>AR</button>
      <button>ZH</button>
    </div>
  );
}
