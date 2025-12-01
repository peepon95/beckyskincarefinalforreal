// Get API key from environment - try multiple sources for compatibility
const GOOGLE_AI_KEY =
  process.env.EXPO_PUBLIC_GOOGLE_AI_KEY ||
  (typeof window !== 'undefined' && window._env_?.EXPO_PUBLIC_GOOGLE_AI_KEY) ||
  (typeof window !== 'undefined' && window.ENV?.EXPO_PUBLIC_GOOGLE_AI_KEY);

const GOOGLE_AI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models';
const SKIN_ANALYSIS_MODEL = 'gemini-2.5-flash';
const PRODUCT_ANALYSIS_MODEL = 'gemini-2.5-flash';

// Enhanced logging for debugging environment issues (especially in Bolt)
console.log('🔑 ===== GOOGLE AI KEY DEBUG =====');
console.log('  - process.env.EXPO_PUBLIC_GOOGLE_AI_KEY:', process.env.EXPO_PUBLIC_GOOGLE_AI_KEY ? 'EXISTS' : 'MISSING');
console.log('  - window._env_:', typeof window !== 'undefined' && window._env_ ? 'EXISTS' : 'MISSING');
console.log('  - window.ENV:', typeof window !== 'undefined' && window.ENV ? 'EXISTS' : 'MISSING');
console.log('  - Final GOOGLE_AI_KEY:', GOOGLE_AI_KEY ? 'LOADED' : 'NOT LOADED');
console.log('  - Key Length:', GOOGLE_AI_KEY?.length || 0);
console.log('  - Starts with AIza:', GOOGLE_AI_KEY?.startsWith('AIza') ? 'YES' : 'NO');
console.log('  - First 10 chars:', GOOGLE_AI_KEY?.substring(0, 10) || 'N/A');
console.log('  - All env keys with GOOGLE:', Object.keys(process.env).filter(k => k.includes('GOOGLE')));
console.log('  - All env keys with EXPO:', Object.keys(process.env).filter(k => k.includes('EXPO')));
console.log('================================');

if (!GOOGLE_AI_KEY || GOOGLE_AI_KEY === 'your_google_ai_key_here') {
  console.error('❌ Google AI API key is missing or invalid!');
  console.error('❌ Set EXPO_PUBLIC_GOOGLE_AI_KEY in your .env file');
  console.error('❌ For Bolt: Add EXPO_PUBLIC_GOOGLE_AI_KEY in environment settings');
  console.error('❌ Get your key at: https://aistudio.google.com/app/apikey');
}

function stripMarkdown(text) {
  let cleaned = text.replace(/```json\n?/g, '');
  cleaned = cleaned.replace(/```\n?/g, '');
  cleaned = cleaned.trim();
  return cleaned;
}

