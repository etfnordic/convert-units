document.addEventListener("DOMContentLoaded", () => {
  const ingredientEl = document.getElementById("ingredient");
  const amountEl = document.getElementById("amount");
  const fromEl = document.getElementById("fromUnit");
  const toEl = document.getElementById("toUnit");
  const swapBtn = document.getElementById("swapBtn");
  const resultMain = document.getElementById("resultMain");
  const resultSub = document.getElementById("resultSub");

  // Restrict typing + allow formulas/constants (uses engine helpers)
  amountEl.addEventListener("input", () => {
    const cleaned = sanitizeExpressionInput(amountEl.value);
    if (cleaned !== amountEl.value) amountEl.value = cleaned;
  });

  function parseVal(s) {
    const v = evalMathExpression((s || "").trim());
    return Number.isFinite(v) ? v : NaN;
  }

  // Unit definitions
  const units = [
    { type:"group", label:"— Volume —" },
    { key:"tsp", label:"Teaspoon (tsp)", kind:"vol", factorToML: 4.92892159375, symbol:"tsp" },
    { key:"tbsp", label:"Tablespoon (tbsp)", kind:"vol", factorToML: 14.78676478125, symbol:"tbsp" },
    { key:"floz", label:"Fluid ounce (US fl oz)", kind:"vol", factorToML: 29.5735295625, symbol:"fl oz" },
    { key:"cup", label:"Cup (US)", kind:"vol", factorToML: 236.5882365, symbol:"cup" },
    { key:"ml", label:"Milliliter (mL)", kind:"vol", factorToML: 1, symbol:"mL" },
    { key:"l", label:"Liter (L)", kind:"vol", factorToML: 1000, symbol:"L" },

    { type:"group", label:"— Mass —" },
    { key:"g", label:"Gram (g)", kind:"mass", factorToG: 1, symbol:"g" },
    { key:"kg", label:"Kilogram (kg)", kind:"mass", factorToG: 1000, symbol:"kg" },
    { key:"oz", label:"Ounce (oz)", kind:"mass", factorToG: 28.349523125, symbol:"oz" },
    { key:"lb", label:"Pound (lb)", kind:"mass", factorToG: 453.59237, symbol:"lb" }
  ];

  // Ingredient densities (approx): grams per US cup
  const ingredients = [
    { key:"water", name:"Water", gPerCup: 236.5882365 },
    { key:"milk", name:"Milk", gPerCup: 245 },
    { key:"flour", name:"All-purpose flour", gPerCup: 120 },
    { key:"sugar", name:"Granulated sugar", gPerCup: 200 },
    { key:"brown_sugar", name:"Brown sugar (packed)", gPerCup: 220 },
    { key:"butter", name:"Butter", gPerCup: 227 },
    { key:"rice", name:"Rice (uncooked)", gPerCup: 185 },
    { key:"honey", name:"Honey", gPerCup: 340 },
    { key:"olive_oil", name:"Olive oil", gPerCup: 215 }
  ];

  // Populate ingredient dropdown
  ingredients.forEach(i => ingredientEl.add(new Option(i.name, i.key)));
  ingredientEl.value = "water";

  // Populate unit dropdowns with group headers
  function fillUnits(selectEl) {
    selectEl.innerHTML = "";
    units.forEach(u => {
      if (u.type === "group") {
        const opt = document.createElement("option");
        opt.textContent = u.label;
        opt.disabled = true;
        opt.value = "";
        selectEl.appendChild(opt);
      } else {
        selectEl.add(new Option(u.label, u.key));
      }
    });
  }
  fillUnits(fromEl);
  fillUnits(toEl);

  fromEl.value = "cup";
  toEl.value = "g";

  function getUnit(key) {
    return units.find(u => u.key === key);
  }
  function getIngredient(key) {
    return ingredients.find(i => i.key === key);
  }

  // Convert helpers
  function toML(value, unit) {
    return value * unit.factorToML;
  }
  function toG(value, unit) {
    return value * unit.factorToG;
  }

  function convert(value, fromUnit, toUnit, ingredient) {
    if (fromUnit.kind === "vol" && toUnit.kind === "vol") {
      const ml = toML(value, fromUnit);
      return ml / toUnit.factorToML;
    }

    if (fromUnit.kind === "mass" && toUnit.kind === "mass") {
      const g = toG(value, fromUnit);
      return g / toUnit.factorToG;
    }

    // Cross conversion needs density
    const gPerCup = ingredient.gPerCup;
    const mlPerCup = 236.5882365;
    const densityGPerML = gPerCup / mlPerCup; // g/mL

    if (fromUnit.kind === "vol" && toUnit.kind === "mass") {
      const ml = toML(value, fromUnit);
      const g = ml * densityGPerML;
      return g / toUnit.factorToG;
    }

    if (fromUnit.kind === "mass" && toUnit.kind === "vol") {
      const g = toG(value, fromUnit);
      const ml = g / densityGPerML;
      return ml / toUnit.factorToML;
    }

    return NaN;
  }

  function fmt(n) {
    if (!Number.isFinite(n)) return "";
    return n.toLocaleString(undefined, { maximumFractionDigits: 8 });
  }

  function doConvert() {
    const expr = amountEl.value.trim();
    if (!expr) {
      resultMain.textContent = "Result will appear here…";
      resultSub.textContent = "Enter a value to convert.";
      return;
    }

    const value = parseVal(expr);
    if (!Number.isFinite(value)) {
      resultMain.textContent = "Result will appear here…";
      resultSub.textContent = "Invalid expression.";
      return;
    }

    const fromUnit = getUnit(fromEl.value);
    const toUnit = getUnit(toEl.value);
    const ing = getIngredient(ingredientEl.value);

    if (!fromUnit || !toUnit || !ing) {
      resultMain.textContent = "Result will appear here…";
      resultSub.textContent = "Choose valid options.";
      return;
    }

    const out = convert(value, fromUnit, toUnit, ing);
    if (!Number.isFinite(out)) {
      resultMain.textContent = "Result will appear here…";
      resultSub.textContent = "Conversion not available.";
      return;
    }

    resultMain.textContent = `${fmt(out)} ${toUnit.symbol}`;
    resultSub.textContent = `${ing.name} • ${fmt(value)} ${fromUnit.symbol} → ${fmt(out)} ${toUnit.symbol}`;
  }

  amountEl.addEventListener("input", doConvert);
  ingredientEl.addEventListener("change", doConvert);
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
