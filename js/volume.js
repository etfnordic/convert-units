const volumeConfig = {
  defaultFrom:"l",
  defaultTo:"gal_us",
  units:[
    {key:"ml", label:"Milliliter (mL)", symbol:"mL"},
    {key:"l",  label:"Liter (L)", symbol:"L"},
    {key:"m3", label:"Cubic meter (m³)", symbol:"m³"},
    {key:"tsp",label:"Teaspoon (tsp)", symbol:"tsp"},
    {key:"tbsp",label:"Tablespoon (tbsp)", symbol:"tbsp"},
    {key:"cup_us",label:"Cup (US)", symbol:"cup"},
    {key:"pt_us",label:"Pint (US)", symbol:"pt"},
    {key:"qt_us",label:"Quart (US)", symbol:"qt"},
    {key:"gal_us",label:"Gallon (US)", symbol:"gal"}
  ],
  unitMap:{
    ml:{factor:0.001, symbol:"mL"},
    l:{factor:1, symbol:"L"},
    m3:{factor:1000, symbol:"m³"},
    tsp:{factor:0.00492892159375, symbol:"tsp"},
    tbsp:{factor:0.01478676478125, symbol:"tbsp"},
    cup_us:{factor:0.2365882365, symbol:"cup"},
    pt_us:{factor:0.473176473, symbol:"pt"},
    qt_us:{factor:0.946352946, symbol:"qt"},
    gal_us:{factor:3.785411784, symbol:"gal"}
  }
};
setupFactorConverter(volumeConfig);
