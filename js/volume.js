const volumeConfig = {
  defaultFrom: "l",
  defaultTo: "gal_us",
  units: [
    { type: "group", label: "— Metric —" },
    { key: "mm3", label: "Cubic millimeter (mm³)", symbol: "mm³" },
    { key: "ml",  label: "Milliliter (mL) (cm³)", symbol: "mL" },
    { key: "l",   label: "Liter (L) (dm³)", symbol: "L" },
    { key: "m3",  label: "Cubic meter (m³)", symbol: "m³" },

    { type: "group", label: "— US Customary —" },
    { key: "tsp", label: "Teaspoon (tsp)", symbol: "tsp" },
    { key: "tbsp", label: "Tablespoon (tbsp)", symbol: "tbsp" },
    { key: "floz_us", label: "Fluid ounce (US fl oz)", symbol: "fl oz" },
    { key: "cup_us", label: "Cup (US)", symbol: "cup" },
    { key: "pt_us", label: "Pint (US)", symbol: "pt" },
    { key: "qt_us", label: "Quart (US)", symbol: "qt" },
    { key: "gal_us", label: "Gallon (US)", symbol: "gal" },

    { type: "group", label: "— Imperial / UK —" },
    { key: "floz_uk", label: "Fluid ounce (UK fl oz)", symbol: "fl oz (UK)" },
    { key: "pt_uk", label: "Pint (UK)", symbol: "pt (UK)" },
    { key: "gal_uk", label: "Gallon (UK)", symbol: "gal (UK)" },

    { type: "group", label: "— Cubic units —" },
    { key: "in3", label: "Cubic inch (in³)", symbol: "in³" },
    { key: "ft3", label: "Cubic foot (ft³)", symbol: "ft³" },
    { key: "yd3", label: "Cubic yard (yd³)", symbol: "yd³" }
  ],

  // base = liter (L)
  unitMap: {
    // Metric
    mm3: { factor: 1e-6, symbol: "mm³" },     // 1 mm³ = 1e-6 mL = 1e-6 L? wait: 1 mm³ = 1e-6 L? No: 1 L = 1e6 mm³ -> so 1 mm³ = 1e-6 L ✅
    ml:  { factor: 0.001, symbol: "mL" },     // 1 mL = 0.001 L
    l:   { factor: 1, symbol: "L" },
    m3:  { factor: 1000, symbol: "m³" },      // 1 m³ = 1000 L

    // US Customary (in liters)
    tsp:     { factor: 0.00492892159375, symbol: "tsp" },
    tbsp:    { factor: 0.01478676478125, symbol: "tbsp" },
    floz_us: { factor: 0.0295735295625, symbol: "fl oz" },
    cup_us:  { factor: 0.2365882365, symbol: "cup" },
    pt_us:   { factor: 0.473176473, symbol: "pt" },
    qt_us:   { factor: 0.946352946, symbol: "qt" },
    gal_us:  { factor: 3.785411784, symbol: "gal" },

    // UK / Imperial (in liters)
    floz_uk: { factor: 0.0284130625, symbol: "fl oz (UK)" },
    pt_uk:   { factor: 0.56826125, symbol: "pt (UK)" },
    gal_uk:  { factor: 4.54609, symbol: "gal (UK)" },

    // Cubic units (in liters)
    in3: { factor: 0.016387064, symbol: "in³" },     // 1 in³ = 16.387064 mL
    ft3: { factor: 28.316846592, symbol: "ft³" },    // 1 ft³ = 28.316846592 L
    yd3: { factor: 764.554857984, symbol: "yd³" }    // 1 yd³ = 764.554857984 L
  }
};

setupFactorConverter(volumeConfig);
