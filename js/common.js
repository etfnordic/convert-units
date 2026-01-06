/* ConverterBase common utilities */

(function () {
  // Year in footer
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  // Copy helper (for converter pages)
  window.cbCopyText = async function (text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (e) {
      // fallback
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
        document.body.removeChild(ta);
        return true;
      } catch (err) {
        document.body.removeChild(ta);
        return false;
      }
    }
  };

  // Read querystring (used for deep-links from homepage search)
  window.cbGetQuery = function () {
    const params = new URLSearchParams(location.search);
    const obj = {};
    for (const [k, v] of params.entries()) obj[k] = v;
    return obj;
  };

  // Best-effort prefill for standard converter pages (amount/from/to)
  window.cbPrefill = function () {
    const q = window.cbGetQuery();
    if (!q) return;

    const amountEl = document.getElementById("amount");
    const fromEl = document.getElementById("fromUnit");
    const toEl = document.getElementById("toUnit");

    if (amountEl && typeof q.v !== "undefined") amountEl.value = q.v;
    if (fromEl && q.f) fromEl.value = q.f;
    if (toEl && q.t) toEl.value = q.t;

    // For date-difference page
    const sd = document.getElementById("startDate");
    const ed = document.getElementById("endDate");
    if (sd && q.start) sd.value = q.start;
    if (ed && q.end) ed.value = q.end;
  };
})();
