import { NextResponse } from "next/server";
import OpenAI from "openai";
import fs from "fs";
import fsp from "fs/promises";
import path from "path";
import os from "os";
import { execFile } from "child_process";
import { promisify } from "util";

export const runtime = "nodejs";

const execFileAsync = promisify(execFile);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function cleanJsonString(value: string) {
  return value
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
}

async function ensureDir(dir: string) {
  await fsp.mkdir(dir, { recursive: true });
}

async function safeRm(dir: string) {
  try {
    await fsp.rm(dir, { recursive: true, force: true });
  } catch {}
}

function getPythonBin() {
  return (
    process.env.YT_DLP_PYTHON_BIN ||
    path.join(process.cwd(), ".venv", "bin", "python3")
  );
}

async function downloadVideoFromUrl(url: string, workDir: string) {
  const pythonBin = getPythonBin();
  const outputTemplate = path.join(workDir, "source.%(ext)s");

  await execFileAsync(
    pythonBin,
    [
      "-m",
      "yt_dlp",
      "--no-playlist",
      "-o",
      outputTemplate,
      url,
    ],
    {
      env: {
        ...process.env,
        ...(process.env.SSL_CERT_FILE
          ? {
              SSL_CERT_FILE: process.env.SSL_CERT_FILE,
              REQUESTS_CA_BUNDLE: process.env.SSL_CERT_FILE,
            }
          : {}),
      },
    }
  );

  const files = await fsp.readdir(workDir);
  const mediaFile = files.find((file) => file.startsWith("source."));

  if (!mediaFile) {
    throw new Error("Impossible de télécharger la vidéo.");
  }

  return path.join(workDir, mediaFile);
}

async function extractAudioToMp3(inputPath: string, workDir: string) {
  const outputPath = path.join(workDir, "audio.mp3");

  await execFileAsync("ffmpeg", [
    "-y",
    "-i",
    inputPath,
    "-vn",
    "-acodec",
    "libmp3lame",
    "-ar",
    "44100",
    "-ac",
    "2",
    "-b:a",
    "192k",
    outputPath,
  ]);

  return outputPath;
}

async function transcribeAudio(audioPath: string) {
  const transcription = await openai.audio.transcriptions.create({
    file: fs.createReadStream(audioPath),
    model: process.env.OPENAI_TRANSCRIPTION_MODEL || "gpt-4o-mini-transcribe",
  });

  return transcription.text || "";
}

async function analyzeTranscript({
  url,
  platform,
  language,
  offer,
  audience,
  notes,
  transcript,
}: {
  url: string;
  platform?: string;
  language?: string;
  offer?: string;
  audience?: string;
  notes?: string;
  transcript: string;
}) {
  const prompt = `
Tu es un expert senior en creative strategy, UGC ads et performance marketing.

Analyse cette vidéo comme une agence marketing professionnelle.

Contexte :
- URL : ${url || ""}
- Plateforme : ${platform || ""}
- Langue : ${language || ""}
- Produit / Offre : ${offer || ""}
- Audience : ${audience || ""}
- Notes : ${notes || ""}

Transcript réel :
"""
${transcript}
"""

Consignes :
- Base-toi d'abord sur le transcript réel.
- Réponds en français.
- Sois concret.
- Ne laisse aucun champ vide.
- Retourne uniquement un JSON valide, sans markdown.

Format :
{
  "transcript": "",
  "summary": "",
  "hook": "",
  "structure": "",
  "angle": "",
  "psychology": ["", ""],
  "strengths": ["", ""],
  "weaknesses": ["", ""],
  "recreateIdeas": ["", ""],
  "similarHooks": ["", ""],
  "similarAngles": ["", ""],
  "scriptPrompt": "",
  "viralScore": "",
  "whyItWorks": ["", ""],
  "howToBeat": ["", ""],
  "adsAngles": ["", ""],
  "creativeType": ""
}
`;

  const completion = await openai.chat.completions.create({
    model: process.env.OPENAI_ANALYSIS_MODEL || "gpt-4.1-mini",
    temperature: 0.5,
    messages: [
      {
        role: "system",
        content:
          "Tu es un expert en analyse marketing UGC. Tu réponds uniquement en JSON valide.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  const content = completion.choices[0]?.message?.content || "";
  const cleaned = cleanJsonString(content);
  const parsed = JSON.parse(cleaned);

  return {
    transcript:
      typeof parsed?.transcript === "string" ? parsed.transcript : transcript,
    summary: typeof parsed?.summary === "string" ? parsed.summary : "",
    hook: typeof parsed?.hook === "string" ? parsed.hook : "",
    structure: typeof parsed?.structure === "string" ? parsed.structure : "",
    angle: typeof parsed?.angle === "string" ? parsed.angle : "",
    psychology: Array.isArray(parsed?.psychology) ? parsed.psychology : [],
    strengths: Array.isArray(parsed?.strengths) ? parsed.strengths : [],
    weaknesses: Array.isArray(parsed?.weaknesses) ? parsed.weaknesses : [],
    recreateIdeas: Array.isArray(parsed?.recreateIdeas) ? parsed.recreateIdeas : [],
    similarHooks: Array.isArray(parsed?.similarHooks) ? parsed.similarHooks : [],
    similarAngles: Array.isArray(parsed?.similarAngles) ? parsed.similarAngles : [],
    scriptPrompt: typeof parsed?.scriptPrompt === "string" ? parsed.scriptPrompt : "",
    viralScore: typeof parsed?.viralScore === "string" ? parsed.viralScore : "",
    whyItWorks: Array.isArray(parsed?.whyItWorks) ? parsed.whyItWorks : [],
    howToBeat: Array.isArray(parsed?.howToBeat) ? parsed.howToBeat : [],
    adsAngles: Array.isArray(parsed?.adsAngles) ? parsed.adsAngles : [],
    creativeType: typeof parsed?.creativeType === "string" ? parsed.creativeType : "",
  };
}

export async function POST(req: Request) {
  let workDir = "";

  try {
    const body = await req.json();
    const { url, platform, language, offer, audience, notes } = body ?? {};

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { error: "Lien vidéo manquant." },
        { status: 400 }
      );
    }

    workDir = path.join(
      os.tmpdir(),
      `ugc-growth-${Date.now()}-${Math.random().toString(36).slice(2)}`
    );

    await ensureDir(workDir);

    console.log("Download video...");
    const downloadedVideoPath = await downloadVideoFromUrl(url, workDir);

    console.log("Extract audio...");
    const audioPath = await extractAudioToMp3(downloadedVideoPath, workDir);

    console.log("Transcribe...");
    const transcript = await transcribeAudio(audioPath);

    if (!transcript.trim()) {
      return NextResponse.json(
        { error: "Transcript vide." },
        { status: 200 }
      );
    }

    console.log("Analyze...");
    const result = await analyzeTranscript({
      url,
      platform,
      language,
      offer,
      audience,
      notes,
      transcript,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("ANALYZE VIDEO ERROR:", error);

    return NextResponse.json(
      {
        error: "Erreur serveur",
        details: error?.message || "Erreur inconnue",
      },
      { status: 500 }
    );
  } finally {
    if (workDir) {
      await safeRm(workDir);
    }
  }
}
