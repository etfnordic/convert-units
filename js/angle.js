const angleConfig = {
  defaultFrom:"deg",
  defaultTo:"rad",
  units:[
    {key:"deg", label:"Degree (°)", symbol:"°"},
    {key:"rad", label:"Radian (rad)", symbol:"rad"},
    {key:"grad",label:"Gradian (gon)", symbol:"gon"},
    {key:"turn",label:"Turn (rev)", symbol:"turn"}
  ],
  unitMap:{
    deg:{factor:Math.PI/180, symbol:"°"},
    rad:{factor:1, symbol:"rad"},
    grad:{factor:Math.PI/200, symbol:"gon"},
    turn:{factor:2*Math.PI, symbol:"turn"}
  }
};
setupFactorConverter(angleConfig);
