const storageKey = "tamago-paradise-state-v5";

const stages = [
  { id: "egg", label: "たまご", name: "たまご", need: 0, reward: 0, rarity: 1 },
  { id: "baby", label: "ベビー", name: "まめた", need: 1, reward: 6, rarity: 2 },
  { id: "kid", label: "星キッズ", name: "ほしっち", need: 5, reward: 14, rarity: 3 },
  { id: "teen", label: "ハート", name: "らぶっち", need: 11, reward: 24, rarity: 4 },
  { id: "adult", label: "ダイヤ", name: "きらっち", need: 20, reward: 38, rarity: 5 },
  { id: "champion", label: "クラウン", name: "ブレイブっち", need: 32, reward: 60, rarity: 7 },
  { id: "legend", label: "レジェンド", name: "ミラクルっち", need: 48, reward: 90, rarity: 10 },
  { id: "moon", label: "ムーン", name: "ルナっち", need: 68, reward: 130, rarity: 12 },
  { id: "flowerForm", label: "フラワー", name: "フローラっち", need: 92, reward: 180, rarity: 14 },
  { id: "dragon", label: "ドラゴン", name: "ドラゴっち", need: 122, reward: 240, rarity: 17 },
  { id: "cosmic", label: "コスモ", name: "コスモっち", need: 160, reward: 320, rarity: 21 },
];

const fieldProfiles = {
  land: {
    label: "陸",
    names: ["たまご", "まめた", "ほしっち", "らぶっち", "きらっち", "ブレイブっち", "ミラクルっち", "ルナっち", "フローラっち", "ドラゴっち", "コスモっち"],
  },
  sky: {
    label: "空",
    names: ["そらたま", "ふわた", "スターる", "ハートピヨ", "クラウディ", "スカイキング", "にじっち", "つきピヨ", "はなそら", "ウィングドラ", "ギャラピヨ"],
  },
  sea: {
    label: "海",
    names: ["うみたま", "ぷるた", "シェルっち", "ラブマリン", "ダイヤフィン", "オーシャン王", "アクアミラクル", "ムーンフィン", "サンゴっち", "シードラっち", "コスモマリン"],
  },
};

const petKeys = [
  "hatched",
  "age",
  "stage",
  "legendLevel",
  "evolveCount",
  "hunger",
  "happy",
  "energy",
  "clean",
  "sick",
  "sleeping",
  "poop",
  "color",
  "customName",
  "wins",
  "losses",
  "careMistakes",
  "battleLog",
];

const shopItems = {
  feast: { price: 24, kind: "stock" },
  cake: { price: 18, kind: "stock" },
  purpleDrink: { price: 88, kind: "stock" },
  blueDrink: { price: 88, kind: "stock" },
  yellowDrink: { price: 88, kind: "stock" },
  deepBlueDrink: { price: 88, kind: "stock" },
  greenDrink: { price: 88, kind: "stock" },
  redDrink: { price: 88, kind: "stock" },
  careCharm: { price: 1000, kind: "stock" },
  flower: { price: 28, kind: "decor" },
  star: { price: 45, kind: "decor" },
};

const itemLabels = {
  feast: { label: "ごちそう", icon: "🍱" },
  cake: { label: "ケーキ", icon: "🍰" },
  purpleDrink: { label: "紫になーる", swatch: "purple" },
  blueDrink: { label: "水色になーる", swatch: "blue" },
  yellowDrink: { label: "黄色になーる", swatch: "yellow" },
  deepBlueDrink: { label: "青になーる", swatch: "deep-blue" },
  greenDrink: { label: "緑になーる", swatch: "green" },
  redDrink: { label: "赤になーる", swatch: "red" },
  careCharm: { label: "ミスけし", icon: "✦" },
  flower: { label: "花", icon: "✿" },
  star: { label: "星", icon: "★" },
};

const defaultState = {
  hatched: false,
  age: 0,
  stage: 0,
  legendLevel: 0,
  evolveCount: 0,
  hunger: 58,
  happy: 58,
  energy: 70,
  clean: 78,
  coins: 10,
  sick: false,
  sleeping: false,
  poop: false,
  color: "normal",
  customName: "",
  field: "land",
  wins: 0,
  losses: 0,
  careMistakes: 0,
  pets: {},
  inventory: {
    feast: 0,
    cake: 0,
    purpleDrink: 0,
    blueDrink: 0,
    yellowDrink: 0,
    deepBlueDrink: 0,
    greenDrink: 0,
    redDrink: 0,
    careCharm: 0,
  },
  decor: [],
  battleLog: "まだ戦っていない",
  lastTick: Date.now(),
};

let state = loadState();
let glowingShell = 0;
let activeOpponent = null;
let activeMiniGame = null;
let audioCtx = null;
let bgmTimer = null;
let bgmOn = false;
let miniTimer = null;

const el = {
  pet: document.getElementById("petButton"),
  speech: document.getElementById("speech"),
  poop: document.getElementById("poop"),
  decorLayer: document.getElementById("decorLayer"),
  coins: document.getElementById("coins"),
  bgmBtn: document.getElementById("bgmBtn"),
  hunger: document.getElementById("hunger"),
  happy: document.getElementById("happy"),
  energy: document.getElementById("energy"),
  clean: document.getElementById("clean"),
  reset: document.getElementById("resetBtn"),
  screen: document.querySelector(".screen"),
  actions: document.querySelectorAll(".action"),
  shop: document.querySelectorAll(".shop-item"),
  inventory: document.querySelectorAll(".inventory-item"),
  shells: document.querySelectorAll(".shell"),
  fieldTabs: document.querySelectorAll(".field-tab"),
  battleNow: document.getElementById("battleNow"),
  panels: document.getElementById("panels"),
  activity: document.getElementById("activity"),
  activityTitle: document.getElementById("activityTitle"),
  activityBody: document.getElementById("activityBody"),
  closeActivity: document.getElementById("closeActivity"),
  stageLabel: document.getElementById("stageLabel"),
  petName: document.getElementById("petName"),
  nameInput: document.getElementById("nameInput"),
  saveName: document.getElementById("saveName"),
  xpBar: document.getElementById("xpBar"),
  evolveCount: document.getElementById("evolveCount"),
  wins: document.getElementById("wins"),
  mistakes: document.getElementById("mistakes"),
  feastCount: document.getElementById("feastCount"),
  cakeCount: document.getElementById("cakeCount"),
  purpleCount: document.getElementById("purpleCount"),
  blueCount: document.getElementById("blueCount"),
  yellowCount: document.getElementById("yellowCount"),
  deepBlueCount: document.getElementById("deepBlueCount"),
  greenCount: document.getElementById("greenCount"),
  redCount: document.getElementById("redCount"),
  careCharmCount: document.getElementById("careCharmCount"),
  battleLog: document.getElementById("battleLog"),
};

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey)) || {};
    return normalizeState(saved);
  } catch {
    return normalizeState({});
  }
}

