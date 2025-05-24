import React, { useState, useEffect } from "react";
import {
  Brain,
  MessageCircle,
  Target,
  BookOpen,
  Settings,
  TrendingUp,
  Send,
  Lightbulb,
  Zap,
} from "lucide-react";

interface LearningProgress {
  conceptsLearned: number;
  dailyGoal: number;
  currentStreak: number;
}

interface Message {
  id: string;
  text: string;
  timestamp: Date;
  type: "user" | "assistant";
}

const Popup: React.FC = () => {
  const [inputText, setInputText] = useState("");
  const [progress, setProgress] = useState<LearningProgress>({
    conceptsLearned: 3,
    dailyGoal: 10,
    currentStreak: 7,
  });
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Load saved data from Chrome storage
    chrome.storage.local.get(["progress", "messages"], (result) => {
      if (result.progress) {
        setProgress(result.progress);
      }
      if (result.messages) {
        setMessages(result.messages);
      }
    });
  }, []);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      timestamp: new Date(),
      type: "user",
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);

    // Send message to background script
    try {
      const response = await chrome.runtime.sendMessage({
        type: "PROCESS_LEARNING_REQUEST",
        text: inputText,
      });

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        text:
          response.text ||
          "I understand! Let me create a learning plan for you.",
        timestamp: new Date(),
        type: "assistant",
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const progressPercentage = Math.round(
    (progress.conceptsLearned / progress.dailyGoal) * 100
  );

  return (
    <div className="w-full h-full min-h-[500px] bg-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-kn-cloud">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-kn-sapphire to-kn-aqua rounded-lg flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <h1 className="font-space-grotesk font-bold text-lg text-kn-ink">
            Knowde
          </h1>
        </div>
        <button className="p-2 hover:bg-kn-cloud rounded-lg transition-colors">
          <Settings className="w-5 h-5 text-kn-ink-light" />
        </button>
      </div>

      {/* Progress Card */}
      <div className="m-4 p-4 bg-gradient-to-r from-kn-sapphire to-kn-aqua rounded-xl text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-space-grotesk font-bold text-lg">
              Daily Progress
            </h3>
            <p className="text-sm opacity-90">
              {progress.conceptsLearned}/{progress.dailyGoal} concepts learned
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{progressPercentage}%</div>
            <div className="text-xs opacity-90">
              <TrendingUp className="w-3 h-3 inline mr-1" />
              {progress.currentStreak} day streak
            </div>
          </div>
        </div>
        <div className="mt-3 bg-white/20 rounded-full h-2">
          <div
            className="bg-white rounded-full h-2 transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Chat Interface */}
      <div className="flex-1 flex flex-col">
        {/* Messages */}
        <div className="flex-1 p-4 space-y-3 overflow-y-auto max-h-48">
          {messages.length === 0 ? (
            <div className="text-center text-kn-ink-light">
              <Lightbulb className="w-12 h-12 mx-auto mb-2 text-kn-sand" />
              <p className="text-sm">Ask me anything you want to learn!</p>
              <p className="text-xs mt-1">
                Try: "I want to learn about machine learning"
              </p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.type === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg text-sm ${
                    message.type === "user"
                      ? "bg-kn-sapphire text-white"
                      : "bg-kn-cloud text-kn-ink"
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-kn-cloud p-3 rounded-lg">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-kn-ink-light rounded-full animate-bounce" />
                  <div
                    className="w-2 h-2 bg-kn-ink-light rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  />
                  <div
                    className="w-2 h-2 bg-kn-ink-light rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-kn-cloud">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="What would you like to learn?"
              className="input-field flex-1 text-sm"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputText.trim() || isLoading}
              className="btn-primary p-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-4 border-t border-kn-cloud">
        <div className="grid grid-cols-2 gap-2">
          <button className="btn-secondary flex items-center gap-2 text-sm py-3 justify-center">
            <Target className="w-4 h-4" />
            Set Goals
          </button>
          <button className="btn-secondary flex items-center gap-2 text-sm py-3 justify-center">
            <BookOpen className="w-4 h-4" />
            View Graph
          </button>
          <button className="btn-secondary flex items-center gap-2 text-sm py-3 justify-center">
            <MessageCircle className="w-4 h-4" />
            Chat History
          </button>
          <button className="btn-secondary flex items-center gap-2 text-sm py-3 justify-center">
            <Zap className="w-4 h-4" />
            Quick Learn
          </button>
        </div>
      </div>
    </div>
  );
};

export default Popup;
