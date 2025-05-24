import React, { useState } from "react";
import { Search, Brain, ArrowRight, Star, BookOpen } from "lucide-react";

export default function ConceptExplorer() {
  const [searchQuery, setSearchQuery] = useState("");

  const concepts = [
    {
      id: "1",
      title: "Machine Learning",
      description: "AI technique that learns from data",
      category: "Artificial Intelligence",
      difficulty: "intermediate",
      masteryLevel: 85,
      relatedConcepts: [
        "Neural Networks",
        "Deep Learning",
        "Supervised Learning",
      ],
    },
    {
      id: "2",
      title: "Neural Networks",
      description: "Computing systems inspired by biological neural networks",
      category: "Machine Learning",
      difficulty: "advanced",
      masteryLevel: 60,
      relatedConcepts: ["Machine Learning", "Deep Learning", "Backpropagation"],
    },
    {
      id: "3",
      title: "React Components",
      description: "Reusable pieces of UI in React applications",
      category: "Web Development",
      difficulty: "beginner",
      masteryLevel: 95,
      relatedConcepts: ["JSX", "Props", "State Management"],
    },
  ];

  const filteredConcepts = concepts.filter(
    (concept) =>
      concept.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      concept.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-bold text-kn-text mb-2">
          Concept Explorer
        </h1>
        <p className="text-kn-text-secondary">
          Discover and explore interconnected learning concepts
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="w-5 h-5 text-kn-text-secondary" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="input-field pl-10"
          placeholder="Search concepts..."
        />
      </div>

      {/* Concepts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredConcepts.map((concept) => (
          <div
            key={concept.id}
            className="card hover:shadow-kn-lg transition-all duration-200 cursor-pointer"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-kn-primary" />
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    concept.difficulty === "beginner"
                      ? "bg-green-100 text-green-700"
                      : concept.difficulty === "intermediate"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {concept.difficulty}
                </span>
              </div>
              <Star className="w-4 h-4 text-kn-text-secondary" />
            </div>

            <h3 className="text-lg font-display font-bold text-kn-text mb-2">
              {concept.title}
            </h3>

            <p className="text-kn-text-secondary text-sm mb-3">
              {concept.description}
            </p>

            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-kn-text-secondary">Mastery Level</span>
                <span className="font-medium text-kn-text">
                  {concept.masteryLevel}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-kn-primary to-kn-success h-2 rounded-full transition-all duration-500"
                  style={{ width: `${concept.masteryLevel}%` }}
                />
              </div>
            </div>

            <div className="mb-4">
              <div className="text-xs text-kn-text-secondary mb-2">
                Related Concepts
              </div>
              <div className="flex flex-wrap gap-1">
                {concept.relatedConcepts.slice(0, 3).map((related, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-kn-surface text-xs rounded-full text-kn-text-secondary"
                  >
                    {related}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <button className="btn-primary flex-1 text-sm">Study</button>
              <button className="btn-secondary text-sm">
                <BookOpen className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredConcepts.length === 0 && (
        <div className="text-center py-12">
          <Brain className="w-12 h-12 mx-auto mb-4 text-kn-text-secondary" />
          <h3 className="text-lg font-medium text-kn-text mb-2">
            No concepts found
          </h3>
          <p className="text-kn-text-secondary">
            Try adjusting your search terms
          </p>
        </div>
      )}
    </div>
  );
}
