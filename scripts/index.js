let apiData = null;

async function getData() {
  const uid = document.getElementById("uid").value;
  const char = document.getElementById("char");

  char.innerHTML = "キャラクターを取得中...";

  try {
    const res = await fetch(`/api/mihomo?uid=${uid}`);
    const data = await res.json();
    const characters = data.characters;
    const baseUrl = "StarRailRes/";
    char.innerHTML = "";

    apiData = data;

    if (data.error || !data.characters) {
      char.innerHTML = "Error fetching data";
      return;
    }

    characters.forEach((character, index) => {
      const iconUrl = baseUrl + character.icon;

      const wrapper = document.createElement("div");
      wrapper.className = "char-wrapper";

      const button = document.createElement("button");
      button.className = "char-button";
      button.onclick = () => createImg(index);

      const img = document.createElement("img");
      img.src = iconUrl;
      img.alt = character.name;
      img.title = character.name;

      button.appendChild(img);
      wrapper.appendChild(button);
      char.appendChild(wrapper);
    });
  } catch (error) {
    char.innerHTML = "Error fetching data";
  }
}

function getDataBase(index) {
  const data = apiData;
  let json = {
    uid: data["player"]["uid"], // uid
    id: data["characters"][index]["id"], // キャラID
    name: data["characters"][index]["name"], // キャラ名
    level: data["characters"][index]["level"], //キャラレベル
    icon: "./StarRailRes/" + data["characters"][index]["portrait"], //キャラアイコン
    total_score: 0, // トータルスコア
    skill: [], // 軌跡
    rank_icons: [
      //凸数
      { icon: "./StarRailRes/" + data["characters"][index]["rank_icons"][0], lock: true },
      { icon: "./StarRailRes/" + data["characters"][index]["rank_icons"][1], lock: true },
      { icon: "./StarRailRes/" + data["characters"][index]["rank_icons"][2], lock: true },
      { icon: "./StarRailRes/" + data["characters"][index]["rank_icons"][3], lock: true },
      { icon: "./StarRailRes/" + data["characters"][index]["rank_icons"][4], lock: true },
      { icon: "./StarRailRes/" + data["characters"][index]["rank_icons"][5], lock: true },
    ],
    path: "./StarRailRes/" + data["characters"][index]["path"]["icon"], //運命
    element: "./StarRailRes/" + data["characters"][index]["element"]["icon"], //属性
    light_cone: [], //光円錐
    relics: [], //遺物
    relic_sets: [], //遺物セット
  };

  for (let i = 0; i < 4; i++) {
    json["skill"][i] = {
      level: data["characters"][index]["skills"][i]["level"],
      icon: "./StarRailRes/" + data["characters"][index]["skills"][i]["icon"],
    };
  }

  for (let i = 0; i < data["characters"][index]["rank"]; i++) {
    json["rank_icons"][i]["lock"] = false;
  }

  if (data["characters"][index]["light_cone"] != null) {
    json.light_cone = {
      name: data["characters"][index]["light_cone"]["name"],
      rarity: data["characters"][index]["light_cone"]["rarity"],
      rank: data["characters"][index]["light_cone"]["rank"],
      level: data["characters"][index]["light_cone"]["level"],
      icon: "./StarRailRes/" + data["characters"][index]["light_cone"]["preview"],
      attributes: [
        {
          name: cleanAffixName(data["characters"][index]["light_cone"]["attributes"][0]["name"]),
          icon: "./StarRailRes/" + data["characters"][index]["light_cone"]["attributes"][0]["icon"],
          val: data["characters"][index]["light_cone"]["attributes"][0]["display"],
        },
        {
          name: cleanAffixName(data["characters"][index]["light_cone"]["attributes"][1]["name"]),
          icon: "./StarRailRes/" + data["characters"][index]["light_cone"]["attributes"][1]["icon"],
          val: data["characters"][index]["light_cone"]["attributes"][1]["display"],
        },
        {
          name: cleanAffixName(data["characters"][index]["light_cone"]["attributes"][2]["name"]),
          icon: "./StarRailRes/" + data["characters"][index]["light_cone"]["attributes"][2]["icon"],
          val: data["characters"][index]["light_cone"]["attributes"][2]["display"],
        },
      ],
    };
  }

  if (data["characters"][index]["relics"].length != 0) {
    for (let i = 0; i < data["characters"][index]["relics"].length; i++) {
      json["relics"][i] = {
        name: data["characters"][index]["relics"][i]["name"],
        rarity: data["characters"][index]["relics"][i]["rarity"],
        level: data["characters"][index]["relics"][i]["level"],
        icon: "./StarRailRes/" + data["characters"][index]["relics"][i]["icon"],
        score: 0,
        part: data["characters"][index]["relics"][i]["type"],
        main_affix: {
          type: data["characters"][index]["relics"][i]["main_affix"]["type"],
          name: cleanAffixName(data["characters"][index]["relics"][i]["main_affix"]["name"]),
          icon: "./StarRailRes/" + data["characters"][index]["relics"][i]["main_affix"]["icon"],
          val: data["characters"][index]["relics"][i]["main_affix"]["value"],
          dis: data["characters"][index]["relics"][i]["main_affix"]["display"],
        },
        sub_affix: [],
      };

      if (data["characters"][index]["relic_sets"] != 0) {
        for (let i = 0; i < data["characters"][index]["relic_sets"].length; i++) {
          json["relic_sets"][i] = {
            name: data["characters"][index]["relic_sets"][i]["name"],
            icon: "./StarRailRes/" + data["characters"][index]["relic_sets"][i]["icon"],
            num: data["characters"][index]["relic_sets"][i]["num"],
          };
        }
      }

      if (data["characters"][index]["relics"][i]["sub_affix"].length != 0) {
        for (let j = 0; j < data["characters"][index]["relics"][i]["sub_affix"].length; j++) {
          json["relics"][i]["sub_affix"][j] = {
            type: data["characters"][index]["relics"][i]["sub_affix"][j]["type"],
            name: cleanAffixName(data["characters"][index]["relics"][i]["sub_affix"][j]["name"]),
            icon: "./StarRailRes/" + data["characters"][index]["relics"][i]["sub_affix"][j]["icon"],
            val: data["characters"][index]["relics"][i]["sub_affix"][j]["value"],
            dis: data["characters"][index]["relics"][i]["sub_affix"][j]["display"],
          };
        }
      }
    }
  }

  let obj = [];
  for (let i = 0; i < data["characters"][index]["additions"].length; i++) {
    obj.push({
      name: cleanAffixName(data["characters"][index]["additions"][i]["name"].replace(/..?属性ダメージ/, "属性ダメ")),
      icon: "./StarRailRes/" + data["characters"][index]["additions"][i]["icon"],
      val: data["characters"][index]["additions"][i]["display"],
    });

    for (let j = 0; j < data["characters"][index]["attributes"].length; j++) {
      if (data["characters"][index]["additions"][i]["name"] == data["characters"][index]["attributes"][j]["name"]) {
        if (data["characters"][index]["additions"][i]["percent"] == false) {
          obj[i]["val"] = (data["characters"][index]["additions"][i]["value"] + data["characters"][index]["attributes"][j]["value"]).toFixed(0);
        } else {
          obj[i]["val"] = ((data["characters"][index]["additions"][i]["value"] + data["characters"][index]["attributes"][j]["value"]) * 100).toFixed(1) + "%";
        }
      }
    }
  }

  const order = ["HP", "攻撃力", "防御力", "速度", "会心率", "会心ダメ", "撃破特効", "EP回復効率", "効果命中", "効果抵抗", "治癒量", "属性ダメ"];

  obj.sort((a, b) => {
    return order.indexOf(a.name) - order.indexOf(b.name);
  });

  json.status = obj;

  return json;
}

