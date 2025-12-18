document.addEventListener("DOMContentLoaded", () => {
  const amountEl = document.getElementById("amount"); // vi använder som "height cm"
  const weightEl = document.getElementById("weightInput");
  const resultMain = document.getElementById("resultMain");
  const resultSub = document.getElementById("resultSub");

  function calc(){
    const h = Number(amountEl.value.trim().replace(",", "."));
    const w = Number(weightEl.value.trim().replace(",", "."));
    if(!Number.isFinite(h) || !Number.isFinite(w) || h<=0 || w<=0){
      resultMain.textContent="Result will appear here…";
      resultSub.textContent="Enter height and weight.";
      return;
    }
    const m = h/100;
    const bmi = w/(m*m);
    resultMain.textContent = `BMI: ${bmi.toFixed(1)}`;

    let cat="Normal";
    if(bmi<18.5) cat="Underweight";
    else if(bmi<25) cat="Normal";
    else if(bmi<30) cat="Overweight";
    else cat="Obesity";

    resultSub.textContent = `Category: ${cat}`;
  }

  amountEl.addEventListener("input", calc);
  weightEl.addEventListener("input", calc);
  calc();
});

