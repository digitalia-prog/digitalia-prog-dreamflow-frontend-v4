"use client";

import { useEffect, useMemo, useState } from "react";

type Platform = {
  id: string;
  name: string;
  category: "Video" | "Discovery" | "Community" | "Business";
};

const PLATFORMS: Platform[] = [
  { id: "tiktok", name: "TikTok", category: "Video" },
  { id: "instagram", name: "Instagram", category: "Video" },
  { id: "youtube", name: "YouTube", category: "Video" },
  { id: "snapchat", name: "Snapchat", category: "Video" },
  { id: "twitch", name: "Twitch", category: "Video" },
  { id: "kick", name: "Kick", category: "Video" },

  { id: "facebook", name: "Facebook", category: "Discovery" },
  { id: "pinterest", name: "Pinterest", category: "Discovery" },
  { id: "x", name: "X (Twitter)", category: "Discovery" },
  { id: "threads", name: "Threads", category: "Discovery" },

  { id: "discord", name: "Discord", category: "Community" },
  { id: "reddit", name: "Reddit", category: "Community" },
  { id: "telegram", name: "Telegram", category: "Community" },

  { id: "linkedin", name: "LinkedIn", category: "Business" },
];

const STORAGE_KEY = "dreamflow.socials.connected.v1";

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function SocialsPage() {
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<"All" | Platform["category"]>("All");
  const [connected, setConnected] = useState<Record<string, boolean>>({});
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      setConnected(JSON.parse(raw) || {});
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(connected));
    } catch {}
  }, [connected]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PLATFORMS.filter((p) => {
      const matchesTab = tab === "All" ? true : p.category === tab;
      const matchesQuery = q ? p.name.toLowerCase().includes(q) : true;
      return matchesTab && matchesQuery;
    });
  }, [query, tab]);

  const counts = useMemo(() => {
    const total = PLATFORMS.length;
    const on = Object.values(connected).filter(Boolean).length;
    return { total, on };
  }, [connected]);

  const toggle = async (id: string) => {
    setSavingId(id);
    await new Promise((r) => setTimeout(r, 200));
    setConnected((prev) => ({ ...prev, [id]: !prev[id] }));
    setSavingId(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">Plateformes sociales</h1>
          <p className="text-white/70">
            MVP : connect/disconnect (stocké localement).{" "}
            <span className="text-white/50">
              {counts.on}/{counts.total} connectées
            </span>
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher…"
            className="w-full sm:w-72 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 outline-none focus:border-white/20"
          />
          <button
            type="button"
            onClick={() => setConnected({})}
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80 hover:text-white hover:border-white/20"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {(["All", "Video", "Discovery", "Community", "Business"] as const).map(
          (k) => (
            <button
              key={k}
              type="button"
              onClick={() => setTab(k as any)}
              className={cx(
                "rounded-full border px-3 py-1 text-xs transition",
                tab === k
                  ? "border-purple-500/40 bg-purple-500/20 text-white"
                  : "border-white/10 bg-white/5 text-white/70 hover:text-white hover:border-white/20"
              )}
            >
              {k === "All" ? "Tout" : k}
            </button>
          )
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p) => {
          const isOn = !!connected[p.id];
          const busy = savingId === p.id;

          return (
            <div
              key={p.id}
              className="rounded-2xl border border-white/10 bg-white/5 p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-base font-semibold">{p.name}</div>
                  <div className="mt-1 text-xs text-white/50">{p.category}</div>
                </div>

                <span
                  className={cx(
                    "rounded-full px-2 py-1 text-[11px] border",
                    isOn
                      ? "border-emerald-500/30 bg-emerald-500/15 text-emerald-200"
                      : "border-white/10 bg-white/5 text-white/60"
                  )}
                >
                  {isOn ? "Connected" : "Not connected"}
                </span>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => toggle(p.id)}
                  disabled={busy}
                  className={cx(
                    "rounded-xl px-3 py-2 text-sm border transition",
                    isOn
                      ? "border-white/10 bg-white/5 text-white/80 hover:text-white hover:border-white/20"
                      : "border-purple-500/40 bg-purple-600 text-white hover:bg-purple-500",
                    busy && "opacity-60 cursor-not-allowed"
                  )}
                >
                  {busy ? "..." : isOn ? "Disconnect" : "Connect"}
                </button>

                <div className="text-xs text-white/50">
                  {isOn ? "Prêt ✅" : "À connecter"}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-white/70">
          Aucun résultat.
        </div>
      )}
    </div>
  );
}
