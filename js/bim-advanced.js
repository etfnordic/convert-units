document.addEventListener("DOMContentLoaded", () => {
  const unitSystem = document.getElementById("unitSystem");
  const sexEl = document.getElementById("sex");
  const ageEl = document.getElementById("age");

  const metricFields = document.getElementById("metricFields");
  const imperialFields = document.getElementById("imperialFields");

  const heightCm = document.getElementById("heightCm");
  const weightKg = document.getElementById("weightKg");

  const heightFt = document.getElementById("heightFt");
  const heightIn = document.getElementById("heightIn");
  const weightLb = document.getElementById("weightLb");

  const resultMain = document.getElementById("resultMain");
  const resultSub = document.getElementById("resultSub");

  // Quick sanity check (if any ID is wrong, we want to know)
  const required = { unitSystem, sexEl, ageEl, metricFields, imperialFields, heightCm, weightKg, heightFt, heightIn, weightLb, resultMain, resultSub };
  for (const [k, v] of Object.entries(required)) {
    if (!v) {
      console.error("BMI: missing element:", k);
      return;
    }
  }

  // ---- Parsing helpers ----
  // If your converter-engine.js provides evalMathExpression / sanitizeExpressionInput, use them.
  // Otherwise fallback to simple numeric parsing (so BMI ALWAYS works).
  const hasEval = typeof window.evalMathExpression === "function";
  const hasSan = typeof window.sanitizeExpressionInput === "function";

  function sanitizeInput(el) {
    el.addEventListener("input", () => {
      if (hasSan) {
        const cleaned = window.sanitizeExpressionInput(el.value);
        if (cleaned !== el.value) el.value = cleaned;
      } else {
        // fallback: allow digits, comma/dot, + - * / ^ ( ) and spaces
        el.value = el.value.replace(/[^0-9+\-*/^()., \t]/g, "");
      }
      calc();
    });
  }

  function parseVal(s) {
    const str = (s || "").trim();
    if (!str) return NaN;

    if (hasEval) {
      const v = window.evalMathExpression(str);
      return Number.isFinite(v) ? v : NaN;
    }

    // fallback numeric parse (comma -> dot)
    const v = Number(str.replace(",", "."));
    return Number.isFinite(v) ? v : NaN;
  }

  function bmiCategory(bmi) {
    if (bmi < 18.5) return "Underweight";
    if (bmi < 25) return "Normal";
    if (bmi < 30) return "Overweight";
    return "Obesity";
  }

  // Optional body fat estimate (approx)
  // BF% ≈ 1.20*BMI + 0.23*Age − 10.8*Sex − 5.4   (male=1, female=0)
  function bodyFatEstimate(bmi, age, sex) {
    if (!Number.isFinite(age) || age <= 0) return null;
    const sexNum = (sex === "male") ? 1 : 0;
    const bf = 1.2 * bmi + 0.23 * age - 10.8 * sexNum - 5.4;
    return Number.isFinite(bf) ? bf : null;
  }

  function setVisibility() {
    const sys = unitSystem.value;
    metricFields.style.display = sys === "metric" ? "" : "none";
    imperialFields.style.display = sys === "imperial" ? "" : "none";
  }

  function calc() {
    setVisibility();

    const sys = unitSystem.value;
    const sex = sexEl.value;
    const age = parseVal(ageEl.value);

    let hMeters = NaN;
    let wKg = NaN;

    if (sys === "metric") {
      const hCm = parseVal(heightCm.value);
      const kg = parseVal(weightKg.value);

      if (Number.isFinite(hCm) && hCm > 0) hMeters = hCm / 100;
      if (Number.isFinite(kg) && kg > 0) wKg = kg;
    } else {
      // ✅ allow either field:
      // - only feet filled -> inches = 0
      // - only inches filled -> feet = 0
      // - both -> combine
      const ft = parseVal(heightFt.value);
      const inch = parseVal(heightIn.value);
      const lb = parseVal(weightLb.value);

      const ftSafe = (Number.isFinite(ft) && ft >= 0) ? ft : 0;
      const inSafe = (Number.isFinite(inch) && inch >= 0) ? inch : 0;

      const totalIn = ftSafe * 12 + inSafe;
      if (totalIn > 0) hMeters = totalIn * 0.0254;

      if (Number.isFinite(lb) && lb > 0) wKg = lb * 0.45359237;
    }

    if (!Number.isFinite(hMeters) || hMeters <= 0 || !Number.isFinite(wKg) || wKg <= 0) {
      resultMain.textContent = "Result will appear here…";
      resultSub.textContent = "Enter your height and weight.";
      return;
    }

    const bmi = wKg / (hMeters * hMeters);
    const cat = bmiCategory(bmi);

    resultMain.textContent = `BMI: ${bmi.toFixed(1)} (${cat})`;

    const bf = bodyFatEstimate(bmi, age, sex);
    if (bf === null) {
      resultSub.textContent = "Tip: add age to estimate body fat % (approx.).";
    } else {
      resultSub.textContent = `Estimated body fat: ${bf.toFixed(1)}% (approx.)`;
    }
  }

  // Events
  unitSystem.addEventListener("change", calc);
  sexEl.addEventListener("change", calc);

  // Sanitize + recalc on input
  [ageEl, heightCm, weightKg, heightFt, heightIn, weightLb].forEach(sanitizeInput);

  // Initial
  calc();
});
