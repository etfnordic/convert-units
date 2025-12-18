document.addEventListener("DOMContentLoaded", () => {
  const amountEl = document.getElementById("amount");
  const fromEl = document.getElementById("fromUnit");
  const toEl = document.getElementById("toUnit");
  const main = document.getElementById("resultMain");
  const sub = document.getElementById("resultSub");
  const swapBtn = document.getElementById("swapBtn");

  // Convert via base: L/100km
  const units = [
    { key:"l100", label:"Liters per 100 km (L/100km)", symbol:"L/100km" },
    { key:"kml",  label:"Kilometers per liter (km/L)", symbol:"km/L" },
    { key:"mpg_us", label:"Miles per gallon (US MPG)", symbol:"mpg (US)" },
    { key:"mpg_uk", label:"Miles per gallon (UK MPG)", symbol:"mpg (UK)" }
  ];

  units.forEach(u => {
    fromEl.add(new Option(u.label, u.key));
    toEl.add(new Option(u.label, u.key));
  });

  fromEl.value = "l100";
  toEl.value = "mpg_us";

  function toL100(value, unit){
    if (!Number.isFinite(value) || value <= 0) return NaN;
    if (unit === "l100") return value;
    if (unit === "kml") return 100 / value;
    if (unit === "mpg_us") return 235.214583 / value;
    if (unit === "mpg_uk") return 282.480936 / value;
    return NaN;
  }

  function fromL100(l100, unit){
    if (!Number.isFinite(l100) || l100 <= 0) return NaN;
    if (unit === "l100") return l100;
    if (unit === "kml") return 100 / l100;
    if (unit === "mpg_us") return 235.214583 / l100;
    if (unit === "mpg_uk") return 282.480936 / l100;
    return NaN;
  }

  function fmt(n){
    if(!Number.isFinite(n)) return "";
    return n.toLocaleString(undefined, { maximumFractionDigits: 6 });
  }

  function doConvert(){
    const raw = amountEl.value.trim().replace(",", ".");
    const v = Number(raw);

    if(!raw || !Number.isFinite(v) || v <= 0){
      main.textContent = "Result will appear here…";
      sub.textContent = "Enter a value greater than 0.";
      return;
    }

    const l100 = toL100(v, fromEl.value);
    const out = fromL100(l100, toEl.value);

    const fromSym = units.find(x => x.key === fromEl.value).symbol;
    const toSym = units.find(x => x.key === toEl.value).symbol;

    main.textContent = `${fmt(out)} ${toSym}`;
    sub.textContent = `${fmt(v)} ${fromSym} = ${fmt(out)} ${toSym}`;
  }

  amountEl.addEventListener("input", doConvert);
  fromEl.addEventListener("change", doConvert);
  toEl.addEventListener("change", doConvert);
  swapBtn.addEventListener("click", () => {
    const a = fromEl.value;
    fromEl.value = toEl.value;
    toEl.value = a;
    doConvert();
  });

  doConvert();
});
