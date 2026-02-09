import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { success: false, error: 'OPENAI_API_KEY manquant (Vercel/.env.local).' },
        { status: 500 }
      );
    }

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { success: false, error: 'prompt manquant.' },
        { status: 400 }
      );
    }

    const r = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-4.1-mini',
        input: prompt,
      }),
    });

    const data = await r.json();

    if (!r.ok) {
      return NextResponse.json(
        { success: false, error: 'OpenAI error', details: data },
        { status: 500 }
      );
    }

    // Extraire le texte
    let text = '';
    const out = data?.output || [];
    for (const item of out) {
      const content = item?.content || [];
      for (const c of content) {
        if (c?.type === 'output_text' && typeof c?.text === 'string') text += c.text;
      }
    }

    return NextResponse.json({ success: true, content: text || '✅ OK (vide)' });
  } catch (e: any) {
    return NextResponse.json(
      { success: false, error: 'Server error', details: e?.message || String(e) },
      { status: 500 }
    );
  }
}