async function getDataScore(index) {
  let json = getDataBase(index);

  const weight = await (await fetch("./StarRailScore/score.json")).json();
  const weight_none = await (await fetch("./assets/none.json")).json();
  const maxVal = await (await fetch("./assets/max_value.json")).json();

  let mainScore = 0;
  let subScore = 0;
  let totalScore = 0;
  let main_weight;
  let sub_weight;

  for (let i = 0; i < json["relics"].length; i++) {
    if (json["id"] in weight) {
      main_weight = weight[json["id"]]["main"][json["relics"][i]["part"]][json["relics"][i]["main_affix"]["type"]];
    } else {
      main_weight = weight_none["main"][json["relics"][i]["part"]][json["relics"][i]["main_affix"]["type"]];
    }

    mainScore = Number((((json["relics"][i]["level"] + 1) / 16) * main_weight * 100).toFixed(1));
    subScore = 0;

    for (let j = 0; j < json["relics"][i]["sub_affix"].length; j++) {
      if (json["id"] in weight) {
        sub_weight = weight[json["id"]]["weight"][json["relics"][i]["sub_affix"][j]["type"]];
      } else {
        sub_weight = weight_none["weight"][json["relics"][i]["sub_affix"][j]["type"]];
      }

      subScore += Number((json["relics"][i]["sub_affix"][j]["val"] / maxVal[json["relics"][i]["sub_affix"][j]["type"]]) * sub_weight * 100);
    }
    json["relics"][i]["score"] = (mainScore * 0.5 + subScore * 0.5).toFixed(1);

    totalScore += Number((mainScore * 0.5 + subScore * 0.5).toFixed(1));
  }

  json["total_score"] = totalScore.toFixed(1);

  return json;
}

