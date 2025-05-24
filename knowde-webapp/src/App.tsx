import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import Dashboard from "./components/dashboard/Dashboard";
import LearningGoals from "./components/goals/LearningGoals";
import ConceptExplorer from "./components/concepts/ConceptExplorer";
import StudyPlan from "./components/study/StudyPlan";
import Quiz from "./components/quiz/Quiz";
import Layout from "./components/layout/Layout";
import LoadingSpinner from "./components/common/LoadingSpinner";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/signup"
              element={
                <PublicRoute>
                  <Signup />
                </PublicRoute>
              }
            />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/goals"
              element={
                <PrivateRoute>
                  <Layout>
                    <LearningGoals />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/concepts"
              element={
                <PrivateRoute>
                  <Layout>
                    <ConceptExplorer />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/study"
              element={
                <PrivateRoute>
                  <Layout>
                    <StudyPlan />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/quiz"
              element={
                <PrivateRoute>
                  <Layout>
                    <Quiz />
                  </Layout>
                </PrivateRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

interface ProtectedRouteProps {
  children: React.ReactNode;
}

function PrivateRoute({ children }: ProtectedRouteProps) {
  const { userData, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return userData ? <>{children}</> : <Navigate to="/login" />;
}

function PublicRoute({ children }: ProtectedRouteProps) {
  const { userData, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return userData ? <Navigate to="/" /> : <>{children}</>;
}

export default App;
