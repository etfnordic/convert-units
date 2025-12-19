// ConverterBase - common engine for linear (factor-based) converters
// Supports: grouped dropdown headers, "1 = x" line, and math expressions in input
// Safe parser (no eval).

function formatNumber(n) {
  if (!Number.isFinite(n)) return "";
  return n.toLocaleString(undefined, { maximumFractionDigits: 10 });
}

function convertByFactors(value, fromFactor, toFactor) {
  return (value * fromFactor) / toFactor;
}

/**
 * Sanitizes input while typing:
 * allows digits, spaces, ., ,, + - * / ^ ( ) and letters for constants: pi, e, tau, phi
 * Also allows the symbol π.
 */
function sanitizeExpressionInput(s) {
  // Normalize decimal comma to dot later; keep comma allowed for typing.
  // Remove any disallowed characters.
  return s
    .replace(/[^0-9+\-*/^()., \tA-Za-zπ]/g, "")
    // Collapse repeated spaces
    .replace(/\s+/g, " ");
}

/**
 * Evaluate a math expression safely:
 * - operators: + - * / ^  (power is right-associative)
 * - parentheses
 * - constants: pi, π, e, tau, phi
 * - supports unary minus: -3, -(2+1)
 * - supports implicit multiplication: 2pi, 3(4+1), (2+1)(3+1), 2e
 */
function evalMathExpression(input) {
  if (typeof input !== "string") return NaN;

  let s = input.trim();
  if (!s) return NaN;

  // Normalize:
  // - decimal comma -> dot
  // - lowercase
  s = s.replace(/,/g, ".").toLowerCase();

  // Replace unicode pi with "pi"
  s = s.replace(/π/g, "pi");

  // Replace constants tokens with numbers later in tokenizer
  // Insert implicit multiplication:
  // number/constant/close-paren followed by open-paren/constant/number => add "*"
  // Examples: 2pi -> 2*pi, 3( -> 3*(, )( -> )*(, pi2 -> pi*2
  s = s
    .replace(/(\d|\bpi\b|\be\b|\btau\b|\bphi\b|\))\s*(\(|\d|\bpi\b|\be\b|\btau\b|\bphi\b)/g, "$1*$2");

  // Tokenize
  const tokens = tokenizeExpression(s);
  if (!tokens || tokens.length === 0) return NaN;

  // Shunting-yard to RPN
  const rpn = toRPN(tokens);
  if (!rpn) return NaN;

  // Evaluate RPN
  const value = evalRPN(rpn);
  return value;
}

function tokenizeExpression(s) {
  const tokens = [];
  let i = 0;

  const isDigit = (c) => c >= "0" && c <= "9";
  const isAlpha = (c) => (c >= "a" && c <= "z");

  while (i < s.length) {
    const c = s[i];

    // Skip whitespace
    if (c === " " || c === "\t" || c === "\n") {
      i++;
      continue;
    }

    // Number (supports decimals)
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

    // Constants (pi, e, tau, phi)
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

      if (!(name in constants)) return null; // unknown identifier
      tokens.push({ type: "num", value: constants[name] });
      continue;
    }

    // Parentheses
    if (c === "(" || c === ")") {
      tokens.push({ type: "paren", value: c });
      i++;
      continue;
    }

    // Operators
    if ("+-*/^".includes(c)) {
      tokens.push({ type: "op", value: c });
      i++;
      continue;
    }

    // Anything else => invalid
    return null;
  }

  // Handle unary minus by converting it to a special operator "u-"
  // Rule: a '-' is unary if it appears at start OR after an operator OR after '('
  const out = [];
  for (let j = 0; j < tokens.length; j++) {
    const t = tokens[j];
    if (t.type === "op" && t.value === "-") {
      const prev = out[out.length - 1];
      const unary = !prev || (prev.type === "op") || (prev.type === "paren" && prev.value === "(");
      if (unary) {
        out.push({ type: "op", value: "u-" });
        continue;
      }
    }
    out.push(t);
  }

  return out;
}

function toRPN(tokens) {
  const output = [];
  const stack = [];

  const prec = {
    "u-": 5,
    "^": 4,
    "*": 3,
    "/": 3,
    "+": 2,
    "-": 2
  };
  const rightAssoc = {
    "^": true,
    "u-": true
  };

  for (const t of tokens) {
    if (t.type === "num") {
      output.push(t);
      continue;
    }

    if (t.type === "op") {
      while (stack.length) {
        const top = stack[stack.length - 1];
        if (top.type !== "op") break;

        const pTop = prec[top.value];
        const pT = prec[t.value];
        const shouldPop =
          (rightAssoc[t.value] ? pT < pTop : pT <= pTop);

        if (!shouldPop) break;
        output.push(stack.pop());
      }
      stack.push(t);
      continue;
    }

    if (t.type === "paren" && t.value === "(") {
      stack.push(t);
      continue;
    }

    if (t.type === "paren" && t.value === ")") {
      let foundOpen = false;
      while (stack.length) {
        const top = stack.pop();
        if (top.type === "paren" && top.value === "(") {
          foundOpen = true;
          break;
        }
        output.push(top);
      }
      if (!foundOpen) return null; // mismatched parens
      continue;
    }

    return null;
  }

  while (stack.length) {
    const top = stack.pop();
    if (top.type === "paren") return null; // mismatched parens
    output.push(top);
  }

  return output;
}

function evalRPN(rpn) {
  const stack = [];

  for (const t of rpn) {
    if (t.type === "num") {
      stack.push(t.value);
      continue;
    }

    if (t.type === "op") {
      if (t.value === "u-") {
        if (stack.length < 1) return NaN;
        const a = stack.pop();
        stack.push(-a);
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

/**
 * config = {
 *   defaultFrom, defaultTo,
 *   units: [ {type:"group", label:"— Metric —"}, {key,label,symbol} ... ],
 *   unitMap: { key:{factor, symbol} ... }
 * }
 */
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

  // ✅ Restrict typing to allowed characters (but still allow formulas/constants)
  amountEl.addEventListener("input", () => {
    const cleaned = sanitizeExpressionInput(amountEl.value);
    if (cleaned !== amountEl.value) amountEl.value = cleaned;
  });

  // Populate dropdowns (supports group headers)
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

  // Set defaults (fallback to first enabled option)
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
      resultSub.textContent = "Invalid expression. Try: 8+4, 2^4, 2*pi.";
      return;
    }

    const fromKey = fromEl.value;
    const toKey = toEl.value;

    const from = config.unitMap[fromKey];
    const to = config.unitMap[toKey];

    if (!from || !to) {
      resultMain.textContent = "Result will appear here…";
      resultSub.textContent = "Choose valid units.";
      return;
    }

    // Main conversion
    const res = convertByFactors(value, from.factor, to.factor);
    resultMain.textContent = `${formatNumber(res)} ${to.symbol}`;

    // ✅ Always show 1 = x (linear converters)
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
