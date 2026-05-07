import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axios";
import Navbar from "../../components/common/Navbar";

const Analytics = () => {
  const { id } = useParams();
  const [analytics, setAnalytics] = useState({
    totalAttempts: 0, averageScore: 0, passRate: 0, distribution: [], questionStats: [],
  });

  useEffect(() => { fetchAnalytics(); }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await api.get(`/analytics/quiz/${id}`);
      setAnalytics({
        totalAttempts: res.data?.totalAttempts || 0,
        averageScore: res.data?.averageScore || 0,
        passRate: res.data?.passRate || 0,
        distribution: res.data?.distribution || [],
        questionStats: res.data?.questionStats || [],
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">Quiz Analytics</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
          {[
            { label: "Total Attempts", value: analytics.totalAttempts },
            { label: "Average Score", value: `${Math.round(analytics.averageScore)}%` },
            { label: "Pass Rate", value: `${analytics.passRate}%` },
          ].map((stat) => (
            <div key={stat.label} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
              <p className="text-zinc-400 text-sm">{stat.label}</p>
              <p className="text-4xl font-bold text-white mt-2">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-6">
          <h2 className="text-xl font-bold text-white mb-5">Score Distribution</h2>
          <div className="space-y-4">
            {analytics.distribution.length === 0 && (
              <p className="text-zinc-500 text-sm">No attempts yet</p>
            )}
            {analytics.distribution.map((item, index) => (
              <div key={index}>
                <div className="flex justify-between mb-1.5 text-sm">
                  <span className="text-zinc-400">{item.range}</span>
                  <span className="text-white font-medium">{item.count} students</span>
                </div>
                <div className="w-full bg-zinc-800 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${Math.min(item.count * 20, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-5">Question Difficulty</h2>
          <div className="space-y-3">
            {analytics.questionStats.length === 0 && (
              <p className="text-zinc-500 text-sm">No attempts yet</p>
            )}
            {analytics.questionStats.map((q, index) => (
              <div key={index} className="border border-zinc-800 bg-zinc-950 rounded-xl p-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-white text-sm">{q.question}</h3>
                  <span className={`px-3 py-0.5 rounded-full text-xs font-semibold ${
                    q.difficulty === "Easy" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    : q.difficulty === "Medium" ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                    : "bg-red-500/10 text-red-400 border border-red-500/20"
                  }`}>
                    {q.difficulty}
                  </span>
                </div>
                <p className="mt-2 text-zinc-400 text-sm">Accuracy: {q.accuracy}%</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;