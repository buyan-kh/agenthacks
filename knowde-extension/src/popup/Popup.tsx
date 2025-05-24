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
  Loader2,
  PlayCircle,
  Clock,
  CheckCircle2,
  Plus,
  GraduationCap,
  BarChart3,
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

interface LessonPlan {
  id: string;
  title: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  estimatedTime: string;
  topics: string[];
  status: "not_started" | "in_progress" | "completed";
  createdAt: Date;
  progress: number;
}

interface Goal {
  id: string;
  title: string;
  description: string;
  targetDate: Date;
  progress: number;
  lessonPlans: string[];
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
  const [isGeneratingLesson, setIsGeneratingLesson] = useState(false);
  const [lessonPlans, setLessonPlans] = useState<LessonPlan[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [currentView, setCurrentView] = useState<
    "dashboard" | "chat" | "lessons" | "goals"
  >("dashboard");

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
      if (currentView === "dashboard") {
        handleGenerateLesson();
      } else {
        handleSendMessage();
      }
    }
  };

  const handleGenerateLesson = async () => {
    if (!inputText.trim()) return;

    setIsGeneratingLesson(true);

    try {
      const response = await chrome.runtime.sendMessage({
        type: "GENERATE_LESSON_PLAN",
        text: inputText,
      });

      if (response.success && response.lessonPlan) {
        const newLessonPlan: LessonPlan = {
          id: Date.now().toString(),
          title: response.lessonPlan.title,
          description: response.lessonPlan.description,
          difficulty: response.lessonPlan.difficulty || "intermediate",
          estimatedTime: response.lessonPlan.estimatedTime || "30 minutes",
          topics: response.lessonPlan.topics || [],
          status: "not_started",
          createdAt: new Date(),
          progress: 0,
        };

        setLessonPlans((prev) => [newLessonPlan, ...prev]);

        // Save to storage
        chrome.storage.local.set({
          lessonPlans: [newLessonPlan, ...lessonPlans],
        });

        setInputText("");
        setCurrentView("lessons");
      }
    } catch (error) {
      console.error("Error generating lesson:", error);
    } finally {
      setIsGeneratingLesson(false);
    }
  };

  const progressPercentage = Math.round(
    (progress.conceptsLearned / progress.dailyGoal) * 100
  );

  const renderDashboard = () => (
    <>
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

      {/* Lesson Generation */}
      <div className="px-4 pb-4">
        <div className="text-center mb-4">
          <GraduationCap className="w-12 h-12 mx-auto mb-2 text-kn-sapphire" />
          <h2 className="font-space-grotesk font-bold text-lg text-kn-ink mb-1">
            Generate Learning Plan
          </h2>
          <p className="text-sm text-kn-ink-light">
            Tell me what you want to learn and I'll create a personalized lesson
            plan
          </p>
        </div>

        <div className="space-y-3">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="e.g., I want to learn React hooks, machine learning basics..."
            className="input-field w-full text-sm"
            disabled={isGeneratingLesson}
          />

          <button
            onClick={handleGenerateLesson}
            disabled={!inputText.trim() || isGeneratingLesson}
            className="w-full btn-primary py-3 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGeneratingLesson ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating Lesson Plan...
              </>
            ) : (
              <>
                <PlayCircle className="w-4 h-4" />
                Generate Lesson Plan
              </>
            )}
          </button>
        </div>
      </div>

      {/* Recent Lesson Plans */}
      {lessonPlans.length > 0 && (
        <div className="px-4 pb-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-space-grotesk font-bold text-md text-kn-ink">
              Recent Lesson Plans
            </h3>
            <button
              onClick={() => setCurrentView("lessons")}
              className="text-kn-sapphire text-sm font-medium"
            >
              View All
            </button>
          </div>
          <div className="space-y-2">
            {lessonPlans.slice(0, 2).map((lesson) => (
              <div
                key={lesson.id}
                className="p-3 border border-kn-cloud rounded-lg hover:bg-kn-cloud/50 transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-kn-ink text-sm">
                      {lesson.title}
                    </h4>
                    <p className="text-xs text-kn-ink-light mt-1 line-clamp-2">
                      {lesson.description}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          lesson.difficulty === "beginner"
                            ? "bg-green-100 text-green-700"
                            : lesson.difficulty === "intermediate"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {lesson.difficulty}
                      </span>
                      <span className="text-xs text-kn-ink-light flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {lesson.estimatedTime}
                      </span>
                    </div>
                  </div>
                  <div className="ml-2">
                    {lesson.status === "completed" ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    ) : lesson.status === "in_progress" ? (
                      <PlayCircle className="w-5 h-5 text-kn-sapphire" />
                    ) : (
                      <PlayCircle className="w-5 h-5 text-kn-ink-light" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );

  const renderLessons = () => (
    <div className="p-4">
      <div className="flex items-center gap-2 mb-4">
        <BookOpen className="w-5 h-5 text-kn-sapphire" />
        <h2 className="font-space-grotesk font-bold text-lg text-kn-ink">
          Your Lesson Plans
        </h2>
      </div>

      {lessonPlans.length === 0 ? (
        <div className="text-center py-8">
          <GraduationCap className="w-12 h-12 mx-auto mb-3 text-kn-ink-light" />
          <p className="text-kn-ink-light">No lesson plans yet</p>
          <button
            onClick={() => setCurrentView("dashboard")}
            className="mt-3 text-kn-sapphire text-sm font-medium"
          >
            Create your first lesson plan
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {lessonPlans.map((lesson) => (
            <div
              key={lesson.id}
              className="p-4 border border-kn-cloud rounded-lg hover:shadow-kn transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-space-grotesk font-bold text-kn-ink">
                    {lesson.title}
                  </h3>
                  <p className="text-sm text-kn-ink-light mt-1">
                    {lesson.description}
                  </p>
                </div>
                <div className="ml-3">
                  {lesson.status === "completed" ? (
                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                  ) : lesson.status === "in_progress" ? (
                    <PlayCircle className="w-6 h-6 text-kn-sapphire" />
                  ) : (
                    <PlayCircle className="w-6 h-6 text-kn-ink-light" />
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 mb-3">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    lesson.difficulty === "beginner"
                      ? "bg-green-100 text-green-700"
                      : lesson.difficulty === "intermediate"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {lesson.difficulty}
                </span>
                <span className="text-xs text-kn-ink-light flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {lesson.estimatedTime}
                </span>
              </div>

              {lesson.topics.length > 0 && (
                <div className="mb-3">
                  <div className="flex flex-wrap gap-1">
                    {lesson.topics.slice(0, 3).map((topic, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-kn-cloud text-xs rounded"
                      >
                        {topic}
                      </span>
                    ))}
                    {lesson.topics.length > 3 && (
                      <span className="px-2 py-1 bg-kn-cloud text-xs rounded">
                        +{lesson.topics.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2">
                <button className="btn-primary py-2 px-4 text-sm">
                  {lesson.status === "not_started"
                    ? "Start Learning"
                    : "Continue"}
                </button>
                <button className="btn-secondary py-2 px-4 text-sm">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="w-full h-full min-h-[600px] bg-white flex flex-col">
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
        <div className="flex items-center gap-2">
          <button
            onClick={() => chrome.tabs.create({ url: "http://localhost:3000" })}
            className="p-2 hover:bg-kn-cloud rounded-lg transition-colors text-kn-sapphire hover:text-kn-sapphire/80"
            title="Open Full App"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </button>
          <button className="p-2 hover:bg-kn-cloud rounded-lg transition-colors">
            <Settings className="w-5 h-5 text-kn-ink-light" />
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex border-b border-kn-cloud">
        {[
          { id: "dashboard", label: "Dashboard", icon: BarChart3 },
          { id: "lessons", label: "Lessons", icon: BookOpen },
          { id: "goals", label: "Goals", icon: Target },
          { id: "chat", label: "Chat", icon: MessageCircle },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setCurrentView(tab.id as any)}
              className={`flex-1 py-3 px-2 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                currentView === tab.id
                  ? "text-kn-sapphire border-b-2 border-kn-sapphire bg-kn-sapphire/5"
                  : "text-kn-ink-light hover:text-kn-ink"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {currentView === "dashboard" && renderDashboard()}
        {currentView === "lessons" && renderLessons()}
        {currentView === "goals" && (
          <div className="p-4 text-center">
            <Target className="w-12 h-12 mx-auto mb-3 text-kn-ink-light" />
            <p className="text-kn-ink-light">Goals feature coming soon!</p>
          </div>
        )}
        {currentView === "chat" && (
          <div className="flex flex-col h-full">
            <div className="flex-1 p-4 space-y-3 overflow-y-auto">
              {messages.length === 0 ? (
                <div className="text-center text-kn-ink-light">
                  <MessageCircle className="w-12 h-12 mx-auto mb-2 text-kn-sand" />
                  <p className="text-sm">Chat with your learning assistant!</p>
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
            <div className="p-4 border-t border-kn-cloud">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about learning..."
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
        )}
      </div>
    </div>
  );
};

export default Popup;
