function formatNumber(n) {
  if (!Number.isFinite(n)) return "";
  // max 8 decimaler men trimma onödiga nollor
  return n.toLocaleString(undefined, { maximumFractionDigits: 8 });
}

function convertByFactors(value, fromFactor, toFactor) {
  // bas = value * fromFactor; result = bas / toFactor
  return (value * fromFactor) / toFactor;
}

function setupFactorConverter(config) {
  const amountEl = document.getElementById("amount");
  const fromEl = document.getElementById("fromUnit");
  const toEl = document.getElementById("toUnit");
  const resultMain = document.getElementById("resultMain");
  const resultSub = document.getElementById("resultSub");
  const swapBtn = document.getElementById("swapBtn");

  // fyll dropdowns
  config.units.forEach(u => {
    const o1 = document.createElement("option");
    o1.value = u.key;
    o1.textContent = u.label;
    fromEl.appendChild(o1);

    const o2 = document.createElement("option");
    o2.value = u.key;
    o2.textContent = u.label;
    toEl.appendChild(o2);
  });

  fromEl.value = config.defaultFrom;
  toEl.value = config.defaultTo;

 function doConvert() {
  const raw = amountEl.value.trim().replace(",", ".");
  const value = Number(raw);

  const from = config.unitMap[fromEl.value];
  const to = config.unitMap[toEl.value];

  // If input is empty/invalid
  if (!raw || !Number.isFinite(value)) {
    resultMain.textContent = "Result will appear here…";
    resultSub.textContent = "Enter a value to convert.";
    return;
  }

  // Main result (user value)
  const res = convertByFactors(value, from.factor, to.factor);
  resultMain.textContent = `${formatNumber(res)} ${to.symbol}`;

  // ✅ Always show 1 = x
  const res1 = convertByFactors(1, from.factor, to.factor);
  resultSub.textContent = `1 ${from.symbol} = ${formatNumber(res1)} ${to.symbol}`;
}


    const fromKey = fromEl.value;
    const toKey = toEl.value;

    const from = config.unitMap[fromKey];
    const to = config.unitMap[toKey];

    const res = convertByFactors(value, from.factor, to.factor);

    resultMain.textContent = `${formatNumber(res)} ${to.symbol}`;
    resultSub.textContent = `${formatNumber(value)} ${from.symbol} = ${formatNumber(res)} ${to.symbol}`;
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
}

