import fs from "fs/promises";
import path from "path";
import { execFile } from "child_process";
import { promisify } from "util";

const execFileAsync = promisify(execFile);

function getPythonBin() {
  return (
    process.env.YT_DLP_PYTHON_BIN ||
    path.join(process.cwd(), ".venv", "bin", "python3")
  );
}

export async function downloadVideoFromUrl(
  url: string,
  workDir: string
) {
  const pythonBin = getPythonBin();

  const outputTemplate = path.join(
    workDir,
    "source.%(ext)s"
  );

  await execFileAsync(
    pythonBin,
    [
      "-m",
      "yt_dlp",
      "--no-playlist",
      "-o",
      outputTemplate,
      url,
    ]
  );

  const files = await fs.readdir(workDir);

  const mediaFile = files.find(
    (file) => file.startsWith("source.")
  );

  if (!mediaFile) {
    throw new Error(
      "Impossible de télécharger la vidéo"
    );
  }

  return path.join(workDir, mediaFile);
}
