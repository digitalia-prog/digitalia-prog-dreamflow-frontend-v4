(() => {
  "use strict";

  const VERSION = "tiktok-direct-v1";
  const APP_URL = "https://ugcgrowth.io";
  const BUTTON_CLASS = "ugc-growth-analyze-button";
  const WRAPPER_CLASS = "ugc-growth-button-wrapper";
  const CARD_MARKER = "data-ugc-growth-tiktok-ready";

  function cleanText(value) {
    return String(value || "").replace(/\u00a0/g, " ").replace(/\s+/g, " ").trim();
  }

  function encodePayload(data) {
    const json = JSON.stringify(data);
    return window.btoa(
      encodeURIComponent(json).replace(/%([0-9A-F]{2})/g, (_, hex) =>
        String.fromCharCode(parseInt(hex, 16))
      )
    );
  }

  function isUsableMediaUrl(value) {
    if (!value) return false;

    try {
      const url = new URL(value, window.location.href);
      if (!["http:", "https:"].includes(url.protocol)) return false;

      const host = url.hostname.toLowerCase();
      const path = url.pathname.toLowerCase();

      if (
        path.includes("avatar") ||
        path.includes("icon") ||
        path.includes("logo") ||
        path.endsWith(".svg")
      ) {
        return false;
      }

      return Boolean(host);
    } catch {
      return false;
    }
  }

  function firstSrcsetUrl(value) {
    const items = String(value || "")
      .split(",")
      .map((part) => part.trim().split(/\s+/)[0])
      .filter(Boolean);

    return items.find(isUsableMediaUrl) || "";
  }

  function cssBackgroundUrl(element) {
    try {
      const background = window.getComputedStyle(element).backgroundImage || "";
      const match = background.match(/url\((['"]?)(.*?)\1\)/i);
      const url = match?.[2] || "";
      return isUsableMediaUrl(url) ? url : "";
    } catch {
      return "";
    }
  }

  function findCreativeMedia(container) {
    const candidates = [];

    function add(url, type, score) {
      if (!isUsableMediaUrl(url)) return;
      candidates.push({ url, type, score });
    }

    for (const video of container.querySelectorAll("video")) {
      const rect = video.getBoundingClientRect();
      const area = Math.max(1, rect.width * rect.height);

      const videoUrls = [
        video.currentSrc,
        video.src,
        video.getAttribute("src"),
        video.querySelector("source")?.src,
        video.querySelector("source")?.getAttribute("src"),
      ];

      for (const url of videoUrls) {
        add(url, "video", area + 1000000);
      }

      add(video.poster || video.getAttribute("poster"), "image", area + 700000);
    }

    for (const image of container.querySelectorAll("img")) {
      const rect = image.getBoundingClientRect();
      const width = image.naturalWidth || rect.width || image.width || 0;
      const height = image.naturalHeight || rect.height || image.height || 0;
      const area = width * height;

      if (width < 100 || height < 100) continue;

      const urls = [
        image.currentSrc,
        image.src,
        image.getAttribute("src"),
        image.getAttribute("data-src"),
        image.getAttribute("data-original"),
        firstSrcsetUrl(image.getAttribute("srcset")),
        firstSrcsetUrl(image.getAttribute("data-srcset")),
      ];

      for (const url of urls) {
        add(url, "image", area);
      }
    }

    const descendants = Array.from(container.querySelectorAll("*")).slice(0, 400);
    for (const element of descendants) {
      if (!(element instanceof HTMLElement)) continue;

      const rect = element.getBoundingClientRect();
      if (rect.width < 120 || rect.height < 120) continue;

      const url = cssBackgroundUrl(element);
      if (url) add(url, "image", rect.width * rect.height + 300000);
    }

    candidates.sort((a, b) => b.score - a.score);
    return candidates[0] || { url: "", type: "unknown" };
  }

  function findCreativeUrl(container) {
    return findCreativeMedia(container).url;
  }

  function extractText(container) {
    const clone = container.cloneNode(true);
    if (!(clone instanceof HTMLElement)) return "";
    clone.querySelectorAll(`.${BUTTON_CLASS}, .${WRAPPER_CLASS}, script, style, svg`)
      .forEach((el) => el.remove());
    return cleanText(clone.innerText).slice(0, 8000);
  }

  function findAdvertiserName(container) {
    const selectors = ['[class*="author"]','[class*="advertiser"]','[class*="account"]','[class*="username"]'];
    for (const selector of selectors) {
      const text = cleanText(container.querySelector(selector)?.textContent);
      if (text && text.length >= 2 && text.length <= 120) return text;
    }
    return "";
  }

  function findCallToAction(container) {
    const ctas = [
      "shop now","learn more","sign up","download","buy now","order now","book now",
      "acheter","en savoir plus","s'inscrire","télécharger","commander","réserver"
    ];
    for (const el of container.querySelectorAll('button, a, [role="button"]')) {
      const text = cleanText(el.textContent);
      const lower = text.toLowerCase();
      if (text && text.length <= 60 && ctas.some((cta) => lower === cta || lower.includes(cta))) {
        return text;
      }
    }
    return "";
  }

  function extractAdData(container) {
    const creative = findCreativeMedia(container);

    return {
      sourcePlatform: "tiktok",
      platform: "tiktok",
      source: "extension",
      sourceUrl: window.location.href,
      advertiserName: findAdvertiserName(container),
      adText: extractText(container),
      callToAction: findCallToAction(container),
      landingPage: "",
      creativeUrl: creative.url,
      creativeType: creative.type,
      capturedAt: new Date().toISOString()
    };
  }

  function openInUgcGrowth(adData) {
    const params = new URLSearchParams({
      source: "extension",
      platform: "tiktok",
      payload: encodePayload(adData)
    });
    window.open(`${APP_URL}/dashboard/import-ad?${params.toString()}`, "_blank");
  }

  function createButton(container) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = BUTTON_CLASS;
    button.textContent = "✦ Analyser avec UGC Growth";
    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      const data = extractAdData(container);
      console.log(`[UGC Growth ${VERSION}] TikTok envoyé :`, data);
      openInUgcGrowth(data);
    });
    return button;
  }

  function candidateCards() {
    const found = [];
    const seen = new Set();

    function addCard(card) {
      if (!(card instanceof HTMLElement)) return;
      if (seen.has(card)) return;
      if (card.closest(`.${WRAPPER_CLASS}`)) return;

      const rect = card.getBoundingClientRect();
      if (rect.width < 180 || rect.height < 220) return;
      if (!card.querySelector("video, img")) return;

      seen.add(card);
      found.push(card);
    }

    const actions = Array.from(
      document.querySelectorAll('button, a, [role="button"]')
    );

    for (const action of actions) {
      const label = cleanText(action.textContent).toLowerCase();
      const analytics =
        label.includes("see analytics") ||
        label.includes("view analytics") ||
        label.includes("voir les analyses") ||
        label.includes("voir l'analyse") ||
        label.includes("analytics");

      if (!analytics) continue;

      let current = action.parentElement;
      let depth = 0;
      let best = null;

      while (
        current instanceof HTMLElement &&
        current !== document.body &&
        depth < 10
      ) {
        const rect = current.getBoundingClientRect();
        const hasMedia = Boolean(current.querySelector("video, img"));
        const text = cleanText(current.innerText);

        if (
          hasMedia &&
          rect.width >= 180 &&
          rect.height >= 220 &&
          text.length >= 5
        ) {
          best = current;
          if (rect.width <= 650 && rect.height <= 1100) break;
        }

        current = current.parentElement;
        depth += 1;
      }

      if (best) addCard(best);
    }

    if (found.length === 0) {
      for (const media of document.querySelectorAll("video, img")) {
        let current = media.parentElement;
        let depth = 0;
        let best = null;

        while (
          current instanceof HTMLElement &&
          current !== document.body &&
          depth < 9
        ) {
          const rect = current.getBoundingClientRect();
          const text = cleanText(current.innerText);

          if (
            rect.width >= 180 &&
            rect.width <= 650 &&
            rect.height >= 220 &&
            rect.height <= 1100 &&
            text.length >= 5
          ) {
            best = current;
          }

          current = current.parentElement;
          depth += 1;
        }

        if (best) addCard(best);
      }
    }

    document.documentElement.setAttribute(
      "data-ugc-growth-tiktok-loaded",
      "true"
    );

    console.log(
      `[UGC Growth ${VERSION}] Détection TikTok: ${found.length} carte(s) candidate(s).`
    );

    return found.slice(0, 100);
  }

  function inject() {
    let added = 0;
    for (const card of candidateCards()) {
      if (card.hasAttribute(CARD_MARKER) || card.querySelector(`.${BUTTON_CLASS}`)) continue;

      const wrapper = document.createElement("div");
      wrapper.className = WRAPPER_CLASS;
      wrapper.appendChild(createButton(card));
      card.setAttribute(CARD_MARKER, "true");
      card.insertBefore(wrapper, card.firstChild);
      added += 1;
    }

    if (added) {
      console.log(`[UGC Growth ${VERSION}] ${added} bouton(s) TikTok ajouté(s).`);
    }
  }

  let timer = null;
  function schedule() {
    if (timer !== null) return;
    timer = window.setTimeout(() => {
      timer = null;
      window.requestAnimationFrame(inject);
    }, 250);
  }

  console.log(`[UGC Growth ${VERSION}] Script chargé.`);
  new MutationObserver(schedule).observe(document.documentElement, { childList: true, subtree: true });
  window.addEventListener("load", schedule);
  window.addEventListener("scroll", schedule, { passive: true });
  schedule();
})();