async function createImg(index) {
  const card = document.getElementById("card-img");
  const card_img = document.createElement("img");

  card.innerHTML = "画像を生成中...";

  const json = await getDataScore(index);

  const canvas = document.getElementById("card");
  const ctx = canvas.getContext("2d");

  await document.fonts.ready;

  const back = await loadImage("./assets/img/back.png");
  ctx.drawImage(back, 0, 0, 1920, 1080);

  const icon = await loadImage(json["icon"]);
  ctx.drawImage(icon, 200, -90, icon.width / 1.5, icon.height / 1.5);

  const element = await loadImage(json.element);
  ctx.drawImage(element, 160, 75, element.width / 5, element.height / 5);

  const path = await loadImage(json.path);
  ctx.drawImage(path, 220, 79, path.width / 10, path.height / 10);

  const front = await loadImage("./assets/img/front.png");
  ctx.drawImage(front, 0, 0, 1920, 1080);

  let inter = json.status.length === 11 ? 55 : json.status.length === 10 ? 60 : 65;
  for (let i = 0; i < json.status.length; i++) {
    const img = await loadImage(json.status[i].icon);
    ctx.drawImage(img, 40, 155 + i * inter, img.width / 2.3, img.height / 2.3);

    ctx.fillStyle = "#fff";
    ctx.font = '38px "kt"';
    ctx.fillText(json.status[i].name, 95, 200 + i * inter);
    ctx.textAlign = "right";
    ctx.fillText(json.status[i].val, 470, 200 + i * inter);
    ctx.textAlign = "start";
  }

  if (json["light_cone"] != null) {
    await loadImage(json["light_cone"]["icon"]).then((img) => {
      ctx.font = '20px "kt"';
      ctx.fillStyle = "rgb(255, 255, 255)";
      ctx.fillText(json["light_cone"]["name"], 250, 830);
      ctx.font = '35px "kt"';
      ctx.fillText("Lv. " + json["light_cone"]["level"] + " R" + json["light_cone"]["rank"], 250, 880);

      ctx.drawImage(img, 50, 810, 160.5, 199);
    });
    await loadImage("StarRailRes/icon/deco/Rarity" + json["light_cone"]["rarity"] + ".png").then((img) => {
      if (json["light_cone"]["rarity"] == 3) ctx.drawImage(img, -25, 950, img.width / 1.5, img.height / 1.5);
      else if (json["light_cone"]["rarity"] == 4) ctx.drawImage(img, -45, 950, img.width / 1.5, img.height / 1.5);
      else ctx.drawImage(img, -55, 950, img.width / 1.5, img.height / 1.5);
    });
    for (let i = 0; i < json["light_cone"]["attributes"].length; i++) {
      await loadImage(json["light_cone"]["attributes"][i]["icon"]).then((img) => {
        ctx.drawImage(img, 240, 880 + i * 40, img.width / 2.5, img.height / 2.5);

        ctx.font = "30px 'kt'";
        ctx.fillText(json["light_cone"]["attributes"][i]["name"], 300, 920 + i * 40);
        ctx.textAlign = "right";
        ctx.fillText(json["light_cone"]["attributes"][i]["val"], 470, 920 + i * 40);
        ctx.textAlign = "start";
      });
    }
  }

  for (let i = 0; i < json["skill"].length; i++) {
    await loadImage(json["skill"][i]["icon"]).then((img) => {
      ctx.drawImage(img, 540, 220 + i * 150, img.width / 1.3, img.height / 1.3);
      ctx.font = '40px "kt"';
      ctx.fillStyle = "rgb(255, 255, 255)";
      if (json["skill"][i]["level"].toString().length == 1) {
        ctx.fillText(json["skill"][i]["level"], 575, 355 + i * 150);
      } else if (json["skill"][i]["level"].toString().length == 2) {
        ctx.fillText(json["skill"][i]["level"], 560, 355 + i * 150);
      }
    });
  }

  for (let i = 0; i < json["rank_icons"].length; i++) {
    await loadImage(json["rank_icons"][i]["icon"]).then((img) => {
      ctx.drawImage(img, 1100, 130 + i * 150, img.width / 1.3, img.height / 1.3);
    });
    if (json["rank_icons"][i]["lock"] == true) {
      await loadImage("./assets/img/back_icon.png").then((img) => {
        ctx.drawImage(img, 1100, 130 + i * 150, img.width / 1.3, img.height / 1.3);
      });
    }
  }

  if (json["relics"]) {
    for (let i = 0; i < json["relics"].length; i++) {
      await loadImage(json["relics"][i]["icon"]).then((img) => {
        ctx.drawImage(img, 1240, 55 + i * 170, img.width, img.height);
      });
      await loadImage(json["relics"][i]["main_affix"]["icon"]).then((img) => {
        ctx.drawImage(img, 1350, 70 + i * 170, img.width / 2.6, img.height / 2.6);
        ctx.font = "30px 'kt'";
        ctx.fillStyle = "rgb(255, 255, 255)";
        ctx.fillText(json["relics"][i]["main_affix"]["name"], 1400, 105 + i * 170);
        ctx.textAlign = "right";
        ctx.font = "40px 'kt'";
        ctx.fillText(json["relics"][i]["main_affix"]["dis"], 1480, 155 + i * 170);
        ctx.fillRect(1530, 50 + i * 170, 5, 150);
        ctx.textAlign = "start";
      });
      await loadImage("StarRailRes/icon/deco/Rarity" + json["relics"][i]["rarity"] + ".png").then((img) => {
        ctx.drawImage(img, 1180, 140 + i * 170, img.width / 2, img.height / 2);
        ctx.font = "25px 'kt'";
        ctx.fillStyle = "rgb(255, 255, 255)";
        ctx.fillText("Lv. " + json["relics"][i]["level"], 1430, 185 + i * 170);
        ctx.strokeStyle = "rgb(255, 255, 255)";
        ctx.strokeText("Lv. " + json["relics"][i]["level"], 1430, 185 + i * 170);
      });

      for (let j = 0; j < json["relics"][i]["sub_affix"].length; j++) {
        await loadImage(json["relics"][i]["sub_affix"][j]["icon"]).then((img) => {
          ctx.drawImage(img, 1540, 50 + (i * 170 + j * 34), img.width / 2.7, img.height / 2.7);
          ctx.font = "25px 'kt'";
          ctx.fillStyle = "rgb(255, 255, 255)";
          ctx.fillText(json["relics"][i]["sub_affix"][j]["name"], 1590, 80 + (i * 170 + j * 34));
          ctx.font = '25px "kt"';
          ctx.fillStyle = "rgba(255, 255, 255)";
          ctx.textAlign = "right";
          ctx.fillText(json["relics"][i]["sub_affix"][j]["dis"], 1765, 80 + (i * 170 + j * 34));
          ctx.strokeStyle = "rgb(255, 255, 255)";
          ctx.strokeText(json["relics"][i]["sub_affix"][j]["dis"], 1765, 80 + (i * 170 + j * 34));
          ctx.textAlign = "start";
        });
      }
    }
  }

  if (json["relic_sets"]) {
    let i = 0;
    let point = 0;
    if (json["relic_sets"][0]["name"] == json["relic_sets"][1]["name"]) i = 1;
    for (i; i < json["relic_sets"].length; i++) {
      await loadImage(json["relic_sets"][i]["icon"]).then((img) => {
        ctx.drawImage(img, 680 + point * 130, 820, 70, 70);

        ctx.fillStyle = "rgb(255, 255, 255)";
        ctx.textAlign = "left";
        ctx.font = '30px "kt"';
        ctx.fillText("x" + json["relic_sets"][i]["num"], 750 + point * 130, 870);
      });
      point++;
    }
  }

  ctx.font = '60px "kt"';
  ctx.textAlign = "start";
  ctx.fillStyle = "rgb(255, 255, 255)";
  ctx.fillText(json["name"], 40, 70);

  ctx.font = '35px "kt"';
  ctx.fillStyle = "rgb(255, 255, 255)";
  ctx.fillText("Lv. " + json["level"], 45, 120);
  ctx.strokeStyle = "rgb(255, 255, 255)";
  ctx.strokeText("Lv. " + json["level"], 45, 120);

  ctx.font = '40px "kt"';
  ctx.fillStyle = "rgb(255, 255, 255)";
  ctx.fillText("Total Score", 690, 950);
  ctx.font = '80px "kt"';
  ctx.fillText(json["total_score"], 700, 1030);
  ctx.strokeStyle = "rgb(255, 255, 255)";
  ctx.strokeText(json["total_score"], 700, 1030);

  let scoreRank = "D";
  if (json["total_score"] >= 600) scoreRank = "SS";
  else if (json["total_score"] >= 540) scoreRank = "S";
  else if (json["total_score"] >= 360) scoreRank = "A";
  else if (json["total_score"] >= 240) scoreRank = "B";
  else if (json["total_score"] >= 60) scoreRank = "C";
  ctx.font = '130px "kt"';
  ctx.fillText(scoreRank, 920, 1030);
  ctx.strokeStyle = "rgb(255, 255, 255)";
  ctx.strokeText(scoreRank, 920, 1030);

  if (json["relics"]) {
    for (let i = 0; i < json["relics"].length; i++) {
      ctx.fillRect(1780, 50 + i * 170, 5, 150);
      ctx.font = '30px "kt"';
      ctx.fillStyle = "rgb(255, 255, 255)";
      ctx.fillText("Score", 1795, 90 + i * 170);
      ctx.strokeStyle = "rgb(255, 255, 255)";
      ctx.strokeText("Score", 1795, 90 + i * 170);
      ctx.font = '35px "kt"';
      ctx.fillText(json["relics"][i]["score"], 1800, 130 + i * 170);
      ctx.strokeText(json["relics"][i]["score"], 1800, 130 + i * 170);

      let scoreRank = "D";
      if (json["relics"][i]["score"] >= 100) scoreRank = "SS";
      else if (json["relics"][i]["score"] >= 90) scoreRank = "S";
      else if (json["relics"][i]["score"] >= 60) scoreRank = "A";
      else if (json["relics"][i]["score"] >= 40) scoreRank = "B";
      else if (json["relics"][i]["score"] >= 10) scoreRank = "C";
      ctx.fillText(scoreRank, 1830, 180 + i * 170);
      ctx.strokeText(scoreRank, 1830, 180 + i * 170);
    }
  }

  card_img.src = canvas.toDataURL("image/png");
  card_img.className = "card-img";
  card.innerHTML = "";
  card.appendChild(card_img);
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = src;
    img.onload = () => resolve(img);
    img.onerror = reject;
  });
}

function cleanAffixName(name) {
  return name
    .replace(/..?属性ダメージ/, "属性ダメ")
    .replace("会心ダメージ", "会心ダメ")
    .replace("EP回復効率", "EP回復")
    .replace("基礎", "");
}
