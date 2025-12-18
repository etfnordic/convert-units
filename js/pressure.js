const pressureConfig = {
  defaultFrom:"bar",
  defaultTo:"psi",
  units:[
    {key:"pa", label:"Pascal (Pa)", symbol:"Pa"},
    {key:"kpa", label:"Kilopascal (kPa)", symbol:"kPa"},
    {key:"mpa", label:"Megapascal (MPa)", symbol:"MPa"},
    {key:"bar", label:"Bar (bar)", symbol:"bar"},
    {key:"atm", label:"Standard atmosphere (atm)", symbol:"atm"},
    {key:"psi", label:"Pounds per square inch (psi)", symbol:"psi"},
    {key:"mmhg", label:"Millimeter of mercury (mmHg)", symbol:"mmHg"}
  ],
  unitMap:{
    pa:{factor:1, symbol:"Pa"},
    kpa:{factor:1000, symbol:"kPa"},
    mpa:{factor:1000000, symbol:"MPa"},
    bar:{factor:100000, symbol:"bar"},
    atm:{factor:101325, symbol:"atm"},
    psi:{factor:6894.757293168, symbol:"psi"},
    mmhg:{factor:133.322387415, symbol:"mmHg"}
  }
};
setupFactorConverter(pressureConfig);
