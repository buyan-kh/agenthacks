// Background script for Knowde extension
// Handles communication between popup, content script, and external APIs

interface LearningRequest {
  type: "PROCESS_LEARNING_REQUEST";
  text: string;
}

interface LearningResponse {
  text: string;
  lessonPlan?: any;
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
export { processLearningRequest };