function normalizeState(saved) {
  const normalized = {
    ...defaultState,
    ...saved,
    field: ["land", "sky", "sea"].includes(saved.field) ? saved.field : "land",
    inventory: { ...defaultState.inventory, ...(saved.inventory || {}) },
    decor: Array.isArray(saved.decor) ? saved.decor : [],
    pets: normalizePets(saved),
    lastTick: Date.now(),
  };
  loadActivePet(normalized, normalized.field);
  return normalized;
}

function defaultPet(field) {
  return {
    ...pickPetState(defaultState),
    battleLog: `${fieldProfiles[field].label}のキャラを育てよう`,
  };
}

function normalizePets(saved) {
  const pets = {};
  ["land", "sky", "sea"].forEach((field) => {
    pets[field] = { ...defaultPet(field), ...((saved.pets && saved.pets[field]) || {}) };
    pets[field].stage = Math.max(0, Math.min(stages.length - 1, Number(pets[field].stage) || 0));
    pets[field].legendLevel = Math.max(0, Number(pets[field].legendLevel) || 0);
  });
  if (!saved.pets && saved.hatched) {
    pets[saved.field || "land"] = { ...pets[saved.field || "land"], ...pickPetState(saved) };
  }
  return pets;
}

function pickPetState(source) {
  return petKeys.reduce((pet, key) => {
    pet[key] = source[key];
    return pet;
  }, {});
}

function saveActivePet() {
  state.pets[state.field] = pickPetState(state);
}

function loadActivePet(target, field) {
  Object.assign(target, target.pets[field]);
}

function saveState() {
  saveActivePet();
  localStorage.setItem(storageKey, JSON.stringify({ ...state, lastTick: Date.now() }));
}

function clamp(value) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function currentStage() {
  const base = stages[state.stage] || stages[0];
  const names = fieldProfiles[state.field].names;
  const endless = state.stage === stages.length - 1 && state.legendLevel > 0;
  return {
    ...base,
    label: endless ? `${base.label}+${state.legendLevel}` : base.label,
    speciesName: endless ? `${names[state.stage]}+${state.legendLevel}` : names[state.stage],
    name: state.customName || (endless ? `${names[state.stage]}+${state.legendLevel}` : names[state.stage]),
    reward: endless ? 100 + state.legendLevel * 35 : base.reward,
    rarity: endless ? base.rarity + state.legendLevel : base.rarity,
  };
}

function nextStage() {
  if (state.stage < stages.length - 1) return stages[state.stage + 1];
  return {
    id: "legend",
    label: `レジェンド+${state.legendLevel + 1}`,
    name: `${fieldProfiles[state.field].names[stages.length - 1]}+${state.legendLevel + 1}`,
    need: stages[stages.length - 1].need + (state.legendLevel + 1) * 18,
    reward: 100 + state.legendLevel * 35,
    rarity: 10 + state.legendLevel + 1,
  };
}

function progressPercent() {
  const next = nextStage();
  if (!next) return 100;
  const currentNeed =
    state.stage < stages.length - 1
      ? currentStage().need
      : stages[stages.length - 1].need + state.legendLevel * 18;
  const span = next.need - currentNeed;
  return clamp(((state.age - currentNeed) / span) * 100);
}

function cutenessScore() {
  return Math.max(0, Math.round(state.happy * 0.55 + state.clean * 0.3 + state.hunger * 0.15 - state.careMistakes * 4));
}

function careBonus() {
  return Math.max(0, 30 - state.careMistakes * 3);
}

function rarityScore() {
  return currentStage().rarity * 10;
}

function totalBattleScore() {
  return cutenessScore() + rarityScore() + careBonus() + state.wins * 3;
}

function moodText() {
  if (!state.hatched) return "タップして孵化！";
  if (state.sick) return `${currentStage().name}はちょっと体調が悪いみたい`;
  if (state.sleeping) return "すやすや... 起こすならもう一度ねるを押してね";
  if (state.poop) return "うんち掃除してほしい！";
  if (state.hunger < 25) return "おなかがぺこぺこ";
  if (state.happy < 25) return "いっしょに遊びたいな";
  if (state.energy < 20) return "ねむたい...";
  if (state.clean < 25) return "お手入れかおふろでさっぱりしたい";
  return `${currentStage().name}は次の進化を目指している`;
}

function render() {
  const stage = currentStage();
  el.pet.className = `pet-button ${stage.id} color-${state.color}`;
  el.pet.classList.toggle("sick", state.sick);
  el.pet.classList.toggle("sleeping", state.sleeping);
  el.poop.classList.toggle("hidden", !state.poop);
  el.screen.classList.remove("field-land", "field-sky", "field-sea");
  el.screen.classList.add(`field-${state.field}`);
  el.coins.textContent = state.coins;
  el.hunger.value = state.hunger;
  el.happy.value = state.happy;
  el.energy.value = state.energy;
  el.clean.value = state.clean;
  el.speech.textContent = moodText();
  el.stageLabel.textContent = stage.label;
  el.petName.textContent = stage.name;
  if (document.activeElement !== el.nameInput) {
    el.nameInput.value = state.customName || "";
    el.nameInput.placeholder = state.stage > 1 ? "名前を入力" : "進化後に名前";
  }
  el.xpBar.style.width = `${progressPercent()}%`;
  el.evolveCount.textContent = state.evolveCount;
  el.wins.textContent = state.wins;
  el.mistakes.textContent = state.careMistakes;
  el.feastCount.textContent = state.inventory.feast;
  el.cakeCount.textContent = state.inventory.cake;
  el.purpleCount.textContent = state.inventory.purpleDrink;
  el.blueCount.textContent = state.inventory.blueDrink;
  el.yellowCount.textContent = state.inventory.yellowDrink;
  el.deepBlueCount.textContent = state.inventory.deepBlueDrink;
  el.greenCount.textContent = state.inventory.greenDrink;
  el.redCount.textContent = state.inventory.redDrink;
  el.careCharmCount.textContent = state.inventory.careCharm;
  el.battleLog.textContent = state.battleLog;
  renderDecorations();
  el.shells.forEach((shell, index) => shell.classList.toggle("glow", index === glowingShell));
  el.fieldTabs.forEach((tab) => tab.classList.toggle("active", tab.dataset.field === state.field));
  saveState();
}

function renderDecorations() {
  if (!el.decorLayer) return;
  const positions = [
    { left: "14%", bottom: "28%" },
    { left: "24%", bottom: "18%" },
    { left: "72%", bottom: "24%" },
    { left: "82%", bottom: "36%" },
    { left: "38%", bottom: "13%" },
    { left: "60%", bottom: "16%" },
    { left: "18%", bottom: "46%" },
    { left: "76%", bottom: "52%" },
  ];
  el.decorLayer.innerHTML = state.decor
    .map((item, index) => {
      const pos = positions[index % positions.length];
      const type = item === "star" ? "star" : "flower";
      const symbol = type === "star" ? "★" : "✿";
      return `<span class="decor-piece ${type}" style="left:${pos.left};bottom:${pos.bottom}">${symbol}</span>`;
    })
    .join("");
}

