import { useEffect, useState } from "react";
import api from "../../api/axios";
import { Link } from "react-router-dom";
import Navbar from "../../components/common/Navbar";

const Dashboard = () => {
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => { fetchQuizzes(); }, []);

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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Available Quizzes</h1>
          <p className="text-zinc-400 mt-2 text-sm">Attempt quizzes under real exam conditions.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {quizzes.map((quiz) => (
            <div key={quiz._id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-zinc-600 transition-colors">
              <div className="flex justify-between items-start mb-3">
                <h2 className="text-lg font-bold text-white">{quiz.title}</h2>
                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full text-xs font-medium">
                  Active
                </span>
              </div>
              <p className="text-zinc-400 text-sm mb-5">{quiz.description}</p>
              <div className="space-y-2 mb-5 text-sm">
                <div className="flex justify-between text-zinc-400">
                  <span>Questions</span>
                  <span className="text-white font-medium">{quiz.questions.length}</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Time Limit</span>
                  <span className="text-white font-medium">{quiz.timeLimitSeconds / 60} mins</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Passing Score</span>
                  <span className="text-white font-medium">{quiz.passingScore}%</span>
                </div>
              </div>
              <Link to={`/quiz/${quiz._id}`}>
                <button className="w-full bg-blue-600 hover:bg-blue-500 transition-colors text-white py-2.5 rounded-xl text-sm font-semibold">
                  Start Quiz
                </button>
              </Link>
            </div>
          ))}
        </div>
        {quizzes.length === 0 && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-10 text-center text-zinc-500 mt-8">
            No quizzes available
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;