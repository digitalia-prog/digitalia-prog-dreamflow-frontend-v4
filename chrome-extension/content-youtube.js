(() => {
  "use strict";

  const VERSION = "youtube-direct-v1";
  const APP_URL = "https://ugcgrowth.io";
  const BUTTON_ID = "ugc-growth-youtube-button";
  const WRAPPER_ID = "ugc-growth-youtube-wrapper";

  function cleanText(value) {
    return String(value || "").replace(/\u00a0/g, " ").replace(/\s+/g, " ").trim();
  }

  function isSupportedPage() {
    return window.location.pathname === "/watch" || window.location.pathname.startsWith("/shorts/");
  }

  function getPlatform() {
    return window.location.pathname.startsWith("/shorts/") ? "youtube_shorts" : "youtube";
  }

  function getVideoId() {
    if (window.location.pathname.startsWith("/shorts/")) {
      return window.location.pathname.split("/").filter(Boolean)[1] || "";
    }
    try {
      return new URL(window.location.href).searchParams.get("v") || "";
    } catch {
      return "";
    }
  }

  function findTitle() {
    const selectors = [
      "h1.ytd-watch-metadata yt-formatted-string",
      "h1 yt-formatted-string",
      "h1"
    ];
    for (const selector of selectors) {
      const text = cleanText(document.querySelector(selector)?.textContent);
      if (text) return text.slice(0, 300);
    }
    return cleanText(document.title.replace(/\s*-\s*YouTube\s*$/i, "")).slice(0, 300);
  }

  function findChannelName() {
    const selectors = [
      "#owner #channel-name a",
      "#channel-name a",
      "ytd-channel-name a"
    ];
    for (const selector of selectors) {
      const text = cleanText(document.querySelector(selector)?.textContent);
      if (text) return text.slice(0, 150);
    }
    return "";
  }

  function findDescription() {
    const selectors = ["#description-inline-expander", "#description", "ytd-text-inline-expander"];
    for (const selector of selectors) {
      const text = cleanText(document.querySelector(selector)?.innerText);
      if (text) return text.slice(0, 8000);
    }
    return "";
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
    const platform = getPlatform();
    return {
      sourcePlatform: platform,
      platform,
      source: "extension",
      sourceUrl: window.location.href,
      advertiserName: findChannelName(),
      adText: findDescription(),
      callToAction: "",
      landingPage: "",
      creativeUrl: "",
      creativeType: "video",
      title: findTitle(),
      videoId: getVideoId(),
      capturedAt: new Date().toISOString()
    };
  }

  function openInUgcGrowth() {
    const data = extractData();
    const params = new URLSearchParams({
      source: "extension",
      platform: data.platform,
      payload: encodePayload(data)
    });
    console.log(`[UGC Growth ${VERSION}] YouTube envoyé :`, data);
    window.open(`${APP_URL}/dashboard/import-ad?${params.toString()}`, "_blank");
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
    console.log(`[UGC Growth ${VERSION}] Bouton YouTube chargé.`);
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
    clearTimeout(window.__ugcGrowthYoutubeTimer);
    window.__ugcGrowthYoutubeTimer = setTimeout(refresh, 200);
  });

  observer.observe(document.documentElement, { childList: true, subtree: true });
  window.addEventListener("yt-navigate-finish", refresh);
  window.addEventListener("popstate", refresh);
  window.addEventListener("load", refresh);

  console.log(`[UGC Growth ${VERSION}] Script chargé.`);
  refresh();
})();