function say(message) {
  el.speech.textContent = message;
  window.clearTimeout(say.timer);
  say.timer = window.setTimeout(render, 1800);
}

function ensureAudio() {
  const AudioCtor = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtor) return null;
  if (!audioCtx) audioCtx = new AudioCtor();
  if (audioCtx.state === "suspended") audioCtx.resume();
  return audioCtx;
}

function playTone(freq = 440, duration = 0.08, type = "sine", volume = 0.035) {
  const ctx = ensureAudio();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(volume, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + duration);
}

function startBgm() {
  if (bgmTimer) return;
  bgmOn = true;
  el.bgmBtn.classList.add("active");
  const notes = [392, 494, 523, 659, 587, 523, 494, 440];
  let index = 0;
  playTone(notes[index], 0.12, "triangle", 0.025);
  bgmTimer = window.setInterval(() => {
    index = (index + 1) % notes.length;
    playTone(notes[index], 0.12, "triangle", 0.025);
  }, 360);
}

function stopBgm() {
  bgmOn = false;
  el.bgmBtn.classList.remove("active");
  window.clearInterval(bgmTimer);
  bgmTimer = null;
}

function toggleBgm() {
  if (bgmOn) stopBgm();
  else startBgm();
}

function openActivity(title, html) {
  clearMiniTimer();
  el.activityTitle.textContent = title;
  el.activityBody.innerHTML = html;
  el.activity.classList.remove("hidden");
  el.panels.classList.add("hidden");
}

function closeActivity() {
  clearMiniTimer();
  el.activity.classList.add("hidden");
  el.panels.classList.remove("hidden");
  activeOpponent = null;
  activeMiniGame = null;
  render();
}

function clearMiniTimer() {
  window.clearInterval(miniTimer);
  miniTimer = null;
}

function startMiniCountdown(seconds, onExpire) {
  const endAt = Date.now() + seconds * 1000;
  const updateTimer = () => {
    const left = Math.max(0, Math.ceil((endAt - Date.now()) / 1000));
    const timerEl = document.getElementById("miniTimer");
    if (timerEl) timerEl.textContent = left;
    if (left <= 0) {
      clearMiniTimer();
      onExpire();
    }
  };
  updateTimer();
  miniTimer = window.setInterval(updateTimer, 250);
}

function miniResult(title, message, success) {
  clearMiniTimer();
  playTone(success ? 784 : 196, 0.13, success ? "triangle" : "sawtooth", 0.035);
  openActivity(
    title,
    `
      <div class="mini-outcome ${success ? "success" : "fail"}">
        <strong>${success ? "成功！" : "失敗..."}</strong>
        <span>${message}</span>
      </div>
      <div class="activity-actions single">
        <button class="primary-activity" data-activity="miniMenu" type="button">ミニゲーム一覧へ</button>
      </div>
    `,
  );
}

function ensureHatched() {
  if (!state.hatched) hatch();
}

function hatch() {
  if (state.hatched) return;
  state.hatched = true;
  state.stage = 1;
  state.age = stages[1].need;
  state.hunger = 72;
  state.happy = 82;
  state.energy = 76;
  state.clean = 90;
  addCoins(stages[1].reward);
  say("ぱかっ！まめたが生まれた！報酬で6コイン！");
  render();
}

function addCoins(amount) {
  state.coins = Math.max(0, state.coins + amount);
}

function addGrowth(amount) {
  state.age += amount;
  checkEvolution();
}

function rewardEvolution(stageIndex) {
  addCoins(currentStage().reward || stages[stageIndex].reward);
  state.evolveCount += 1;
}

function checkEvolution() {
  let evolved = false;
  while (state.age >= nextStage().need) {
    if (state.stage < stages.length - 1) {
      state.stage += 1;
    } else {
      state.legendLevel += 1;
    }
    rewardEvolution(state.stage);
    state.hunger = clamp(state.hunger + 16);
    state.happy = clamp(state.happy + 22);
    state.energy = clamp(state.energy + 18);
    state.clean = clamp(state.clean + 16);
    evolved = true;
  }
  if (evolved) {
    const stage = currentStage();
    state.battleLog = `${stage.name}に進化！報酬で${stage.reward}コイン`;
    say(`${stage.label}に進化！形も変わった！`);
  }
}

function spendStock(item) {
  if (state.inventory[item] < 1) {
    say("もちものにないよ。ショップで買おう");
    return false;
  }
  state.inventory[item] -= 1;
  return true;
}

function markCareMistake() {
  state.careMistakes += 1;
  state.happy = clamp(state.happy - 8);
}

function openFoodMenu() {
  ensureHatched();
  openActivity(
    "たべる",
    `
      <div class="choice-grid">
        <button data-food="free" type="button"><strong>無限ごはん</strong><span>いつでも食べられる</span></button>
        <button data-food="feast" type="button"><strong>ごちそう</strong><span>もちものを1つ使う</span></button>
        <button data-food="cake" type="button"><strong>おやつ</strong><span>ケーキを1つ使う</span></button>
      </div>
      <div class="result-box">買った食べ物は「つかう」でも使えるよ</div>
    `,
  );
}

function openUseMenu() {
  ensureHatched();
  const items = [
    ["feast", "ごちそう"],
    ["cake", "ケーキ"],
    ["purpleDrink", "紫になーる"],
    ["blueDrink", "水色になーる"],
    ["yellowDrink", "黄色になーる"],
    ["deepBlueDrink", "青になーる"],
    ["greenDrink", "緑になーる"],
    ["redDrink", "赤になーる"],
    ["careCharm", "ミスけし"],
  ];
  const itemButtons = items
    .map(([key, label]) => `<button data-use="${key}" type="button"><strong>${label}</strong><span>持ち数 ${state.inventory[key]}</span></button>`)
    .join("");
  openActivity(
    "つかう",
    `
      <div class="choice-grid use-grid">${itemButtons}</div>
      <div class="result-box">ショップで買ったアイテムをここから使えるよ</div>
    `,
  );
}

function openShopMenu() {
  ensureHatched();
  const order = ["feast", "cake", "purpleDrink", "blueDrink", "yellowDrink", "deepBlueDrink", "greenDrink", "redDrink", "careCharm", "flower", "star"];
  const buttons = order
    .map((key) => {
      const item = shopItems[key];
      const meta = itemLabels[key];
      const mark = meta.swatch ? `<span class="swatch ${meta.swatch}"></span>` : `<span>${meta.icon}</span>`;
      const owned = item.kind === "decor" ? state.decor.filter((decor) => decor === key).length : state.inventory[key];
      return `
        <button class="shop-item" data-buy="${key}" type="button">
          ${mark}
          <strong>${meta.label}</strong>
          <small>${item.price}コイン / 持ち数 ${owned}</small>
        </button>
      `;
    })
    .join("");
  openActivity(
    "ショップ",
    `
      <div class="shop activity-shop">${buttons}</div>
      <div class="result-box">買った花と星は、買った数だけフィールドにかざれるよ</div>
    `,
  );
}

