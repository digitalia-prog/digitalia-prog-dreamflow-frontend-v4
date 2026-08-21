(() => {
  "use strict";

  const VERSION = "instagram-direct-v1";
  const APP_URL = "https://ugcgrowth.io";
  const BUTTON_ID = "ugc-growth-instagram-button";
  const WRAPPER_ID = "ugc-growth-instagram-wrapper";

  function cleanText(value) {
    return String(value || "")
      .replace(/\u00a0/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function isSupportedPage() {
    const path = window.location.pathname;
    return (
      path.startsWith("/reel/") ||
      path.startsWith("/reels/") ||
      path.startsWith("/p/") ||
      path.startsWith("/tv/")
    );
  }

  function isReel() {
    const path = window.location.pathname;
    return path.startsWith("/reel/") || path.startsWith("/reels/");
  }

  function metaContent(property) {
    const el =
      document.querySelector(`meta[property="${property}"]`) ||
      document.querySelector(`meta[name="${property}"]`);
    return cleanText(el?.getAttribute("content"));
  }

  function findUsername() {
    const ogTitle = metaContent("og:title");
    const titleMatch = ogTitle.match(/^([^•(@]+)\s*[(@]/);
    if (titleMatch?.[1]) return cleanText(titleMatch[1]).slice(0, 150);

    const links = Array.from(document.querySelectorAll('a[href^="/"]'));
    for (const link of links) {
      const href = link.getAttribute("href") || "";
      const parts = href.split("/").filter(Boolean);

      if (
        parts.length === 1 &&
        !["explore", "accounts", "direct", "reels", "reel", "p"].includes(parts[0])
      ) {
        const text = cleanText(link.textContent);
        if (text && text.length <= 150) return text;
      }
    }

    return "";
  }

  function findCaption() {
    const description =
      metaContent("og:description") ||
      metaContent("description");

    if (description) return description.slice(0, 8000);

    const article = document.querySelector("article");
    if (article instanceof HTMLElement) {
      return cleanText(article.innerText).slice(0, 8000);
    }

    return "";
  }

  function isUsableHttpUrl(value) {
    if (!value) return false;
    try {
      const url = new URL(value, window.location.href);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch {
      return false;
    }
  }

  function findCreativeMedia() {
    // Open Graph est généralement plus stable que le DOM React d'Instagram.
    const ogVideo =
      metaContent("og:video") ||
      metaContent("og:video:url") ||
      metaContent("og:video:secure_url");

    if (isUsableHttpUrl(ogVideo)) {
      return { url: ogVideo, type: "video" };
    }

    for (const video of document.querySelectorAll("video")) {
      const urls = [
        video.currentSrc,
        video.src,
        video.getAttribute("src"),
        video.querySelector("source")?.src
      ];

      for (const url of urls) {
        if (isUsableHttpUrl(url)) return { url, type: "video" };
      }
    }

    if (isReel()) {
      return { url: "", type: "video" };
    }

    const ogImage = metaContent("og:image");
    if (isUsableHttpUrl(ogImage)) {
      return { url: ogImage, type: "image" };
    }

    const images = Array.from(document.querySelectorAll("article img, main img"))
      .map((img) => {
        const rect = img.getBoundingClientRect();
        const width = img.naturalWidth || rect.width || 0;
        const height = img.naturalHeight || rect.height || 0;
        const url = img.currentSrc || img.src || img.getAttribute("data-src") || "";
        return { url, width, height, area: width * height };
      })
      .filter((x) => isUsableHttpUrl(x.url) && x.width >= 150 && x.height >= 150)
      .sort((a, b) => b.area - a.area);

    if (images[0]?.url) return { url: images[0].url, type: "image" };

    return { url: "", type: isReel() ? "video" : "unknown" };
  }

  function encodePayload(data) {
    const json = JSON.stringify(data);
    return window.btoa(
      encodeURIComponent(json).replace(/%([0-9A-F]{2})/g, (_, hex) =>
        String.fromCharCode(parseInt(hex, 16))
      )
    );
  }

  function extractData() {
    const creative = findCreativeMedia();

    return {
      sourcePlatform: "instagram",
      platform: "instagram",
      source: "extension",
      sourceUrl: window.location.href,
      advertiserName: findUsername(),
      adText: findCaption(),
      callToAction: "",
      landingPage: "",
      creativeUrl: creative.url,
      creativeType: creative.type,
      title: metaContent("og:title"),
      capturedAt: new Date().toISOString()
    };
  }

  function openInUgcGrowth() {
    const data = extractData();

    try {
      const params = new URLSearchParams({
        source: "extension",
        platform: "instagram",
        payload: encodePayload(data)
      });

      console.log(`[UGC Growth ${VERSION}] Instagram envoyé :`, data);

      window.open(
        `${APP_URL}/dashboard/import-ad?${params.toString()}`,
        "_blank"
      );
    } catch (error) {
      console.error("[UGC Growth] Impossible d’envoyer le contenu Instagram :", error);
      window.alert("UGC Growth n’a pas réussi à envoyer ce contenu Instagram.");
    }
  }

  function removeButton() {
    document.getElementById(WRAPPER_ID)?.remove();
  }

  function injectButton() {
    if (!isSupportedPage()) {
      removeButton();
      return;
    }

    if (document.getElementById(BUTTON_ID)) return;

    const wrapper = document.createElement("div");
    wrapper.id = WRAPPER_ID;
    wrapper.style.position = "fixed";
    wrapper.style.right = "20px";
    wrapper.style.bottom = "22px";
    wrapper.style.zIndex = "2147483647";

    const button = document.createElement("button");
    button.id = BUTTON_ID;
    button.type = "button";
    button.textContent = "✦ Analyser avec UGC Growth";
    button.style.border = "1px solid rgba(168,85,247,.45)";
    button.style.borderRadius = "14px";
    button.style.padding = "12px 16px";
    button.style.background = "linear-gradient(135deg,#11111b,#6d28d9)";
    button.style.color = "#fff";
    button.style.fontWeight = "700";
    button.style.fontSize = "14px";
    button.style.cursor = "pointer";
    button.style.boxShadow = "0 12px 30px rgba(0,0,0,.28)";

    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      openInUgcGrowth();
    });

    wrapper.appendChild(button);
    document.documentElement.appendChild(wrapper);

    console.log(`[UGC Growth ${VERSION}] Bouton Instagram chargé.`);
  }

  let lastUrl = window.location.href;

  function refresh() {
    if (window.location.href !== lastUrl) {
      lastUrl = window.location.href;
      removeButton();
    }

    injectButton();
  }

  const observer = new MutationObserver(() => {
    clearTimeout(window.__ugcGrowthInstagramTimer);
    window.__ugcGrowthInstagramTimer = setTimeout(refresh, 200);
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });

  window.addEventListener("popstate", refresh);
  window.addEventListener("load", refresh);

  console.log(`[UGC Growth ${VERSION}] Script chargé.`);
  refresh();
})();
