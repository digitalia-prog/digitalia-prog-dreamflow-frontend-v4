// public/bridge.js
// Ne change pas l'UI. Branche simplement le bouton "Générer" à l'API /api/generate
// et injecte les prompts Fun / Business / Hook Growth Hack.

(function () {
  function pick(selectorList) {
    for (const sel of selectorList) {
      const el = document.querySelector(sel);
      if (el) return el;
    }
    return null;
  }

  function val(el) {
    if (!el) return "";
    if (el.tagName === "SELECT") return el.value;
    return (el.value ?? el.textContent ?? "").toString();
  }

  // Essaie de récupérer tes champs sans casser ton UI
  const els = {
    // bouton générer (plusieurs IDs possibles)
    btn: pick(["#generate", "#btnGenerate", "#btn", "button[type='submit']", "button"]),

    // zone résultat
    out: pick(["#result", "#output", "#out", "#generated", "#response", "pre", ".result", ".output"]),

    // inputs courants
    mode: pick(["#mode", "select[name='mode']"]),
    type: pick(["#type", "#contentType", "select[name='type']", "select[name='contentType']"]),
    niche: pick(["#niche", "input[name='niche']"]),
    platform: pick(["#platform", "select[name='platform']"]),
    subject: pick(["#subject", "#product", "input[name='subject']", "input[name='product']"]),
    style: pick(["#style", "#bizStyle", "#funStyle", "input[name='style']", "select[name='style']"]),
    prompt: pick(["#prompt", "textarea[name='prompt']"])
  };

  async function callAPI(prompt) {
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt })
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok || data.success === false) {
      const msg = data.error || `Erreur API (${res.status})`;
      throw new Error(msg);
    }

    return data.result || data.text || data.script || data.content || "";
  }

  function buildPromptFromUI() {
    // Si l'utilisateur a écrit un prompt à la main, on le respecte
    const manual = val(els.prompt).trim();
    if (manual) return manual;

    const mode = val(els.mode) || "business";
    const type = val(els.type) || "default";
    const niche = val(els.niche) || "général";
    const platform = val(els.platform) || "tiktok";
    const subject = val(els.subject) || "sans sujet";
    const style = val(els.style) || "";

    if (window.DreamflowPrompts && typeof window.DreamflowPrompts.buildPrompt === "function") {
      return window.DreamflowPrompts.buildPrompt({
        mode,
        type,
        niche,
        platform,
        subject,
        style,
        lang: "français"
      });
    }

    // fallback si prompts.js pas chargé (ne casse pas)
    return `Tu es expert UGC. Plateforme: ${platform}. Niche: ${niche}. Sujet: ${subject}. Donne un script mot à mot (30-40s) + 3 hooks + 1 CTA.`;
  }

  async function onGenerate() {
    try {
      if (els.out) els.out.textContent = "Génération...";
      const prompt = buildPromptFromUI();
      const text = await callAPI(prompt);
      if (els.out) els.out.textContent = text || "Réponse vide.";
    } catch (e) {
      if (els.out) els.out.textContent = e && e.message ? e.message : "Erreur";
      console.error("Dreamflow bridge error:", e);
    }
  }

  // Branche le bouton sans casser ton UI
  if (els.btn) {
    els.btn.addEventListener("click", function (ev) {
      // évite que ça submit un form si tu en as un
      try { ev.preventDefault(); } catch (_) {}
      onGenerate();
    });
  } else {
    // Si on ne trouve pas le bouton, on ne casse rien : on log juste
    console.warn("Bridge: bouton Générer introuvable. Ajoute un id #generate ou #btnGenerate.");
  }
})();

