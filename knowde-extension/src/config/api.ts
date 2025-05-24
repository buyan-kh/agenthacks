// API Configuration for Knowde Extension
// Store your API keys and settings here

// Try to import API secrets, fall back to placeholder if not available
let API_SECRETS: { CLAUDE_API_KEY: string } = {
  CLAUDE_API_KEY: "your_claude_api_key_here",
};

try {
  // Import API secrets from gitignored file
  const secrets = require("./api-secrets");
  API_SECRETS = secrets.API_SECRETS;
} catch (error) {
  console.warn(
    "API secrets file not found. Please copy api-secrets.template.ts to api-secrets.ts and add your API keys."
  );
}

export const API_CONFIG = {
  // Claude API Configuration
  CLAUDE_API_KEY: API_SECRETS.CLAUDE_API_KEY,
  CLAUDE_MODEL: "claude-3-5-sonnet-20241022",

  // Backend API Configuration
  BACKEND_URL: "http://localhost:8000",

  // Request settings
  MAX_TOKENS: 1000,
  TEMPERATURE: 0.7,
};

export const API_ENDPOINTS = {
  GENERATE_LESSON_PLAN: "/api/generate-lesson-plan",
  GET_LESSON_PLAN: "/api/lesson-plan",
  GET_KNOWLEDGE_GRAPH: "/api/knowledge-graph",
  CREATE_USER_PROFILE: "/api/user-profile",
  GET_USER_PROFILE: "/api/user-profile",
  UPDATE_LESSON_PROGRESS: "/api/lesson-progress",
  GET_LESSON_PROGRESS: "/api/lesson-progress",
};

export const SYSTEM_PROMPTS = {
  NODI_CHAT: `You are Nodi, a friendly and knowledgeable AI learning assistant integrated into the Knowde browser extension. You help users with:

1. **Learning Questions**: Answer questions about any topic the user is studying
2. **Study Guidance**: Provide study tips, learning strategies, and motivation
3. **Content Explanation**: Break down complex concepts into digestible parts
4. **Learning Path Advice**: Suggest next steps in their learning journey

Keep your responses:
- Concise but helpful (aim for 2-3 sentences unless more detail is needed)
- Encouraging and supportive
- Focused on learning and education
- Practical and actionable

The user is currently browsing a webpage, so they might ask about content related to what they're viewing. Be ready to help them understand, analyze, or learn from any topic.`,

  LESSON_GENERATION: `You are an expert curriculum designer. Generate a comprehensive lesson plan based on the user's learning request.

Return a JSON object with:
{
  "title": "Clear, engaging lesson title",
  "description": "2-3 sentence description of what the user will learn",
  "difficulty": "beginner|intermediate|advanced",
  "estimatedTime": "realistic time estimate (e.g., '45 minutes')",
  "topics": ["array", "of", "key", "topics", "covered"]
}

Make the lesson plan practical, engaging, and appropriate for the user's apparent skill level.`,
};
