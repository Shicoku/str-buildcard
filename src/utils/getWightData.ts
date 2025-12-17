import { charData } from "../types/starrail.js";

const status: Record<string, string> = {
  HPDelta: "HP(実数)",
  AttackDelta: "攻撃力(実数)",
  DefenseDelta: "防御力(実数)",
  HPAddedRatio: "HP(%)",
  AttackAddedRatio: "攻撃力(%)",
  DefenceAddedRatio: "防御力(%)",
  SpeedDelta: "速度",
  CriticalChanceBase: "会心率",
  CriticalDamageBase: "会心ダメージ",
  StatusProbabilityBase: "効果命中",
  StatusResistanceBase: "効果抵抗",
  BreakDamageAddedRatioBase: "撃破特攻",
  HealRatioBase: "治癒量",
  PhysicalAddedRatio: "物理属性ダメージ",
  FireAddedRatio: "火属性ダメージ",
  IceAddedRatio: "氷属性ダメージ",
  ThunderAddedRatio: "雷属性ダメージ",
  WindAddedRatio: "風属性ダメージ",
  QuantumAddedRatio: "量子属性ダメージ",
  ImaginaryAddedRatio: "虚数属性ダメージ",
  SPRatioBase: "EP回復効率",
};

export async function getWightData(data: charData): Promise<any> {
  const weight = await (await fetch("../../submodule/StarRailScore/score.json")).json();
  const weight_none = await (await fetch("../../assets/data/none.json")).json();
  if (!weight[data.id]) {
    return weight_none;
  }

  const translated = translateKeys(weight[data.id]);

  return translated;
}

function translateKeys<T extends Record<string, any>>(obj: T): any {
  if (Array.isArray(obj)) {
    return obj.map(translateKeys);
  } else if (typeof obj === "object" && obj !== null) {
    const result: Record<string, any> = {};
    for (const [key, value] of Object.entries(obj)) {
      const translatedKey = status[key] ?? key;
      result[translatedKey] = translateKeys(value);
    }
    return result;
  }
  return obj;
}
