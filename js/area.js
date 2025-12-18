const areaConfig = {
  defaultFrom:"m2",
  defaultTo:"ft2",
  units:[
    {key:"mm2", label:"Square millimeter (mm²)", symbol:"mm²"},
    {key:"cm2", label:"Square centimeter (cm²)", symbol:"cm²"},
    {key:"m2",  label:"Square meter (m²)", symbol:"m²"},
    {key:"km2", label:"Square kilometer (km²)", symbol:"km²"},
    {key:"ft2", label:"Square foot (ft²)", symbol:"ft²"},
    {key:"yd2", label:"Square yard (yd²)", symbol:"yd²"},
    {key:"acre",label:"Acre", symbol:"acre"},
    {key:"ha",  label:"Hectare (ha)", symbol:"ha"}
  ],
  unitMap:{
    mm2:{factor:1e-6, symbol:"mm²"},
    cm2:{factor:1e-4, symbol:"cm²"},
    m2:{factor:1, symbol:"m²"},
    km2:{factor:1e6, symbol:"km²"},
    ft2:{factor:0.09290304, symbol:"ft²"},
    yd2:{factor:0.83612736, symbol:"yd²"},
    acre:{factor:4046.8564224, symbol:"acre"},
    ha:{factor:10000, symbol:"ha"}
  }
};
setupFactorConverter(areaConfig);
