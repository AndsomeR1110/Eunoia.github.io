import type {
  ConversationMode,
  Locale,
  ResponseMode,
  RiskLevel,
  SupportExercise,
} from "@/lib/types";

export const LOCALE_COOKIE_NAME = "eunoia-locale";

const dictionary = {
  en: {
    languageName: "English",
    shell: {
      tagline: "Warm support, safer defaults.",
      description:
        "A youth-centered AI support scaffold with chat, mood tracking, guided coping, crisis routing, and internal review tools.",
      builtFor: "Built for calmer check-ins, guided coping, and visible crisis help pathways.",
      sections: {
        user: "User",
        admin: "Admin",
      },
      nav: {
        overview: "Overview",
        onboarding: "Onboarding",
        chat: "Chat",
        mood: "Mood",
        skills: "Skills",
        helpNow: "Help Now",
        content: "Content",
        risk: "Risk Review",
        resources: "Resources",
      },
    },
    pages: {
      home: {
        eyebrow: "Welcome",
        title: "Eunoia",
        heroTitle: "A calmer place to talk, check in, and ask for support.",
        heroDescription:
          "Start a conversation, log how you're feeling, try a grounding exercise, or jump straight to urgent help if you need it.",
        primaryAction: "Start a chat",
        secondaryAction: "Log your mood",
        helpAction: "Help now",
        safetyTitle: "What to expect",
        safetyDescription: "Supportive by design, clear about limits, and ready to route you to human help.",
        safetyBullets: [
          "Eunoia is an AI support tool, not a therapist or emergency responder.",
          "If a message sounds high-risk, normal chat stops and urgent help options are shown.",
          "You can use an alias instead of your real name for the core experience.",
        ],
        featureCards: [
          {
            title: "Guided Support",
            description: "Talk through stress, school pressure, friendship conflict, or overwhelm with gentle next-step guidance.",
            cta: "Open chat",
            href: "/chat",
          },
          {
            title: "Vent Space",
            description: "Choose a lighter-touch mode when you mostly need to be heard without a pile of advice.",
            cta: "Set your mode",
            href: "/onboarding",
          },
          {
            title: "Mood Tracking",
            description: "Use quick check-ins to notice patterns before your feelings start stacking up silently.",
            cta: "Track mood",
            href: "/mood",
          },
          {
            title: "Skills Library",
            description: "Try breathing, grounding, journaling, and reframing exercises you can use in a few minutes.",
            cta: "Browse skills",
            href: "/skills",
          },
        ],
      },
      onboarding: {
        eyebrow: "User Journey",
        title: "Onboarding",
      },
      chat: {
        eyebrow: "Conversation",
        title: "Chat",
      },
      mood: {
        eyebrow: "Emotional Tracking",
        title: "Mood",
      },
      skills: {
        eyebrow: "Guided Support",
        title: "Skills Library",
        minute: "min",
      },
      helpNow: {
        eyebrow: "Crisis Support",
        title: "Help Now",
        cardTitle: "If safety feels shaky right now",
        cardDescription:
          "This product does not replace emergency help. When there is immediate danger, reach a real person now.",
        steps: [
          "1. Tell a trusted adult, teacher, parent, counselor, or coach what is happening.",
          "2. Move closer to another person. Do not stay alone if you feel at risk.",
          "3. Use a crisis line or local emergency services right away.",
        ],
        callLabel: "Call",
        visitWebsite: "Visit website",
      },
      adminContent: {
        eyebrow: "Admin Console",
        title: "Content Review",
        heroEyebrow: "Knowledge Operations",
        heroTitle: "Review, stage, and publish support content with the same calm product voice.",
        heroDescription:
          "This queue keeps sourced materials readable, traceable, and intentionally gated before the RAG layer can surface them to users.",
        metrics: {
          total: "Content pool",
          published: "Published",
          drafts: "Drafts",
        },
        metricDetails: {
          total: "Everything currently stored in the knowledge library.",
          published: "Visible to retrieval and ready for grounded responses.",
          drafts: "Waiting for a human publish decision.",
        },
      },
      adminRisk: {
        eyebrow: "Admin Console",
        title: "Risk Events",
        heroEyebrow: "Safety Review",
        heroTitle: "Keep high-signal risk events visible, fast to scan, and easy to escalate.",
        heroDescription:
          "The review queue separates higher-risk moments from routine chat so the safety team can triage patterns, reasons, and triggered signals at a glance.",
        metrics: {
          total: "Captured events",
          critical: "Critical",
          high: "High",
        },
        metricDetails: {
          total: "All stored high-risk and crisis-adjacent events.",
          critical: "Messages that look closest to immediate danger.",
          high: "Serious events that still need timely review.",
        },
        queueTitle: "High-risk review queue",
        queueDescription:
          "High and critical user messages are recorded separately from standard conversation turns.",
        signals: "Signals",
        empty: "No high-risk events captured yet.",
      },
      adminResources: {
        eyebrow: "Admin Console",
        title: "Resource Directory",
        heroEyebrow: "Crisis Routing",
        heroTitle: "Shape the help pathways users see when the product needs to hand off to people.",
        heroDescription:
          "Resource coverage needs to stay clear, current, and easy to edit so urgent routing remains trustworthy under stress.",
        metrics: {
          total: "Directory size",
          urgent: "Urgent routes",
          coverage: "Region coverage",
        },
        metricDetails: {
          total: "Every support destination currently available in-product.",
          urgent: "Entries meant for immediate handoff moments.",
          coverage: "Distinct regions represented in this directory.",
        },
      },
    },
    onboarding: {
      title: "Set your vibe",
      description:
        "This prototype starts with an alias, not a real-name signup, to reduce friction and protect privacy.",
      alias: "Alias",
      aliasPlaceholder: "Quiet Comet",
      chatMode: "Chat mode",
      supportTitle: "Guided Support",
      supportDescription: "Empathy plus light coping suggestions.",
      ventTitle: "Vent Space",
      ventDescription: "Lower-advice mode focused on listening and reflection.",
      continue: "Continue to chat",
      safetyTitle: "Safety defaults",
      safetyDescription:
        "The framework is designed to stay supportive without pretending to be treatment.",
      bullets: [
        "Visible disclaimer: Eunoia is an AI support tool, not a clinician.",
        "High-risk messages bypass freeform generation and trigger crisis scripts.",
        "Help resources stay one tap away on every key screen.",
        "Only an alias is required for MVP usage.",
      ],
      previewHelp: "Preview the help-now flow",
    },
    chat: {
      chattingAs: "Chatting as",
      supportMode: "Guided Support",
      ventMode: "Vent Space",
      riskBanner: "High-risk messages trigger a scripted crisis response.",
      preMoodTitle: "Pre-chat mood check-in",
      startTitle: "Start softly",
      startDescription:
        "This scaffold is tuned for empathy, structure, and clear safety boundaries. It is not a therapist and it will suggest human help when things sound unsafe.",
      inputPlaceholder: "Tell Eunoia what feels heavy right now...",
      thinking: "Thinking...",
      send: "Send",
      urgentHelp: "Need urgent help instead?",
      supportSummaryTitle: "Real-time support summary",
      supportSummaryDescription:
        "A product-facing snapshot of mood, risk, next steps, and grounding content.",
      latestResponse: "Latest response",
      waiting: "Waiting for first message",
      recommendedActions: "Recommended actions",
      actionGuidance: "Action guidance will appear here.",
      resourceLinks: "Resource links",
      safetyLedgerTitle: "Safety ledger",
      safetyLedgerDescription: "What the risk layer noticed most recently.",
      riskLevel: "Risk level",
      reason: "Reason",
      matchedSignals: "Matched signals",
      noMessages: "No messages yet.",
      noneDetected: "None detected",
      sessionError: "Unable to start the chat session.",
      sendError: "The message could not be sent right now.",
      starterPrompts: [
        "I can't stop worrying about school.",
        "My friend group feels weird and I don't know what to do.",
        "I just need somewhere to vent without getting judged.",
      ],
    },
    mood: {
      logTitle: "Log today's check-in",
      logDescription: "This page is wired to the same anonymous session used by the chat flow.",
      missingSession: "Start a chat session first so mood data has a session anchor.",
      notePlaceholder: "Optional note: what made today feel this way?",
      trendTitle: "Trend snapshot",
      trendDescription: "A lightweight timeline for MVP emotional tracking.",
      empty: "No mood entries yet.",
    },
    adminContent: {
      importTitle: "Import web-based source material",
      importDescription:
        "Open-web content enters as draft only. Publishing requires an explicit review step.",
      placeholders: {
        title: "title",
        source: "source",
        sourceUrl: "source url",
        tags: "comma-separated tags",
        body: "cleaned source summary",
      },
      importButton: "Import as draft",
      reviewTitle: "Review queue",
      reviewDescription:
        "Published content becomes retrievable by the RAG layer. Drafts stay invisible.",
      sourceLink: "Source",
      publish: "Publish",
      status: {
        draft: "draft",
        published: "published",
      },
    },
    adminResources: {
      title: "Crisis resource directory",
      description: "Editable entries for urgent and near-urgent support links.",
      fields: {
        phone: "Phone",
        textLine: "Text line",
        website: "Website",
        region: "Region",
      },
    },
  },
  zh: {
    languageName: "中文",
    shell: {
      tagline: "温柔支持，安全优先。",
      description:
        "一个面向青少年的 AI 心理支持框架，包含聊天、情绪追踪、引导练习、危机分流与内部审核工具。",
      builtFor: "为更平静的自我检视、引导练习和清晰可见的危机帮助路径而设计。",
      sections: {
        user: "用户端",
        admin: "管理端",
      },
      nav: {
        overview: "概览",
        onboarding: "引导",
        chat: "聊天",
        mood: "情绪",
        skills: "练习",
        helpNow: "立即求助",
        content: "内容",
        risk: "风险复核",
        resources: "求助资源",
      },
    },
    pages: {
      home: {
        eyebrow: "欢迎使用",
        title: "Eunoia",
        heroTitle: "一个更安静、更温和的地方，让你说说近况、记录状态并获得支持。",
        heroDescription:
          "你可以开始一段对话、记录此刻的情绪、做一个简短练习，或者在需要时直接进入紧急求助页面。",
        primaryAction: "开始聊天",
        secondaryAction: "记录情绪",
        helpAction: "立即求助",
        safetyTitle: "你可以期待什么",
        safetyDescription: "它会尽量支持你，也会清楚说明自己的边界，并在需要时引导你找到真人帮助。",
        safetyBullets: [
          "Eunoia 是 AI 支持工具，不是治疗师，也不是紧急救援人员。",
          "如果消息听起来风险较高，普通聊天会停止，并展示紧急帮助选项。",
          "在核心体验中，你可以使用昵称而不是真实姓名。",
        ],
        featureCards: [
          {
            title: "引导支持",
            description: "聊聊压力、学业、人际关系或情绪过载，并获得温和的下一步建议。",
            cta: "进入聊天",
            href: "/chat",
          },
          {
            title: "树洞模式",
            description: "当你主要只是想被听见，而不是一下子收到很多建议时，可以选择更轻的模式。",
            cta: "设置模式",
            href: "/onboarding",
          },
          {
            title: "情绪记录",
            description: "用快速打卡看见自己的波动趋势，不让情绪一直悄悄堆着。",
            cta: "开始记录",
            href: "/mood",
          },
          {
            title: "练习库",
            description: "尝试呼吸、落地、书写和重构想法等几分钟就能完成的小练习。",
            cta: "浏览练习",
            href: "/skills",
          },
        ],
      },
      onboarding: {
        eyebrow: "用户旅程",
        title: "开始使用",
      },
      chat: {
        eyebrow: "对话",
        title: "聊天",
      },
      mood: {
        eyebrow: "情绪追踪",
        title: "情绪",
      },
      skills: {
        eyebrow: "引导支持",
        title: "练习库",
        minute: "分钟",
      },
      helpNow: {
        eyebrow: "危机支持",
        title: "立即求助",
        cardTitle: "如果你现在感觉自己不太安全",
        cardDescription: "这个产品不能替代紧急援助。如果存在即时危险，请立刻联系真人帮助。",
        steps: [
          "1. 立即告诉你信任的成年人、老师、家长、辅导员或教练发生了什么。",
          "2. 尽量靠近其他人。如果你有伤害自己的风险，不要独处。",
          "3. 立刻联系危机热线或当地紧急服务。",
        ],
        callLabel: "拨打",
        visitWebsite: "访问网站",
      },
      adminContent: {
        eyebrow: "管理控制台",
        title: "内容审核",
        heroEyebrow: "知识运营",
        heroTitle: "用同一套温和而克制的产品语气，审核、暂存并发布支持内容。",
        heroDescription:
          "这个队列让外部来源内容在进入 RAG 检索前保持可读、可追踪，也必须经过有意识的人审发布。",
        metrics: {
          total: "内容池",
          published: "已发布",
          drafts: "草稿",
        },
        metricDetails: {
          total: "当前知识库中保存的全部内容。",
          published: "已可被检索，用于支撑回复。",
          drafts: "仍在等待人工发布决策。",
        },
      },
      adminRisk: {
        eyebrow: "管理控制台",
        title: "风险事件",
        heroEyebrow: "安全复核",
        heroTitle: "让高信号风险事件始终清晰可见、易于扫描，也更容易被及时升级处理。",
        heroDescription:
          "复核队列把高风险时刻从普通对话里抽离出来，方便安全团队快速查看模式、触发原因和命中的信号。",
        metrics: {
          total: "已捕获事件",
          critical: "危机级",
          high: "高风险",
        },
        metricDetails: {
          total: "所有已记录的高风险与危机相邻事件。",
          critical: "最接近即时危险的消息。",
          high: "仍需尽快复核的严重事件。",
        },
        queueTitle: "高风险复核队列",
        queueDescription: "高风险与危机级别消息会与普通对话记录分开保存。",
        signals: "触发信号",
        empty: "还没有记录到高风险事件。",
      },
      adminResources: {
        eyebrow: "管理控制台",
        title: "求助资源目录",
        heroEyebrow: "危机分流",
        heroTitle: "打磨用户在需要转交给真人帮助时看到的每一条支持路径。",
        heroDescription:
          "资源覆盖需要保持清晰、及时并易于编辑，这样产品在高压场景里的分流才值得信任。",
        metrics: {
          total: "目录规模",
          urgent: "紧急入口",
          coverage: "地区覆盖",
        },
        metricDetails: {
          total: "当前产品内可用的全部支持目的地。",
          urgent: "面向即时转交场景的入口数量。",
          coverage: "目录里覆盖到的不同地区数。",
        },
      },
    },
    onboarding: {
      title: "先设定一下你的状态",
      description: "这个原型只需要昵称，不需要真实姓名注册，以降低使用门槛并保护隐私。",
      alias: "昵称",
      aliasPlaceholder: "安静的彗星",
      chatMode: "聊天模式",
      supportTitle: "引导支持",
      supportDescription: "以共情回应为主，并提供轻量 coping 建议。",
      ventTitle: "树洞模式",
      ventDescription: "更少建议，更多倾听与反映。",
      continue: "继续进入聊天",
      safetyTitle: "默认安全设置",
      safetyDescription: "这个框架会保持支持性，但不会假装自己是在提供治疗。",
      bullets: [
        "清晰免责声明：Eunoia 是 AI 支持工具，不是临床专业人员。",
        "高风险消息会绕过自由生成并触发危机脚本。",
        "求助资源会在关键页面保持一键可见。",
        "MVP 阶段仅需昵称即可使用。",
      ],
      previewHelp: "预览立即求助页面",
    },
    chat: {
      chattingAs: "当前昵称",
      supportMode: "引导支持",
      ventMode: "树洞模式",
      riskBanner: "高风险消息会触发脚本化危机回应。",
      preMoodTitle: "聊天前情绪打卡",
      startTitle: "先轻轻开始",
      startDescription:
        "这个框架强调共情、结构和清晰的安全边界。它不是治疗师，当内容听起来不安全时会鼓励你寻求人类帮助。",
      inputPlaceholder: "告诉 Eunoia 现在最压着你的是什么……",
      thinking: "正在思考…",
      send: "发送",
      urgentHelp: "如果你现在更需要紧急帮助？",
      supportSummaryTitle: "实时支持摘要",
      supportSummaryDescription: "从产品角度展示当前情绪、风险、下一步建议和支持资源。",
      latestResponse: "最近一次回应",
      waiting: "等待第一条消息",
      recommendedActions: "建议动作",
      actionGuidance: "这里会显示建议动作。",
      resourceLinks: "求助资源",
      safetyLedgerTitle: "安全记录",
      safetyLedgerDescription: "最近一次风险层识别到了什么。",
      riskLevel: "风险等级",
      reason: "原因",
      matchedSignals: "匹配信号",
      noMessages: "还没有消息。",
      noneDetected: "未检测到",
      sessionError: "无法启动聊天会话。",
      sendError: "这条消息暂时无法发送。",
      starterPrompts: [
        "我一直停不下来担心学校的事情。",
        "我和朋友之间气氛怪怪的，不知道怎么办。",
        "我只是想找个不会评判我的地方说说话。",
      ],
    },
    mood: {
      logTitle: "记录今天的情绪",
      logDescription: "这个页面会连接到当前匿名聊天会话。",
      missingSession: "请先开始一个聊天会话，这样情绪记录才能绑定到对应 session。",
      notePlaceholder: "可选备注：今天为什么会有这种感觉？",
      trendTitle: "趋势快照",
      trendDescription: "这是 MVP 阶段的轻量情绪时间线。",
      empty: "还没有情绪记录。",
    },
    adminContent: {
      importTitle: "导入网页来源内容",
      importDescription: "公开网页内容只会先进入草稿状态，必须经过审核后才能发布。",
      placeholders: {
        title: "标题",
        source: "来源",
        sourceUrl: "来源链接",
        tags: "用逗号分隔标签",
        body: "清洗后的内容摘要",
      },
      importButton: "导入为草稿",
      reviewTitle: "审核队列",
      reviewDescription: "只有已发布内容才会进入 RAG 检索，草稿不会被命中。",
      sourceLink: "来源",
      publish: "发布",
      status: {
        draft: "草稿",
        published: "已发布",
      },
    },
    adminResources: {
      title: "危机资源目录",
      description: "可编辑的紧急与高优先级支持资源。",
      fields: {
        phone: "电话",
        textLine: "短信渠道",
        website: "网站",
        region: "地区",
      },
    },
  },
} as const;

