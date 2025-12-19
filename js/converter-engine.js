// ConverterBase - common engine for linear (factor-based) converters
// Supports grouped dropdown headers, "1 = x", and math expressions safely (no eval)

function formatNumber(n) {
  if (!Number.isFinite(n)) return "";
  return n.toLocaleString(undefined, { maximumFractionDigits: 10 });
}

function convertByFactors(value, fromFactor, toFactor) {
  return (value * fromFactor) / toFactor;
}

function sanitizeExpressionInput(s) {
  return s
    .replace(/[^0-9+\-*/^()., \tA-Za-zπ]/g, "")
    .replace(/\s+/g, " ");
}

function evalMathExpression(input) {
  if (typeof input !== "string") return NaN;

  let s = input.trim();
  if (!s) return NaN;

  s = s.replace(/,/g, ".").toLowerCase();
  s = s.replace(/π/g, "pi");

  const tokens0 = tokenizeExpression(s);
  if (!tokens0 || tokens0.length === 0) return NaN;

  const tokens = insertImplicitMultiplication(tokens0);

  const rpn = toRPN(tokens);
  if (!rpn) return NaN;

  return evalRPN(rpn);
}

function tokenizeExpression(s) {
  const tokens = [];
  let i = 0;

  const isDigit = (c) => c >= "0" && c <= "9";
  const isAlpha = (c) => c >= "a" && c <= "z";

  while (i < s.length) {
    const c = s[i];

    if (c === " " || c === "\t" || c === "\n") { i++; continue; }

    // number (multi-digit + decimal)
    if (isDigit(c) || c === ".") {
      let start = i;
      i++;
      while (i < s.length && (isDigit(s[i]) || s[i] === ".")) i++;

      const numStr = s.slice(start, i);
      const num = Number(numStr);
      if (!Number.isFinite(num)) return null;

      tokens.push({ type: "num", value: num });
      continue;
    }

    // identifiers -> constants
    if (isAlpha(c)) {
      let start = i;
      i++;
      while (i < s.length && isAlpha(s[i])) i++;

      const name = s.slice(start, i);
      const constants = {
        pi: Math.PI,
        e: Math.E,
        tau: Math.PI * 2,
        phi: (1 + Math.sqrt(5)) / 2
      };
      if (!(name in constants)) return null;

      tokens.push({ type: "num", value: constants[name] });
      continue;
    }

    if (c === "(" || c === ")") {
      tokens.push({ type: "paren", value: c });
      i++;
      continue;
    }

    if ("+-*/^".includes(c)) {
      tokens.push({ type: "op", value: c });
      i++;
      continue;
    }

    return null;
  }

  // unary minus -> u-
  const out = [];
  for (let j = 0; j < tokens.length; j++) {
    const t = tokens[j];
    if (t.type === "op" && t.value === "-") {
      const prev = out[out.length - 1];
      const unary = !prev || prev.type === "op" || (prev.type === "paren" && prev.value === "(");
      if (unary) { out.push({ type: "op", value: "u-" }); continue; }
    }
    out.push(t);
  }

  return out;
}

// ✅ Insert implicit multiplication SAFELY between tokens (not inside numbers)
function insertImplicitMultiplication(tokens) {
  const out = [];
  for (let i = 0; i < tokens.length; i++) {
    const a = tokens[i];
    const b = tokens[i + 1];

    out.push(a);

    if (!b) continue;

    const aIsNum = a.type === "num";
    const aIsClose = a.type === "paren" && a.value === ")";
    const bIsNum = b.type === "num";
    const bIsOpen = b.type === "paren" && b.value === "(";

    // Insert * for patterns like:
    // 2pi  -> num num
    // 2(   -> num (
    // )(   -> ) (
    // )2   -> ) num
    if ((aIsNum || aIsClose) && (bIsOpen || bIsNum)) {
      out.push({ type: "op", value: "*" });
    }
  }
  return out;
}

