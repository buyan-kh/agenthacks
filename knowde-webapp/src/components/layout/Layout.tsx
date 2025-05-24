import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  Brain,
  BarChart3,
  Target,
  Compass,
  BookOpen,
  HelpCircle,
  Settings,
  LogOut,
  Bell,
  User,
  Crown,
} from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

const navigationItems = [
  { id: "dashboard", label: "Dashboard", icon: BarChart3, path: "/" },
  { id: "goals", label: "Learning Goals", icon: Target, path: "/goals" },
  {
    id: "concepts",
    label: "Concept Explorer",
    icon: Compass,
    path: "/concepts",
  },
  { id: "study", label: "Study Plan", icon: BookOpen, path: "/study" },
  { id: "quiz", label: "Quiz", icon: HelpCircle, path: "/quiz" },
];

export default function Layout({ children }: LayoutProps) {
  const { userData, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-kn-surface flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-kn border-r border-kn-border flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-kn-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-kn-primary to-kn-secondary rounded-xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-display font-bold text-kn-text">
                Knowde
              </h1>
              <div className="flex items-center gap-1 text-xs text-kn-text-secondary">
                <Crown className="w-3 h-3" />
                <span>Pro</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = isActiveRoute(item.path);

            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={`sidebar-item w-full ${isActive ? "active" : ""}`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User Profile Section */}
        <div className="p-4 border-t border-kn-border">
          <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-kn-surface transition-colors">
            <div className="w-10 h-10 bg-gradient-to-br from-kn-primary to-kn-accent rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-kn-text truncate">
                {userData?.name || "User"}
              </p>
              <p className="text-xs text-kn-text-secondary truncate">
                {userData?.email || "user@example.com"}
              </p>
            </div>
          </div>

          <div className="mt-2 space-y-1">
            <button className="sidebar-item w-full text-sm">
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </button>
            <button
              onClick={handleLogout}
              className="sidebar-item w-full text-sm text-red-600 hover:bg-red-50 hover:text-red-700"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="bg-white border-b border-kn-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-display font-bold text-kn-text">
                {navigationItems.find((item) => item.path === location.pathname)
                  ?.label || "Dashboard"}
              </h2>
              <p className="text-kn-text-secondary mt-1">
                Welcome back, {userData?.name?.split(" ")[0] || "User"}!
                <span className="ml-2 inline-flex items-center gap-1 text-kn-primary font-medium">
                  🔥 {userData?.streak || 0} Day Streak
                </span>
              </p>
            </div>

            <div className="flex items-center gap-4">
              {/* Notifications */}
              <button className="relative p-2 text-kn-text-secondary hover:text-kn-text transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-kn-accent rounded-full"></span>
              </button>

              {/* User Avatar */}
              <div className="w-8 h-8 bg-gradient-to-br from-kn-primary to-kn-accent rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
