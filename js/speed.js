const speedConfig = {
  defaultFrom:"kmh", defaultTo:"mph",
  units:[
    {key:"ms", label:"Meters per second (m/s)", symbol:"m/s"},
    {key:"kmh",label:"Kilometers per hour (km/h)",symbol:"km/h"},
    {key:"mph",label:"Miles per hour (mph)",symbol:"mph"},
    {key:"fts",label:"Feet per second (ft/s)",symbol:"ft/s"},
    {key:"knot",label:"Knots (kn)",symbol:"kn"},
  ],
  // base = m/s 
  unitMap:{
    ms:{factor:1, symbol:"m/s"},
    kmh:{factor:0.2777777778, symbol:"km/h"},
    mph:{factor:0.44704, symbol:"mph"},
    fts:{factor:3.2808399, symbol:"ft/s"},
    knot:{factor:0.514444, symbol:"kn"},
  }
};
setupFactorConverter(speedConfig);