export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function callGoogleAI(prompt, imageBase64, model) {
  // Enhanced API key check
  const trimmedKey = GOOGLE_AI_KEY?.trim();

  if (!GOOGLE_AI_KEY || GOOGLE_AI_KEY === 'your_google_ai_key_here') {
    console.error('❌ Google AI API key is missing or invalid');
    throw new Error('API configuration error. Please set up your Google AI key.');
  }

  if (!trimmedKey.startsWith('AIza')) {
    console.error('❌ API key format is invalid (should start with AIza)');
    throw new Error('Invalid API key format. Please check your Google AI key.');
  }

  if (!imageBase64) {
    throw new Error('No image provided');
  }

  if (!prompt) {
    throw new Error('No analysis prompt provided');
  }

  // Detect mime type from base64 string
  let mimeType = "image/jpeg";
  if (imageBase64.startsWith("data:image/png")) {
    mimeType = "image/png";
  } else if (imageBase64.startsWith("data:image/webp")) {
    mimeType = "image/webp";
  } else if (imageBase64.startsWith("data:image/heic")) {
    mimeType = "image/heic";
  }

  // Extract base64 data without the data:image prefix and clean whitespace
  const rawBase64 = imageBase64.split(',')[1] || imageBase64;
  // Remove all whitespace characters (spaces, tabs, newlines) from base64 string
  const base64Data = rawBase64.replace(/\s/g, '');

  const requestBody = {
    contents: [{
      parts: [
        { text: prompt },
        {
          inline_data: {
            mime_type: mimeType,
            data: base64Data
          }
        }
      ]
    }],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 8000,
    }
  };

  console.log('📡 Calling Google AI API');
  console.log('🔑 API Key present:', GOOGLE_AI_KEY ? 'YES' : 'NO');
  console.log('📊 Model:', model);
  console.log('🖼️ Image Type:', mimeType);

  let response;
  try {
    const controller = new AbortController();
    // 45 second timeout - balanced for mobile and web reliability
    const timeoutId = setTimeout(() => controller.abort(), 45000);

    console.log('🚀 Sending request to Gemini API...');
    const startTime = Date.now();

    response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': trimmedKey,
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal,
      }
    );

    const endTime = Date.now();
    console.log(`⏱️ API request took ${(endTime - startTime) / 1000}s`);

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      console.error('❌ Gemini API error:', response.status, errorText);

      if (response.status === 503) {
        throw new Error("The AI service is temporarily unavailable. Please try again in a moment.");
      }

      throw new Error("Becky couldn't analyse your skin right now. Please try again.");
    }

  } catch (networkError) {
    console.error('❌ Network error:', networkError);
    if (networkError.name === 'AbortError') {
      throw new Error('Request timed out after 45 seconds. Please check your connection and try again.');
    }
    if (networkError.message.includes('fetch')) {
      throw new Error('Network connection failed. Please check your internet connection and try again.');
    }
    throw networkError;
  }

  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch (e) {
      errorData = {};
    }

    console.error('❌ Google AI API error:', response.status, errorData);

    if (response.status === 400) {
      const errorMessage = errorData.error?.message || 'Invalid request format';
      console.error('❌ Detailed 400 Error:', errorMessage);
      throw new Error(`Request failed: ${errorMessage}`);
    } else if (response.status === 403) {
      console.error('💡 Check your Google AI key at https://aistudio.google.com/app/apikey');
      throw new Error('Invalid API Key. Please check your Google AI key configuration.');
    } else if (response.status === 429) {
      throw new Error('Rate limit exceeded. Please wait a moment and try again.');
    } else if (response.status >= 500) {
      throw new Error('Server error. Please try again later.');
    }

    throw new Error(errorData.error?.message || `API error (${response.status}). Please try again.`);
  }

  let data;
  try {
    data = await response.json();
  } catch (jsonError) {
    console.error('❌ Failed to parse API response:', jsonError);
    throw new Error('Invalid response from server. Please try again.');
  }

  console.log('✅ Google AI API response received');

  if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
    console.error('❌ Invalid API response structure:', data);
    throw new Error('Unexpected response format. Please try again.');
  }

  const textContent = data.candidates[0].content.parts
    .filter(part => part.text)
    .map(part => part.text)
    .join('');

  return textContent;
}

