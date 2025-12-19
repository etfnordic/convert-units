const weightConfig = {
  defaultFrom: "kg",
  defaultTo: "lb",
  units: [
    { type: "group", label: "— Metric —" },
    { key: "ug", label: "Microgram (µg)", symbol: "µg" },
    { key: "mg", label: "Milligram (mg)", symbol: "mg" },
    { key: "g",  label: "Gram (g)", symbol: "g" },
    { key: "kg", label: "Kilogram (kg)", symbol: "kg" },
    { key: "t",  label: "Metric ton (t)", symbol: "t" },

    { type: "group", label: "— Imperial —" },
    { key: "oz", label: "Ounce (oz)", symbol: "oz" },
    { key: "lb", label: "Pound (lb)", symbol: "lb" },
    { key: "st", label: "Stone (st)", symbol: "st" }
  ],

  // base = kg
  unitMap: {
    // Metric
    ug: { factor: 1e-9, symbol: "µg" },      // 1 µg = 1e-9 kg
    mg: { factor: 1e-6, symbol: "mg" },      // 1 mg = 1e-6 kg
    g:  { factor: 0.001, symbol: "g" },      // 1 g  = 0.001 kg
    kg: { factor: 1, symbol: "kg" },         // 1 kg = 1 kg
    t:  { factor: 1000, symbol: "t" },       // 1 t  = 1000 kg

    // Imperial
    oz: { factor: 0.028349523125, symbol: "oz" }, // 1 oz = 0.028349523125 kg
    lb: { factor: 0.45359237, symbol: "lb" },     // 1 lb = 0.45359237 kg
    st: { factor: 6.35029318, symbol: "st" }      // 1 st = 14 lb = 6.35029318 kg
  }
};

setupFactorConverter(weightConfig);
