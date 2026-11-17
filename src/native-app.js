import { Capacitor } from "@capacitor/core";
import { App } from "@capacitor/app";
import { Haptics, ImpactStyle } from "@capacitor/haptics";
import { StatusBar, Style } from "@capacitor/status-bar";
import { SplashScreen } from "@capacitor/splash-screen";

const isNative = Capacitor.isNativePlatform();
if (isNative) {
  document.documentElement.classList.add("capacitor-native");
  document.body.classList.add("native-app");

  try {
    await StatusBar.setBackgroundColor({ color: "#101114" });
    await StatusBar.setStyle({ style: Style.Light });
    await SplashScreen.hide();
  } catch (error) {
    console.debug("Native system UI setup skipped:", error);
  }

  const nav = document.createElement("nav");
  nav.className = "native-bottom-nav";
  nav.setAttribute("aria-label", "Main navigation");
  nav.innerHTML = `
    <button type="button" data-native-nav="home" aria-current="page">
      <span class="native-nav-icon" aria-hidden="true">⌂</span><span>Home</span>
    </button>
    <button type="button" data-native-nav="catalog">
      <span class="native-nav-icon" aria-hidden="true">▦</span><span>Browse</span>
    </button>
    <button type="button" data-native-nav="quote">
      <span class="native-nav-icon" aria-hidden="true">▤</span><span>My quote <span class="native-nav-count" id="nativeQuoteCount">0</span></span>
    </button>`;
  document.body.appendChild(nav);

  const setActive = (name) => {
    nav.querySelectorAll("button").forEach((button) => {
      if (button.dataset.nativeNav === name) button.setAttribute("aria-current", "page");
      else button.removeAttribute("aria-current");
    });
  };
  const scrollTo = (selector, name) => {
    document.querySelector(selector)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setActive(name);
    Haptics.impact({ style: ImpactStyle.Light }).catch(() => {});
  };

  nav.addEventListener("click", (event) => {
    const button = event.target.closest("[data-native-nav]");
    if (!button) return;
    const target = button.dataset.nativeNav;
    if (target === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      setActive("home");
    } else if (target === "catalog") {
      scrollTo("#catalog", "catalog");
    } else {
      scrollTo("#quote", "quote");
    }
  });

  const updateQuoteCount = () => {
    const source = document.getElementById("cartCount");
    const target = document.getElementById("nativeQuoteCount");
    if (source && target) target.textContent = source.textContent || "0";
  };
  updateQuoteCount();
  new MutationObserver(updateQuoteCount).observe(document.getElementById("cartCount") || document.body, {
    childList: true, characterData: true, subtree: true
  });

  // The existing catalogue opens WhatsApp using window.open on the web.
  // In the Android build, navigate to the WhatsApp URL so Android can hand it to
  // WhatsApp (or the installed browser if WhatsApp is unavailable).
  const whatsappButton = document.getElementById("whatsapp");
  whatsappButton?.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();
    const cart = document.getElementById("cartCount")?.textContent || "0";
    if (cart === "0") {
      document.getElementById("toast") && (document.getElementById("toast").textContent = "Add a product first");
      return;
    }
    const message = typeof window.buildMessage === "function"
      ? window.buildMessage("request")
      : "GREYSTUDIO PRINT SERVICES\\nPlease confirm my quotation request in this chat.";
    const url = "https://wa.me/916281256601?text=" + encodeURIComponent(message);
    window.location.href = url;
  }, true);

  document.addEventListener("click", (event) => {
    if (event.target.closest(".add, [data-native-nav]")) {
      Haptics.impact({ style: ImpactStyle.Light }).catch(() => {});
    }
  }, true);

  App.addListener("backButton", ({ canGoBack }) => {
    const modal = document.getElementById("productImageModal");
    if (modal && modal.getAttribute("aria-hidden") === "false") {
      document.getElementById("closeProductImage")?.click();
      return;
    }
    if (canGoBack) {
      window.history.back();
      return;
    }
    if (window.scrollY > 80) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      setActive("home");
      return;
    }
    App.exitApp();
  });
}