async function generateActionPlan(analysisData, imageBase64) {
  try {
    const prompt = `You are a board-certified dermatologist creating a detailed, personalized Action Plan based on skin analysis results.

ANALYSIS SUMMARY:
- Skin Type: ${analysisData.skinType}
- Concerns Identified: ${analysisData.concerns.map(c => `${c.type} (${c.severity}) in ${c.location}`).join('; ')}

YOUR TASK:
Create a comprehensive, dermatologist-style action plan that feels like a professional consultation, NOT generic advice. The plan must reference specific areas visible in the photo and provide tailored guidance.

REQUIREMENTS:
1. Write in a warm, professional tone - like a dermatologist speaking directly to this patient
2. Reference SPECIFIC facial areas from the analysis (cheeks, T-zone, jawline, etc.)
3. Explain WHY each recommendation is important for THEIR specific concerns
4. Create detailed AM and PM routines with:
   - Clear step-by-step instructions
   - Specific product types and ingredients
   - Application frequency and amounts
   - Important cautions and tips
5. Include "When to See a Dermatologist" guidance
6. NO disclaimer at the top - it goes at the end

Return ONLY valid JSON (no markdown):

{
  "introduction": "Personalized opening that acknowledges what you saw in their photo and their main concerns (2-3 sentences)",
  "skinTypeAnalysis": {
    "type": "${analysisData.skinType}",
    "explanation": "Detailed explanation of their skin type based on visible characteristics in specific areas (e.g., 'Your T-zone shows enlarged pores and shine, while your cheeks appear normal to dry...')"
  },
  "concernsDetailed": [
    {
      "concern": "Concern name",
      "severity": "mild|moderate|severe",
      "location": "Specific areas",
      "analysis": "What you see and why it's happening, referencing the visible areas",
      "impact": "How this affects their skin health"
    }
  ],
  "amRoutine": [
    {
      "step": 1,
      "title": "Step name",
      "category": "Cleanse|Treat|Hydrate|Protect",
      "instruction": "Detailed how-to with specifics",
      "products": "What to use and why for THEIR concerns",
      "frequency": "How often",
      "tips": "Important tips or cautions"
    }
  ],
  "pmRoutine": [
    {
      "step": 1,
      "title": "Step name",
      "category": "Cleanse|Treat|Hydrate|Repair",
      "instruction": "Detailed how-to",
      "products": "What to use and why",
      "frequency": "How often",
      "tips": "Tips or cautions"
    }
  ],
  "keyIngredients": [
    {
      "name": "Ingredient with percentage",
      "purpose": "What it does for THEIR specific concerns",
      "usage": "When and how to use",
      "caution": "Important warnings"
    }
  ],
  "lifestyleRecommendations": [
    "Specific lifestyle advice based on their concerns (diet, sleep, stress, sun protection, etc.)"
  ],
  "progressTracking": {
    "week2": "What to expect in 2 weeks",
    "week6": "What to expect in 6 weeks",
    "week12": "What to expect in 12 weeks"
  },
  "whenToSeeDermatologist": [
    "Specific signs that indicate professional consultation needed, based on their current concerns"
  ],
  "disclaimer": "Professional disclaimer - keep brief and place at end"
}

Make it feel personal and specific to THIS person's skin, not a template. Reference the areas you analyzed.`;

    const responseText = await callGoogleAI(prompt, imageBase64, SKIN_ANALYSIS_MODEL);
    const cleanedText = stripMarkdown(responseText);
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error('❌ Action plan generation error:', error);
    // Return a basic structure if generation fails
    return {
      introduction: "Based on your skin analysis, I've created a personalized action plan to address your specific concerns.",
      skinTypeAnalysis: {
        type: analysisData.skinType,
        explanation: `Your skin type is ${analysisData.skinType}.`
      },
      concernsDetailed: analysisData.concerns || [],
      amRoutine: [],
      pmRoutine: [],
      keyIngredients: analysisData.recommendations || [],
      lifestyleRecommendations: [],
      progressTracking: {
        week2: "Initial results may begin to show",
        week6: "Noticeable improvements expected",
        week12: "Significant progress in skin health"
      },
      whenToSeeDermatologist: [
        "If concerns worsen or don't improve within 8-12 weeks",
        "If you experience severe irritation or allergic reactions",
        "For persistent or severe skin conditions"
      ],
      disclaimer: "This analysis is for informational purposes only and does not replace professional medical advice. Consult a dermatologist for medical concerns."
    };
  }
}

