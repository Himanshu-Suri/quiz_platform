import { useLocation, useNavigate, Link } from "react-router-dom";
import Navbar from "../../components/common/Navbar";

const ResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state;

  if (!result) {
    return (
      <div className="min-h-screen bg-zinc-950">
        <Navbar />
        <div className="h-[80vh] flex items-center justify-center">
          <p className="text-white text-xl font-semibold">No Result Found</p>
        </div>
      </div>
    );
  }

  const passed = result.percentage >= 50;

  return (
    <div className="min-h-screen bg-zinc-950">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-8">

        <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Quiz Result</h1>
            <p className="text-zinc-400 text-sm mt-1">
              {passed ? "🎉 Congratulations, you passed!" : "Keep practicing, you'll get it!"}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate("/")}
              className="bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 transition-colors text-white px-4 py-2.5 rounded-xl text-sm font-semibold"
            >
              Dashboard
            </button>
            <Link to={`/leaderboard/${result.quizId}`}>
              <button className="bg-blue-600 hover:bg-blue-500 transition-colors text-white px-4 py-2.5 rounded-xl text-sm font-semibold">
                Leaderboard
              </button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <p className="text-zinc-400 text-sm">Score</p>
            <p className="text-4xl font-bold text-white mt-2">
              {result.score}<span className="text-zinc-500 text-2xl">/{result.totalMarks}</span>
            </p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <p className="text-zinc-400 text-sm">Percentage</p>
            <p className="text-4xl font-bold text-white mt-2">{result.percentage}%</p>
          </div>
          <div className={`rounded-2xl p-6 border ${passed ? "bg-emerald-500/10 border-emerald-500/20" : "bg-red-500/10 border-red-500/20"}`}>
            <p className="text-zinc-400 text-sm">Status</p>
            <p className={`text-4xl font-bold mt-2 ${passed ? "text-emerald-400" : "text-red-400"}`}>
              {passed ? "Passed" : "Failed"}
            </p>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-5">Answer Review</h2>
          <div className="space-y-5">
            {result.correctAnswers.map((question, index) => {
              const studentAnswer = result.answers[index];
              return (
                <div key={question.questionId} className="border border-zinc-800 rounded-xl p-5">
                  <h3 className="text-white font-semibold mb-4 text-sm">
                    Q{index + 1}. {question.text}
                  </h3>
                  <div className="space-y-2">
                    {question.options.map((option, optionIndex) => {
                      const isCorrect = optionIndex === question.correctIndex;
                      const isSelected = optionIndex === studentAnswer?.selectedIndex;
                      return (
                        <div
                          key={optionIndex}
                          className={`px-4 py-3 rounded-lg text-sm border transition ${
                            isCorrect
                              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                              : isSelected
                              ? "bg-red-500/10 border-red-500/30 text-red-400"
                              : "bg-zinc-800 border-zinc-700 text-zinc-400"
                          }`}
                        >
                          <span className="mr-2">{String.fromCharCode(65 + optionIndex)}.</span>
                          {option}
                          {isCorrect && <span className="ml-2 text-xs">✓ Correct</span>}
                          {isSelected && !isCorrect && <span className="ml-2 text-xs">✗ Your answer</span>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ResultPage;