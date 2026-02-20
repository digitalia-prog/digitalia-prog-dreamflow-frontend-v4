"use client";

import { useMemo, useState } from "react";

export default function AiPage({
  defaultMode = "AGENCY",
}: {
  defaultMode?: "AGENCY" | "CREATOR";
}) {
  const [mode, setMode] = useState<"AGENCY" | "CREATOR">(defaultMode);
  const [raw, setRaw] = useState<string>("");
  const [error, setError] = useState<string>("");

  const title = useMemo(() => {
    return mode === "AGENCY"
      ? "Script Engine — Agency"
      : "Script Engine — Creator";
  }, [mode]);

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-4">{title}</h1>

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setMode("AGENCY")}
          className="px-3 py-2 rounded bg-violet-600"
        >
          Agency
        </button>

        <button
          onClick={() => setMode("CREATOR")}
          className="px-3 py-2 rounded bg-violet-800"
        >
          Creator
        </button>
      </div>

      <textarea
        value={raw}
        onChange={(e) => setRaw(e.target.value)}
        placeholder="Paste your script here..."
        className="w-full h-40 p-3 rounded bg-black/30 border border-white/20"
      />

      {error && (
        <p className="mt-3 text-red-400 text-sm">
          {error}
        </p>
      )}
    </div>
  );
}
