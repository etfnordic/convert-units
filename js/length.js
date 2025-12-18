const lengthConfig = {
  defaultFrom: "m",
  defaultTo: "in",
  units: [
    { key:"mm", label:"Millimeter (mm)", symbol:"mm" },
    { key:"cm", label:"Centimeter (cm)", symbol:"cm" },
    { key:"m",  label:"Meter (m)", symbol:"m" },
    { key:"km", label:"Kilometer (km)", symbol:"km" },
    { key:"in", label:"Inch (in)", symbol:"in" },
    { key:"ft", label:"Foot (ft)", symbol:"ft" },
    { key:"yd", label:"Yard (yd)", symbol:"yd" },
    { key:"mi", label:"Mile (mi)", symbol:"mi" },
  ],
  // factors to a base unit (meters)
  unitMap: {
    mm:{ factor:0.001, symbol:"mm" },
    cm:{ factor:0.01,  symbol:"cm" },
    m: { factor:1,     symbol:"m"  },
    km:{ factor:1000,  symbol:"km" },
    in:{ factor:0.0254,symbol:"in" },
    ft:{ factor:0.3048,symbol:"ft" },
    yd:{ factor:0.9144,symbol:"yd" },
    mi:{ factor:1609.344, symbol:"mi" },
  }
};

setupFactorConverter(lengthConfig);

