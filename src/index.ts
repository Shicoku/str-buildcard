import { parseChar } from "./utils/JsonParser.js";
import { calculateScore } from "./utils/scorer.js";
import { renderImg } from "./utils/renderImg.js";
import { ApiError } from "./errors/ApiError.js";
import { charData } from "./types/starrail.js";

const loader = document.getElementById("loader") as HTMLElement;
let apiData: any = null;

loader.style.display = "none";

async function getData(): Promise<any> {
  const uid = (document.getElementById("uid") as HTMLInputElement).value;
  const char = document.getElementById("char") as HTMLElement;
  const card = document.getElementById("card") as HTMLElement;

  loader.style.display = "flex";
  char.innerHTML = "";
  card.innerHTML = "";

  try {
    const res = await fetch(`/api/mihomo?uid=${uid}`);
    if (!res.ok) {
      throw new ApiError(`Fetch failed: ${res.statusText}`, res.status);
    }
    const data = await res.json();
    const characters = data.characters;
    const baseUrl = "StarRailRes/";
    char.innerHTML = "";

    apiData = data;

    if (data.error || !data.characters) {
      char.innerHTML = `<p>Error: ${data.error}</p>`;
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
  } catch (err) {
    char.innerHTML = `<p>Error: ${(err as Error).message}</p>`;
  }
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

  loader.style.display = "flex";

  buttons.forEach((btn) => btn.classList.remove("selected"));
  link.classList.add("selected");

  const data = await getCharData(index);
  if (!data) return null;
  const canvas = await renderImg(data);

  loader.style.display = "none";

  card_img.src = canvas.toDataURL("image/png");
  card_img.className = "card-img";
  card.innerHTML = "";
  card.appendChild(card_img);
}

(window as any).getData = getData;
(window as any).createCard = createCard;
