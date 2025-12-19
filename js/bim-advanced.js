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

  // Reuse your safe input sanitizer (from converter-engine.js)
  const sanitize = (el) => {
    el.addEventListener("input", () => {
      const cleaned = sanitizeExpressionInput(el.value);
      if (cleaned !== el.value) el.value = cleaned;
    });
  };

  [ageEl, heightCm, weightKg, heightFt, heightIn, weightLb].forEach(sanitize);

  function parseVal(s) {
    const v = evalMathExpression((s || "").trim());
    return Number.isFinite(v) ? v : NaN;
  }

  function bmiCategory(bmi) {
    if (bmi < 18.5) return "Underweight";
    if (bmi < 25) return "Normal";
    if (bmi < 30) return "Overweight";
    return "Obesity";
  }

  // Optional: Deurenberg body fat estimate (needs age + sex)
  // BF% ≈ 1.20*BMI + 0.23*Age − 10.8*Sex − 5.4  (Sex: male=1, female=0)
  function bodyFatEstimate(bmi, age, sex) {
    if (!Number.isFinite(age) || age <= 0) return null;
    const sexNum = (sex === "male") ? 1 : 0;
    const bf = 1.2 * bmi + 0.23 * age - 10.8 * sexNum - 5.4;
    return Number.isFinite(bf) ? bf : null;
  }

  function updateVisibility() {
    const sys = unitSystem.value;
    metricFields.style.display = sys === "metric" ? "" : "none";
    imperialFields.style.display = sys === "imperial" ? "" : "none";
    calc();
  }

  function calc() {
    const sys = unitSystem.value;
    const sex = sexEl.value;

    const age = parseVal(ageEl.value);

    let hMeters = NaN;
    let wKg = NaN;

    if (sys === "metric") {
      const hCm = parseVal(heightCm.value);
      const kg = parseVal(weightKg.value);

      if (Number.isFinite(hCm) && hCm > 0) hMeters = hCm / 100;
      wKg = kg;
    } else {
      const ft = parseVal(heightFt.value);
      const inch = parseVal(heightIn.value);
      const lb = parseVal(weightLb.value);

      if (Number.isFinite(ft) && ft >= 0 && Number.isFinite(inch) && inch >= 0) {
        const totalIn = ft * 12 + inch;
        if (totalIn > 0) hMeters = totalIn * 0.0254;
      }
      if (Number.isFinite(lb)) wKg = lb * 0.45359237;
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
      resultSub.textContent = "Tip: add age to estimate body fat %.";
    } else {
      resultSub.textContent = `Estimated body fat: ${bf.toFixed(1)}% (approx.)`;
    }
  }

  unitSystem.addEventListener("change", updateVisibility);
  sexEl.addEventListener("change", calc);

  [ageEl, heightCm, weightKg, heightFt, heightIn, weightLb].forEach(el => {
    el.addEventListener("input", calc);
  });

  updateVisibility();
});