export async function analyzeSkin(imageBase64) {
  try {
    console.log('🔍 API: Starting skin analysis');
    console.log('📊 Using model:', SKIN_ANALYSIS_MODEL);
    console.log('🔑 Google AI endpoint:', GOOGLE_AI_API_URL);
    console.log('API Key available:', GOOGLE_AI_KEY ? 'YES' : 'NO');
    console.log('API Key length:', GOOGLE_AI_KEY?.length || 0);
    console.log('Image data length:', imageBase64?.length || 0);

    // Validate API key
    if (!GOOGLE_AI_KEY || GOOGLE_AI_KEY === 'your_google_ai_key_here') {
      console.error('❌ Google AI API key is missing or invalid');
      throw new Error("Becky couldn't analyse your skin right now. Please contact support.");
    }

    // Validate image data
    if (!imageBase64) {
      console.error('❌ No image data provided');
      throw new Error('No image provided. Please take a photo first.');
    }

    // Validate image format
    if (!imageBase64.startsWith('data:image/')) {
      console.error('❌ Invalid image format');
      throw new Error('Invalid image format. Please try taking the photo again.');
    }

    const prompt = `You are an AI assistant that visually analyzes skin photos.

Your task is to describe what you observe in the image in a calm, clear, and non-diagnostic manner.

GUIDELINES:
- Describe visible features based purely on appearance
- You may use descriptive terms such as:
  "localized raised lesion", "pigmented spot", "vascular lesion-like area", "inflamed breakout", "uneven texture", "area of redness", "visible pores", "dry patches", "surface roughness", "textural irregularity"
- Do NOT guess or diagnose medical conditions
- Prefer more specific descriptive labels over generic terms like "blemish" when the image supports it
- Keep language professional, factual, and non-alarming
- Base all observations ONLY on what you can visually see in THIS photo
- If you cannot clearly see something, acknowledge the limitation

VISUAL ANALYSIS APPROACH:
1. Examine overall skin appearance:
   - Texture (smooth, rough, uneven)
   - Tone (even, patchy, discolored areas)
   - Surface characteristics (shine, dryness, flakiness)
   - Pore visibility

2. Identify specific visible features:
   - Raised areas or bumps
   - Flat pigmented spots
   - Areas of redness or inflammation
   - Textural changes
   - Surface disruptions

3. Note locations precisely:
   - Use anatomical terms: "mid-forehead", "left cheek", "chin area", "T-zone", "around nose", "jawline"
   - Describe distribution: "scattered across", "concentrated in", "isolated to"

Return ONLY valid JSON in the following structure (no markdown, no code blocks, no extra text):

{
  "skin_type": "Normal|Dry|Oily|Combination|Sensitive|Unknown",
  "overall_assessment": "2-3 human-friendly sentences describing what you visually observe in this photo. Focus on appearance, not assumptions.",
  "key_concerns": [
    {
      "name": "Descriptive visual label (e.g., 'Localized raised lesion', 'Cluster of inflamed breakouts', 'Pigmented spots', 'Textural roughness', 'Vascular lesion-like area')",
      "severity": "Mild|Moderate|Severe",
      "location": "Specific anatomical location where you see this feature",
      "short_description": "1-2 sentences describing exactly what you observe visually - size, color, distribution, appearance"
    }
  ],
  "ingredients_to_avoid": [
    {
      "name": "Ingredient name",
      "reason": "Short explanation of why it may irritate or worsen this visible skin condition"
    }
  ],
  "ingredients_that_help": [
    {
      "name": "Ingredient name (with percentage if standard, e.g., 'Niacinamide 10%', 'Salicylic Acid 2%')",
      "use_for": "How it may support or calm the visible concern you observed",
      "product_type": "Serum|Cleanser|Moisturiser|SPF|Spot Treatment"
    }
  ],
  "general_recommendations": [
    "Short and practical tip based on what you observe",
    "Short and practical tip based on what you observe",
    "Short and practical tip based on what you observe"
  ],
  "dermatology_advice": "Short paragraph (2-3 sentences) on when professional review would be sensible based on what you observe.",
  "action_plan_steps": [
    {
      "title": "Step name (e.g., 'Seek Professional Consultation', 'Gentle Skincare Routine', 'Targeted Treatment', 'Sun Protection', 'Hands Off')",
      "priority": "High|Medium|Low",
      "description": "1-2 sentence step explaining what to do and why, based on what you observed"
    }
  ],
  "quick_tips": [
    "Short, practical tip (e.g., 'Avoid picking or squeezing the area.')",
    "Short, practical tip",
    "Short, practical tip"
  ]
}

CRITICAL RULES:
- If skin type cannot be clearly inferred from the image, return "Unknown"
- Be visually descriptive but not alarming
- Keep all text concise and factual
- Focus on appearance, not medical diagnosis
- Provide 3-5 key concerns if multiple features are visible
- Suggest 2-4 ingredients to avoid and 4-6 ingredients that may help
- All recommendations must relate to what you actually observe in the photo
- Provide 4-6 action plan steps with specific, practical actions
- Action plan steps should be prioritized: High priority for urgent/important actions, Medium for beneficial routines, Low for optional enhancements
- Quick tips should be 3-5 short, immediately actionable bullets
- Action plan steps common examples: "Seek Professional Consultation", "Gentle Skincare Routine", "Targeted Treatment", "Sun Protection", "Hands Off / Don't Pick", "Hydration Focus", "Barrier Repair"
- Keep the same calm, non-diagnostic Google AI Studio tone for action plan content`;

    const responseText = await callGoogleAI(prompt, imageBase64, SKIN_ANALYSIS_MODEL);
    const cleanedText = stripMarkdown(responseText);
    const data = JSON.parse(cleanedText);

    // Log what we got - don't throw errors yet
    console.log('📊 Parsed API response keys:', Object.keys(data));

    // Validate required fields to ensure complete response
    if (!data.skin_type) {
      console.warn("⚠️ API response missing skin_type");
    }

    if (!data.overall_assessment || data.overall_assessment.trim() === '') {
      console.warn("⚠️ API response missing or empty overall_assessment, adding default");
      data.overall_assessment = "Based on the visual analysis of your skin, we've identified several areas that may benefit from targeted skincare. The concerns detected include visible texture variations and pigmentation. Please review the detailed findings below for personalized recommendations.";
    }

    if (!data.action_plan_steps || data.action_plan_steps.length === 0) {
      console.warn('⚠️ No action plan steps received, adding default steps');
      data.action_plan_steps = [
        {
          title: "Gentle Skincare Routine",
          priority: "High",
          description: "Use gentle, fragrance-free products suitable for your skin type. Cleanse twice daily and moisturize regularly."
        },
        {
          title: "Sun Protection",
          priority: "High",
          description: "Apply broad-spectrum SPF 30+ daily, even on cloudy days. Reapply every 2 hours when outdoors."
        }
      ];
    }

    if (!data.quick_tips || data.quick_tips.length === 0) {
      console.warn('⚠️ No quick tips received, adding default tips');
      data.quick_tips = [
        "Stay hydrated by drinking plenty of water throughout the day.",
        "Get adequate sleep (7-9 hours) to support skin repair.",
        "Avoid touching your face with unwashed hands."
      ];
    }

    // Calculate health score based on concerns
    const severityCounts = { Mild: 0, Moderate: 0, Severe: 0 };
    if (data.key_concerns) {
      data.key_concerns.forEach(concern => {
        severityCounts[concern.severity] = (severityCounts[concern.severity] || 0) + 1;
      });
    }

    // Simple health score calculation
    const baseScore = 100;
    const scoreDeduction = (severityCounts.Severe * 20) + (severityCounts.Moderate * 10) + (severityCounts.Mild * 5);
    data.healthScore = Math.max(50, Math.min(100, baseScore - scoreDeduction));

    return data;

  } catch (error) {
    console.error("❌ Skin analysis error:", error);
    console.error('Error details:', error.message);
    console.error('Error stack:', error.stack);

    // Ensure we throw a user-friendly error message
    if (error.message && error.message.includes("Becky couldn't")) {
      throw error;
    }

    // Convert technical errors to user-friendly messages
    throw new Error("Becky couldn't analyse your skin right now. Please check your connection and try again.");
  }
}

