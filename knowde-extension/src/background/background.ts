// Background script for Knowde extension
// Handles communication between popup, content script, and external APIs

interface LearningRequest {
  type: "PROCESS_LEARNING_REQUEST" | "GENERATE_LESSON_PLAN";
  text: string;
}

interface LessonPlan {
  title: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  estimatedTime: string;
  topics: string[];
}

interface LearningResponse {
  text: string;
  lessonPlan?: LessonPlan;
  success: boolean;
}

// Initialize extension
chrome.runtime.onInstalled.addListener(() => {
  console.log("Knowde extension installed");

  // Set default values
  chrome.storage.local.set({
    progress: {
      conceptsLearned: 0,
      dailyGoal: 10,
      currentStreak: 0,
    },
    settings: {
      autoCapture: true,
      notifications: true,
      learningMode: "adaptive",
    },
  });
});

// Handle messages from popup and content script
chrome.runtime.onMessage.addListener(
  (
    request: LearningRequest,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response: LearningResponse) => void
  ) => {
    console.log("Background received message:", request);

    if (request.type === "PROCESS_LEARNING_REQUEST") {
      processLearningRequest(request.text)
        .then((response) => sendResponse(response))
        .catch((error) => {
          console.error("Error processing learning request:", error);
          sendResponse({
            text: "Sorry, I encountered an error processing your request.",
            success: false,
          });
        });

      // Return true to indicate we'll send a response asynchronously
      return true;
    }

    if (request.type === "GENERATE_LESSON_PLAN") {
      generateLessonPlan(request.text)
        .then((response) => sendResponse(response))
        .catch((error) => {
          console.error("Error generating lesson plan:", error);
          sendResponse({
            text: "Sorry, I encountered an error generating your lesson plan.",
            success: false,
          });
        });

      // Return true to indicate we'll send a response asynchronously
      return true;
    }
  }
);

// Process learning requests and generate responses
async function processLearningRequest(text: string): Promise<LearningResponse> {
  // For now, return a mock response
  // In the future, this will integrate with AI APIs

  const responses = [
    "Great question! I'll create a personalized learning plan for you about this topic.",
    "I understand you want to learn more about this. Let me break it down into manageable steps.",
    "Excellent! I'll help you build a comprehensive understanding of this subject.",
    "Perfect! Let me create a structured learning path that builds on your existing knowledge.",
    "I see what you're interested in. I'll design a lesson plan that adapts to your learning style.",
  ];

  const randomResponse =
    responses[Math.floor(Math.random() * responses.length)];

  // Simulate processing time
  await new Promise((resolve) =>
    setTimeout(resolve, 1000 + Math.random() * 2000)
  );

  // Update progress
  try {
    const result = await chrome.storage.local.get(["progress"]);
    const currentProgress = result.progress || {
      conceptsLearned: 0,
      dailyGoal: 10,
      currentStreak: 0,
    };

    // Increment concepts learned
    currentProgress.conceptsLearned += 1;

    await chrome.storage.local.set({ progress: currentProgress });
  } catch (error) {
    console.error("Error updating progress:", error);
  }

  return {
    text: randomResponse,
    success: true,
  };
}

// Generate lesson plans based on user input
async function generateLessonPlan(text: string): Promise<LearningResponse> {
  // Mock lesson plan generation
  // In the future, this will integrate with AI APIs (OpenAI, Claude, etc.)

  const topics = extractTopics(text);
  const difficulty = determineDifficulty(text);
  const estimatedTime = calculateEstimatedTime(topics.length, difficulty);

  // Generate a mock lesson plan based on the input
  const lessonPlan: LessonPlan = {
    title: generateTitle(text),
    description: generateDescription(text),
    difficulty: difficulty,
    estimatedTime: estimatedTime,
    topics: topics,
  };

  // Simulate AI processing time
  await new Promise((resolve) =>
    setTimeout(resolve, 2000 + Math.random() * 3000)
  );

  return {
    text: `I've created a comprehensive lesson plan for "${lessonPlan.title}". This ${difficulty}-level course is estimated to take ${estimatedTime}.`,
    lessonPlan: lessonPlan,
    success: true,
  };
}

// Helper functions for lesson plan generation
function extractTopics(text: string): string[] {
  const keywords = [
    "react",
    "javascript",
    "python",
    "machine learning",
    "css",
    "html",
    "algorithms",
    "data structures",
    "typescript",
    "node.js",
    "database",
    "api",
    "frontend",
    "backend",
    "ai",
    "blockchain",
    "cybersecurity",
  ];

  const foundTopics = keywords.filter((keyword) =>
    text.toLowerCase().includes(keyword.toLowerCase())
  );

  // If no specific topics found, generate generic ones based on text analysis
  if (foundTopics.length === 0) {
    return [
      "Fundamentals",
      "Core Concepts",
      "Practical Applications",
      "Best Practices",
    ];
  }

  return foundTopics.length > 0 ? foundTopics.slice(0, 5) : ["General Topics"];
}

function determineDifficulty(
  text: string
): "beginner" | "intermediate" | "advanced" {
  const beginnerKeywords = [
    "basic",
    "intro",
    "beginner",
    "start",
    "learn",
    "fundamentals",
  ];
  const advancedKeywords = [
    "advanced",
    "expert",
    "complex",
    "deep dive",
    "master",
  ];

  const lowerText = text.toLowerCase();

  if (beginnerKeywords.some((keyword) => lowerText.includes(keyword))) {
    return "beginner";
  }
  if (advancedKeywords.some((keyword) => lowerText.includes(keyword))) {
    return "advanced";
  }
  return "intermediate";
}

function calculateEstimatedTime(
  topicCount: number,
  difficulty: string
): string {
  const baseTime =
    difficulty === "beginner" ? 20 : difficulty === "intermediate" ? 30 : 45;
  const totalMinutes = baseTime + topicCount * 10;

  if (totalMinutes < 60) {
    return `${totalMinutes} minutes`;
  } else {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return minutes > 0
      ? `${hours}h ${minutes}m`
      : `${hours} hour${hours > 1 ? "s" : ""}`;
  }
}

function generateTitle(text: string): string {
  // Extract main subject from user input
  const commonPrefixes = [
    "i want to learn",
    "teach me",
    "help me understand",
    "learn about",
  ];
  let cleanText = text.toLowerCase();

  commonPrefixes.forEach((prefix) => {
    if (cleanText.startsWith(prefix)) {
      cleanText = cleanText.replace(prefix, "").trim();
    }
  });

  // Capitalize and format
  return (
    cleanText
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
      .replace(/([a-z])([A-Z])/g, "$1 $2") // Add spaces between camelCase
      .substring(0, 50) + (cleanText.length > 50 ? "..." : "")
  );
}

function generateDescription(text: string): string {
  const templates = [
    `A comprehensive learning path designed to help you master the concepts and practical applications.`,
    `An interactive course that covers fundamental concepts, real-world examples, and hands-on practice.`,
    `A structured approach to learning with clear explanations, examples, and progressive skill building.`,
    `A personalized curriculum that adapts to your learning style and provides practical knowledge.`,
  ];

  return templates[Math.floor(Math.random() * templates.length)];
}

// Handle keyboard shortcuts
chrome.commands.onCommand.addListener((command) => {
  if (command === "toggle-learning") {
    // Toggle learning mode or open popup
    chrome.action.openPopup();
  }
});

// Monitor tab changes for learning opportunities
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url) {
    // Analyze page content for learning opportunities
    // This will be implemented later with content script integration
    console.log("Page loaded:", tab.url);
  }
});

// Export for testing (if needed)
export { processLearningRequest, generateLessonPlan };