function care(action) {
  ensureHatched();

  const blockedBySleep = state.sleeping && !["sleep", "medicine"].includes(action);
  if (blockedBySleep) {
    say("今は夢の中。あとでおせわしよう");
    return;
  }

  const moves = {
    foodMenu: () => openFoodMenu(),
    useMenu: () => openUseMenu(),
    shopMenu: () => openShopMenu(),
    earn: () => {
      addCoins(6);
      state.happy = clamp(state.happy + 3);
      addGrowth(0.45);
      say("おこづかいゲット！6コイン増えた");
    },
    feedFree: () => {
      state.hunger = clamp(state.hunger + 16);
      state.energy = clamp(state.energy + 3);
      state.poop = Math.random() < 0.25 ? true : state.poop;
      addGrowth(0.65);
      say("無限ごはんをもぐもぐ。進化に近づいた");
    },
    feedSpecial: () => useItem("feast"),
    snack: () => useItem("cake"),
    play: () => openPlayView(),
    miniMenu: () => openMiniMenu(),
    groom: () => {
      state.clean = clamp(state.clean + 36);
      state.happy = clamp(state.happy + 8);
      state.poop = false;
      state.careMistakes = Math.max(0, state.careMistakes - 1);
      addGrowth(0.5);
      say("お手入れとお風呂でつやつや！ミスも1つ取り返した");
    },
    cleanPoop: () => {
      if (!state.poop) {
        say("うんちは落ちてないよ");
        return;
      }
      state.poop = false;
      state.clean = clamp(state.clean + 18);
      state.happy = clamp(state.happy + 4);
      addGrowth(0.35);
      say("うんち掃除完了。すっきり！");
    },
    clean: () => {
      state.clean = clamp(state.clean + 30);
      state.poop = false;
      addGrowth(0.35);
      say("おふろでぴかぴか！");
    },
    sleep: () => {
      state.sleeping = !state.sleeping;
      if (!state.sleeping) state.energy = clamp(state.energy + 35);
      say(state.sleeping ? "おやすみなさい" : "おはよう！");
    },
    medicine: () => {
      if (!state.sick) {
        say("今はくすりはいらないみたい");
        return;
      }
      if (state.coins < 3) {
        say("くすりにはコインが3枚いるよ");
        return;
      }
      state.sick = false;
      state.happy = clamp(state.happy + 8);
      addCoins(-3);
      say("体調がよくなった！");
    },
    battle: () => openBattleView(),
  };

  moves[action]();
  render();
}

function useItem(item) {
  ensureHatched();
  if (!spendStock(item)) return;
  if (item === "feast") {
    state.hunger = clamp(state.hunger + 34);
    state.energy = clamp(state.energy + 12);
    state.happy = clamp(state.happy + 8);
    state.poop = true;
    addGrowth(1.7);
    say("ごちそうで大成長！うんちも出た");
  }
  if (item === "cake") {
    state.happy = clamp(state.happy + 30);
    state.hunger = clamp(state.hunger + 10);
    state.clean = clamp(state.clean - 6);
    addGrowth(1.1);
    say("ケーキでごきげん！進化に近づいた");
  }
  if (item === "purpleDrink") {
    state.color = "purple";
    state.happy = clamp(state.happy + 12);
    say("紫になーるを飲んだ！からだが紫に変わった");
  }
  if (item === "blueDrink") {
    state.color = "blue";
    state.happy = clamp(state.happy + 12);
    say("水色になーるを飲んだ！からだが水色に変わった");
  }
  if (item === "yellowDrink") {
    state.color = "yellow";
    state.happy = clamp(state.happy + 12);
    say("黄色になーるを飲んだ！からだが黄色に変わった");
  }
  if (item === "deepBlueDrink") {
    state.color = "deep-blue";
    state.happy = clamp(state.happy + 12);
    say("青になーるを飲んだ！からだが青に変わった");
  }
  if (item === "greenDrink") {
    state.color = "green";
    state.happy = clamp(state.happy + 12);
    say("緑になーるを飲んだ！からだが緑に変わった");
  }
  if (item === "redDrink") {
    state.color = "red";
    state.happy = clamp(state.happy + 12);
    say("赤になーるを飲んだ！からだが赤に変わった");
  }
  if (item === "careCharm") {
    state.careMistakes = Math.max(0, state.careMistakes - 5);
    state.happy = clamp(state.happy + 18);
    say("ミスけしでお世話ミスが5減った！");
  }
}

function tick() {
  if (state.hatched) {
    const drain = state.sleeping ? 0.35 : 1;
    addGrowth(state.sleeping ? 0.25 : 0.5);
    state.hunger = clamp(state.hunger - 1.5 * drain);
    state.happy = clamp(state.happy - 1 * drain);
    state.clean = clamp(state.clean - 1 * drain);
    state.energy = clamp(state.energy + (state.sleeping ? 5 : -1.1));

    const emptyGauge = state.hunger === 0 || state.happy === 0 || state.clean === 0 || state.energy === 0;
    if (emptyGauge) {
      markCareMistake();
      state.sick = true;
      state.hunger = Math.max(state.hunger, 4);
      state.happy = Math.max(state.happy, 4);
      state.clean = Math.max(state.clean, 4);
      state.energy = Math.max(state.energy, 4);
      state.battleLog = "ゲージが空になってお世話ミス。薬が必要かも";
    }
    if (Math.random() < 0.12 && state.clean < 52) state.poop = true;
    if (Math.random() < 0.12 && (state.hunger < 25 || state.clean < 25 || state.poop)) state.sick = true;
  }
  render();
}

function buy(item) {
  ensureHatched();
  const shopItem = shopItems[item];
  if (!shopItem) return;
  if (state.coins < shopItem.price) {
    say("コインが足りない！コイン稼ぎかミニゲームで増やそう");
    return;
  }
  state.coins -= shopItem.price;
  if (shopItem.kind === "decor") {
    state.decor.push(item);
    state.happy = clamp(state.happy + 10);
    say(`${itemLabels[item].label}をかざった！買った分だけ増えるよ`);
  } else {
    state.inventory[item] += 1;
    say(`${itemLabels[item].label}をもちものに入れたよ`);
  }
  render();
  if (!el.activity.classList.contains("hidden") && el.activityTitle.textContent === "ショップ") openShopMenu();
}