export async function analyzeProducts(imageBase64) {
  try {
    console.log('🔍 Starting product analysis...');
    console.log('📊 Using model:', PRODUCT_ANALYSIS_MODEL);
    console.log('🔑 Google AI endpoint:', GOOGLE_AI_API_URL);
    console.log('API Key available:', GOOGLE_AI_KEY ? 'YES' : 'NO');
    console.log('📸 Image data length:', imageBase64?.length || 0);
    console.log('📸 Image starts with:', imageBase64.substring(0, 50));

    if (!GOOGLE_AI_KEY || GOOGLE_AI_KEY === 'your_google_ai_key_here') {
      throw new Error('Google AI API key is missing');
    }

    if (!imageBase64) {
      throw new Error('No image data provided');
    }

    const prompt = `Analyze these skincare products. Return ONLY valid JSON with NO extra text:

{
  "products": [
    {
      "name": "Product name",
      "brand": "Brand",
      "category": "cleanser|toner|serum|moisturizer|treatment",
      "keyIngredients": ["ingredient1", "ingredient2"]
    }
  ],
  "suggestions": [
    {
      "type": "redundancy|gap",
      "title": "Brief title",
      "description": "One sentence explanation"
    }
  ],
  "conflicts": [
    {
      "severity": "high|medium|low",
      "products": ["Product A", "Product B"],
      "issue": "Brief conflict description",
      "solution": "Brief solution"
    }
  ],
  "routine": {
    "AM": [
      {
        "step": 1,
        "category": "CLEANSER",
        "product": "Product name",
        "instructions": "Brief how-to"
      }
    ],
    "PM": [
      {
        "step": 1,
        "category": "CLEANSER",
        "product": "Product name",
        "instructions": "Brief how-to"
      }
    ]
  },
  "missing": [
    {
      "category": "What's missing",
      "importance": "critical|recommended",
      "reason": "Brief reason"
    }
  ]
}

Identify all visible products. Keep descriptions brief - one sentence each. Return complete valid JSON only.`;

    const responseText = await callGoogleAI(prompt, imageBase64, PRODUCT_ANALYSIS_MODEL);

    if (!responseText) {
      throw new Error("API returned empty response");
    }

    console.log("📝 Raw response length:", responseText.length);
    console.log("📝 First 500 chars:", responseText.substring(0, 500));

    // Aggressive cleanup
    let cleaned = responseText
      .replace(/```json\s*/g, '')
      .replace(/```\s*/g, '')
      .replace(/[\u0000-\u001F\u007F-\u009F]/g, '')
      .trim();

    // Find JSON boundaries
    const jsonStart = cleaned.indexOf('{');
    const jsonEnd = cleaned.lastIndexOf('}');

    if (jsonStart === -1 || jsonEnd === -1 || jsonEnd <= jsonStart) {
      console.error("❌ No valid JSON found");
      throw new Error("Could not find valid JSON in response");
    }

    // Extract ONLY the JSON object
    cleaned = cleaned.substring(jsonStart, jsonEnd + 1);

    console.log("🧹 Cleaned length:", cleaned.length);
    console.log("🧹 Last 200 chars:", cleaned.substring(cleaned.length - 200));

    // Validate JSON structure before parsing
    if (!cleaned.endsWith('}')) {
      console.warn("⚠️ JSON doesn't end with }, attempting to fix...");
      cleaned = cleaned + '}';
    }

    try {
      const results = JSON.parse(cleaned);
      console.log("✅ Successfully parsed!");
      console.log("📦 Products:", results.products?.length || 0);
      console.log("💡 Suggestions:", results.suggestions?.length || 0);

      if (!results.products || results.products.length === 0) {
        throw new Error("No products could be identified. Please ensure product labels are clearly visible.");
      }

      if (!results.routine || !results.routine.AM || !results.routine.PM) {
        throw new Error("Invalid routine format in response");
      }

      return results;
    } catch (parseError) {
      console.error("❌ Parse failed:", parseError.message);
      throw new Error("Failed to parse API response. The response may be incomplete.");
    }

  } catch (error) {
    console.error("❌ Product analysis failed:", error);
    console.error('Error details:', error.message);
    throw new Error(`Failed to analyze products: ${error.message}`);
  }
}
