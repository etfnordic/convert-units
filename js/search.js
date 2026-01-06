(function () {
  const input = document.getElementById("smartSearch");
  const out = document.getElementById("quickResult");
  const outMain = document.getElementById("qrMain");
  const outSub = document.getElementById("qrSub");

  if (!input || !out || !outMain || !outSub) return;

  const unitMap = {
    // length
    m: { cat: "length", unit: "m" }, meter: { cat: "length", unit: "m" }, meters: { cat: "length", unit: "m" },
    cm: { cat: "length", unit: "cm" }, mm:{cat:"length", unit:"mm"}, km:{cat:"length", unit:"km"},
    in: { cat: "length", unit: "in" }, inch: { cat: "length", unit: "in" }, inches: { cat: "length", unit: "in" },
    ft: { cat: "length", unit: "ft" }, foot: { cat: "length", unit: "ft" }, feet: { cat: "length", unit: "ft" },
    yd: { cat: "length", unit: "yd" }, yard: { cat: "length", unit: "yd" }, yards: { cat: "length", unit: "yd" },
    mi: { cat: "length", unit: "mi" }, mile: { cat: "length", unit: "mi" }, miles: { cat: "length", unit: "mi" },

    // weight
    kg: { cat: "weight", unit: "kg" }, g: { cat: "weight", unit: "g" }, mg:{cat:"weight", unit:"mg"},
    lb: { cat: "weight", unit: "lb" }, lbs: { cat: "weight", unit: "lb" }, pound: { cat: "weight", unit: "lb" }, pounds: { cat: "weight", unit: "lb" },
    oz: { cat: "weight", unit: "oz" }, ounce: { cat: "weight", unit: "oz" }, ounces: { cat: "weight", unit: "oz" },

    // temperature
    c: { cat: "temperature", unit: "c" }, "°c": { cat: "temperature", unit: "c" }, celsius: { cat: "temperature", unit: "c" },
    f: { cat: "temperature", unit: "f" }, "°f": { cat: "temperature", unit: "f" }, fahrenheit: { cat: "temperature", unit: "f" },
    k: { cat: "temperature", unit: "k" }, kelvin: { cat: "temperature", unit: "k" },

    // speed
    "kmh": { cat: "speed", unit: "kmh" }, "km/h": { cat: "speed", unit: "kmh" },
    mph: { cat: "speed", unit: "mph" },
    "ms": { cat: "speed", unit: "ms" }, "m/s": { cat: "speed", unit: "ms" },

    // time
    s: { cat: "time", unit: "s" }, sec:{cat:"time", unit:"s"}, second:{cat:"time", unit:"s"}, seconds:{cat:"time", unit:"s"},
    min: { cat: "time", unit: "min" }, minute: { cat: "time", unit: "min" }, minutes:{cat:"time", unit:"min"},
    h: { cat: "time", unit: "h" }, hr:{cat:"time", unit:"h"}, hour:{cat:"time", unit:"h"}, hours:{cat:"time", unit:"h"},
    day: { cat: "time", unit: "day" }, days:{cat:"time", unit:"day" }
  };

  const prettyCat = {
    length: "Length Converter",
    weight: "Weight Converter",
    temperature: "Temperature Converter",
    speed: "Speed Converter",
    time: "Time Converter",
    volume: "Volume Converter",
    area: "Area Converter"
  };

  function normalizeUnit(u){
    return u.toLowerCase().replace(/\s+/g,"").replace(/°/g,"");
  }

  function showResult(main, sub){
    outMain.textContent = main;
    outSub.textContent = sub;
    out.style.display = "block";
  }

  function parseQuery(q){
    const m = q.trim().match(/^(-?\d+(?:\.\d+)?)\s*([a-zA-Z°\/]+)\s*(?:to|in)\s*([a-zA-Z°\/]+)$/i);
    if (!m) return null;
    return { v: m[1], from: normalizeUnit(m[2]), to: normalizeUnit(m[3]) };
  }

  function deepLink(cat, v, f, t){
    return `/converters/${cat}.html?v=${encodeURIComponent(v)}&f=${encodeURIComponent(f)}&t=${encodeURIComponent(t)}`;
  }

  let timer = null;
  input.addEventListener("input", () => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      const q = input.value;
      if (!q || q.trim().length < 3) { out.style.display="none"; return; }

      const p = parseQuery(q);
      if (!p) {
        showResult("Tip: try “15 km to miles”", "We’ll send you straight to the right converter.");
        out.removeAttribute("data-url");
        return;
      }
      const from = unitMap[p.from];
      const to = unitMap[p.to];
      if (!from || !to || from.cat !== to.cat){
        showResult("We couldn’t match those units.", "Try common units like km, mi, kg, lb, °C, °F, mph.");
        out.removeAttribute("data-url");
        return;
      }

      const url = deepLink(from.cat, p.v, from.unit, to.unit);
      showResult(`Open ${prettyCat[from.cat]} →`, `${p.v} ${p.from} to ${p.to}. Press Enter to open.`);
      out.setAttribute("data-url", url);
    }, 120);
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const url = out.getAttribute("data-url");
      if (url) location.href = url;
    }
  });

  out.addEventListener("click", () => {
    const url = out.getAttribute("data-url");
    if (url) location.href = url;
  });
})();
