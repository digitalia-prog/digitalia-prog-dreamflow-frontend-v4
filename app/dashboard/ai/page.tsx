"use client"

import { useState } from "react"

export default function AiPage() {
  const [result, setResult] = useState("")

  async function generate() {
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userType: "agency",
        platform: "TikTok",
        objective: "Vente",
        offer: "Coaching UGC",
        audience: "E-commerçants",
        angle: "ROI rapide",
        hookType: "Question choc",
        tone: "Direct"
      })
    })

    const data = await res.json()
    setResult(data.prompt)
  }

  return (
    <main className="min-h-screen bg-black text-white p-10">
      <h1 className="text-3xl font-bold mb-6">Script Engine Test</h1>
      <button
        onClick={generate}
        className="px-4 py-2 bg-purple-600 rounded"
      >
        Générer
      </button>

      <pre className="mt-6 whitespace-pre-wrap">
        {result}
      </pre>
    </main>
  )
}

