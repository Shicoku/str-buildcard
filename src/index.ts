import { parseChar } from "./utils/JsonParser.js";
import { calculateScore } from "./utils/scorer.js";
import { renderImg } from "./utils/renderImg.js";
import { ApiError } from "./errors/ApiError.js";
import { charData } from "./types/starrail.js";
import { counter } from "./utils/counter.js";
import { getWightData } from "./utils/getWightData.js";

const loader = document.getElementById("loader") as HTMLElement;
const bar = document.getElementById("progress") as HTMLElement;
const circle = document.getElementById("countdownCircle") as HTMLElement;
const cardBtn = document.getElementById("card-btn") as HTMLElement;

let apiData: any = null;
let selectedIndex: any = null;
let isLock = false;
let Index = 0;

loader.style.display = "none";
circle.style.display = "none";
cardBtn.style.display = "none";

const parts: Record<string, string> = { "1": "頭", "2": "手", "3": "胴体", "4": "足", "5": "オーブ", "6": "縄" };

async function getData(): Promise<any> {
  const uid = (document.getElementById("uid") as HTMLInputElement).value;
  const char = document.getElementById("char") as HTMLElement;
  const card = document.getElementById("card-img") as HTMLElement;
  const log = document.getElementById("log") as HTMLElement;
  const status = document.getElementById("status") as HTMLElement;

  log.innerHTML = "";

  if (isLock) return;

  loader.style.display = "flex";
  bar.style.display = "none";

  char.innerHTML = "";
  card.innerHTML = "";
  status.innerHTML = "";
  cardBtn.style.display = "none";

  try {
    const res = await fetch(`/api/mihomo?uid=${uid}`);
    if (!res.ok) {
      loader.style.display = "flex";
      throw new ApiError(`Fetch failed: ${res.statusText}`, res.status);
    }
    const data = await res.json();
    const characters = data.characters;
    const baseUrl = "submodule/StarRailRes/";
    char.innerHTML = "";

    apiData = data;

    if (data.error || !data.characters) {
      loader.style.display = "none";
      console.error(data.error);
      log.innerHTML = `<p>API Error: ${data.error}<br />データが見つかりませんでした。UIDをご確認の上、もう一度試してください。</p>`;
      return;
    }

    characters.forEach((c: any, i: number) => {
      const iconUrl = baseUrl + c.icon;

      const wrapper = document.createElement("div");
      wrapper.className = "char-wrapper";

      const button = document.createElement("a");
      button.className = "char_button";
      button.href = "#";
      button.onclick = (e) => {
        e.preventDefault();
        createCard(i, button);
      };

      const img = document.createElement("img");
      img.src = iconUrl;
      img.alt = c.name;
      img.title = c.name;
      img.className = "char_img";

      loader.style.display = "none";

      button.appendChild(img);
      wrapper.appendChild(button);
      char.appendChild(wrapper);
    });
    status.innerHTML = `<p>UID: ${data.player.uid}<br />ニックネーム: ${data.player.nickname}<br />レベル: ${data.player.level}</p>`;
  } catch (err) {
    loader.style.display = "none";
    log.innerHTML = `<p>API Error: ${(err as Error).message}<br />サーバーに何らかの障害が発生している可能性があります。時間を開けてもう一度試してください。</p>`;
    console.error(err);
  }

  counter();
}

function getCharData(index: number): Promise<charData | null> {
  const data = apiData;
  const parsed = parseChar(data, index);
  if (!parsed) return Promise.resolve(null);

  const scoreData = calculateScore(parsed);
  return scoreData;
}

async function createCard(index: number, link: any): Promise<any> {
  const card = document.getElementById("card-img") as HTMLElement;
  const card_img = document.createElement("img");
  const buttons = document.querySelectorAll(".char_button");
  const log = document.getElementById("log") as HTMLElement;
  const status = document.getElementById("status") as HTMLElement;

  log.innerHTML = "";

  Index = index;

  if (selectedIndex === index) return;

  loader.style.display = "flex";
  bar.style.display = "flex";

  selectedIndex = index;

  if (link !== null) {
    buttons.forEach((btn) => btn.classList.remove("selected"));
    link.classList.add("selected");
  }

  try {
    const data = await getCharData(index);
    if (!data) return null;
    const canvas = await renderImg(data);

    loader.style.display = "none";
    cardBtn.style.display = "flex";

    card_img.src = canvas.toDataURL("image/png");
    card_img.className = "card-img";
    card.innerHTML = "";
    card.appendChild(card_img);
    const weightData = getWightData(data);
    const foo = formatData(await weightData);
    status.innerHTML += `<p>${foo}</p>`;
  } catch (err) {
    loader.style.display = "none";
    console.error(err);
    log.innerHTML = `<p>${err}<br />ビルドカードが生成できませんでした。もう一度試してください。</p>`;
  }
}

async function reload(): Promise<any> {
  const card = document.getElementById("card-img") as HTMLElement;
  const card_img = document.createElement("img");
  const log = document.getElementById("log") as HTMLElement;

  log.innerHTML = "";
  loader.style.display = "flex";
  bar.style.display = "flex";

  if (apiData === null) {
    loader.style.display = "none";
    log.innerHTML = `データがありません。`;
    return;
  }

  try {
    const data = await getCharData(Index);
    if (!data) return null;
    const canvas = await renderImg(data);

    loader.style.display = "none";

    card_img.src = canvas.toDataURL("image/png");
    card_img.className = "card-img";
    card.innerHTML = "";
    card.appendChild(card_img);
  } catch (err) {
    loader.style.display = "none";
    console.error(err);
    log.innerHTML = `<p>${err}<br />ビルドカードが生成できませんでした。もう一度試してください。</p>`;
  }
}

function downloadCard() {
  const card_img = document.querySelector(".card-img") as HTMLImageElement;
  if (!card_img) return;

  const link = document.createElement("a");
  link.href = card_img.src;
  link.download = "starrail_build_card.png";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function formatData(data: any): string {
  let output = "";
  output += "共通:<br />";
  for (const [key, value] of Object.entries(data.weight)) {
    if (value !== 0) {
      output += `${key}: ${value}<br />`;
    }
  }
  output += "<br />";
  for (const [partKey, partName] of Object.entries(parts)) {
    if (partKey === "1" || partKey === "2") continue;
    const partData = data.main[partKey];
    if (!partData) continue;
    output += `${partName}:<br />`;
    for (const [key, value] of Object.entries(partData)) {
      if (value !== 0) {
        output += `${key}: ${value}<br />`;
      }
    }
    output += "<br />";
  }
  return output.trim();
}

(window as any).getData = getData;
(window as any).reload = reload;
(window as any).downloadCard = downloadCard;
