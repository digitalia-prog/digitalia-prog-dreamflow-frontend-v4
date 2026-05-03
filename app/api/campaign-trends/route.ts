import { NextResponse } from "next/server";

export async function POST(req: Request) {
  return NextResponse.json({
    trends: [
      {
        keyword: "ongles été 2026",
        volume: 12000,
        growth: 230,
        opportunityScore: 92,
        curve: [
          { date: "1", value: 10 },
          { date: "2", value: 20 },
          { date: "3", value: 40 },
          { date: "4", value: 70 },
          { date: "5", value: 90 },
        ],
        angle: "Beauté estivale tendance TikTok",
        hooks: [
          "Les ongles que tout le monde veut cet été",
          "Tu rates cette tendance ? erreur…",
        ],
        script: "Hook + démonstration + transformation",
      },
      {
        keyword: "nail design minimal",
        volume: 8000,
        growth: 180,
        opportunityScore: 85,
        curve: [
          { date: "1", value: 5 },
          { date: "2", value: 15 },
          { date: "3", value: 30 },
          { date: "4", value: 60 },
          { date: "5", value: 80 },
        ],
        angle: "Minimalisme luxe",
        hooks: [
          "Simple mais ultra stylé",
          "Moins = plus (et ça vend)",
        ],
        script: "Hook → close-up → résultat",
      },
    ],
  });
}