function makeOpponent(difficulty = "normal") {
  const difficultySettings = {
    weak: { label: "弱い", cuteBoost: -18, rarityBoost: -1, reward: 18, growth: 1.6 },
    normal: { label: "普通", cuteBoost: 0, rarityBoost: 0, reward: 32, growth: 2.5 },
    strong: { label: "強い", cuteBoost: 18, rarityBoost: 2, reward: 58, growth: 4.2 },
  };
  const setting = difficultySettings[difficulty] || difficultySettings.normal;
  const pool = [
    { name: "ふわふわっち", shape: "heart", rarity: 2, cute: 62, mistakes: 4 },
    { name: "そらピカっち", shape: "star", rarity: 4, cute: 70, mistakes: 2 },
    { name: "うみぷるっち", shape: "drop", rarity: 5, cute: 76, mistakes: 3 },
    { name: "きら王っち", shape: "crown", rarity: 7, cute: 82, mistakes: 1 },
    { name: "ミラクルライバル", shape: "legend", rarity: 10, cute: 92, mistakes: 0 },
  ];
  const base = pool[Math.min(pool.length - 1, Math.floor(state.stage * 0.8 + Math.random() * 2))];
  const cute = Math.max(20, base.cute + setting.cuteBoost + state.legendLevel * 4);
  const rarity = Math.max(1, base.rarity + setting.rarityBoost + Math.floor(state.legendLevel / 2));
  const score = cute + rarity * 5 - base.mistakes * 2;
  return { ...base, cute, rarity, score, difficulty, difficultyLabel: setting.label, reward: setting.reward, growth: setting.growth };
}

function openBattleView(resultHtml = "", difficulty = "normal") {
  ensureHatched();
  activeOpponent = makeOpponent(difficulty);
  const playerCute = cutenessScore();
  openActivity(
    "バトル",
    `
      <div class="difficulty-row">
        <button data-battle-level="weak" type="button">弱い</button>
        <button data-battle-level="normal" type="button">普通</button>
        <button data-battle-level="strong" type="button">強い</button>
      </div>
      <div class="versus">
        <div class="fighter">
          <div class="fighter-pet ${currentStage().id} color-${state.color}"></div>
          <h3>${currentStage().name}</h3>
          <dl>
            <div><dt>可愛さ度</dt><dd>${playerCute}</dd></div>
            <div><dt>レア度</dt><dd>${currentStage().rarity}</dd></div>
            <div><dt>ミス回数</dt><dd>${state.careMistakes}</dd></div>
            <div><dt>調子</dt><dd>${state.sick ? "病気" : "元気"}</dd></div>
          </dl>
          <strong>可愛さ勝負 ${playerCute}</strong>
        </div>
        <div class="versus-mark">VS</div>
        <div class="fighter">
          <div class="fighter-pet enemy ${activeOpponent.shape}"></div>
          <h3>${activeOpponent.name} (${activeOpponent.difficultyLabel})</h3>
          <dl>
            <div><dt>可愛さ度</dt><dd>${activeOpponent.cute}</dd></div>
            <div><dt>レア度</dt><dd>${activeOpponent.rarity}</dd></div>
            <div><dt>ミス回数</dt><dd>${activeOpponent.mistakes}</dd></div>
            <div><dt>勝利報酬</dt><dd>${activeOpponent.reward + state.stage * 6}</dd></div>
          </dl>
          <strong>可愛さ勝負 ${activeOpponent.score}</strong>
        </div>
      </div>
      <div class="activity-actions">
        <button class="primary-activity" data-activity="resolveBattle" type="button">勝負する</button>
        <button data-activity="close" type="button">戻る</button>
      </div>
      <div class="result-box">${resultHtml || "難易度を選んで、可愛さ度で勝負しよう。強いほど報酬アップ"}</div>
    `,
  );
}

function resolveBattle() {
  const opponent = activeOpponent || makeOpponent();
  const player = cutenessScore() + currentStage().rarity * 4 + Math.floor(Math.random() * 16);
  const enemy = opponent.score + Math.floor(Math.random() * 16);
  state.energy = clamp(state.energy - 12);
  if (player >= enemy) {
    const reward = opponent.reward + state.stage * 6 + state.legendLevel * 10;
    const growth = opponent.growth + state.stage * 0.45;
    state.wins += 1;
    addCoins(reward);
    addGrowth(growth);
    state.happy = clamp(state.happy + 14);
    state.battleLog = `${opponent.name}に勝利！+${reward}コイン / 進化+${growth.toFixed(1)}`;
    openBattleView(`勝利！ 可愛さ ${player} 対 ${enemy}。${reward}コインもらった`, opponent.difficulty);
  } else {
    state.losses += 1;
    addGrowth(1.2);
    state.battleLog = `${opponent.name}に惜敗。でも進化経験は入った`;
    openBattleView(`惜敗... 可愛さ ${player} 対 ${enemy}。可愛さ度は下がらないよ`, opponent.difficulty);
  }
  render();
}

function openMiniMenu() {
  ensureHatched();
  openActivity(
    "ミニゲームを選ぶ",
    `
      <div class="choice-grid">
        <button data-game="shell" type="button"><strong>光る貝</strong><span>当てるとコイン+6</span></button>
        <button data-game="catch" type="button"><strong>おやつキャッチ</strong><span>ごきげんとコイン</span></button>
        <button data-game="jump" type="button"><strong>そらジャンプ</strong><span>進化が進む</span></button>
        <button data-game="bubble" type="button"><strong>泡タッチ</strong><span>清潔とコイン</span></button>
        <button data-game="star" type="button"><strong>星あつめ</strong><span>レア進化に近づく</span></button>
        <button data-game="rhythm" type="button"><strong>リズム</strong><span>ごきげん大アップ</span></button>
        <button data-game="treasure" type="button"><strong>宝箱</strong><span>コイン多め</span></button>
        <button data-game="balance" type="button"><strong>バランス</strong><span>元気アップ</span></button>
        <button data-game="color" type="button"><strong>色合わせ</strong><span>全部ちょっとアップ</span></button>
      </div>
      <div class="result-box">好きなゲームを選んでね</div>
    `,
  );
}

function openMiniGame(game) {
  activeMiniGame = game;
  if (game === "shell") {
    const correct = Math.floor(Math.random() * 9);
    activeMiniGame = { type: "shell", correct };
    const shells = Array.from({ length: 9 }, (_, index) => {
      const marks = ["◖", "◗", "◓", "◒", "◐", "◑", "◆", "◇", "●"];
      return `<button class="big-shell ${correct === index ? "glow" : ""}" data-pick="${index}" type="button">${marks[index]}</button>`;
    }).join("");
    openActivity(
      "光る貝",
      `
        <div class="big-game-row shell-nine">${shells}</div>
        <div class="result-box">光っている貝を押してね</div>
      `,
    );
  }
  if (game === "catch") {
    openActivity(
      "おやつキャッチ",
      `
        <div class="fall-game">
          <button class="falling-snack" data-activity="catchSnack" type="button">🍰</button>
          <button class="fall-decoy decoy-a" data-activity="missSnack" type="button">✕</button>
          <button class="fall-decoy decoy-b" data-activity="missSnack" type="button">✕</button>
        </div>
        <div class="result-box">空から落ちてくるおやつをタッチしてキャッチ！</div>
      `,
    );
  }
  if (game === "jump") {
    activeMiniGame = { type: "jump", startedAt: Date.now(), beat: 820 };
    playTone(523, 0.08, "square", 0.03);
    openActivity(
      "そらジャンプ",
      `
        <div class="rhythm-game">
          <div class="beat-lane">
            <span></span><span></span><span></span><span></span>
          </div>
          <button class="rhythm-target" data-activity="skyJump" type="button">JUMP</button>
        </div>
        <div class="result-box">丸が光るリズムに合わせてJUMPを押そう</div>
      `,
    );
  }
  if (game === "bubble") openBubbleGame();
  if (game === "star") openStarGame();
  if (game === "rhythm") openRhythmGame();
  if (game === "treasure") openTreasureGame();
  if (game === "balance") openBalanceGame();
  if (game === "color") openColorGame();
}

