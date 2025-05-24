import React, { useState } from "react";
import {
  Target,
  Plus,
  Calendar,
  TrendingUp,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { Goal } from "../../types";

export default function LearningGoals() {
  const [showCreateGoal, setShowCreateGoal] = useState(false);
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: "1",
      userId: "1",
      title: "Master Machine Learning Fundamentals",
      description:
        "Learn core ML concepts to contribute to AI product decisions",
      targetDate: new Date("2024-03-15"),
      createdAt: new Date(),
      status: "active",
      progress: 65,
      lessonPlans: [],
      milestones: [
        {
          id: "1",
          title: "Fundamentals",
          description: "Basic ML concepts",
          completed: true,
          completedAt: new Date(),
          order: 1,
        },
        {
          id: "2",
          title: "Algorithms",
          description: "Core ML algorithms",
          completed: false,
          order: 2,
        },
        {
          id: "3",
          title: "Applications",
          description: "Real-world ML applications",
          completed: false,
          order: 3,
        },
      ],
    },
  ]);

  const activeGoals = goals.filter((goal) => goal.status === "active");
  const completedGoals = goals.filter((goal) => goal.status === "completed");

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-kn-text mb-2">
            Learning Goals
          </h1>
          <p className="text-kn-text-secondary">
            Set and track your learning objectives
          </p>
        </div>
        <button
          onClick={() => setShowCreateGoal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New Goal
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center gap-3 mb-2">
            <Target className="w-5 h-5 text-kn-primary" />
            <span className="font-medium text-kn-text">Active Goals</span>
          </div>
          <div className="text-2xl font-bold text-kn-text">
            {activeGoals.length}
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle2 className="w-5 h-5 text-kn-success" />
            <span className="font-medium text-kn-text">Completed</span>
          </div>
          <div className="text-2xl font-bold text-kn-text">
            {completedGoals.length}
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5 text-kn-accent" />
            <span className="font-medium text-kn-text">Average Progress</span>
          </div>
          <div className="text-2xl font-bold text-kn-text">
            {Math.round(
              goals.reduce((sum, goal) => sum + goal.progress, 0) / goals.length
            )}
            %
          </div>
        </div>
      </div>

      {/* Active Goals */}
      <div className="space-y-6">
        <h2 className="text-xl font-display font-bold text-kn-text">
          Active Goals
        </h2>

        {activeGoals.length === 0 ? (
          <div className="card text-center py-12">
            <Target className="w-12 h-12 mx-auto mb-4 text-kn-text-secondary" />
            <h3 className="text-lg font-medium text-kn-text mb-2">
              No active goals
            </h3>
            <p className="text-kn-text-secondary mb-4">
              Create your first learning goal to get started
            </p>
            <button
              onClick={() => setShowCreateGoal(true)}
              className="btn-primary"
            >
              Create Goal
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {activeGoals.map((goal) => (
              <div
                key={goal.id}
                className="card hover:shadow-kn-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-display font-bold text-kn-text mb-2">
                      {goal.title}
                    </h3>
                    <p className="text-kn-text-secondary mb-3">
                      {goal.description}
                    </p>

                    <div className="flex items-center gap-4 text-sm text-kn-text-secondary">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>Due {goal.targetDate.toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>
                          {Math.ceil(
                            (goal.targetDate.getTime() - Date.now()) /
                              (1000 * 60 * 60 * 24)
                          )}{" "}
                          days left
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-2xl font-bold text-kn-primary mb-1">
                      {goal.progress}%
                    </div>
                    <div className="text-sm text-kn-text-secondary">
                      Complete
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-kn-primary to-kn-secondary h-2 rounded-full transition-all duration-500"
                      style={{ width: `${goal.progress}%` }}
                    />
                  </div>
                </div>

                {/* Milestones */}
                <div className="space-y-2">
                  <h4 className="font-medium text-kn-text mb-3">Milestones</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {goal.milestones.map((milestone) => (
                      <div
                        key={milestone.id}
                        className={`p-3 rounded-lg border transition-all ${
                          milestone.completed
                            ? "bg-kn-success/10 border-kn-success/20 text-kn-success"
                            : "bg-gray-50 border-gray-200 text-kn-text-secondary"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm">
                            {milestone.title}
                          </span>
                          {milestone.completed && (
                            <CheckCircle2 className="w-4 h-4" />
                          )}
                        </div>
                        <p className="text-xs mt-1 opacity-75">
                          {milestone.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 mt-4 pt-4 border-t border-kn-border">
                  <button className="btn-primary">Continue Learning</button>
                  <button className="btn-secondary">Edit Goal</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Goal Modal */}
      {showCreateGoal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-kn-xl max-w-md w-full p-6">
            <h3 className="text-xl font-display font-bold text-kn-text mb-4">
              Create New Goal
            </h3>

            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-kn-text mb-2">
                  Goal Title
                </label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g., Master React Development"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-kn-text mb-2">
                  Description
                </label>
                <textarea
                  className="input-field h-20 resize-none"
                  placeholder="Describe what you want to achieve..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-kn-text mb-2">
                  Target Date
                </label>
                <input
                  type="date"
                  className="input-field"
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button type="submit" className="btn-primary flex-1">
                  Create Goal
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateGoal(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
