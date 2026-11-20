(() => {
  "use strict";

  const VERSION = "meta-video-safe-v188";
  const APP_URL = "https://ugcgrowth.io";
  const DYNAMIC_CONTAINER_SELECTOR =
    '[data-testid="ad-library-dynamic-content-container"]';
  const BUTTON_CLASS = "ugc-growth-analyze-button";
  const WRAPPER_CLASS = "ugc-growth-button-wrapper";
  const CARD_MARKER = "data-ugc-growth-ready";
  const STYLE_ID = "ugc-growth-meta-styles";

  const LIBRARY_PATTERNS = [
    /ID dans la bibliothèque\s*:?\s*(\d+)/i,
    /ID de la bibliothèque\s*:?\s*(\d+)/i,
    /Identifiant de la bibliothèque\s*:?\s*(\d+)/i,
    /Library ID\s*:?\s*(\d+)/i,
  ];

  function cleanText(value) {
    return String(value || "")
      .replace(/\u00a0/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function extractLibraryId(text) {
    const normalized = cleanText(text);
    for (const pattern of LIBRARY_PATTERNS) {
      const match = normalized.match(pattern);
      if (match?.[1]) return match[1];
    }
    return "";
  }

  function findLibraryIdNearContainer(container) {
    let current = container;
    let level = 0;
    while (
      current instanceof HTMLElement &&
      current !== document.body &&
      level < 10
    ) {
      const id = extractLibraryId(current.innerText);
      if (id) return id;
      current = current.parentElement;
      level += 1;
    }
    return "";
  }

  function findAdvertiserName(container) {
    const links = Array.from(container.querySelectorAll("a[href]"));
    for (const link of links) {
      const text = cleanText(link.textContent);
      if (!text || text.length < 2 || text.length > 120) continue;

      let url;
      try {
        url = new URL(link.getAttribute("href") || "", window.location.href);
      } catch {
        continue;
      }

      const hostname = url.hostname.toLowerCase();
      const isFacebookPage =
        hostname.endsWith("facebook.com") &&
        !url.pathname.startsWith("/ads/library") &&
        !url.pathname.startsWith("/l.php");

      if (isFacebookPage) return text;
    }
    return "";
  }

  function unwrapMetaRedirect(rawUrl) {
    try {
      const url = new URL(rawUrl, window.location.href);
      if (url.hostname === "l.facebook.com") {
        const destination = url.searchParams.get("u");
        if (destination) return decodeURIComponent(destination);
      }
      return url.href;
    } catch {
      return "";
    }
  }

  function findLandingPage(container) {
    const links = Array.from(container.querySelectorAll("a[href]"));
    for (const link of links) {
      const resolved = unwrapMetaRedirect(link.getAttribute("href") || "");
      if (!resolved) continue;

      try {
        const url = new URL(resolved);
        const hostname = url.hostname.toLowerCase();
        const isMetaDomain =
          hostname === "facebook.com" ||
          hostname.endsWith(".facebook.com") ||
          hostname === "instagram.com" ||
          hostname.endsWith(".instagram.com") ||
          hostname === "meta.com" ||
          hostname.endsWith(".meta.com") ||
          hostname === "fb.me" ||
          hostname.endsWith(".fb.me");

        if (url.protocol.startsWith("http") && !isMetaDomain) return url.href;
      } catch {}
    }
    return "";
  }

  function findPosterUrl(container) {
    const poster = container.querySelector("video[poster]")?.poster;
    if (poster) return poster;
    const images = Array.from(container.querySelectorAll("img"))
      .map((image) => {
        const rect = image.getBoundingClientRect();
        const width = image.naturalWidth || rect.width || image.width || 0;
        const height = image.naturalHeight || rect.height || image.height || 0;
        const url = image.currentSrc || image.src || image.getAttribute("data-src") || "";
        return { url, width, height, area: width * height };
      })
      .filter((image) => image.url && image.width >= 150 && image.height >= 100)
      .sort((a, b) => b.area - a.area);
    return images[0]?.url || "";
  }

  function findCreativeType(container) {
    if (container.querySelector('video, source[type^="video/"], [data-testid*="video-player" i]')) {
      return "video";
    }
    // Meta peut présenter une vidéo comme une image de couverture avant lecture.
    // Ne jamais déduire le type uniquement de l'extension .jpg du poster.
    const controls = Array.from(container.querySelectorAll(
      'button, [role="button"], [aria-label], [title], [data-testid]'
    ));
    const videoControl = controls.some((element) => {
      if (element.closest(`.${WRAPPER_CLASS}`)) return false;
      const cues = [
        element.getAttribute("aria-label"),
        element.getAttribute("title"),
        element.getAttribute("data-testid"),
      ].filter(Boolean).join(" ");
      return /\b(play|pause|video|vidéo|reproducir)\b|lire la vidéo|lecture vidéo|video-player|play-button/i.test(cues);
    });
    if (videoControl) return "video";
    if (findPosterUrl(container)) return "image";
    return "unknown";
  }

  function findCreativeUrl(container, creativeType) {
    if (creativeType !== "video") return creativeType === "image" ? findPosterUrl(container) : "";
    const videos = Array.from(container.querySelectorAll("video"));
    for (const video of videos) {
      // Les URL blob: appartiennent à cet onglet et sont inutilisables dans UGC Growth.
      const urls = [video.currentSrc, video.src, video.querySelector("source")?.src];
      const direct = urls.find((url) => /^https?:\/\//i.test(url || ""));
      if (direct) return direct;
    }
    return "";
  }

  function findCallToAction(container) {
    const ctas = [
      "acheter",
      "acheter maintenant",
      "shop now",
      "en savoir plus",
      "learn more",
      "s’inscrire",
      "s'inscrire",
      "sign up",
      "réserver",
      "book now",
      "télécharger",
      "download",
      "commander",
      "order now",
      "nous contacter",
      "contact us",
      "postuler",
      "apply now",
      "voir l’offre",
      "voir l'offre",
      "get offer",
      "see details",
      "voir les détails",
      "get quote",
      "demander un devis",
      "send message",
      "envoyer un message",
    ];

    const elements = Array.from(
      container.querySelectorAll('button, a, [role="button"]')
    );

    for (const element of elements) {
      const text = cleanText(element.textContent);
      const lower = text.toLowerCase();

      if (
        text &&
        text.length <= 60 &&
        ctas.some((cta) => lower === cta || lower.includes(cta))
      ) {
        return text;
      }
    }
    return "";
  }

  function findPublishedDate(container) {
    const text = cleanText(container.innerText);
    const patterns = [
      /Diffusion commencée le\s+([^|•]+)/i,
      /Début de diffusion\s*:?\s*([^|•]+)/i,
      /Started running on\s+([^|•]+)/i,
      /Créée le\s+([^|•]+)/i,
      /Created on\s+([^|•]+)/i,
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match?.[1]) return cleanText(match[1]).slice(0, 100);
    }
    return "";
  }

  function extractAdText(container) {
    const clone = container.cloneNode(true);
    if (!(clone instanceof HTMLElement)) return "";

    clone
      .querySelectorAll(
        `.${BUTTON_CLASS}, .${WRAPPER_CLASS}, script, style, svg`
      )
      .forEach((element) => element.remove());

    return cleanText(clone.innerText).slice(0, 8000);
  }

  function extractAdData(container) {
    const creativeType = findCreativeType(container);
    return {
      sourcePlatform: "meta",
      platform: "meta",
      source: "extension",
      sourceUrl: window.location.href,
      libraryId: findLibraryIdNearContainer(container),
      advertiserName: findAdvertiserName(container),
      adText: extractAdText(container),
      callToAction: findCallToAction(container),
      landingPage: findLandingPage(container),
      publishedAt: findPublishedDate(container),
      creativeUrl: findCreativeUrl(container, creativeType),
      posterUrl: findPosterUrl(container),
      creativeType,
      capturedAt: new Date().toISOString(),
    };
  }

  function encodePayload(data) {
    const json = JSON.stringify(data);
    return window.btoa(
      encodeURIComponent(json).replace(/%([0-9A-F]{2})/g, (_, hex) =>
        String.fromCharCode(parseInt(hex, 16))
      )
    );
  }

  function openInUgcGrowth(adData) {
    try {
      const params = new URLSearchParams({
        source: "extension",
        platform: "meta",
        payload: encodePayload(adData),
      });

      window.open(
        `${APP_URL}/dashboard/import-ad?${params.toString()}`,
        "_blank"
      );
    } catch (error) {
      console.error(
        "[UGC Growth] Impossible d’envoyer la publicité :",
        error
      );
      window.alert(
        "UGC Growth n’a pas réussi à envoyer cette publicité."
      );
    }
  }

  function createAnalyzeButton(container) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = BUTTON_CLASS;
    button.textContent = "✦ Analyser avec UGC Growth";
    button.setAttribute(
      "aria-label",
      "Analyser cette publicité avec UGC Growth"
    );

    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();

      const adData = extractAdData(container);
      console.log(
        `[UGC Growth ${VERSION}] Publicité envoyée :`,
        adData
      );
      openInUgcGrowth(adData);
    });

    return button;
  }

  function installStyles() {
    if (document.getElementById(STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      .${WRAPPER_CLASS} {
        box-sizing: border-box;
        display: flex;
        justify-content: center;
        width: 100%;
        padding: 10px 12px;
        position: relative;
        z-index: 9999;
      }

      .${BUTTON_CLASS} {
        appearance: none;
        border: 0;
        border-radius: 10px;
        cursor: pointer;
        font-family: Arial, sans-serif;
        font-size: 14px;
        font-weight: 700;
        line-height: 20px;
        padding: 10px 16px;
        background: #111827;
        color: #ffffff;
        box-shadow: 0 4px 14px rgba(0, 0, 0, 0.18);
      }

      .${BUTTON_CLASS}:hover {
        filter: brightness(1.12);
      }

      .${BUTTON_CLASS}:focus-visible {
        outline: 3px solid rgba(17, 24, 39, 0.35);
        outline-offset: 2px;
      }
    `;
    document.head.appendChild(style);
  }

  function getAdContainers() {
    const containers = Array.from(document.querySelectorAll(DYNAMIC_CONTAINER_SELECTOR))
      .filter((element) => element instanceof HTMLElement);

    // Le DOM Meta n'emploie pas systématiquement ce conteneur pour les vidéos.
    // Repli : repérer une carte par son ID de bibliothèque, sans englober plusieurs annonces.
    const markers = Array.from(document.querySelectorAll("div, span")).filter((element) => {
      if (!(element instanceof HTMLElement) || element.childElementCount > 1) return false;
      const label = cleanText(element.textContent);
      return label.length < 130 && /^(ID dans la bibliothèque|ID de la bibliothèque|Library ID)\s*:?\s*\d{7,}/i.test(label);
    });
    for (const marker of markers) {
      let current = marker.parentElement;
      for (let depth = 0; current instanceof HTMLElement && depth < 9; depth += 1) {
        if (current === document.body) break;
        const text = cleanText(current.innerText);
        const ids = text.match(/(?:ID dans la bibliothèque|ID de la bibliothèque|Library ID)\s*:?\s*\d{7,}/gi) || [];
        if (ids.length > 1) break;
        const media = findPosterUrl(current) || current.querySelector("video");
        if (media && ids.length === 1 && /^(DIV|ARTICLE)$/.test(current.tagName)) {
          if (!containers.some((known) => known === current || current.contains(known) || known.contains(current))) {
            containers.push(current);
          }
          break;
        }
        current = current.parentElement;
      }
    }
    return containers;
  }

  function injectButton(container) {
    if (!(container instanceof HTMLElement)) return false;

    // Meta re-renderise les cartes et peut supprimer notre bouton sans retirer le marqueur.
    if (container.querySelector(`.${BUTTON_CLASS}`)) {
      container.setAttribute(CARD_MARKER, "true");
      return false;
    }

    const wrapper = document.createElement("div");
    wrapper.className = WRAPPER_CLASS;
    wrapper.appendChild(createAnalyzeButton(container));

    container.setAttribute(CARD_MARKER, "true");
    container.insertBefore(wrapper, container.firstChild);
    return true;
  }

  let timer = null;
  let lastSignature = "";

  function injectButtons() {
    timer = null;
    installStyles();

    const containers = getAdContainers();
    let injectedCount = 0;

    for (const container of containers) {
      if (injectButton(container)) injectedCount += 1;
    }

    const signature = `${containers.length}:${injectedCount}`;

    if (signature !== lastSignature || injectedCount > 0) {
      console.log(
        `[UGC Growth ${VERSION}] ${containers.length} publicité(s) détectée(s). ${injectedCount} nouveau(x) bouton(s).`
      );
      lastSignature = signature;
    }
  }

  function scheduleInjection() {
    if (timer !== null) return;

    timer = window.setTimeout(() => {
      window.requestAnimationFrame(injectButtons);
    }, 150);
  }

  console.log(`[UGC Growth ${VERSION}] Script chargé.`);

  const observer = new MutationObserver(scheduleInjection);
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });

  window.addEventListener("load", scheduleInjection);
  window.addEventListener("scroll", scheduleInjection, { passive: true });

  scheduleInjection();
})();
