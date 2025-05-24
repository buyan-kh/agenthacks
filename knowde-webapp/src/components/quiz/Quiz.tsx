import React, { useState } from "react";
import { HelpCircle, CheckCircle2, XCircle, Clock, Trophy } from "lucide-react";

export default function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const questions = [
    {
      id: 1,
      question:
        "What is the primary goal of supervised learning in machine learning?",
      options: [
        "To find hidden patterns in unlabeled data",
        "To learn from labeled training data to make predictions",
        "To maximize rewards through trial and error",
        "To reduce the dimensionality of data",
      ],
      correctAnswer: 1,
      explanation:
        "Supervised learning uses labeled training data to learn a mapping from inputs to outputs, enabling predictions on new data.",
    },
    {
      id: 2,
      question:
        "Which of the following is NOT a common activation function in neural networks?",
      options: [
        "ReLU (Rectified Linear Unit)",
        "Sigmoid",
        "Tanh",
        "Linear Regression",
      ],
      correctAnswer: 3,
      explanation:
        "Linear regression is a machine learning algorithm, not an activation function. ReLU, Sigmoid, and Tanh are all common activation functions.",
    },
    {
      id: 3,
      question: "What does overfitting mean in machine learning?",
      options: [
        "The model performs well on training data but poorly on new data",
        "The model performs poorly on both training and test data",
        "The model is too simple to capture the underlying pattern",
        "The model has too few parameters",
      ],
      correctAnswer: 0,
      explanation:
        "Overfitting occurs when a model learns the training data too well, including noise and irrelevant details, leading to poor generalization.",
    },
  ];

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === null) return;

    const newAnswers = [...answers, selectedAnswer];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      // Calculate score
      const correctAnswers = newAnswers.reduce((count, answer, index) => {
        return count + (answer === questions[index].correctAnswer ? 1 : 0);
      }, 0);
      setScore(correctAnswers);
      setShowResult(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setAnswers([]);
    setShowResult(false);
    setScore(0);
  };

  const getScoreColor = (score: number, total: number) => {
    const percentage = (score / total) * 100;
    if (percentage >= 80) return "text-kn-success";
    if (percentage >= 60) return "text-kn-warning";
    return "text-kn-error";
  };

  if (showResult) {
    return (
      <div className="p-6 space-y-6">
        <div className="card text-center max-w-2xl mx-auto">
          <Trophy className="w-16 h-16 mx-auto mb-4 text-kn-accent" />
          <h1 className="text-3xl font-display font-bold text-kn-text mb-2">
            Quiz Complete!
          </h1>

          <div
            className={`text-6xl font-bold mb-4 ${getScoreColor(
              score,
              questions.length
            )}`}
          >
            {score}/{questions.length}
          </div>

          <p className="text-kn-text-secondary mb-6">
            You scored {Math.round((score / questions.length) * 100)}% on this
            quiz
          </p>

          {/* Question Review */}
          <div className="space-y-4 mb-6 text-left">
            {questions.map((question, index) => {
              const userAnswer = answers[index];
              const isCorrect = userAnswer === question.correctAnswer;

              return (
                <div
                  key={question.id}
                  className="p-4 rounded-lg border border-kn-border"
                >
                  <div className="flex items-start gap-3 mb-2">
                    {isCorrect ? (
                      <CheckCircle2 className="w-5 h-5 text-kn-success flex-shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-5 h-5 text-kn-error flex-shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <h3 className="font-medium text-kn-text mb-1">
                        Question {index + 1}
                      </h3>
                      <p className="text-sm text-kn-text-secondary mb-2">
                        {question.question}
                      </p>
                      <p className="text-sm text-kn-text-secondary">
                        <span className="font-medium">Your answer:</span>{" "}
                        {question.options[userAnswer]}
                      </p>
                      {!isCorrect && (
                        <p className="text-sm text-kn-success">
                          <span className="font-medium">Correct answer:</span>{" "}
                          {question.options[question.correctAnswer]}
                        </p>
                      )}
                      <p className="text-xs text-kn-text-secondary mt-2 italic">
                        {question.explanation}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex gap-3">
            <button onClick={resetQuiz} className="btn-primary">
              Take Quiz Again
            </button>
            <button className="btn-secondary">Continue Learning</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-kn-text mb-2">
            Machine Learning Quiz
          </h1>
          <p className="text-kn-text-secondary">
            Test your knowledge of ML concepts
          </p>
        </div>
        <div className="flex items-center gap-2 text-kn-text-secondary">
          <Clock className="w-4 h-4" />
          <span>No time limit</span>
        </div>
      </div>

      {/* Progress */}
      <div className="card">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-kn-text">Progress</span>
          <span className="text-sm text-kn-text-secondary">
            {currentQuestion + 1} of {questions.length}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-kn-primary to-kn-secondary h-2 rounded-full transition-all duration-300"
            style={{
              width: `${((currentQuestion + 1) / questions.length) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="card max-w-3xl mx-auto">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-10 h-10 bg-kn-primary rounded-full flex items-center justify-center flex-shrink-0">
            <HelpCircle className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-display font-bold text-kn-text mb-2">
              Question {currentQuestion + 1}
            </h2>
            <p className="text-kn-text-secondary leading-relaxed">
              {questions[currentQuestion].question}
            </p>
          </div>
        </div>

        {/* Answer Options */}
        <div className="space-y-3 mb-6">
          {questions[currentQuestion].options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                selectedAnswer === index
                  ? "border-kn-primary bg-kn-primary/5 text-kn-primary"
                  : "border-kn-border hover:border-kn-primary/50 text-kn-text"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    selectedAnswer === index
                      ? "border-kn-primary bg-kn-primary"
                      : "border-gray-300"
                  }`}
                >
                  {selectedAnswer === index && (
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  )}
                </div>
                <span>{option}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
            disabled={currentQuestion === 0}
            className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          <button
            onClick={handleNextQuestion}
            disabled={selectedAnswer === null}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {currentQuestion === questions.length - 1
              ? "Finish Quiz"
              : "Next Question"}
          </button>
        </div>
      </div>
    </div>
  );
}
