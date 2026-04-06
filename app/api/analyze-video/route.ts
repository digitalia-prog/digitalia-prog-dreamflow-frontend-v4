import { NextResponse } from "next/server";
import OpenAI from "openai";
import fs from "fs";
import os from "os";
import path from "path";
import { promisify } from "util";
import { execFile } from "child_process";

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
  await fs.promises.mkdir(dir, { recursive: true });
}

async function safeRm(dirPath: string) {
  try {
    await fs.promises.rm(dirPath, { recursive: true, force: true });
  } catch {}
}

function getPythonCandidates() {
  const candidates: string[] = [];

  if (process.env.YT_DLP_PYTHON_BIN) {
    candidates.push(process.env.YT_DLP_PYTHON_BIN);
  }

  candidates.push(path.join(process.cwd(), ".venv", "bin", "python3"));
  candidates.push("python3");
  candidates.push("/usr/bin/python3");

  return [...new Set(candidates)];
}

async function runYtDlpWithPython(
  pythonBin: string,
  args: string[],
  certFile?: string
) {
  return execFileAsync(pythonBin, args, {
    env: certFile
      ? {
          ...process.env,
          SSL_CERT_FILE: certFile,
          REQUESTS_CA_BUNDLE: certFile,
        }
      : {
          ...process.env,
        },
  });
}

async function downloadTikTokMedia(url: string, outDir: string) {
  const outputTemplate = path.join(outDir, "source.%(ext)s");
  const certFile = process.env.SSL_CERT_FILE;

  const args = [
    "-m",
    "yt_dlp",
    "--no-playlist",
    "-f",
    "mp4/best",
    "-o",
    outputTemplate,
    url,
  ];

  const pythonCandidates = getPythonCandidates();

  let lastError: any = null;

  for (const pythonBin of pythonCandidates) {
    try {
      await runYtDlpWithPython(pythonBin, args, certFile);

      const files = await fs.promises.readdir(outDir);
      const mediaFile = files.find((file) => file.startsWith("source."));

      if (!mediaFile) {
        throw new Error("Téléchargement terminé mais aucun fichier vidéo trouvé.");
      }

      return path.join(outDir, mediaFile);
    } catch (error: any) {
      lastError = error;
    }
  }

  throw new Error(
    lastError?.message ||
      "Impossible de lancer yt-dlp. Vérifie Python / yt-dlp sur l’environnement."
  );
}

async function extractAudioToMp3(inputPath: string, outDir: string) {
  const audioPath = path.join(outDir, "audio.mp3");

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
    audioPath,
  ]);

  return audioPath;
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
  offer,
  audience,
  notes,
  transcript,
}: {
  url: string;
  platform?: string;
  offer?: string;
  audience?: string;
  notes?: string;
  transcript: string;
}) {
  const prompt = `
Tu es un expert senior en creative strategy, UGC ads et performance marketing.

Analyse cette vidéo TikTok comme une agence marketing professionnelle.

Contexte utilisateur :
- URL : ${url}
- Plateforme : ${platform || "Non précisée"}
- Produit / Offre : ${offer || "Non précisé"}
- Audience : ${audience || "Non précisée"}
- Notes : ${notes || "Aucune"}

Transcript réel :
"""
${transcript || "Aucun transcript exploitable"}
"""

Consignes :
- Base-toi d'abord sur le transcript réel.
- Si certaines infos manquent, dis-le honnêtement.
- N'invente pas des détails visuels précis si le transcript ne les prouve pas.
- Réponds en français.
- Analyse comme une agence UGC / performance.
- Retourne UNIQUEMENT un JSON valide, sans markdown.

Format attendu :
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
    temperature: 0.4,
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

  let parsed: any;

  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error("Réponse IA invalide après analyse transcript.");
  }

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
    recreateIdeas: Array.isArray(parsed?.recreateIdeas)
      ? parsed.recreateIdeas
      : [],
    similarHooks: Array.isArray(parsed?.similarHooks)
      ? parsed.similarHooks
      : [],
    similarAngles: Array.isArray(parsed?.similarAngles)
      ? parsed.similarAngles
      : [],
    scriptPrompt:
      typeof parsed?.scriptPrompt === "string" ? parsed.scriptPrompt : "",
    viralScore: typeof parsed?.viralScore === "string" ? parsed.viralScore : "",
    whyItWorks: Array.isArray(parsed?.whyItWorks) ? parsed.whyItWorks : [],
    howToBeat: Array.isArray(parsed?.howToBeat) ? parsed.howToBeat : [],
    adsAngles: Array.isArray(parsed?.adsAngles) ? parsed.adsAngles : [],
    creativeType:
      typeof parsed?.creativeType === "string" ? parsed.creativeType : "",
  };
}

export async function POST(req: Request) {
  let workDir = "";

  try {
    const body = await req.json();
    const { url, platform, offer, audience, notes } = body ?? {};

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

    const downloadedVideoPath = await downloadTikTokMedia(url, workDir);
    const audioPath = await extractAudioToMp3(downloadedVideoPath, workDir);
    const transcript = await transcribeAudio(audioPath);

    if (!transcript.trim()) {
      return NextResponse.json(
        {
          transcript: "",
          summary: "",
          hook: "",
          structure: "",
          angle: "",
          psychology: [],
          strengths: [],
          weaknesses: [],
          recreateIdeas: [],
          similarHooks: [],
          similarAngles: [],
          scriptPrompt: "",
          viralScore: "",
          whyItWorks: [],
          howToBeat: [],
          adsAngles: [],
          creativeType: "",
          error: "Transcript vide après transcription.",
        },
        { status: 200 }
      );
    }

    const result = await analyzeTranscript({
      url,
      platform,
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
