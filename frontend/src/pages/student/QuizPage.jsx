/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../api/axios";
import useTimer from "../../hooks/useTimer";
import useTabMonitor from "../../hooks/useTabMonitor";

const QuizPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [attemptId, setAttemptId] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [gateError, setGateError] = useState("");
  const [attemptInfo, setAttemptInfo] = useState({ used: 0, max: 1 });
  const violations = useTabMonitor();

  useEffect(() => {
    fetchQuiz();
    fetchAttemptInfo();
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  useEffect(() => {
    if (violations >= 3) {
      alert("Too many tab switches. Auto submitting.");
      submitQuiz();
    }
  }, [violations]);

  const fetchQuiz = async () => {
    try {
      const res = await api.get(`/quizzes/${id}/take`);
      setQuiz(res.data);
    } catch (err) {
      console.log(err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const fetchAttemptInfo = async () => {
    try {
      const historyRes = await api.get(`/attempts/my/${id}`);
      const quizRes = await api.get(`/quizzes/${id}/take`);
      const used = historyRes.data.filter((a) => a.status === "submitted").length;
      const max = quizRes.data.maxAttempts;
      setAttemptInfo({ used, max });
      if (used >= max) {
        setGateError("Max attempts reached. You cannot attempt this quiz again.");
      }
    } catch (err) {
      console.log(err);
    }
  };

const startAttempt = async () => {
  try {
    const res = await api.post("/attempts/start", { quizId: id });
    if (res.data.attemptId) {
      setAttemptId(res.data.attemptId);
      setSubmitError(""); // clear any old error
    } else {
      setSubmitError("Server did not return an attempt ID.");
    }
  } catch (err) {
    const msg = err.response?.data?.message || err.message;
    setSubmitError(`Start attempt failed: ${msg}`);
  }
};

const enterFullscreen = async () => {
  try {
    await document.documentElement.requestFullscreen();
    setIsFullscreen(true);
  } catch (err) {
    console.log(err);
  }
};

// Add a separate useEffect to start attempt when fullscreen is confirmed
useEffect(() => {
  if (isFullscreen && !attemptId) {
    startAttempt();
  }
}, [isFullscreen]);

  const submitQuiz = async () => {
    if (submitting) return;
    if (!attemptId) {
      setSubmitError("No attempt ID found. Try refreshing.");
      return;
    }
    try {
      setSubmitting(true);
      setSubmitError("");
      const res = await api.post(`/attempts/${attemptId}/submit`, {
        answers: Object.values(answers),
        autoSubmitted: false,
      });
      toast.success(`Quiz Submitted! Score: ${res.data.score}`);
      navigate("/result", { state: { ...res.data, quizId: id } });
    } catch (err) {
      setSubmitError(err.response?.data?.message || err.message || "Submission Failed");
    } finally {
      setSubmitting(false);
    }
  };

  const timeLeft = useTimer(quiz ? quiz.timeLimitSeconds : 0, submitQuiz);

  const formattedTime = useMemo(() => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }, [timeLeft]);

  if (loading) {
    return (
      <div className="h-screen bg-zinc-950 flex items-center justify-center">
        <p className="text-white text-xl font-semibold">Loading Quiz...</p>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="h-screen bg-zinc-950 flex items-center justify-center">
        <p className="text-white text-xl font-semibold">Quiz Not Found</p>
      </div>
    );
  }

  if (!isFullscreen) {
    return (
      <div className="h-screen bg-zinc-950 flex items-center justify-center px-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-10 max-w-md w-full text-center">
          <div className="text-5xl mb-4">🖥️</div>
          <h1 className="text-2xl font-bold text-white mb-2">Fullscreen Required</h1>
          <p className="text-zinc-400 text-sm mb-5">
            This quiz must be taken in fullscreen mode. Exiting fullscreen will pause your quiz.
          </p>

          <div className="bg-zinc-800 border border-zinc-700 rounded-xl px-5 py-4 mb-6 flex justify-between items-center">
            <span className="text-zinc-400 text-sm">Attempts Used</span>
            <span className={`text-sm font-bold ${
              attemptInfo.used >= attemptInfo.max ? "text-red-400" : "text-white"
            }`}>
              {attemptInfo.used} / {attemptInfo.max}
            </span>
          </div>

          {gateError ? (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-5 py-3 text-sm">
              {gateError}
            </div>
          ) : (
            <button
              onClick={enterFullscreen}
              className="w-full bg-blue-600 hover:bg-blue-500 transition-colors text-white py-3 rounded-xl font-semibold text-sm"
            >
              Enter Fullscreen & Continue
            </button>
          )}
        </div>
      </div>
    );
  }

  const question = quiz.questions[currentQuestion];
  const answeredCount = Object.keys(answers).length;
  const progress = (answeredCount / quiz.questions.length) * 100;

  const handleAnswerSelect = (questionId, optionIndex) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: { questionId, selectedIndex: optionIndex, timeTaken: 10 },
    }));
  };

  return (
    <div className="min-h-screen bg-zinc-950 p-6">
      {/* Header */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 mb-5 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-white">{quiz.title}</h1>
          <p className="text-zinc-400 text-sm mt-0.5">
            Question {currentQuestion + 1} of {quiz.questions.length}
          </p>
        </div>
        <div className="text-right">
          <p className={`text-2xl font-bold ${timeLeft < 60 ? "text-red-400" : "text-white"}`}>
            {formattedTime}
          </p>
          <p className="text-xs text-zinc-500 mt-0.5">Violations: {violations}</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-zinc-800 h-1.5 rounded-full mb-5">
        <div
          className="bg-blue-600 h-1.5 rounded-full transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Question Card */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-5">
        <h2 className="text-white font-semibold text-lg mb-5">{question.text}</h2>
        <div className="space-y-3">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(question._id, index)}
              className={`w-full text-left px-5 py-4 rounded-xl border text-sm font-medium transition-colors ${
                answers[question._id]?.selectedIndex === index
                  ? "bg-blue-600 border-blue-500 text-white"
                  : "bg-zinc-800 border-zinc-700 text-zinc-300 hover:border-zinc-500"
              }`}
            >
              <span className="mr-3 text-zinc-500">{String.fromCharCode(65 + index)}.</span>
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Error Message */}
      {submitError && (
        <div className="mb-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-5 py-3 text-sm">
          Error: {submitError}
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={() => setCurrentQuestion((p) => p - 1)}
          disabled={currentQuestion === 0}
          className="bg-zinc-800 border border-zinc-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-30 hover:bg-zinc-700 transition-colors"
        >
          Previous
        </button>
        {currentQuestion < quiz.questions.length - 1 ? (
          <button
            onClick={() => setCurrentQuestion((p) => p + 1)}
            className="bg-zinc-800 border border-zinc-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-zinc-700 transition-colors"
          >
            Next
          </button>
        ) : (
          <button
            onClick={submitQuiz}
            disabled={submitting}
            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50 transition-colors"
          >
            {submitting ? "Submitting..." : "Submit Quiz"}
          </button>
        )}
      </div>

      {/* Question Palette */}
      <div className="mt-6 bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
        <h3 className="text-white font-semibold text-sm mb-4">Question Palette</h3>
        <div className="flex flex-wrap gap-2">
          {quiz.questions.map((q, index) => (
            <button
              key={q._id}
              onClick={() => setCurrentQuestion(index)}
              className={`w-9 h-9 rounded-lg text-sm font-bold transition-colors ${
                currentQuestion === index
                  ? "bg-blue-600 text-white"
                  : answers[q._id]
                  ? "bg-emerald-600 text-white"
                  : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuizPage;