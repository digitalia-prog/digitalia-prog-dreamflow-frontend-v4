async function downloadTikTokMedia(url: string, outDir: string) {
  const outputTemplate = path.join(outDir, "source.%(ext)s");

  const pythonBin =
    process.env.YT_DLP_PYTHON_BIN ||
    path.join(process.cwd(), ".venv", "bin", "python3");

  await execFileAsync(pythonBin, [
    "-m",
    "yt_dlp",
    "--no-playlist",
    "-f",
    "mp4/best",
    "-o",
    outputTemplate,
    url,
  ]);

  const files = await fs.promises.readdir(outDir);
  const mediaFile = files.find((file) => file.startsWith("source."));

  if (!mediaFile) {
    throw new Error("Impossible de télécharger la vidéo depuis ce lien.");
  }

  return path.join(outDir, mediaFile);
}
