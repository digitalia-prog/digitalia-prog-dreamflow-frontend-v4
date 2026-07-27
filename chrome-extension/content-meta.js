(() => {
  "use strict";

  const APP_URL = "http://localhost:3000";
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

  function isVisible(element) {
    if (!(element instanceof HTMLElement)) return false;

    const style = window.getComputedStyle(element);
    const rect = element.getBoundingClientRect();

    return (
      style.display !== "none" &&
      style.visibility !== "hidden" &&
      Number(style.opacity) !== 0 &&
      rect.width > 0 &&
      rect.height > 0
    );
  }

  function extractLibraryId(text) {
    const normalized = cleanText(text);

    for (const pattern of LIBRARY_PATTERNS) {
      const match = normalized.match(pattern);
      if (match?.[1]) return match[1];
    }

    return "";
  }

  /**
   * Meta fournit un conteneur stable pour chaque création publicitaire.
   * On utilise directement ces conteneurs, sans filtrage de visibilité
   * ni remontée fragile dans les parents.
   */
  function findAdCards() {
    const containers = Array.from(
      document.querySelectorAll(DYNAMIC_CONTAINER_SELECTOR)
    ).filter((element) => element instanceof HTMLElement);

    return {
      cards: containers,
      containerCount: containers.length,
    };
  }

  function findLibraryIdNearCard(card) {
    let current = card;
    let level = 0;

    while (
      current instanceof HTMLElement &&
      current !== document.body &&
      level < 8
    ) {
      const id = extractLibraryId(current.innerText);
      if (id) return id;

      const parent = current.parentElement;
      if (!parent || countDynamicContainers(parent) > 1) break;

      current = parent;
      level += 1;
    }

    return "";
  }

  function findAdvertiserName(card) {
    const links = Array.from(card.querySelectorAll("a[href]"));

    for (const link of links) {
      if (!isVisible(link)) continue;

      const href = link.getAttribute("href") || "";
      const text = cleanText(link.textContent);

      if (!text || text.length < 2 || text.length > 120) continue;
      if (/^\d+$/.test(text)) continue;

      let url;
      try {
        url = new URL(href, window.location.href);
      } catch {
        continue;
      }

      const hostname = url.hostname.toLowerCase();
      const isAdvertiserPage =
        hostname === "www.facebook.com" &&
        !url.pathname.startsWith("/ads/library") &&
        !url.pathname.startsWith("/l.php");

      if (isAdvertiserPage) return text;
    }

    const candidates = Array.from(card.querySelectorAll("h1, h2, h3, h4, strong"));
    const forbidden = [
      "sponsorisé",
      "sponsored",
      "voir les détails",
      "see ad details",
      "bibliothèque publicitaire",
      "ad library",
    ];

    for (const element of candidates) {
      if (!isVisible(element)) continue;

      const text = cleanText(element.textContent);
      const lower = text.toLowerCase();

      if (!text || text.length < 2 || text.length > 120) continue;
      if (forbidden.some((item) => lower.includes(item))) continue;
      if (/^\d+$/.test(text)) continue;

      return text;
    }

    return "";
  }

  function unwrapMetaRedirect(url) {
    try {
      const parsed = new URL(url, window.location.href);

      if (parsed.hostname === "l.facebook.com") {
        const destination = parsed.searchParams.get("u");
        if (destination) return decodeURIComponent(destination);
      }

      return parsed.href;
    } catch {
      return "";
    }
  }

  function findLandingPage(card) {
    const links = Array.from(card.querySelectorAll("a[href]"));

    for (const link of links) {
      const rawHref = link.getAttribute("href");
      if (!rawHref) continue;

      const resolved = unwrapMetaRedirect(rawHref);
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
          hostname.endsWith(".meta.com");

        if (url.protocol.startsWith("http") && !isMetaDomain) {
          return url.href;
        }
      } catch {
        // Lien invalide : on passe au suivant.
      }
    }

    return "";
  }

  function findCreativeUrl(card) {
    const videos = Array.from(card.querySelectorAll("video"));

    for (const video of videos) {
      const url =
        video.currentSrc ||
        video.src ||
        video.querySelector("source")?.src ||
        "";
      if (url) return url;
    }

    const images = Array.from(card.querySelectorAll("img"))
      .map((image) => {
        const rect = image.getBoundingClientRect();
        const width = image.naturalWidth || rect.width || image.width || 0;
        const height = image.naturalHeight || rect.height || image.height || 0;
        const url =
          image.currentSrc || image.src || image.getAttribute("data-src") || "";

        return { url, width, height, area: width * height };
      })
      .filter((image) => image.url && image.width >= 180 && image.height >= 120)
      .sort((a, b) => b.area - a.area);

    return images[0]?.url || "";
  }

  function findCreativeType(card) {
    if (card.querySelector("video")) return "video";
    if (card.querySelector("img")) return "image";
    return "unknown";
  }

  function findCallToAction(card) {
    const possibleCtas = [
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
    ];

    const elements = Array.from(
      card.querySelectorAll('button, a, [role="button"]')
    );

    for (const element of elements) {
      if (!isVisible(element)) continue;

      const text = cleanText(element.textContent);
      const lower = text.toLowerCase();

      if (
        text &&
        text.length <= 60 &&
        possibleCtas.some((cta) => lower === cta || lower.includes(cta))
      ) {
        return text;
      }
    }

    return "";
  }

  function findPublishedDate(card) {
    const text = cleanText(card.innerText);
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

  function extractAdText(card) {
    const clone = card.cloneNode(true);
    if (!(clone instanceof HTMLElement)) return "";

    clone
      .querySelectorAll(`.${BUTTON_CLASS}, .${WRAPPER_CLASS}, script, style, svg`)
      .forEach((element) => element.remove());

    return cleanText(clone.innerText).slice(0, 8000);
  }

  function extractAdData(card) {
    return {
      sourcePlatform: "meta",
      platform: "meta",
      source: "extension",
      sourceUrl: window.location.href,
      libraryId: findLibraryIdNearCard(card),
      advertiserName: findAdvertiserName(card),
      adText: extractAdText(card),
      callToAction: findCallToAction(card),
      landingPage: findLandingPage(card),
      publishedAt: findPublishedDate(card),
      creativeUrl: findCreativeUrl(card),
      creativeType: findCreativeType(card),
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

      window.open(`${APP_URL}/dashboard/import-ad?${params.toString()}`, "_blank");
    } catch (error) {
      console.error("[UGC Growth] Impossible d’envoyer la publicité :", error);
      window.alert("UGC Growth n’a pas réussi à envoyer cette publicité.");
    }
  }

  function createAnalyzeButton(card) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = BUTTON_CLASS;
    button.textContent = "✦ Analyser avec UGC Growth";
    button.setAttribute("aria-label", "Analyser cette publicité avec UGC Growth");

    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();

      const adData = extractAdData(card);
      console.log("[UGC Growth] Publicité envoyée :", adData);
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
        z-index: 20;
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

  function injectButton(card) {
    if (!(card instanceof HTMLElement)) return false;

    if (card.hasAttribute(CARD_MARKER) || card.querySelector(`.${BUTTON_CLASS}`)) {
      card.setAttribute(CARD_MARKER, "true");
      return false;
    }

    const wrapper = document.createElement("div");
    wrapper.className = WRAPPER_CLASS;
    wrapper.appendChild(createAnalyzeButton(card));

    card.setAttribute(CARD_MARKER, "true");
    card.insertBefore(wrapper, card.firstChild);
    return true;
  }

  let injectionTimer = null;
  let lastLogSignature = "";

  function injectButtons() {
    injectionTimer = null;
    installStyles();

    const { cards, containerCount } = findAdCards();
    let injectedCount = 0;

    for (const card of cards) {
      if (injectButton(card)) injectedCount += 1;
    }

    const signature = `${containerCount}:${cards.length}`;
    if (signature !== lastLogSignature || injectedCount > 0) {
      console.log(
        `[UGC Growth] ${cards.length} publicité(s) détectée(s) sur ${containerCount} conteneur(s) Meta. ${injectedCount} nouveau(x) bouton(s).`
      );
      lastLogSignature = signature;
    }
  }

  function scheduleInjection() {
    if (injectionTimer !== null) return;

    injectionTimer = window.setTimeout(() => {
      window.requestAnimationFrame(injectButtons);
    }, 180);
  }

  const observer = new MutationObserver(scheduleInjection);
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });

  window.addEventListener("load", scheduleInjection);
  window.addEventListener("scroll", scheduleInjection, { passive: true });

  scheduleInjection();
})();
