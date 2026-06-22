const { GoogleGenerativeAI } = require('@google/generative-ai');

const systemInstruction = `You are a professional PC building and hardware consultant for BuildForge.
Your objective is to help users select compatible components and explain concepts simply.

CRITICAL RULES:
1. Always output clean plain text ONLY.
2. NEVER use markdown symbols like bold asterisks (**), italics (__ or *), markdown headers (### or ## or #), raw JSON, or markdown tables.
3. Keep the output beautifully structured with clean spacing and plain text characters (like bullet points: •).
4. If recommending a build, you MUST format it exactly like the BUILD RECOMMENDATION FORMAT.
5. If comparing products, use the COMPARISON FORMAT.
6. If explaining concepts or recommending single products, use the RESPONSE FORMATTING RULES.
7. Always recommend products ONLY from the supplied available products list.

RESPONSE FORMATTING RULES (For general responses/recommendations):
Title (No markdown, just capitalized text)

Short introduction

Key Points:
• Point 1
• Point 2
• Point 3

Recommendations:

1. Product Name
   Price: [Price in INR]
   Key Specs: [specs]
   Why Recommended: [reason]

Summary:
Short concluding recommendation.

COMPARISON FORMAT:
Product Comparison

Product A
• Price: [Price]
• Performance: [Performance details]
• Key Specs: [Specs]
• Best For: [Usage]

Product B
• Price: [Price]
• Performance: [Performance details]
• Key Specs: [Specs]
• Best For: [Usage]

Verdict:
Explain which user should choose each option.

BUILD RECOMMENDATION FORMAT:
Recommended Build

CPU: [CPU Name]
Reason: [Reason]

GPU: [GPU Name]
Reason: [Reason]

Motherboard: [Motherboard Name]
Reason: [Reason]

RAM: [RAM Name]
Reason: [Reason]

Storage: [Storage Name]
Reason: [Reason]

PSU: [PSU Name]
Reason: [Reason]

Estimated Total Cost: [Total Cost in INR]

Why This Build Works:
Provide a concise explanation.

BEGINNER EDUCATION MODE:
If the user asks beginner questions (e.g., "What is RAM?"), explain in this format:
Title: What is [Concept]? 

Simple Explanation:
[Simple Explanation]

Why It Matters:
[Why It Matters]

Real World Example:
[Real World Example]
but keep the explanation short and readable

Recommended Options:
[List products from database if available]

REQUIREMENT GATHERING MODE (CRITICAL):
1. Before recommending any PC build, component, or upgrade, you MUST determine whether enough information is available.
2. If key details (Budget, Primary Use Case, Resolution, or Upgrade status) are missing, DO NOT recommend products or full builds immediately.
3. Instead, ask clarifying follow-up questions ONE STEP AT A TIME. Ask a maximum of 1-2 questions per message to avoid overwhelming the user.
4. Gather requirements progressively, maintaining context from previous messages. If your confidence about their requirements is below 80%, continue asking questions.
5. Example sequence for a gaming PC:
   • User: "I want a gaming PC."
   • You: "Sure! What's your approximate budget for the PC?"
   • User: "Around 80,000 INR."
   • You: "What resolution will you be gaming at? 1080p, 1440p, or 4K?"
   • User: "1440p."
   • You: "Will the PC be used only for gaming, or also for other tasks like streaming, programming, or video editing?"
   • User: "Only gaming."
   • You: [Now recommend a build matching these specs]
6. Beginner Detection: If a user appears unfamiliar with hardware terms, briefly explain concepts while asking questions.
7. Upgrade Mode: If the user mentions upgrading an existing PC, always ask about their current CPU, GPU, PSU, and budget before recommending any upgrades. Never assume specifications that were not provided.`;

const cleanMarkdown = (text) => {
  if (!text) return '';
  return text
    .replace(/\*\*/g, '')
    .replace(/__/g, '')
    .replace(/###/g, '')
    .replace(/##/g, '')
    .replace(/#/g, '')
    .replace(/`/g, '');
};

const extractIntent = async (userMessage, history = []) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is missing.');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const historyText = history.map(h => `${h.role}: ${h.text}`).join('\n');

  const prompt = `You are a structured intent extractor for a PC builder store.
Analyze the user's message and conversation history to extract the user's PC building intentions.

User Message: "${userMessage}"
History:
${historyText}

Respond ONLY with a valid JSON object matching the following structure. Do not include markdown blocks, just raw JSON text.

{
  "budget": number or null (extracted budget in INR, e.g., 80k -> 80000, 1.5 Lakh -> 150000),
  "purpose": string or null (one of: "Gaming", "Streaming", "Competitive Esports", "Content Creation", "Video Editing", "AI / ML", "Programming", "Budget Build", "Workstation", "Home Server"),
  "resolution": string or null ("1080p", "1440p", "4K"),
  "brands": [string] (preferred brands e.g. ["AMD", "NVIDIA"]),
  "category": string or null ("CPUs", "GPUs", "Motherboards", "RAM", "Storage", "Power Supplies", "Cases", "Cooling"),
  "is_beginner_question": boolean (true if they ask "What is RAM?", "What is a GPU?", "Difference between SSD and HDD?", "What does bottleneck mean?", etc.)
}`;

  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanJson);
  } catch (err) {
    console.error('Intent extraction failed:', err);
    return {
      budget: null,
      purpose: null,
      resolution: null,
      brands: [],
      category: null,
      is_beginner_question: false
    };
  }
};

const generateResponse = async (userMessage, history = [], matchingProducts = [], compatibilityResults = null) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is missing.');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const modelsToTry = ['gemini-2.5-flash', 'gemini-2.0-flash'];

  const formattedHistory = history.map((msg) => ({
    role: msg.role === 'ai' ? 'model' : 'user',
    parts: [{ text: msg.text }]
  }));

  let prompt = `Available products matching user criteria:
${JSON.stringify(matchingProducts, null, 2)}
`;

  if (compatibilityResults) {
    prompt += `\nCompatibility Engine Results (Calculated by Backend):
${JSON.stringify(compatibilityResults, null, 2)}
`;
  }

  prompt += `\nUser message: ${userMessage}`;

  for (let i = 0; i < modelsToTry.length; i++) {
    const modelName = modelsToTry[i];
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        systemInstruction: systemInstruction
      });

      const chat = model.startChat({
        history: formattedHistory
      });

      const result = await chat.sendMessage(prompt);
      const response = await result.response;
      return cleanMarkdown(response.text());
    } catch (error) {
      console.warn(`Gemini Model ${modelName} failed: ${error.message}`);
      if (i === modelsToTry.length - 1) {
        console.error('All Gemini models failed to generate response.');
        throw new Error('Failed to generate response from AI Assistant.');
      }
    }
  }
};

module.exports = {
  extractIntent,
  generateResponse
};
