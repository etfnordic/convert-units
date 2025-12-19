<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>BMI Calculator – Metric & Imperial</title>
  <meta name="description" content="Free BMI calculator for metric and imperial units. Includes optional body fat estimate using age and sex." />
  <link rel="stylesheet" href="css/style.css" />
</head>
<body>
  <header class="header">
    <div class="container header-inner">
      <div class="brand">
        <h1>ConverterBase</h1>
        <p>BMI Calculator (Metric + Imperial)</p>
      </div>
      <nav class="nav">
        <a class="chip" href="index.html">Home</a>
        <a class="chip" href="about.html">About</a>
        <a class="chip" href="contact.html">Contact</a>
        <a class="chip" href="privacy-policy.html">Privacy</a>
      </nav>
    </div>
  </header>

  <div class="ad-slot">Ad slot (top). Replace with AdSense later.</div>

  <main class="container">
    <section class="section converter">
      <h1>BMI Calculator</h1>

      <div class="form-row">
        <label for="unitSystem">Unit system</label>
        <select id="unitSystem">
          <option value="metric">Metric (cm, kg)</option>
          <option value="imperial">Imperial (ft/in, lb)</option>
        </select>
      </div>

      <div class="form-row">
        <label for="sex">Sex</label>
        <select id="sex">
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
      </div>

      <div class="form-row">
        <label for="age">Age (optional – improves body fat estimate)</label>
        <input id="age" inputmode="decimal" placeholder="e.g. 28" />
      </div>

      <!-- Metric inputs -->
      <div id="metricFields">
        <div class="form-row">
          <label for="heightCm">Height (cm)</label>
          <input id="heightCm" inputmode="decimal" placeholder="e.g. 180" />
        </div>

        <div class="form-row">
          <label for="weightKg">Weight (kg)</label>
          <input id="weightKg" inputmode="decimal" placeholder="e.g. 75" />
        </div>
      </div>

      <!-- Imperial inputs -->
      <div id="imperialFields" style="display:none;">
        <div class="form-row">
          <label>Height (ft / in)</label>
          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px;">
            <input id="heightFt" inputmode="decimal" placeholder="ft (e.g. 5)" />
            <input id="heightIn" inputmode="decimal" placeholder="in (e.g. 11)" />
          </div>
        </div>

        <div class="form-row">
          <label for="weightLb">Weight (lb)</label>
          <input id="weightLb" inputmode="decimal" placeholder="e.g. 165" />
        </div>
      </div>

      <div class="result" aria-live="polite">
        <strong id="resultMain">Result will appear here…</strong>
        <span id="resultSub">Enter your height and weight.</span>
      </div>
    </section>

    <div class="ad-slot">Ad slot (after result). Replace with AdSense later.</div>

    <section class="section">
      <h3>How BMI works</h3>
      <p style="color:var(--muted); line-height:1.7; margin:0;">
        BMI = weight (kg) / height² (m²). BMI is a screening tool and does not directly measure body fat or health.
      </p>
    </section>
  </main>

  <footer class="footer">
    <div class="container">
      © <span id="year"></span> ConverterBase • <a href="privacy-policy.html">Privacy Policy</a>
    </div>
  </footer>

  <!-- Use engine for math-input parsing (8+4, 2^4, pi, etc.) -->
  <script src="js/common.js"></script>
  <script src="js/converter-engine.js"></script>
  <script src="js/bmi-advanced.js"></script>
</body>
</html>
