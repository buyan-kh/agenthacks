import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import {
  MessageCircle,
  Send,
  TrendingUp,
  BookOpen,
  Target,
  CheckCircle2,
  Brain,
  Clock,
  Award,
  Lightbulb,
} from "lucide-react";
import { ChatMessage } from "../../types";

export default function Dashboard() {
  const { userData } = useAuth();
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: chatInput,
      timestamp: new Date(),
      type: "user",
    };

    setChatMessages((prev) => [...prev, userMessage]);
    setChatInput("");
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: "I'd be happy to help you with that! Based on your current goal of understanding ML concepts, I can create a personalized study plan or answer specific questions you have.",
        timestamp: new Date(),
        type: "assistant",
      };
      setChatMessages((prev) => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const milestones = userData?.currentGoal?.milestones || [];
  const completedMilestones = milestones.filter((m) => m.completed).length;
  const totalConcepts = 25;
  const masteredConcepts = userData?.totalConceptsLearned || 13;

  return (
    <div className="p-6 space-y-6">
      {/* Current Goal Card */}
      <div className="card bg-gradient-to-r from-kn-primary/10 to-kn-secondary/10 border-kn-primary/20">
        <div className="flex items-center gap-3 mb-4">
          <Target className="w-6 h-6 text-kn-primary" />
          <div>
            <h3 className="text-lg font-display font-bold text-kn-text">
              Current Goal:
            </h3>
            <p className="text-kn-text-secondary text-sm">
              Track your learning progress
            </p>
          </div>
        </div>

        <h4 className="text-xl font-bold text-kn-text mb-4">
          {userData?.currentGoal?.title || "No active goal"}
        </h4>

        {/* Milestone Progress */}
        <div className="flex gap-4 mb-6">
          {milestones.map((milestone, index) => (
            <div
              key={milestone.id}
              className={`flex-1 p-4 rounded-lg text-center transition-all ${
                milestone.completed
                  ? "bg-kn-success/10 border border-kn-success/20"
                  : "bg-gray-50 border border-gray-200"
              }`}
            >
              <div
                className={`text-sm font-medium mb-1 ${
                  milestone.completed
                    ? "text-kn-success"
                    : "text-kn-text-secondary"
                }`}
              >
                {milestone.title}
              </div>
              {milestone.completed && (
                <CheckCircle2 className="w-5 h-5 text-kn-success mx-auto" />
              )}
            </div>
          ))}
        </div>

        {/* Overall Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-kn-text-secondary">Overall Progress</span>
            <span className="font-medium text-kn-text">
              {userData?.currentGoal?.progress || 0}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-kn-primary to-kn-secondary h-3 rounded-full transition-all duration-500"
              style={{ width: `${userData?.currentGoal?.progress || 0}%` }}
            />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Overall Progress */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold text-kn-text">
              Overall Progress
            </h3>
            <TrendingUp className="w-5 h-5 text-kn-primary" />
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-kn-text mb-2">
              {userData?.currentGoal?.progress || 0}%
            </div>
            <div className="text-sm text-kn-text-secondary">Complete</div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
              <div
                className="bg-kn-primary h-2 rounded-full transition-all duration-500"
                style={{ width: `${userData?.currentGoal?.progress || 0}%` }}
              />
            </div>
          </div>
        </div>

        {/* Concepts Mastered */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold text-kn-text">
              Concepts Mastered
            </h3>
            <Brain className="w-5 h-5 text-kn-primary" />
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-kn-text mb-2">
              {masteredConcepts}/{totalConcepts}
            </div>
            <div className="text-sm text-kn-text-secondary">
              Concepts learned
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
              <div
                className="bg-kn-success h-2 rounded-full transition-all duration-500"
                style={{
                  width: `${(masteredConcepts / totalConcepts) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Take Quiz */}
        <div className="card bg-gradient-to-br from-kn-accent/10 to-kn-accent/20 border-kn-accent/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold text-kn-text">Take Quiz</h3>
            <Lightbulb className="w-5 h-5 text-kn-accent" />
          </div>
          <div className="text-center">
            <div className="text-6xl mb-2">💡</div>
            <div className="text-sm text-kn-text-secondary mb-4">
              Test your knowledge
            </div>
            <button className="btn-primary w-full">Start Quiz</button>
          </div>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-kn-primary to-kn-accent rounded-full flex items-center justify-center">
            <MessageCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-display font-bold text-kn-text">Nodi</h3>
            <p className="text-sm text-kn-text-secondary">
              Your AI learning assistant
            </p>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
          {chatMessages.length === 0 ? (
            <div className="text-center py-8 text-kn-text-secondary">
              <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Ask me anything about your learning journey!</p>
            </div>
          ) : (
            chatMessages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.type === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] p-4 rounded-lg ${
                    message.type === "user"
                      ? "bg-kn-primary text-white rounded-br-sm"
                      : "bg-kn-surface text-kn-text rounded-bl-sm"
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <div
                    className={`text-xs mt-1 ${
                      message.type === "user"
                        ? "text-kn-secondary"
                        : "text-kn-text-secondary"
                    }`}
                  >
                    {new Date(message.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            ))
          )}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-kn-surface p-4 rounded-lg rounded-bl-sm">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-kn-text-secondary rounded-full animate-bounce" />
                  <div
                    className="w-2 h-2 bg-kn-text-secondary rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  />
                  <div
                    className="w-2 h-2 bg-kn-text-secondary rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Chat Input */}
        <div className="flex gap-3">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask Me Anything..."
            className="input-field flex-1"
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={!chatInput.trim() || isLoading}
            className="btn-primary px-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