function openBubbleGame() {
  activeMiniGame = { type: "bubble", popped: 0, goal: 5 };
  const bubbles = Array.from({ length: 7 }, (_, index) => {
    const left = 10 + ((index * 13) % 78);
    const delay = (index % 4) * 0.35;
    return `<button class="bubble-target" data-bubble="${index}" style="left:${left}%;animation-delay:${delay}s" type="button">○</button>`;
  }).join("");
  openActivity(
    "泡タッチ",
    `
      <div class="mini-status"><span>残り <strong id="miniTimer">10</strong>秒</span><span>泡 <strong id="miniCount">0</strong>/5</span></div>
      <div class="bubble-game">${bubbles}</div>
      <div class="result-box">下から上がる泡を5個タッチ！タッチすると泡がはじけるよ</div>
    `,
  );
  startMiniCountdown(10, () => finishBubbleGame(false));
}

function openStarGame() {
  activeMiniGame = { type: "star", collected: 0, goal: 10 };
  const stars = Array.from({ length: 10 }, (_, index) => {
    const left = 8 + ((index * 17) % 82);
    const top = 10 + ((index * 23) % 72);
    return `<button class="collect-star" data-star="${index}" style="left:${left}%;top:${top}%" type="button">★</button>`;
  }).join("");
  openActivity(
    "星あつめ",
    `
      <div class="mini-status"><span>残り <strong id="miniTimer">10</strong>秒</span><span>星 <strong id="miniCount">0</strong>/10</span></div>
      <div class="star-game">${stars}</div>
      <div class="result-box">10秒以内に星を10個集めたら成功！</div>
    `,
  );
  startMiniCountdown(10, () => finishStarGame(false));
}

function openRhythmGame() {
  activeMiniGame = { type: "rhythm", startedAt: Date.now(), beat: 980 };
  openActivity(
    "リズム",
    `
      <div class="rhythm-game">
        <div class="timing-ring"><span></span></div>
        <button class="rhythm-target" data-activity="rhythmTap" type="button">いまだ！</button>
      </div>
      <div class="result-box">黄色の輪が真ん中に重なるタイミングで押そう。ぴったりならごきげん大アップ！</div>
    `,
  );
}

function openTreasureGame() {
  const path = [0, 1, 2, 7, 12, 13, 18, 23, 24];
  activeMiniGame = { type: "treasure", path, step: 0 };
  const cells = Array.from({ length: 25 }, (_, index) => {
    const isStart = index === path[0];
    const isGoal = index === path[path.length - 1];
    const mark = isStart ? "▶" : isGoal ? "宝" : "";
    return `<button class="maze-cell ${path.includes(index) ? "path" : "wall"} ${isStart ? "done" : ""}" data-maze="${index}" type="button">${mark}</button>`;
  }).join("");
  openActivity(
    "宝箱迷路",
    `
      <div class="maze-game">${cells}</div>
      <div class="result-box">光る道を順番に進んで宝箱まで行けたら成功！</div>
    `,
  );
}

function openBalanceGame() {
  activeMiniGame = { type: "balance", tilt: 0, seconds: 7 };
  openActivity(
    "バランス",
    `
      <div class="mini-status"><span>残り <strong id="miniTimer">7</strong>秒</span><span>中心をキープ</span></div>
      <div class="balance-game">
        <div class="balance-board"><span id="balancePerson">人</span></div>
        <div class="balance-meter"><span id="balanceNeedle"></span></div>
      </div>
      <div class="balance-controls">
        <button data-balance="left" type="button">左</button>
        <button data-balance="right" type="button">右</button>
      </div>
      <div class="result-box">ゆらゆらする台で、人が落ちないように左右ボタンで支えよう</div>
    `,
  );
  startBalanceLoop();
}

function openColorGame() {
  const colors = [
    { name: "赤", value: "#e74b4b" },
    { name: "青", value: "#3ca8db" },
    { name: "緑", value: "#46bd72" },
    { name: "黄", value: "#ffe45c" },
  ];
  const same = colors[Math.floor(Math.random() * colors.length)];
  const different = colors.find((color) => color !== same && Math.random() < 0.4) || colors[(colors.indexOf(same) + 1) % colors.length];
  const cards = [same, same, different].sort(() => Math.random() - 0.5);
  activeMiniGame = { type: "color", cards, picked: [] };
  const buttons = cards
    .map((card, index) => `<button class="color-card" data-color-card="${index}" style="--card-color:${card.value}" type="button">?</button>`)
    .join("");
  openActivity(
    "色合わせ",
    `
      <div class="color-game">${buttons}</div>
      <div class="result-box">3枚のうち、同じ色のカードを2枚めくれたら成功！</div>
    `,
  );
}

function finishShellGame(pick) {
  if (!activeMiniGame || activeMiniGame.type !== "shell") return;
  if (Number(pick) === activeMiniGame.correct) {
    addCoins(6);
    state.happy = clamp(state.happy + 8);
    addGrowth(0.8);
    say("光る貝あたり！6コインゲット");
    miniResult("光る貝", "光っている貝を選べた！6コインゲット", true);
  } else {
    state.energy = clamp(state.energy - 3);
    say("おしい！違う貝だった");
    miniResult("光る貝", "違う貝だった。次は光る貝をねらおう", false);
  }
  render();
}

function catchSnack() {
  addCoins(4);
  state.happy = clamp(state.happy + 16);
  state.energy = clamp(state.energy - 5);
  addGrowth(0.65);
  say("キャッチ成功！ごきげんアップ");
  miniResult("おやつキャッチ", "おやつをキャッチ！ごきげんとコインアップ", true);
  render();
}

function missSnack() {
  state.happy = clamp(state.happy - 8);
  state.energy = clamp(state.energy - 4);
  say("違うものを押しちゃった");
  miniResult("おやつキャッチ", "おやつじゃないものを押したので失敗", false);
  render();
}