function toRPN(tokens) {
  const output = [];
  const stack = [];

  const prec = { "u-": 5, "^": 4, "*": 3, "/": 3, "+": 2, "-": 2 };
  const rightAssoc = { "^": true, "u-": true };

  for (const t of tokens) {
    if (t.type === "num") { output.push(t); continue; }

    if (t.type === "op") {
      while (stack.length) {
        const top = stack[stack.length - 1];
        if (top.type !== "op") break;

        const pTop = prec[top.value];
        const pT = prec[t.value];
        const shouldPop = rightAssoc[t.value] ? (pT < pTop) : (pT <= pTop);

        if (!shouldPop) break;
        output.push(stack.pop());
      }
      stack.push(t);
      continue;
    }

    if (t.type === "paren" && t.value === "(") { stack.push(t); continue; }

    if (t.type === "paren" && t.value === ")") {
      let foundOpen = false;
      while (stack.length) {
        const top = stack.pop();
        if (top.type === "paren" && top.value === "(") { foundOpen = true; break; }
        output.push(top);
      }
      if (!foundOpen) return null;
      continue;
    }

    return null;
  }

  while (stack.length) {
    const top = stack.pop();
    if (top.type === "paren") return null;
    output.push(top);
  }
  return output;
}

function evalRPN(rpn) {
  const stack = [];

  for (const t of rpn) {
    if (t.type === "num") { stack.push(t.value); continue; }

    if (t.type === "op") {
      if (t.value === "u-") {
        if (stack.length < 1) return NaN;
        stack.push(-stack.pop());
        continue;
      }

      if (stack.length < 2) return NaN;
      const b = stack.pop();
      const a = stack.pop();

      let res = NaN;
      switch (t.value) {
        case "+": res = a + b; break;
        case "-": res = a - b; break;
        case "*": res = a * b; break;
        case "/": res = a / b; break;
        case "^": res = Math.pow(a, b); break;
      }
      if (!Number.isFinite(res)) return NaN;
      stack.push(res);
      continue;
    }
    return NaN;
  }

  return stack.length === 1 ? stack[0] : NaN;
}

function setupFactorConverter(config) {
  const amountEl = document.getElementById("amount");
  const fromEl = document.getElementById("fromUnit");
  const toEl = document.getElementById("toUnit");
  const resultMain = document.getElementById("resultMain");
  const resultSub = document.getElementById("resultSub");
  const swapBtn = document.getElementById("swapBtn");

  if (!amountEl || !fromEl || !toEl || !resultMain || !resultSub) {
    console.error("Converter engine: Missing required DOM elements.");
    return;
  }

  amountEl.addEventListener("input", () => {
    const cleaned = sanitizeExpressionInput(amountEl.value);
    if (cleaned !== amountEl.value) amountEl.value = cleaned;
  });

  fromEl.innerHTML = "";
  toEl.innerHTML = "";

  config.units.forEach((u) => {
    if (u.type === "group") {
      const g1 = document.createElement("option");
      g1.textContent = u.label;
      g1.disabled = true;
      g1.value = "";
      fromEl.appendChild(g1);

      const g2 = document.createElement("option");
      g2.textContent = u.label;
      g2.disabled = true;
      g2.value = "";
      toEl.appendChild(g2);
      return;
    }
    fromEl.add(new Option(u.label, u.key));
    toEl.add(new Option(u.label, u.key));
  });

  const firstFrom = Array.from(fromEl.options).find(o => !o.disabled);
  const firstTo = Array.from(toEl.options).find(o => !o.disabled);

  fromEl.value = (config.defaultFrom && config.unitMap[config.defaultFrom]) ? config.defaultFrom : (firstFrom ? firstFrom.value : "");
  toEl.value = (config.defaultTo && config.unitMap[config.defaultTo]) ? config.defaultTo : (firstTo ? firstTo.value : "");

  function doConvert() {
    const expr = amountEl.value.trim();

    if (!expr) {
      resultMain.textContent = "Result will appear here…";
      resultSub.textContent = "Enter a value to convert.";
      return;
    }

    const value = evalMathExpression(expr);

    if (!Number.isFinite(value)) {
      resultMain.textContent = "Result will appear here…";
      resultSub.textContent = "Invalid expression.";
      return;
    }

    const from = config.unitMap[fromEl.value];
    const to = config.unitMap[toEl.value];

    if (!from || !to) {
      resultMain.textContent = "Result will appear here…";
      resultSub.textContent = "Choose valid units.";
      return;
    }

    const res = convertByFactors(value, from.factor, to.factor);
    resultMain.textContent = `${formatNumber(res)} ${to.symbol}`;

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

  doConvert();
}
