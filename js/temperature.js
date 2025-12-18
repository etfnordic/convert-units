function setupTemperatureConverter() {
  const amountEl = document.getElementById("amount");
  const fromEl = document.getElementById("fromUnit");
  const toEl = document.getElementById("toUnit");
  const resultMain = document.getElementById("resultMain");
  const resultSub = document.getElementById("resultSub");
  const swapBtn = document.getElementById("swapBtn");

  const units = [
    { key:"c", label:"Celsius (°C)", symbol:"°C" },
    { key:"f", label:"Fahrenheit (°F)", symbol:"°F" },
    { key:"k", label:"Kelvin (K)", symbol:"K" },
  ];

  units.forEach(u=>{
    fromEl.add(new Option(u.label, u.key));
    toEl.add(new Option(u.label, u.key));
  });
  fromEl.value="c"; toEl.value="f";

  function toC(v, unit){
    if(unit==="c") return v;
    if(unit==="f") return (v-32)*5/9;
    if(unit==="k") return v-273.15;
  }
  function fromC(c, unit){
    if(unit==="c") return c;
    if(unit==="f") return c*9/5+32;
    if(unit==="k") return c+273.15;
  }

  function doConvert(){
    const raw = amountEl.value.trim().replace(",", ".");
    const v = Number(raw);
    if(!raw || !Number.isFinite(v)){
      resultMain.textContent="Result will appear here…";
      resultSub.textContent="Enter a value to convert.";
      return;
    }
    const c = toC(v, fromEl.value);
    const out = fromC(c, toEl.value);
    const toSym = units.find(x=>x.key===toEl.value).symbol;
    const fromSym = units.find(x=>x.key===fromEl.value).symbol;

    resultMain.textContent = `${out.toFixed(4).replace(/\.?0+$/,"")} ${toSym}`;
    resultSub.textContent = `${v} ${fromSym} = ${out.toFixed(4).replace(/\.?0+$/,"")} ${toSym}`;
  }

  amountEl.addEventListener("input", doConvert);
  fromEl.addEventListener("change", doConvert);
  toEl.addEventListener("change", doConvert);
  swapBtn.addEventListener("click", ()=>{
    const a=fromEl.value; fromEl.value=toEl.value; toEl.value=a; doConvert();
  });
  doConvert();
}
setupTemperatureConverter();

