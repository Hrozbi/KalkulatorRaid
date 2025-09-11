let HEROES = [];
let ITEMS = [];

// Загружаем героев
fetch("heroes.json")
  .then(r => r.json())
  .then(data => {
    HEROES = data;
    initHeroes();
  });

// Загружаем предметы
fetch("items.json")
  .then(r => r.json())
  .then(data => {
    ITEMS = data;
  });

function initHeroes(){
  const heroSel = document.getElementById("hero");
  heroSel.innerHTML = "";
  HEROES.forEach(h=>{
    const o = document.createElement("option");
    o.value = h.id; 
    o.textContent = h.name;
    heroSel.appendChild(o);
  });

  document.getElementById("run").addEventListener("click", runPicker);
  document.getElementById("reset").addEventListener("click", resetForm);
  document.getElementById("export").addEventListener("click", exportJSON);
}

function parseExtraWeight(input){
  if(!input) return 0;
  const v = parseFloat(input.replace(",", "."));
  return isNaN(v)?0:v;
}

function runPicker(){
  const heroId = document.getElementById("hero").value;
  const mode = document.getElementById("mode").value;
  const extraSpd = parseExtraWeight(document.getElementById("w_speed").value);
  const extraAcc = parseExtraWeight(document.getElementById("w_acc").value);

  const hero = HEROES.find(h=>h.id===heroId);
  if(!hero) return alert("Выберите героя");

  const summaryTitle = document.getElementById("summaryTitle");
  const summaryDesc = document.getElementById("summaryDesc");
  summaryTitle.textContent = `Подбор для ${hero.name}`;
  summaryDesc.textContent = `Режим: ${mode} · Роль: ${hero.role}`;

  const resultsArea = document.getElementById("resultsArea");
  resultsArea.innerHTML = "";
  ITEMS.forEach(it => {
    const div = document.createElement("div");
    div.className = "slot";
    div.textContent = it.name + " (" + JSON.stringify(it.stats) + ")";
    resultsArea.appendChild(div);
  });
}

function resetForm(){
  document.getElementById("hero").selectedIndex = 0;
  document.getElementById("mode").value = "clan_boss";
  document.getElementById("w_speed").value = "";
  document.getElementById("w_acc").value = "";
  document.getElementById("resultsArea").innerHTML = "";
  document.getElementById("summaryTitle").textContent = "Результат";
  document.getElementById("summaryDesc").textContent = "Выбери героя и режим";
}

function exportJSON(){
  const data = {heroes:HEROES, items:ITEMS, date:new Date().toISOString()};
  const blob = new Blob([JSON.stringify(data, null, 2)], {type:"application/json"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "export.json";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