export function getDictionary(locale: Locale) {
  return dictionary[locale];
}

export function getMoodOptions(locale: Locale) {
  return locale === "zh"
    ? [
        { score: 1, label: "快撑不住了" },
        { score: 2, label: "很沉重" },
        { score: 3, label: "有点复杂" },
        { score: 4, label: "还算稳定" },
        { score: 5, label: "有一点希望" },
      ]
    : [
        { score: 1, label: "Barely holding on" },
        { score: 2, label: "Heavy" },
        { score: 3, label: "Mixed" },
        { score: 4, label: "Steady" },
        { score: 5, label: "Hopeful" },
      ];
}

export function getExerciseCategoryLabel(locale: Locale, category: SupportExercise["category"]) {
  const labels = {
    en: {
      grounding: "grounding",
      breathing: "breathing",
      journaling: "journaling",
      cbt: "cbt",
      dbt: "dbt",
    },
    zh: {
      grounding: "落地练习",
      breathing: "呼吸练习",
      journaling: "书写练习",
      cbt: "CBT",
      dbt: "DBT",
    },
  };

  return labels[locale][category];
}

export function getRiskLevelLabel(locale: Locale, risk: RiskLevel) {
  const labels = {
    en: {
      LOW: "LOW",
      MODERATE: "MODERATE",
      HIGH: "HIGH",
      CRITICAL: "CRITICAL",
    },
    zh: {
      LOW: "低",
      MODERATE: "中",
      HIGH: "高",
      CRITICAL: "危机",
    },
  };

  return labels[locale][risk];
}

