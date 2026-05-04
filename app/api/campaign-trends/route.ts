import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const keyword = String(body?.keyword || "tendance").trim();

  return NextResponse.json({
    trends: [
      {
        keyword: `${keyword} été 2026`,
        volume: 86,
        weeklyGrowth: -10,
        monthlyGrowth: 200,
        yearlyGrowth: 10000,
        opportunityScore: 92,
        timeline: [
          { label: "Jan", value: 5 },
          { label: "Fév", value: 8 },
          { label: "Mar", value: 18 },
          { label: "Avr", value: 45 },
          { label: "Mai", value: 82 },
        ],
        angle: "Tendance saisonnière à fort potentiel d’achat",
        hooks: [
          `La tendance ${keyword} que tout le monde va vouloir cet été`,
          `Pourquoi ${keyword} explose maintenant ?`,
        ],
        script: "Hook fort → démonstration → preuve → appel à l’action.",
      },
      {
        keyword: `${keyword} minimal`,
        volume: 64,
        weeklyGrowth: 25,
        monthlyGrowth: 180,
        yearlyGrowth: 950,
        opportunityScore: 85,
        timeline: [
          { label: "Jan", value: 12 },
          { label: "Fév", value: 15 },
          { label: "Mar", value: 22 },
          { label: "Avr", value: 38 },
          { label: "Mai", value: 66 },
        ],
        angle: "Angle simplicité premium",
        hooks: [
          `Simple, propre, mais ultra désirable`,
          `La version minimaliste qui donne envie d’acheter`,
        ],
        script: "Avant → après → bénéfice → CTA clair.",
      },
    ],
  });
}
