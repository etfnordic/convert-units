const weightConfig = {
  defaultFrom:"kg", defaultTo:"lb",
  units:[
    {key:"g", label:"Gram (g)", symbol:"g"},
    {key:"kg",label:"Kilogram (kg)",symbol:"kg"},
    {key:"oz",label:"Ounce (oz)",symbol:"oz"},
    {key:"lb",label:"Pound (lb)",symbol:"lb"},
  ],
  // base = kg
  unitMap:{
    g:{factor:0.001, symbol:"g"},
    kg:{factor:1, symbol:"kg"},
    oz:{factor:0.028349523125, symbol:"oz"},
    lb:{factor:0.45359237, symbol:"lb"},
  }
};
setupFactorConverter(weightConfig);

