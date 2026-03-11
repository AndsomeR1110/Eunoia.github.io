import type {
  Locale,
  RecommendedAction,
  ResourceDirectoryEntry,
  RiskLevel,
  SafetyDecision,
} from "@/lib/types";

const signalMap: Array<{
  level: RiskLevel;
  terms: string[];
  reason: string;
}> = [
  {
    level: "CRITICAL",
    reason: "The message suggests immediate danger or a possible suicide plan.",
    terms: [
      "kill myself",
      "end my life",
      "suicide plan",
      "want to die",
      "hurt myself tonight",
      "self harm plan",
      "goodbye forever",
    ],
  },
  {
    level: "HIGH",
    reason: "The message suggests serious hopelessness or self-harm risk.",
    terms: [
      "better off without me",
      "i should disappear",
      "can't stay safe",
      "want to hurt myself",
      "cut myself",
      "nobody would care if i disappeared",
      "not safe with myself",
    ],
  },
  {
    level: "MODERATE",
    reason: "The message suggests distress that may need structured support.",
    terms: [
      "nothing matters",
      "can't do this anymore",
      "panic attack",
      "overwhelmed",
      "burned out",
      "i hate myself",
      "i feel trapped",
    ],
  },
];

function buildActions(riskLevel: RiskLevel, locale: Locale): RecommendedAction[] {
  if (riskLevel === "LOW") {
    return [
      {
        id: "act-breathe",
        label: locale === "zh" ? "先暂停一下" : "Take one small pause",
        description:
          locale === "zh"
            ? "先试一个很短的呼吸或落地练习，再决定下一步。"
            : "Try a short breathing or grounding exercise before doing anything else.",
      },
    ];
  }

  if (riskLevel === "MODERATE") {
    return [
      {
        id: "act-ground",
        label: locale === "zh" ? "做一个落地练习" : "Use a grounding skill",
        description:
          locale === "zh"
            ? "选一个 2 到 5 分钟的小练习，先把强度降下来。"
            : "Pick one 2-5 minute exercise to slow the intensity down.",
      },
      {
        id: "act-reach-out",
        label: locale === "zh" ? "告诉一个信任的人" : "Tell one trusted person",
        description:
          locale === "zh"
            ? "朋友、家长、辅导员、老师或教练都可以。"
            : "A friend, parent, counselor, teacher, or coach counts.",
      },
    ];
  }

  return [
    {
      id: "act-contact-now",
      label: locale === "zh" ? "立刻联系真人帮助" : "Get human help now",
      description:
        locale === "zh"
          ? "马上联系信任的成年人、危机热线或紧急服务。"
          : "Contact a trusted adult, crisis line, or emergency service right away.",
    },
    {
      id: "act-stay-near",
      label: locale === "zh" ? "尽量不要独处" : "Stay near another person",
      description:
        locale === "zh"
          ? "如果你觉得自己可能会伤害自己，请不要一个人待着。"
          : "Do not stay alone if you feel at risk of harming yourself.",
    },
  ];
}

function getReason(locale: Locale, riskLevel: RiskLevel, fallback = false) {
  if (locale === "zh") {
    if (fallback) {
      return "消息描述了功能受损和持续性的痛苦。";
    }

    return {
      LOW: "未检测到明显升高的安全风险。",
      MODERATE: "消息显示出较强痛苦，可能需要更结构化的支持。",
      HIGH: "消息显示出严重无望感或自伤风险。",
      CRITICAL: "消息暗示了即时危险或可能存在自杀计划。",
    }[riskLevel];
  }

  if (fallback) {
    return "The message describes functional strain and persistent distress.";
  }

  return {
    LOW: "No elevated safety concerns detected.",
    MODERATE: "The message suggests distress that may need structured support.",
    HIGH: "The message suggests serious hopelessness or self-harm risk.",
    CRITICAL: "The message suggests immediate danger or a possible suicide plan.",
  }[riskLevel];
}

export function classifyMessageRisk(message: string, locale: Locale = "en"): SafetyDecision {
  const normalized = message.toLowerCase();
  const matchedSignals: string[] = [];
  let riskLevel: RiskLevel = "LOW";
  let reason = getReason(locale, "LOW");

  for (const group of signalMap) {
    const matches = group.terms.filter((term) => normalized.includes(term));
    if (matches.length > 0) {
      matchedSignals.push(...matches);
      riskLevel = group.level;
      reason = getReason(locale, group.level);
      break;
    }
  }

  if (riskLevel === "LOW" && /never sleep|can't eat|crying all day/.test(normalized)) {
    riskLevel = "MODERATE";
    reason = getReason(locale, "MODERATE", true);
    matchedSignals.push("functional strain");
  }

  return {
    riskLevel,
    shouldBypassModel: riskLevel === "HIGH" || riskLevel === "CRITICAL",
    reason,
    matchedSignals,
    recommendedActions: buildActions(riskLevel, locale),
  };
}

export function filterResourcesForRisk(
  resources: ResourceDirectoryEntry[],
  riskLevel: RiskLevel,
) {
  if (riskLevel === "LOW") {
    return resources.filter((resource) => resource.urgency === "support").slice(0, 2);
  }

  if (riskLevel === "MODERATE") {
    return resources.filter((resource) => resource.urgency !== "urgent").slice(0, 3);
  }

  return resources.filter((resource) => resource.urgency !== "support").slice(0, 4);
}

export function buildCrisisReply(
  riskLevel: RiskLevel,
  resources: ResourceDirectoryEntry[],
  locale: Locale = "en",
) {
  const urgentContacts = resources
    .map((resource) => {
      const channel = resource.phone ?? resource.textLine ?? resource.website ?? resource.name;
      return `${resource.name}: ${channel}`;
    })
    .join(" | ");

  if (locale === "zh") {
    const opening =
      riskLevel === "CRITICAL"
        ? "谢谢你把这件事说出来。你刚刚描述的情况听起来很紧急，你现在的安全非常重要。"
        : "你刚刚说的内容很严重，我不想把它当作普通聊天来处理。";

    return `${opening} 我只是一个 AI 支持工具，所以我需要鼓励你立刻联系真人帮助。请现在就联系你身边信任的成年人，或者使用这些危机支持资源：${urgentContacts}。如果你正处于即时危险中，或者觉得自己无法保证安全，请立刻拨打当地紧急服务电话。`;
  }

  const opening =
    riskLevel === "CRITICAL"
      ? "I'm really glad you said this out loud. What you shared sounds urgent, and your safety matters right now."
      : "What you shared sounds really serious, and I don't want to treat it like a normal chat message.";

  return `${opening} I'm only an AI support tool, so I need to encourage immediate human help. Please contact a trusted adult near you right now, or use one of these crisis supports: ${urgentContacts}. If you're in immediate danger or feel unable to stay safe, call emergency services now.`;
}