function skyJump() {
  const game = activeMiniGame && activeMiniGame.type === "jump" ? activeMiniGame : { startedAt: Date.now(), beat: 820 };
  const elapsed = Date.now() - game.startedAt;
  const offset = Math.abs((elapsed % game.beat) - game.beat / 2);
  const success = offset < 170;
  if (success) {
    addCoins(8);
    state.happy = clamp(state.happy + 14);
    state.energy = clamp(state.energy - 7);
    addGrowth(1.8);
    playTone(784, 0.12, "square", 0.04);
    say("リズムぴったり！大ジャンプ成功！");
    miniResult("そらジャンプ", "ぴったりジャンプ！進化がぐっと進んだ", true);
  } else {
    addCoins(2);
    state.happy = clamp(state.happy + 3);
    state.energy = clamp(state.energy - 7);
    addGrowth(0.5);
    playTone(220, 0.12, "sawtooth", 0.025);
    say("タイミングおしい！少しジャンプできた");
    miniResult("そらジャンプ", "タイミングがずれた。少しだけ成長した", false);
  }
  render();
}

function finishBubbleGame(success) {
  if (!activeMiniGame || activeMiniGame.type !== "bubble") return;
  if (success) {
    addCoins(7);
    state.clean = clamp(state.clean + 22);
    addGrowth(0.75);
    say("泡タッチ成功！泡がはじけてきれいアップ");
    miniResult("泡タッチ", "泡を5個はじけさせた！きれいアップ", true);
  } else {
    state.clean = clamp(state.clean + 4);
    say("時間切れ。泡が流れていった");
    miniResult("泡タッチ", "時間切れ。次は泡を5個タッチしよう", false);
  }
  render();
}

function popBubble(button) {
  if (!activeMiniGame || activeMiniGame.type !== "bubble" || button.classList.contains("popped")) return;
  button.classList.add("popped");
  button.textContent = "＊";
  activeMiniGame.popped += 1;
  const countEl = document.getElementById("miniCount");
  if (countEl) countEl.textContent = activeMiniGame.popped;
  playTone(640 + activeMiniGame.popped * 30, 0.06, "sine", 0.025);
  if (activeMiniGame.popped >= activeMiniGame.goal) finishBubbleGame(true);
}

function finishStarGame(success) {
  if (!activeMiniGame || activeMiniGame.type !== "star") return;
  if (success) {
    addCoins(10);
    state.happy = clamp(state.happy + 10);
    addGrowth(1.5);
    say("星あつめ成功！進化が進んだ");
    miniResult("星あつめ", "10秒以内に星を10個集めた！進化が進む", true);
  } else {
    addCoins(2);
    state.energy = clamp(state.energy - 4);
    say("星が集めきれなかった");
    miniResult("星あつめ", "10個集める前に時間切れ。少しだけコインゲット", false);
  }
  render();
}

function collectStar(button) {
  if (!activeMiniGame || activeMiniGame.type !== "star" || button.classList.contains("collected")) return;
  button.classList.add("collected");
  button.textContent = "✓";
  activeMiniGame.collected += 1;
  const countEl = document.getElementById("miniCount");
  if (countEl) countEl.textContent = activeMiniGame.collected;
  playTone(720 + activeMiniGame.collected * 12, 0.05, "triangle", 0.025);
  if (activeMiniGame.collected >= activeMiniGame.goal) finishStarGame(true);
}

function rhythmTap() {
  const game = activeMiniGame && activeMiniGame.type === "rhythm" ? activeMiniGame : { startedAt: Date.now(), beat: 980 };
  const elapsed = Date.now() - game.startedAt;
  const offset = Math.abs((elapsed % game.beat) - game.beat / 2);
  if (offset < 105) {
    addCoins(9);
    state.happy = clamp(state.happy + 30);
    addGrowth(0.8);
    say("リズムぴったり！ごきげんめっちゃアップ");
    miniResult("リズム", "ぴったり！ごきげんがめっちゃ上がった", true);
  } else if (offset < 245) {
    addCoins(4);
    state.happy = clamp(state.happy + 15);
    addGrowth(0.45);
    say("ちょっとずれたけど成功！");
    miniResult("リズム", "少しずれたけど成功。ごきげん半分アップ", true);
  } else {
    state.energy = clamp(state.energy - 4);
    say("タイミングがずれた");
    miniResult("リズム", "タイミングが大きくずれて失敗", false);
  }
  render();
}

function stepMaze(index, button) {
  if (!activeMiniGame || activeMiniGame.type !== "treasure") return;
  const next = activeMiniGame.path[activeMiniGame.step + 1];
  if (Number(index) !== next) {
    state.energy = clamp(state.energy - 5);
    say("迷路で行き止まり！");
    miniResult("宝箱迷路", "道を外れてしまった。光る道を順番に進もう", false);
    render();
    return;
  }
  activeMiniGame.step += 1;
  button.classList.add("done");
  playTone(520 + activeMiniGame.step * 24, 0.06, "triangle", 0.025);
  if (activeMiniGame.step === activeMiniGame.path.length - 1) {
    addCoins(18);
    addGrowth(0.65);
    say("宝箱迷路クリア！コイン多め");
    miniResult("宝箱迷路", "迷路をクリアして宝箱を開けた！18コイン", true);
    render();
  }
}

function startBalanceLoop() {
  clearMiniTimer();
  const duration = 7;
  const endAt = Date.now() + duration * 1000;
  miniTimer = window.setInterval(() => {
    if (!activeMiniGame || activeMiniGame.type !== "balance") {
      clearMiniTimer();
      return;
    }
    activeMiniGame.tilt += (Math.random() - 0.5) * 24;
    activeMiniGame.tilt = Math.max(-100, Math.min(100, activeMiniGame.tilt));
    updateBalanceView();
    const left = Math.max(0, Math.ceil((endAt - Date.now()) / 1000));
    const timerEl = document.getElementById("miniTimer");
    if (timerEl) timerEl.textContent = left;
    if (Math.abs(activeMiniGame.tilt) > 82) finishBalanceGame(false);
    if (left <= 0) finishBalanceGame(true);
  }, 350);
}

function updateBalanceView() {
  const tilt = activeMiniGame && activeMiniGame.type === "balance" ? activeMiniGame.tilt : 0;
  const board = document.querySelector(".balance-board");
  const person = document.getElementById("balancePerson");
  const needle = document.getElementById("balanceNeedle");
  if (board) board.style.transform = `rotate(${tilt / 6}deg)`;
  if (person) person.style.transform = `translateX(${tilt * 0.9}px)`;
  if (needle) needle.style.left = `${50 + tilt / 2}%`;
}

function nudgeBalance(direction) {
  if (!activeMiniGame || activeMiniGame.type !== "balance") return;
  activeMiniGame.tilt += direction === "left" ? -24 : 24;
  activeMiniGame.tilt = Math.max(-100, Math.min(100, activeMiniGame.tilt));
  playTone(360, 0.04, "square", 0.02);
  updateBalanceView();
}