export function getResponseModeLabel(locale: Locale, mode: ResponseMode) {
  return locale === "zh"
    ? mode === "generated"
      ? "模型生成"
      : "脚本回复"
    : mode;
}

export function getPhaseLabel(locale: Locale, phase: "pre" | "post") {
  return locale === "zh" ? (phase === "pre" ? "前测" : "后测") : phase;
}

export function getConversationModeLabel(locale: Locale, mode: ConversationMode) {
  if (locale === "zh") {
    return mode === "vent" ? "树洞模式" : "引导支持";
  }

  return mode === "vent" ? "Vent Space" : "Guided Support";
}

export function getDemoExerciseCopy(locale: Locale, slug: string) {
  if (locale === "en") {
    return null;
  }

  const map = {
    "box-breathing": {
      title: "方框呼吸重置",
      summary: "一个 2 分钟的呼吸节奏练习，帮助缓和压力上涌。",
      steps: ["吸气四拍。", "停留四拍。", "呼气四拍。", "再停留四拍，重复四轮。"],
    },
    "54321-grounding": {
      title: "5-4-3-2-1 落地练习",
      summary: "当你感到过载或脑中停不下来时，用感官把自己拉回当下。",
      steps: [
        "说出你能看到的五样东西。",
        "说出你能触摸到的四样东西。",
        "说出你能听到的三种声音。",
        "说出你能闻到的两种气味。",
        "说出一种你能尝到或感激的东西。",
      ],
    },
    "thought-story-check": {
      title: "想法故事检查",
      summary: "把事实和大脑自动补出来的故事分开看。",
      steps: [
        "先用一句话写下发生了什么。",
        "列出你确定无疑的事实。",
        "列出大脑自动加上的解释或故事。",
        "把它改写成更温和、更平衡的版本。",
      ],
    },
  } as const;

  return map[slug as keyof typeof map] ?? null;
}

export function getDemoResourceCopy(locale: Locale, id: string) {
  if (locale === "en") {
    return null;
  }

  const map = {
    "res-988": {
      name: "988 自杀与危机生命线",
      description: "提供 24/7 电话或在线危机支持。",
      region: "美国",
    },
    "res-crisis-text": {
      name: "危机短信热线",
      description: "当你不想开口说话时，可以通过短信获得支持。",
      region: "美国",
    },
    "res-trevor": {
      name: "The Trevor Project",
      description: "面向 LGBTQ+ 青少年的危机与咨询支持。",
      region: "国际",
    },
    "res-emergency": {
      name: "当地紧急服务",
      description: "当存在即时危险或无法保证自身安全时使用。",
      region: "本地",
    },
  } as const;

  return map[id as keyof typeof map] ?? null;
}
