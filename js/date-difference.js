document.addEventListener("DOMContentLoaded", () => {
  const s = document.getElementById("startDate");
  const e = document.getElementById("endDate");
  const main = document.getElementById("resultMain");
  const sub = document.getElementById("resultSub");

  function calc(){
    if(!s.value || !e.value){
      main.textContent="Result will appear here…";
      sub.textContent="Pick two dates.";
      return;
    }
    const sd = new Date(s.value);
    const ed = new Date(e.value);
    const diffMs = ed - sd;
    const days = Math.round(diffMs / (1000*60*60*24));

    main.textContent = `${days} day(s)`;
    sub.textContent = `${s.value} → ${e.value}`;
  }
  s.addEventListener("change", calc);
  e.addEventListener("change", calc);
  calc();
});

