function formatNumber(n) {
  if (!Number.isFinite(n)) return "";
  return n.toLocaleString(undefined, { maximumFractionDigits: 8 });
}

function convertByFactors(value, fromFactor, toFactor) {
  return (value * fromFactor) / toFactor;
}

function setupFactorConverter(config) {
  const amountEl = document.getElementById("amount");
  const fromEl = document.getElementById("fromUnit");
  const toEl = document.getElementById("toUnit");
  const resultMain = document.getElementById("resultMain");
  const resultSub = document.getElementById("resultSub");
  const swapBtn = document.getElementById("swapBtn");

  // Populate dropdowns
  fromEl.innerHTML = "";
  toEl.innerHTML = "";
  config.units.forEach((u) => {
    fromEl.add(new Option(u.label, u.key));
    toEl.add(new Option(u.label, u.key));
  });

  fromEl.value = config.defaultFrom;
  toEl.value = config.defaultTo;

  function doConvert() {
    const raw = amountEl.value.trim().replace(",", ".");
    const value = Number(raw);

    if (!raw || !Number.isFinite(value)) {
      resultMain.textContent = "Result will appear here…";
      resultSub.textContent = "Enter a value to convert.";
      return;
    }

    const from = config.unitMap[fromEl.value];
    const to = config.unitMap[toEl.value];

    const res = convertByFactors(value, from.factor, to.factor);
    resultMain.textContent = `${formatNumber(res)} ${to.symbol}`;

    // ✅ Always show 1 = x
    const res1 = convertByFactors(1, from.factor, to.factor);
    resultSub.textContent = `1 ${from.symbol} = ${formatNumber(res1)} ${to.symbol}`;
  }

  amountEl.addEventListener("input", doConvert);
  fromEl.addEventListener("change", doConvert);
  toEl.addEventListener("change", doConvert);

  if (swapBtn) {
    swapBtn.addEventListener("click", () => {
      const a = fromEl.value;
      fromEl.value = toEl.value;
      toEl.value = a;
      doConvert();
    });
  }

  // Run once
  doConvert();
}
