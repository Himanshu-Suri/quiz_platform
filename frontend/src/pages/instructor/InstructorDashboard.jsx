import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import Navbar from "../../components/common/Navbar";

const InstructorDashboard = () => {
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const res = await api.get("/quizzes");
      setQuizzes(res.data);
    } catch (err) {
      console.log(err.response?.data);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Instructor Dashboard</h1>
            <p className="text-zinc-400 mt-2 text-sm">Manage quizzes and view analytics</p>
          </div>
          <Link to="/create-quiz">
            <button className="bg-blue-600 hover:bg-blue-500 transition-colors text-white px-5 py-2.5 rounded-xl text-sm font-semibold">
              + Create Quiz
            </button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {quizzes.map((quiz) => (
            <div key={quiz._id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-zinc-600 transition-colors">
              <div className="flex justify-between items-start mb-3">
                <h2 className="text-lg font-bold text-white">{quiz.title}</h2>
                <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2.5 py-0.5 rounded-full text-xs font-medium">
                  Quiz
                </span>
              </div>
              <p className="text-zinc-400 text-sm mb-5">{quiz.description}</p>
              <div className="space-y-2 mb-5 text-sm">
                <div className="flex justify-between text-zinc-400">
                  <span>Questions</span>
                  <span className="text-white font-medium">{quiz.questions.length}</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Duration</span>
                  <span className="text-white font-medium">{quiz.timeLimitSeconds / 60} mins</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Pass Score</span>
                  <span className="text-white font-medium">{quiz.passingScore}%</span>
                </div>
              </div>
              <div className="flex gap-2 flex-wrap">
                <Link to={"/analytics/" + quiz._id} className="flex-1">
                  <button className="w-full bg-blue-600 hover:bg-blue-500 transition-colors text-white py-2.5 rounded-xl text-sm font-semibold">
                    Analytics
                  </button>
                </Link>
                <Link to={"/leaderboard/" + quiz._id} className="flex-1">
                  <button className="w-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 transition-colors text-white py-2.5 rounded-xl text-sm font-semibold">
                    Leaderboard
                  </button>
                </Link>
                <a
                 href={"http://localhost:8082/report?quizId=" + quiz._id}
  target="_blank"
  rel="noreferrer"
  className="flex-1"
>
  <button className="w-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 transition-colors text-white py-2.5 rounded-xl text-sm font-semibold">
    Report
  </button>
</a>
              </div>
            </div>
          ))}
        </div>

        {quizzes.length === 0 && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-10 text-center text-zinc-500 mt-8">
            No quizzes found. Create your first quiz!
          </div>
        )}
      </div>
    </div>
  );
};

export default InstructorDashboard;