function finishBalanceGame(success) {
  if (!activeMiniGame || activeMiniGame.type !== "balance") return;
  clearMiniTimer();
  if (success) {
    addCoins(8);
    state.energy = clamp(state.energy + 20);
    addGrowth(0.55);
    say("バランス成功！立ち続けられた");
    miniResult("バランス", "最後まで立ち続けた！げんきアップ", true);
  } else {
    state.happy = clamp(state.happy - 6);
    say("バランスを崩した");
    miniResult("バランス", "大きく傾いて落ちちゃった", false);
  }
  render();
}

function pickColorCard(button) {
  if (!activeMiniGame || activeMiniGame.type !== "color" || button.classList.contains("flipped")) return;
  const index = Number(button.dataset.colorCard);
  const card = activeMiniGame.cards[index];
  button.classList.add("flipped");
  button.textContent = card.name;
  activeMiniGame.picked.push(card.name);
  playTone(520, 0.06, "triangle", 0.025);
  if (activeMiniGame.picked.length < 2) return;
  const success = activeMiniGame.picked[0] === activeMiniGame.picked[1];
  if (success) {
    addCoins(7);
    state.hunger = clamp(state.hunger + 5);
    state.happy = clamp(state.happy + 8);
    state.energy = clamp(state.energy + 5);
    state.clean = clamp(state.clean + 5);
    addGrowth(0.7);
    say("同じ色を2枚めくった！");
    miniResult("色合わせ", "同じ色を2枚選べた！全体アップ", true);
  } else {
    state.happy = clamp(state.happy - 5);
    say("違う色だった");
    miniResult("色合わせ", "2枚の色が違った。もう一回チャレンジ", false);
  }
  render();
}

function openPlayView() {
  ensureHatched();
  const correct = Math.floor(Math.random() * 3);
  activeMiniGame = { type: "play", correct };
  const buttons = [0, 1, 2]
    .map((index) => {
      const isCorrect = index === correct;
      return `<button class="${isCorrect ? "moving-strawberry" : "wrong-play"}" data-play-pick="${index}" type="button">${isCorrect ? "🍓" : "×"}</button>`;
    })
    .join("");
  openActivity(
    "あそぶ",
    `
      <div class="play-arena">
        ${buttons}
      </div>
      <div class="result-box">動くイチゴをタッチ！違うボタンだとごきげんが下がるよ</div>
    `,
  );
}

function playToy(pick) {
  if (!activeMiniGame || activeMiniGame.type !== "play") return;
  if (Number(pick) === activeMiniGame.correct) {
    state.happy = clamp(state.happy + 22);
    state.energy = clamp(state.energy - 6);
    state.clean = clamp(state.clean - 3);
    addGrowth(0.9);
    say("イチゴをキャッチ！ごきげんアップ！");
  } else {
    state.happy = clamp(state.happy - 12);
    state.energy = clamp(state.energy - 4);
    markCareMistake();
    say("違うボタン！ごきげんダウン");
  }
  openPlayView();
  render();
}

function playShell(index) {
  ensureHatched();
  if (index === glowingShell) {
    addCoins(6);
    state.happy = clamp(state.happy + 7);
    addGrowth(0.5);
    say("あたり！コインを6枚ゲット");
  } else {
    state.energy = clamp(state.energy - 4);
    say("おしい！ミニゲーム画面でも遊べるよ");
  }
  glowingShell = Math.floor(Math.random() * 3);
  render();
}

el.pet.addEventListener("click", () => {
  ensureHatched();
  state.happy = clamp(state.happy + 3);
  addGrowth(0.2);
  say(["なでなでうれしい！", "ぷにっ", "今日も強くなるぞ！"][Math.floor(Math.random() * 3)]);
  render();
});

el.poop.addEventListener("click", () => care("cleanPoop"));

el.bgmBtn.addEventListener("click", toggleBgm);

el.actions.forEach((button) => {
  button.addEventListener("click", () => care(button.dataset.action));
});

el.fieldTabs.forEach((button) => {
  button.addEventListener("click", () => {
    saveActivePet();
    state.field = button.dataset.field;
    loadActivePet(state, state.field);
    const names = { land: "陸", sky: "空", sea: "海" };
    say(`${names[state.field]}フィールドのキャラに切り替えた`);
    render();
  });
});

el.saveName.addEventListener("click", () => {
  ensureHatched();
  if (state.stage < 2) {
    say("もう一回進化したら名前を付けられるよ");
    return;
  }
  const nextName = el.nameInput.value.trim();
  if (!nextName) {
    state.customName = "";
    say("名前を元の種類名に戻した");
  } else {
    state.customName = nextName.slice(0, 12);
    say(`${state.customName}に名前を付けた！`);
  }
  render();
});

el.closeActivity.addEventListener("click", closeActivity);

el.activityBody.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  if (button.dataset.activity === "close") closeActivity();
  if (button.dataset.activity === "miniMenu") openMiniMenu();
  if (button.dataset.activity === "resolveBattle") resolveBattle();
  if (button.dataset.activity === "catchSnack") catchSnack();
  if (button.dataset.activity === "missSnack") missSnack();
  if (button.dataset.activity === "skyJump") skyJump();
  if (button.dataset.activity === "rhythmTap") rhythmTap();
  if (button.dataset.battleLevel) openBattleView("", button.dataset.battleLevel);
  if (button.dataset.buy) buy(button.dataset.buy);
  if (button.dataset.food === "free") {
    care("feedFree");
    openFoodMenu();
  }
  if (button.dataset.food === "feast") {
    useItem("feast");
    openFoodMenu();
  }
  if (button.dataset.food === "cake") {
    useItem("cake");
    openFoodMenu();
  }
  if (button.dataset.use) {
    useItem(button.dataset.use);
    openUseMenu();
  }
  if (button.dataset.game) openMiniGame(button.dataset.game);
  if (button.dataset.pick) finishShellGame(button.dataset.pick);
  if (button.dataset.playPick) playToy(button.dataset.playPick);
  if (button.dataset.bubble) popBubble(button);
  if (button.dataset.star) collectStar(button);
  if (button.dataset.maze) stepMaze(button.dataset.maze, button);
  if (button.dataset.balance) nudgeBalance(button.dataset.balance);
  if (button.dataset.colorCard) pickColorCard(button);
});

el.battleNow.addEventListener("click", openBattleView);

el.shop.forEach((button) => {
  button.addEventListener("click", () => buy(button.dataset.item));
});

el.inventory.forEach((button) => {
  button.addEventListener("click", () => {
    useItem(button.dataset.use);
    render();
  });
});

el.shells.forEach((button) => {
  button.addEventListener("click", () => playShell(Number(button.dataset.shell)));
});

el.reset.addEventListener("click", () => {
  const ok = window.confirm("最初からやり直しますか？");
  if (!ok) return;
  state = normalizeState({});
  glowingShell = 0;
  closeActivity();
  render();
});

window.setInterval(tick, 5200);
window.setInterval(() => {
  glowingShell = Math.floor(Math.random() * 3);
  render();
}, 2600);

render();
