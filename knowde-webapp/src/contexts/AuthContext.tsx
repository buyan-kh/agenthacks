import React, { createContext, useContext, useEffect, useState } from "react";
import { User as FirebaseUser } from "firebase/auth";
import { User } from "../types";

interface AuthContextType {
  currentUser: FirebaseUser | null;
  userData: User | null;
  loading: boolean;
  signup: (email: string, password: string, name: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Mock implementation for now - will integrate with Firebase later
  const signup = async (email: string, password: string, name: string) => {
    // Mock user creation
    console.log("Signup:", { email, password, name });
    const mockUser = {
      id: Date.now().toString(),
      email,
      name,
      createdAt: new Date(),
      lastLoginAt: new Date(),
      streak: 0,
      totalConceptsLearned: 0,
    };
    setUserData(mockUser);
  };

  const login = async (email: string, password: string) => {
    // Mock login
    console.log("Login:", { email, password });
    const mockUser = {
      id: "1",
      email,
      name: "Hyun Kim",
      createdAt: new Date(),
      lastLoginAt: new Date(),
      streak: 7,
      totalConceptsLearned: 13,
      currentGoal: {
        id: "1",
        userId: "1",
        title:
          "Understand core ML concepts to confidently contribute to AI product decisions",
        description: "Master machine learning fundamentals",
        targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        createdAt: new Date(),
        status: "active" as const,
        progress: 65,
        lessonPlans: [],
        milestones: [
          {
            id: "1",
            title: "Fundamentals",
            description: "Learn ML basics",
            completed: true,
            completedAt: new Date(),
            order: 1,
          },
          {
            id: "2",
            title: "Core Concepts",
            description: "Understanding algorithms",
            completed: false,
            order: 2,
          },
          {
            id: "3",
            title: "Practical Applications",
            description: "Apply knowledge",
            completed: false,
            order: 3,
          },
        ],
      },
    };
    setUserData(mockUser);
  };

  const logout = async () => {
    setCurrentUser(null);
    setUserData(null);
  };

  const resetPassword = async (email: string) => {
    console.log("Reset password for:", email);
  };

  useEffect(() => {
    // Mock loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const value = {
    currentUser,
    userData,
    loading,
    signup,
    login,
    logout,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
