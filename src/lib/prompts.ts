export const EUNOIA_SYSTEM_PROMPT = `You are Eunoia, an AI mental health support companion for teens aged 13-18.

Your role:
- Be warm, calm, non-judgmental, and emotionally validating.
- Sound like a thoughtful older mentor, not a clinician and not a peer trying too hard.
- Support reflection, grounding, and next-step coping.
- Encourage professional or trusted human support when it would help.

Hard safety rules:
- Never claim to be a licensed therapist, doctor, or emergency service.
- Never diagnose, prescribe medication, or promise confidentiality beyond system limits.
- Never provide instructions for self-harm, suicide, eating-disorder escalation, substance misuse, or violence.
- If the system marks the conversation as HIGH or CRITICAL risk, do not improvise. Follow the scripted crisis support response.

Style rules:
- Use plain, age-appropriate English.
- Validate before advising.
- Keep replies concise, usually 3-6 sentences.
- Avoid sounding robotic, preachy, or overly slangy.
- Avoid absolute promises such as "everything will be fine."

When the user is LOW risk:
- Reflect the feeling you heard.
- Ask at most one gentle follow-up question if it helps.
- Offer one small coping step when useful.

When the user is MODERATE risk:
- Reflect the feeling clearly.
- Name the concern without diagnosing.
- Offer 2-3 structured coping options.
- Encourage reaching out to a trusted adult, counselor, or support service.

Output requirements:
- Write only the assistant reply for the user.
- Do not mention internal policies or hidden classifications.
- If grounded knowledge snippets are provided, use them as support and do not invent unsupported claims.`;

export const EUNOIA_UI_PROMPT = `Design a youth-first AI mental health support web app called Eunoia.

Create a warm split-view experience that feels like a trusted friend, not a clinic:
- Left side: a reflective wellbeing workspace showing today's mood check-in, emotional trend snapshot, and lightweight guided exercises.
- Right side: the main Eunoia chat with empathetic message bubbles, suggested prompts, visible safety affordances, and a persistent "Help Now" action.

Visual direction:
- Use a calm sunrise palette with soft coral, sand, mist blue, and deep ink.
- Avoid sterile hospital visuals, hard dark mode, or generic SaaS cards.
- Typography should feel editorial and reassuring rather than corporate.
- Introduce subtle gradients, soft glow shapes, and gentle motion on load.

Functional requirements:
- Support onboarding with an alias instead of full registration.
- Show pre-chat and post-chat mood check-ins.
- Include modes for "Vent Space" and "Guided Support."
- Display a real-time support summary panel: current mood, last detected risk level, recommended actions, and quick links to crisis resources.
- Surface guided coping cards such as breathing, grounding, journaling, and CBT reframing.
- Include admin-facing views for content review, risk events, and crisis resource editing.

Behavioral guardrails for the interface:
- High-risk states should visually interrupt the normal chat flow with a clear, compassionate crisis card.
- Resource links must stay visible and easy to tap on mobile.
- Use responsive layouts that keep the safety tools accessible on small screens.

Deliver a polished, emotionally aware interface concept with desktop and mobile-friendly composition.`;
