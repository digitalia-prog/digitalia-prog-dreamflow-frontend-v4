python3 <<'PY'
from pathlib import Path
import shutil
import re
import sys

file_path = Path("chrome-extension/content-meta.js")
backup_path = Path("chrome-extension/content-meta.js.backup")

if not file_path.exists():
    print("ERREUR : fichier introuvable :", file_path)
    sys.exit(1)

# Sauvegarde du fichier complet avant modification
shutil.copy2(file_path, backup_path)

text = file_path.read_text(encoding="utf-8")

# 1. Ajouter la nouvelle formulation utilisée par Meta
if "ID dans la bibliothèque" not in text:
    pattern = re.compile(
        r"(const\s+LIBRARY_PATTERNS\s*=\s*\[\s*)",
        re.MULTILINE
    )

    text, count_patterns = pattern.subn(
        r'\1/ID dans la bibliothèque\\s*:?\\s*(\\d+)/i,\n    ',
        text,
        count=1
    )
else:
    count_patterns = 1

# 2. Ajouter la détection textuelle dans containsLibraryIdentifier
if 'normalizedText.includes("id dans la bibliothèque")' not in text:
    pattern_contains = re.compile(
        r'(\s*return\s*\(\s*)(normalizedText\.includes\("id de la bibliothèque"\))',
        re.MULTILINE
    )

    text, count_contains = pattern_contains.subn(
        r'\1normalizedText.includes("id dans la bibliothèque") ||\n      \2',
        text,
        count=1
    )
else:
    count_contains = 1

if count_patterns == 0:
    print("ERREUR : bloc LIBRARY_PATTERNS non trouvé.")
    print("Le fichier original a été conservé dans :", backup_path)
    sys.exit(1)

if count_contains == 0:
    print("ERREUR : fonction containsLibraryIdentifier non trouvée.")
    print("Le fichier original a été conservé dans :", backup_path)
    sys.exit(1)

file_path.write_text(text, encoding="utf-8")

desktop_extension = Path.home() / "Desktop" / "TestExtension"
desktop_extension.mkdir(parents=True, exist_ok=True)

shutil.copy2(
    file_path,
    desktop_extension / "content-meta.js"
)

print("✅ Fichier complet corrigé :", file_path)
print("✅ Sauvegarde créée :", backup_path)
print("✅ Copie installée :", desktop_extension / "content-meta.js")
print("✅ Nombre de lignes :", len(text.splitlines()))
print("✅ Nouvelle détection présente :", "ID dans la bibliothèque" in text)
PY
