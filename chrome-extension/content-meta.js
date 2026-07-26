(() => {
  "use strict";

  const BUTTON_CLASS = "ugc-growth-analyze-button";
  const WRAPPER_CLASS = "ugc-growth-button-wrapper";
  const CARD_MARKER = "data-ugc-growth-ready";

  // Pendant le développement, l’extension envoie toujours vers localhost.
  const APP_URL = "http://localhost:3000";

  const LIBRARY_PATTERNS = [
    /ID dans la bibliothèque\s*:?\s*(\d+)/i,
    /ID de la bibliothèque\s*:?\s*(\d+)/i,
    /Identifiant de la bibliothèque\s*:?\s*(\d+)/i,
    /Library ID\s*:?\s*(\d+)/i
  ];

  function cleanText(value) {
    return String(value || "")
      .replace(/\u00a0/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function isVisible(element) {
    if (!(element instanceof HTMLElement)) {
      return false;
    }

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
    const normalizedText = cleanText(text);

    for (const pattern of LIBRARY_PATTERNS) {
      const match = normalizedText.match(pattern);

      if (match?.[1]) {
        return match[1];
      }
    }

    return "";
  }

  function containsLibraryIdentifier(text) {
    const normalizedText = cleanText(text).toLowerCase();

    return (
      normalizedText.includes("id dans la bibliothèque") ||
      normalizedText.includes("id de la bibliothèque") ||
      normalizedText.includes("identifiant de la bibliothèque") ||
      normalizedText.includes("library id")
    );
  }

  function findAdvertiserName(card) {
    const selectors = [
      'a[href*="view_all_page_id"]',
      'a[href*="page_id"]',
      'a[role="link"]',
      "h3",
      "h4",
      "strong"
    ];

    const elements = Array.from(
      card.querySelectorAll(selectors.join(","))
    );

    const forbiddenTexts = [
      "voir les détails",
      "see ad details",
      "détails de la publicité",
      "ad details",
      "sponsorisé",
      "sponsored",
      "actif",
      "active",
      "inactive",
      "inactif",
      "bibliothèque publicitaire",
      "ad library"
    ];

    for (const element of elements) {
      if (!isVisible(element)) {
        continue;
      }

      const text = cleanText(element.textContent);
      const lowerText = text.toLowerCase();

      if (!text || text.length < 2 || text.length > 120) {
        continue;
      }

      if (forbiddenTexts.some((forbidden) => lowerText.includes(forbidden))) {
        continue;
      }

      if (/^\d+$/.test(text)) {
        continue;
      }

      return text;
    }

    return "";
  }

  function findLandingPage(card) {
    const links = Array.from(card.querySelectorAll("a[href]"));

    for (const link of links) {
      try {
        const href = link.getAttribute("href");

        if (!href) {
          continue;
        }

        const url = new URL(href, window.location.href);
        const hostname = url.hostname.toLowerCase();

        const isMetaLink =
          hostname.includes("facebook.com") ||
          hostname.includes("instagram.com") ||
          hostname.includes("meta.com") ||
          hostname === window.location.hostname;

        if (
          url.protocol.startsWith("http") &&
          !isMetaLink &&
          !url.href.startsWith("javascript:")
        ) {
          return url.href;
        }
      } catch {
        // On ignore les liens invalides.
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

      if (url) {
        return url;
      }
    }

    const images = Array.from(card.querySelectorAll("img"));

    for (const image of images) {
      const url =
        image.currentSrc ||
        image.src ||
        image.getAttribute("data-src") ||
        "";

      const width = image.naturalWidth || image.width || 0;
      const height = image.naturalHeight || image.height || 0;

      // Évite de récupérer les petites photos de profil et les icônes.
      if (url && (width >= 200 || height >= 200)) {
        return url;
      }
    }

    return "";
  }

  function findCreativeType(card) {
    if (card.querySelector("video")) {
      return "video";
    }

    if (card.querySelector("img")) {
      return "image";
    }

    return "unknown";
  }

  function findCallToAction(card) {
    const elements = Array.from(
      card.querySelectorAll(
        'button, a[role="button"], div[role="button"], span'
      )
    );

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
      "get offer"
    ];

    for (const element of elements) {
      if (!isVisible(element)) {
        continue;
      }

      const text = cleanText(element.textContent);
      const lowerText = text.toLowerCase();

      if (
        text &&
        text.length <= 60 &&
        possibleCtas.some(
          (cta) => lowerText === cta || lowerText.includes(cta)
        )
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
      /Created on\s+([^|•]+)/i
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);

      if (match?.[1]) {
        return cleanText(match[1]).slice(0, 100);
      }
    }

    return "";
  }

  function extractAdText(card) {
    const clone = card.cloneNode(true);

    if (!(clone instanceof HTMLElement)) {
      return "";
    }

    clone
      .querySelectorAll(
        `.${BUTTON_CLASS}, .${WRAPPER_CLASS}, script, style, svg`
      )
      .forEach((element) => element.remove());

    const fullText = cleanText(clone.innerText);

    return fullText.slice(0, 8000);
  }

  function extractAdData(card) {
    const cardText = cleanText(card.innerText);
    const libraryId = extractLibraryId(cardText);
    const advertiserName = findAdvertiserName(card);
    const landingPage = findLandingPage(card);
    const creativeUrl = findCreativeUrl(card);
    const creativeType = findCreativeType(card);
    const callToAction = findCallToAction(card);
    const publishedAt = findPublishedDate(card);
    const adText = extractAdText(card);

    return {
      sourcePlatform: "meta",
      platform: "meta",
      source: "extension",
      sourceUrl: window.location.href,
      libraryId,
      advertiserName,
      adText,
      callToAction,
      landingPage,
      publishedAt,
      creativeUrl,
      creativeType,
      capturedAt: new Date().toISOString()
    };
  }

  function encodePayload(data) {
    const json = JSON.stringify(data);

    return window.btoa(
      encodeURIComponent(json).replace(
        /%([0-9A-F]{2})/g,
        (_, hex) => String.fromCharCode(parseInt(hex, 16))
      )
    );
  }

  function openInUgcGrowth(adData) {
    try {
      const payload = encodePayload(adData);

      const params = new URLSearchParams({
        source: "extension",
        platform: "meta",
        payload
      });

      const destination =
        `${APP_URL}/dashboard/import-ad?${params.toString()}`;

      window.open(destination, "_blank");
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

  function createAnalyzeButton(card) {
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

      const adData = extractAdData(card);

      console.log(
        "[UGC Growth] Publicité détectée :",
        adData
      );

      openInUgcGrowth(adData);
    });

    return button;
  }

  function scoreCard(element) {
    if (!(element instanceof HTMLElement) || !isVisible(element)) {
      return -1;
    }

    const text = cleanText(element.innerText);
    const rect = element.getBoundingClientRect();

    let score = 0;

    if (containsLibraryIdentifier(text)) {
      score += 10;
    }

    if (extractLibraryId(text)) {
      score += 10;
    }

    if (element.querySelector("video")) {
      score += 6;
    }

    if (element.querySelector("img")) {
      score += 3;
    }

    if (
      element.querySelector(
        'a[href*="view_all_page_id"], a[href*="page_id"]'
      )
    ) {
      score += 5;
    }

    if (
      text.toLowerCase().includes("voir les détails") ||
      text.toLowerCase().includes("see ad details")
    ) {
      score += 4;
    }

    if (rect.width >= 250 && rect.width <= 1000) {
      score += 3;
    }

    if (rect.height >= 250 && rect.height <= 2500) {
      score += 3;
    }

    if (text.length > 150 && text.length < 15000) {
      score += 2;
    }

    return score;
  }

  function findCardFromLibraryElement(element) {
    let current = element;
    let bestCard = null;
    let bestScore = -1;
    let level = 0;

    while (
      current instanceof HTMLElement &&
      current !== document.body &&
      level < 12
    ) {
      const score = scoreCard(current);

      if (score > bestScore) {
        bestScore = score;
        bestCard = current;
      }

      current = current.parentElement;
      level += 1;
    }

    return bestScore >= 20 ? bestCard : null;
  }

  function findLibraryTextElements() {
    const elements = Array.from(
      document.querySelectorAll(
        "div, span, p, strong"
      )
    );

    return elements.filter((element) => {
      if (!isVisible(element)) {
        return false;
      }

      const text = cleanText(element.textContent);

      return (
        text.length > 0 &&
        text.length < 300 &&
        containsLibraryIdentifier(text)
      );
    });
  }

  function findAdCards() {
    const libraryElements = findLibraryTextElements();
    const cards = new Set();

    for (const libraryElement of libraryElements) {
      const card = findCardFromLibraryElement(libraryElement);

      if (card) {
        cards.add(card);
      }
    }

    return Array.from(cards);
  }

  function injectButton(card) {
    if (!(card instanceof HTMLElement)) {
      return;
    }

    if (card.hasAttribute(CARD_MARKER)) {
      return;
    }

    if (card.querySelector(`.${BUTTON_CLASS}`)) {
      card.setAttribute(CARD_MARKER, "true");
      return;
    }

    card.setAttribute(CARD_MARKER, "true");

    const wrapper = document.createElement("div");
    wrapper.className = WRAPPER_CLASS;
    wrapper.appendChild(createAnalyzeButton(card));

    card.prepend(wrapper);
  }

  let injectionScheduled = false;

  function injectButtons() {
    injectionScheduled = false;

    const cards = findAdCards();

    cards.forEach(injectButton);

    console.log(
      `[UGC Growth] ${cards.length} publicité(s) détectée(s).`
    );
  }

  function scheduleInjection() {
    if (injectionScheduled) {
      return;
    }

    injectionScheduled = true;

    window.requestAnimationFrame(() => {
      window.setTimeout(injectButtons, 150);
    });
  }

  const observer = new MutationObserver(() => {
    scheduleInjection();
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });

  window.addEventListener(
    "scroll",
    scheduleInjection,
    { passive: true }
  );

  window.addEventListener(
    "load",
    scheduleInjection
  );

  scheduleInjection();
})();
