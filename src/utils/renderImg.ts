import { charData } from "../types/starrail.js";
import { loadImage } from "./loadImage.js";
import { progress } from "./progress.js";

export async function renderImg(data: charData): Promise<any> {
  const card = document.getElementById("card-img") as HTMLElement;
  const bar = document.getElementById("progress") as HTMLElement;

  progress(bar, 0);

  const canvas = document.getElementById("card") as HTMLCanvasElement;
  const ctx = canvas.getContext("2d");
  if (ctx == null) {
    return (card.innerHTML = `<p>Error: Canvas context is null</p>`);
  }

  await document.fonts.ready;

  const back = await loadImage("../../assets/img/back.png");
  ctx.drawImage(back, 0, 0, 1920, 1080);

  progress(bar, 10);

  const icon = (await loadImage(data["icon"])) as HTMLImageElement;
  ctx.drawImage(icon, 200, -90, icon.width / 1.5, icon.height / 1.5);

  progress(bar, 15);

  const element = (await loadImage(data["element"])) as HTMLImageElement;
  ctx.drawImage(element, 160, 75, element.width / 5, element.height / 5);

  progress(bar, 20);

  const path = (await loadImage(data["path"])) as HTMLImageElement;
  ctx.drawImage(path, 220, 79, path.width / 10, path.height / 10);

  progress(bar, 25);

  const front = await loadImage("../../assets/img/front.png");
  ctx.drawImage(front, 0, 0, 1920, 1080);

  progress(bar, 30);

  let inter = data.status.length === 11 ? 55 : data.status.length === 10 ? 60 : 65;
  for (let i = 0; i < data.status.length; i++) {
    const img = (await loadImage(data.status[i].icon)) as HTMLImageElement;
    ctx.drawImage(img, 40, 155 + i * inter, img.width / 2.3, img.height / 2.3);

    ctx.fillStyle = "#fff";
    ctx.font = '38px "kt"';
    ctx.fillText(data.status[i].name, 95, 200 + i * inter);
    ctx.textAlign = "right";
    ctx.fillText(data.status[i].val, 470, 200 + i * inter);
    ctx.textAlign = "start";
  }

  if (data.light_cone) {
    {
      const img = await loadImage(data.light_cone.icon);
      ctx.font = '20px "kt"';
      ctx.fillStyle = "rgb(255, 255, 255)";
      ctx.fillText(data.light_cone.name, 250, 830);
      ctx.font = '35px "kt"';
      ctx.fillText("Lv. " + data.light_cone.level + " R" + data.light_cone.rank, 250, 880);

      ctx.drawImage(img, 50, 810, 160.5, 199);
    }
    {
      const img = (await loadImage("../../StarRailRes/" + "icon/deco/Rarity" + data["light_cone"]["rarity"] + ".png")) as HTMLImageElement;
      if (data["light_cone"]["rarity"] == 3) ctx.drawImage(img, -25, 950, img.width / 1.5, img.height / 1.5);
      else if (data["light_cone"]["rarity"] == 4) ctx.drawImage(img, -45, 950, img.width / 1.5, img.height / 1.5);
      else ctx.drawImage(img, -55, 950, img.width / 1.5, img.height / 1.5);
    }
    for (let i = 0; i < data["light_cone"]["attributes"].length; i++) {
      const img = (await loadImage(data["light_cone"]["attributes"][i]["icon"])) as HTMLImageElement;
      ctx.drawImage(img, 240, 880 + i * 40, img.width / 2.5, img.height / 2.5);

      ctx.font = "30px 'kt'";
      ctx.fillText(data["light_cone"]["attributes"][i]["name"], 300, 920 + i * 40);
      ctx.textAlign = "right";
      ctx.fillText(data["light_cone"]["attributes"][i]["val"], 470, 920 + i * 40);
      ctx.textAlign = "start";
    }
  }

  progress(bar, 40);

  for (let i = 0; i < data["skill"].length; i++) {
    const img = (await loadImage(data["skill"][i]["icon"])) as HTMLImageElement;
    ctx.drawImage(img, 540, 220 + i * 150, img.width / 1.3, img.height / 1.3);
    ctx.font = '40px "kt"';
    ctx.fillStyle = "rgb(255, 255, 255)";
    const skill = data.skill?.[i];
    const level = skill.level.toString();
    const x = level.length === 1 ? 575 : 560;
    ctx.fillText(level, x, 355 + i * 150);
  }

  progress(bar, 50);

  for (let i = 0; i < data["rank_icons"].length; i++) {
    const rank_icon = (await loadImage(data["rank_icons"][i]["icon"])) as HTMLImageElement;
    ctx.drawImage(rank_icon, 1100, 130 + i * 150, rank_icon.width / 1.3, rank_icon.height / 1.3);
    if (data["rank_icons"][i]["lock"] == true) {
      const rank_lock = (await loadImage("../../assets/img/back_icon.png")) as HTMLImageElement;
      ctx.drawImage(rank_lock, 1100, 130 + i * 150, rank_lock.width / 1.3, rank_lock.height / 1.3);
    }
  }

  progress(bar, 60);

  if (data["relics"]) {
    for (let i = 0; i < data["relics"].length; i++) {
      const relic_icon = (await loadImage(data["relics"][i]["icon"])) as HTMLImageElement;
      ctx.drawImage(relic_icon, 1240, 55 + i * 170, relic_icon.width, relic_icon.height);
      const relic_main_icon = (await loadImage(data["relics"][i]["main_affix"]["icon"])) as HTMLImageElement;
      ctx.drawImage(relic_main_icon, 1350, 70 + i * 170, relic_main_icon.width / 2.6, relic_main_icon.height / 2.6);
      ctx.font = "30px 'kt'";
      ctx.fillStyle = "rgb(255, 255, 255)";
      ctx.fillText(data["relics"][i]["main_affix"]["name"], 1400, 105 + i * 170);
      ctx.textAlign = "right";
      ctx.font = "40px 'kt'";
      ctx.fillText(data["relics"][i]["main_affix"]["dis"], 1480, 155 + i * 170);
      ctx.fillRect(1530, 50 + i * 170, 5, 150);
      ctx.textAlign = "start";
      const rarity = (await loadImage("../../StarRailRes/" + "icon/deco/Rarity" + data["relics"][i]["rarity"] + ".png")) as HTMLImageElement;
      ctx.drawImage(rarity, 1180, 140 + i * 170, rarity.width / 2, rarity.height / 2);
      ctx.font = "25px 'kt'";
      ctx.fillStyle = "rgb(255, 255, 255)";
      ctx.fillText("Lv. " + data["relics"][i]["level"], 1430, 185 + i * 170);
      ctx.strokeStyle = "rgb(255, 255, 255)";
      ctx.strokeText("Lv. " + data["relics"][i]["level"], 1430, 185 + i * 170);

      for (let j = 0; j < data["relics"][i]["sub_affix"].length; j++) {
        const img = (await loadImage(data["relics"][i]["sub_affix"][j]["icon"])) as HTMLImageElement;
        ctx.drawImage(img, 1540, 50 + (i * 170 + j * 34), img.width / 2.7, img.height / 2.7);
        ctx.font = "25px 'kt'";
        ctx.fillStyle = "rgb(255, 255, 255)";
        ctx.fillText(data["relics"][i]["sub_affix"][j]["name"], 1590, 80 + (i * 170 + j * 34));
        ctx.font = '25px "kt"';
        ctx.fillStyle = "rgba(255, 255, 255)";
        ctx.textAlign = "right";
        ctx.fillText(data["relics"][i]["sub_affix"][j]["dis"], 1765, 80 + (i * 170 + j * 34));
        ctx.strokeStyle = "rgb(255, 255, 255)";
        ctx.strokeText(data["relics"][i]["sub_affix"][j]["dis"], 1765, 80 + (i * 170 + j * 34));
        ctx.textAlign = "start";
      }
    }
  }

  progress(bar, 70);

  if (data["relic_sets"]) {
    let i = 0;
    let point = 0;
    if (data["relic_sets"][0]["name"] == data["relic_sets"][1]["name"]) i = 1;
    for (i; i < data["relic_sets"].length; i++) {
      await loadImage(data["relic_sets"][i]["icon"]).then((img) => {
        ctx.drawImage(img, 680 + point * 130, 820, 70, 70);

        ctx.fillStyle = "rgb(255, 255, 255)";
        ctx.textAlign = "left";
        ctx.font = '30px "kt"';
        ctx.fillText("x" + data["relic_sets"][i]["num"], 750 + point * 130, 870);
      });
      point++;
    }
  }

  progress(bar, 80);

  ctx.font = '60px "kt"';
  ctx.textAlign = "start";
  ctx.fillStyle = "rgb(255, 255, 255)";
  ctx.fillText(data["name"], 40, 70);

  // キャラレベル描画
  ctx.font = '35px "kt"';
  ctx.fillStyle = "rgb(255, 255, 255)";
  ctx.fillText("Lv. " + data["level"], 45, 120);
  ctx.strokeStyle = "rgb(255, 255, 255)";
  ctx.strokeText("Lv. " + data["level"], 45, 120);

  progress(bar, 85);

  // スコア描画
  ctx.font = '40px "kt"';
  ctx.fillStyle = "rgb(255, 255, 255)";
  ctx.fillText("Total Score", 690, 950);
  ctx.font = '80px "kt"';
  ctx.fillText(data.total_score.toString(), 700, 1030);
  ctx.strokeStyle = "rgb(255, 255, 255)";
  ctx.strokeText(data.total_score.toString(), 700, 1030);

  let scoreRank = "D";
  if (data["total_score"] >= 600) scoreRank = "SS";
  else if (data["total_score"] >= 540) scoreRank = "S";
  else if (data["total_score"] >= 360) scoreRank = "A";
  else if (data["total_score"] >= 240) scoreRank = "B";
  else if (data["total_score"] >= 60) scoreRank = "C";
  ctx.font = '130px "kt"';
  ctx.fillText(scoreRank, 920, 1030);
  ctx.strokeStyle = "rgb(255, 255, 255)";
  ctx.strokeText(scoreRank, 920, 1030);

  progress(bar, 90);

  // 遺物スコア描画
  if (data["relics"]) {
    for (let i = 0; i < data["relics"].length; i++) {
      ctx.fillRect(1780, 50 + i * 170, 5, 150);
      ctx.font = '30px "kt"';
      ctx.fillStyle = "rgb(255, 255, 255)";
      ctx.fillText("Score", 1795, 90 + i * 170);
      ctx.strokeStyle = "rgb(255, 255, 255)";
      ctx.strokeText("Score", 1795, 90 + i * 170);
      ctx.font = '35px "kt"';
      const relic = data.relics?.[i];
      if (relic && typeof relic.score === "string") {
        ctx.fillText(relic.score, 1800, 130 + i * 170);
        ctx.strokeText(relic.score, 1800, 130 + i * 170);
      }
      let scoreRank = "D";
      const score = Number(data.relics?.[i].score);
      if (score >= 100) scoreRank = "SS";
      else if (score >= 90) scoreRank = "S";
      else if (score >= 60) scoreRank = "A";
      else if (score >= 40) scoreRank = "B";
      else if (score >= 10) scoreRank = "C";
      ctx.fillText(scoreRank, 1830, 180 + i * 170);
      ctx.strokeText(scoreRank, 1830, 180 + i * 170);
    }
  }

  progress(bar, 100);

  return canvas;
}
