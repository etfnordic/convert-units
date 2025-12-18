const timeConfig = {
  defaultFrom:"min",
  defaultTo:"h",
  units:[
    {key:"ms", label:"Millisecond (ms)", symbol:"ms"},
    {key:"s",  label:"Second (s)", symbol:"s"},
    {key:"min",label:"Minute (min)", symbol:"min"},
    {key:"h",  label:"Hour (h)", symbol:"h"},
    {key:"day",label:"Day", symbol:"day"},
    {key:"week",label:"Week", symbol:"week"}
  ],
  unitMap:{
    ms:{factor:0.001, symbol:"ms"},
    s:{factor:1, symbol:"s"},
    min:{factor:60, symbol:"min"},
    h:{factor:3600, symbol:"h"},
    day:{factor:86400, symbol:"day"},
    week:{factor:604800, symbol:"week"}
  }
};
setupFactorConverter(timeConfig);
