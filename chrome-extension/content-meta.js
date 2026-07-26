(() => {
  "use strict";

  const BUTTON_CLASS = "ugc-growth-analyze-button";
  const WRAPPER_CLASS = "ugc-growth-button-wrapper";
  const CARD_MARKER = "data-ugc-growth-ready";
  const DEBUG_PREFIX = "[UGC Growth]";

  // Développement local. Remplacer par l’URL de production au déploiement.
  const APP_URL = "http://localhost:3000";

  const LIBRARY_LABEL_PATTERNS = [
    /id\s+dans\s+la\s+biblioth[eè]que/i,
    /id\s+de\s+la\s+biblioth[eè]que/i,
    /identifiant\s+de\s+la\s+biblioth[eè]que/i,
    /library\s+id/i
  ];

  const LIBRARY_ID_PATTERNS = [
    /id\s+dans\s+la\s+biblioth[eè]que\s*:?\s*([0-9]{5,})/i,
    /id\s+de\s+la\s+biblioth[eè]que\s*:?\s*([0-9]{5,})/i,
    /identifiant\s+de\s+la\s+biblioth[eè]que\s*:?\s*([0-9]{5,})/i,
    /library\s+id\s*:?\s*([0-9]{5,})/i
  ];

  function cleanText(value) {
    return String(value || "")
      .replace(/\u00a0/g, " ")
      .replace(/[\u200B-\u200D\uFEFF]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  function normalizeText(value) {
    return cleanText(value)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  }

  function isHTMLElement(value) {
    return value instanceof HTMLElement;
  }

  function isVisible(element) {
    if (!isHTMLElement(element)) {
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

  function containsLibraryLabel(text) {
    const normalized = cleanText(text);
    return LIBRARY_LABEL_PATTERNS.some((pattern) => pattern.test(normalized));
  }

  function extractLibraryId(text) {
    const normalized = cleanText(text);

    for (const pattern of LIBRARY_ID_PATTERNS) {
      const match = normalized.match(pattern);

      if (match?.[1]) {
        return match[1];
      }
    }

    // Secours : l’ID peut être séparé du libellé par plusieurs nœuds HTML.
    if (containsLibraryLabel(normalized)) {
      const numbers = normalized.match(/\b[0-9]{8,}\b/g);
      if (numbers?.length) {
        return numbers[0];
      }
    }

    return "";
  }

  function getElementText(element) {
    if (!isHTMLElement(element)) {
      return "";
    }

    return cleanText(element.innerText || element.textContent || "");
  }

  function getLibraryMarkerLeaves() {
    const selector = "div, span, p, strong, b, small";
    const all = Array.from(document.querySelectorAll(selector));

    return all.filter((element) => {
      if (!isVisible(element)) {
        return false;
      }

      const ownText = cleanText(element.textContent);
      if (!ownText || ownText.length > 180 || !containsLibraryLabel(ownText)) {
        return false;
      }

      // On conserve uniquement les nœuds les plus petits contenant le libellé.
      const childContainsSameLabel = Array.from(element.children).some((child) =>
        containsLibraryLabel(cleanText(child.textContent))
      );

      return !childContainsSameLabel;
    });
  }

  function countLibraryMarkers(root) {
    if (!isHTMLElement(root)) {
      return 0;
    }

    const markers = getLibraryMarkerLeaves();
    let count = 0;

    for (const marker of markers) {
      if (root === marker || root.contains(marker)) {
        count += 1;
      }
    }

    return count;
  }

  function getMetrics(element) {
    const text = getElementText(element);
    const rect = element.getBoundingClientRect();

    return {
      text,
      textLength: text.length,
      videos: element.querySelectorAll("video").length,
      images: element.querySelectorAll("img").length,
      links: element.querySelectorAll("a[href]").length,
      buttons: element.querySelectorAll(
        'button, [role="button"], input[type="button"], input[type="submit"]'
      ).length,
      width: rect.width,
      height: rect.height,
      area: Math.max(0, rect.width * rect.height),
      libraryMarkers: countLibraryMarkers(element)
    };
  }

  function isReasonableLocalContainer(metrics) {
    return (
      metrics.libraryMarkers === 1 &&
      metrics.textLength >= 40 &&
      metrics.textLength <= 12000 &&
      metrics.width >= 240 &&
      metrics.height >= 100 &&
      metrics.area <= 3500000
    );
  }

  function parentCreatesGlobalJump(currentMetrics, parentMetrics) {
    const textJump =
      currentMetrics.textLength > 0 &&
      parentMetrics.textLength > Math.max(
        currentMetrics.textLength * 4,
        currentMetrics.textLength + 5000
      );

    const imageJump =
      parentMetrics.images > Math.max(
        currentMetrics.images + 20,
        currentMetrics.images * 4
      );

    const videoJump =
      parentMetrics.videos > Math.max(
        currentMetrics.videos + 2,
        currentMetrics.videos * 3
      );

    const areaJump =
      currentMetrics.area > 0 &&
      parentMetrics.area > currentMetrics.area * 5;

    const multipleAds = parentMetrics.libraryMarkers > 1;

    return multipleAds || textJump || imageJump || videoJump || areaJump;
  }

  function findCardFromMarker(marker) {
    if (!isHTMLElement(marker)) {
      return null;
    }

    let current = marker;
    let best = null;
    let depth = 0;

    while (
      isHTMLElement(current) &&
      current !== document.body &&
      depth < 18
    ) {
      const currentMetrics = getMetrics(current);

      if (isReasonableLocalContainer(currentMetrics)) {
        best = current;
      }

      const parent = current.parentElement;
      if (!isHTMLElement(parent) || parent === document.body) {
        break;
      }

      const parentMetrics = getMetrics(parent);

      // Le meilleur signal : le parent devient soudainement le conteneur global.
      if (
        best &&
        parentCreatesGlobalJump(currentMetrics, parentMetrics)
      ) {
        break;
      }

      // Stop immédiat lorsque plusieurs annonces sont regroupées.
      if (parentMetrics.libraryMarkers > 1) {
        break;
      }

      current = parent;
      depth += 1;
    }

    if (best) {
      return best;
    }

    // Secours : premier ancêtre visible contenant le libellé et un contenu suffisant.
    current = marker;
    depth = 0;

    while (
      isHTMLElement(current) &&
      current !== document.body &&
      depth < 14
    ) {
      const metrics = getMetrics(current);

      if (
        metrics.libraryMarkers === 1 &&
        metrics.textLength >= 40 &&
        metrics.width >= 200 &&
        metrics.height >= 80
      ) {
        return current;
      }

      current = current.parentElement;
      depth += 1;
    }

    return null;
  }

  function deduplicateCards(cards) {
    const unique = [];

    for (const card of cards) {
      if (!isHTMLElement(card)) {
        continue;
      }

      const alreadyRepresented = unique.some(
        (existing) =>
          existing === card ||
          existing.contains(card) ||
          card.contains(existing)
      );

      if (!alreadyRepresented) {
        unique.push(card);
        continue;
      }

      // On préfère le conteneur le plus petit lorsqu’un doublon existe.
      for (let index = 0; index < unique.length; index += 1) {
        const existing = unique[index];

        if (existing.contains(card)) {
          unique[index] = card;
          break;
        }
      }
    }

    return unique;
  }

  function findAdCards() {
    const markers = getLibraryMarkerLeaves();
    const cards = markers
      .map(findCardFromMarker)
      .filter(Boolean);

    return deduplicateCards(cards);
  }

  function findAdvertiserName(card) {
    const selectors = [
      'a[href*="view_all_page_id"]',
      'a[href*="page_id"]',
      'a[role="link"]',
      "h1",
      "h2",
      "h3",
      "h4",
      "strong"
    ];

    const forbidden = [
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
      "ad library",
      "id dans la bibliothèque",
      "id de la bibliothèque",
      "library id"
    ];

    for (const element of card.querySelectorAll(selectors.join(","))) {
      if (!isVisible(element)) {
        continue;
      }

      const text = cleanText(element.textContent);
      const lower = normalizeText(text);

      if (!text || text.length < 2 || text.length > 120) {
        continue;
      }

      if (forbidden.some((value) => lower.includes(normalizeText(value)))) {
        continue;
      }

      if (/^[0-9\s]+$/.test(text)) {
        continue;
      }

      return text;
    }

    return "";
  }

  function findLandingPage(card) {
    for (const link of card.querySelectorAll("a[href]")) {
      try {
        const href = link.getAttribute("href");
        if (!href) {
          continue;
        }

        const url = new URL(href, window.location.href);
        const host = url.hostname.toLowerCase();

        const isMeta =
          host.includes("facebook.com") ||
          host.includes("instagram.com") ||
          host.includes("meta.com") ||
          host === window.location.hostname;

        if (
          /^https?:$/.test(url.protocol) &&
          !isMeta &&
          !url.href.startsWith("javascript:")
        ) {
          return url.href;
        }
      } catch {
        // Lien invalide : ignoré.
      }
    }

    return "";
  }

  function findCreativeUrl(card) {
    for (const video of card.querySelectorAll("video")) {
      const url =
        video.currentSrc ||
        video.src ||
        video.querySelector("source")?.src ||
        "";

      if (url) {
        return url;
      }
    }

    let bestImage = null;
    let bestArea = 0;

    for (const image of card.querySelectorAll("img")) {
      const url =
        image.currentSrc ||
        image.src ||
        image.getAttribute("data-src") ||
        "";

      const width = image.naturalWidth || image.width || 0;
      const height = image.naturalHeight || image.height || 0;
      const area = width * height;

      if (url && width >= 180 && height >= 120 && area > bestArea) {
        bestImage = url;
        bestArea = area;
      }
    }

    return bestImage || "";
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
    const ctas = [
      "acheter",
      "acheter maintenant",
      "shop now",
      "en savoir plus",
      "learn more",
      "s'inscrire",
      "s’inscrire",
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
      "voir l'offre",
      "voir l’offre",
      "get offer"
    ];

    const elements = card.querySelectorAll(
      'button, a[role="button"], div[role="button"], span'
    );

    for (const element of elements) {
      if (!isVisible(element)) {
        continue;
      }

      const text = cleanText(element.textContent);
      const lower = normalizeText(text);

      if (
        text &&
        text.length <= 60 &&
        ctas.some((cta) => lower.includes(normalizeText(cta)))
      ) {
        return text;
      }
    }

    return "";
  }

  function findPublishedDate(card) {
    const text = getElementText(card);
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

    if (!isHTMLElement(clone)) {
      return "";
    }

    clone
      .querySelectorAll(
        `.${BUTTON_CLASS}, .${WRAPPER_CLASS}, script, style, svg`
      )
      .forEach((element) => element.remove());

    return cleanText(clone.innerText).slice(0, 8000);
  }

  function extractAdData(card) {
    const cardText = getElementText(card);

    return {
      sourcePlatform: "meta",
      platform: "meta",
      source: "extension",
      sourceUrl: window.location.href,
      libraryId: extractLibraryId(cardText),
      advertiserName: findAdvertiserName(card),
      adText: extractAdText(card),
      callToAction: findCallToAction(card),
      landingPage: findLandingPage(card),
      publishedAt: findPublishedDate(card),
      creativeUrl: findCreativeUrl(card),
      creativeType: findCreativeType(card),
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
      const params = new URLSearchParams({
        source: "extension",
        platform: "meta",
        payload: encodePayload(adData)
      });

      const destination =
        `${APP_URL}/dashboard/import-ad?${params.toString()}`;

      window.open(destination, "_blank", "noopener,noreferrer");
    } catch (error) {
      console.error(`${DEBUG_PREFIX} Envoi impossible :`, error);
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
      console.log(`${DEBUG_PREFIX} Publicité envoyée :`, adData);
      openInUgcGrowth(adData);
    });

    return button;
  }

  function injectButton(card) {
    if (!isHTMLElement(card)) {
      return;
    }

    if (
      card.hasAttribute(CARD_MARKER) ||
      card.querySelector(`.${BUTTON_CLASS}`)
    ) {
      card.setAttribute(CARD_MARKER, "true");
      return;
    }

    const wrapper = document.createElement("div");
    wrapper.className = WRAPPER_CLASS;
    wrapper.appendChild(createAnalyzeButton(card));

    card.setAttribute(CARD_MARKER, "true");
    card.prepend(wrapper);
  }

  let scheduled = false;
  let lastLogCount = null;

  function injectButtons() {
    scheduled = false;

    const cards = findAdCards();
    cards.forEach(injectButton);

    if (lastLogCount !== cards.length) {
      console.log(
        `${DEBUG_PREFIX} ${cards.length} publicité(s) détectée(s).`
      );
      lastLogCount = cards.length;
    }
  }

  function scheduleInjection() {
    if (scheduled) {
      return;
    }

    scheduled = true;

    window.requestAnimationFrame(() => {
      window.setTimeout(injectButtons, 180);
    });
  }

  const observer = new MutationObserver(scheduleInjection);

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    characterData: true
  });

  window.addEventListener("scroll", scheduleInjection, {
    passive: true
  });

  window.addEventListener("load", scheduleInjection);
  window.addEventListener("pageshow", scheduleInjection);

  scheduleInjection();
})();
