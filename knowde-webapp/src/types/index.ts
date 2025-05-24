export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: Date;
  lastLoginAt: Date;
  streak: number;
  totalConceptsLearned: number;
  currentGoal?: Goal;
}

export interface Goal {
  id: string;
  userId: string;
  title: string;
  description: string;
  targetDate: Date;
  createdAt: Date;
  status: "active" | "completed" | "paused";
  progress: number;
  lessonPlans: string[];
  milestones: Milestone[];
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  completedAt?: Date;
  order: number;
}

export interface LessonPlan {
  id: string;
  userId: string;
  title: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  estimatedTime: string;
  topics: string[];
  status: "not_started" | "in_progress" | "completed";
  createdAt: Date;
  updatedAt: Date;
  progress: number;
  lessons: Lesson[];
  quiz?: Quiz;
}

export interface Lesson {
  id: string;
  title: string;
  content: string;
  type: "explanation" | "example" | "practice" | "quiz";
  order: number;
  completed: boolean;
  completedAt?: Date;
  timeSpent: number;
}

export interface Quiz {
  id: string;
  title: string;
  questions: Question[];
  passingScore: number;
  attempts: QuizAttempt[];
  maxAttempts: number;
}

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: "easy" | "medium" | "hard";
}

export interface QuizAttempt {
  id: string;
  answers: number[];
  score: number;
  completedAt: Date;
  timeSpent: number;
}

export interface Concept {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  prerequisites: string[];
  relatedConcepts: string[];
  masteryLevel: number;
  lastReviewed?: Date;
  nextReview?: Date;
  spacedRepetitionData: SpacedRepetitionData;
}

export interface SpacedRepetitionData {
  interval: number;
  easeFactor: number;
  repetitions: number;
  quality: number;
}

export interface StudySession {
  id: string;
  userId: string;
  type: "lesson" | "quiz" | "review" | "practice";
  contentId: string;
  startTime: Date;
  endTime?: Date;
  completed: boolean;
  score?: number;
  timeSpent: number;
  conceptsReviewed: string[];
}

export interface Progress {
  conceptsLearned: number;
  dailyGoal: number;
  currentStreak: number;
  longestStreak: number;
  totalTimeSpent: number;
  lessonsCompleted: number;
  quizzesCompleted: number;
  averageScore: number;
}

export interface ChatMessage {
  id: string;
  text: string;
  timestamp: Date;
  type: "user" | "assistant";
  context?: {
    currentLesson?: string;
    currentGoal?: string;
    relatedConcepts?: string[];
  };
}

export interface Notification {
  id: string;
  userId: string;
  type: "reminder" | "achievement" | "system" | "social";
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
  actionUrl?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  unlockedAt?: Date;
  progress: number;
  maxProgress: number;
}
