/* AdSense bootstrap:
   - Adds responsive AdSense ads if data-ad-slot is set on .ad-slot elements
   - Keeps placeholders visible in dev if slot IDs aren't configured.
*/
(function(){
  const client = "ca-pub-3468184357715504";
  const slots = document.querySelectorAll(".ad-slot[data-ad-slot]");
  if (!slots.length) return;

  // Ensure adsbygoogle.js is loaded (already in your HTML head, but this is safe)
  const existing = document.querySelector('script[src*="pagead/js/adsbygoogle.js"]');
  if (!existing) {
    const s = document.createElement("script");
    s.async = true;
    s.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=" + encodeURIComponent(client);
    s.crossOrigin = "anonymous";
    document.head.appendChild(s);
  }

  slots.forEach((host) => {
    const slotId = host.getAttribute("data-ad-slot");
    if (!slotId) return; // keep placeholder if not configured
    if (host.querySelector("ins.adsbygoogle")) return;

    const ins = document.createElement("ins");
    ins.className = "adsbygoogle";
    ins.style.display = "block";
    ins.setAttribute("data-ad-client", client);
    ins.setAttribute("data-ad-slot", slotId);
    ins.setAttribute("data-ad-format", "auto");
    ins.setAttribute("data-full-width-responsive", "true");

    // Reserve some height to reduce CLS
    if (!host.style.minHeight) host.style.minHeight = host.getAttribute("data-min-height") || "100px";

    host.innerHTML = "";
    host.appendChild(ins);

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {}
  });
})();
