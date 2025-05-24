import React from "react";
import {
  BookOpen,
  Clock,
  CheckCircle2,
  PlayCircle,
  Calendar,
} from "lucide-react";

export default function StudyPlan() {
  const lessonPlans = [
    {
      id: "1",
      title: "Machine Learning Fundamentals",
      description: "Learn the basics of ML algorithms and concepts",
      difficulty: "beginner",
      estimatedTime: "2 hours",
      progress: 85,
      status: "in_progress",
      lessons: 12,
      completedLessons: 10,
    },
    {
      id: "2",
      title: "Neural Network Architecture",
      description: "Deep dive into neural network design and implementation",
      difficulty: "intermediate",
      estimatedTime: "3 hours",
      progress: 40,
      status: "in_progress",
      lessons: 8,
      completedLessons: 3,
    },
    {
      id: "3",
      title: "Data Preprocessing Techniques",
      description: "Master data cleaning and preparation for ML models",
      difficulty: "intermediate",
      estimatedTime: "1.5 hours",
      progress: 0,
      status: "not_started",
      lessons: 6,
      completedLessons: 0,
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-bold text-kn-text mb-2">
          Study Plan
        </h1>
        <p className="text-kn-text-secondary">
          Your personalized learning roadmap
        </p>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center gap-3 mb-2">
            <BookOpen className="w-5 h-5 text-kn-primary" />
            <span className="font-medium text-kn-text">Total Lessons</span>
          </div>
          <div className="text-2xl font-bold text-kn-text">
            {lessonPlans.reduce((sum, plan) => sum + plan.lessons, 0)}
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle2 className="w-5 h-5 text-kn-success" />
            <span className="font-medium text-kn-text">Completed</span>
          </div>
          <div className="text-2xl font-bold text-kn-text">
            {lessonPlans.reduce((sum, plan) => sum + plan.completedLessons, 0)}
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-5 h-5 text-kn-accent" />
            <span className="font-medium text-kn-text">Time Invested</span>
          </div>
          <div className="text-2xl font-bold text-kn-text">24h</div>
        </div>
      </div>

      {/* Lesson Plans */}
      <div className="space-y-6">
        <h2 className="text-xl font-display font-bold text-kn-text">
          Your Lesson Plans
        </h2>

        <div className="space-y-4">
          {lessonPlans.map((plan) => (
            <div
              key={plan.id}
              className="card hover:shadow-kn-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-display font-bold text-kn-text">
                      {plan.title}
                    </h3>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        plan.difficulty === "beginner"
                          ? "bg-green-100 text-green-700"
                          : plan.difficulty === "intermediate"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {plan.difficulty}
                    </span>
                  </div>

                  <p className="text-kn-text-secondary mb-3">
                    {plan.description}
                  </p>

                  <div className="flex items-center gap-4 text-sm text-kn-text-secondary">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{plan.estimatedTime}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4" />
                      <span>
                        {plan.completedLessons}/{plan.lessons} lessons
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-bold text-kn-primary mb-1">
                    {plan.progress}%
                  </div>
                  <div className="text-sm text-kn-text-secondary">Complete</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-kn-primary to-kn-secondary h-2 rounded-full transition-all duration-500"
                    style={{ width: `${plan.progress}%` }}
                  />
                </div>
              </div>

              {/* Status and Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {plan.status === "completed" ? (
                    <CheckCircle2 className="w-5 h-5 text-kn-success" />
                  ) : plan.status === "in_progress" ? (
                    <PlayCircle className="w-5 h-5 text-kn-primary" />
                  ) : (
                    <PlayCircle className="w-5 h-5 text-kn-text-secondary" />
                  )}
                  <span
                    className={`text-sm font-medium ${
                      plan.status === "completed"
                        ? "text-kn-success"
                        : plan.status === "in_progress"
                        ? "text-kn-primary"
                        : "text-kn-text-secondary"
                    }`}
                  >
                    {plan.status === "completed"
                      ? "Completed"
                      : plan.status === "in_progress"
                      ? "In Progress"
                      : "Not Started"}
                  </span>
                </div>

                <div className="flex gap-3">
                  <button className="btn-primary">
                    {plan.status === "not_started"
                      ? "Start Learning"
                      : "Continue"}
                  </button>
                  <button className="btn-secondary">View Details</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Schedule */}
      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <Calendar className="w-5 h-5 text-kn-primary" />
          <h3 className="text-lg font-display font-bold text-kn-text">
            Today's Schedule
          </h3>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-kn-surface rounded-lg">
            <div>
              <div className="font-medium text-kn-text">
                Neural Network Basics
              </div>
              <div className="text-sm text-kn-text-secondary">
                Lesson 4 of 8
              </div>
            </div>
            <div className="text-sm text-kn-text-secondary">30 min</div>
          </div>

          <div className="flex items-center justify-between p-3 bg-kn-surface rounded-lg">
            <div>
              <div className="font-medium text-kn-text">
                Practice: Building Your First Model
              </div>
              <div className="text-sm text-kn-text-secondary">
                Hands-on exercise
              </div>
            </div>
            <div className="text-sm text-kn-text-secondary">45 min</div>
          </div>
        </div>
      </div>
    </div>
  );
}
