import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import toast from "react-hot-toast";

const CreateQuiz = () => {
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState({
    title: "", description: "", timeLimitSeconds: 600, passingScore: 50, maxAttempts: 1, isActive: true,
    questions: [{ text: "", options: ["", "", "", ""], correctIndex: 0, marks: 1 }],
  });

  const handleQuestionChange = (index, field, value) => {
    const updated = [...quiz.questions];
    updated[index][field] = value;
    setQuiz({ ...quiz, questions: updated });
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const updated = [...quiz.questions];
    updated[qIndex].options[oIndex] = value;
    setQuiz({ ...quiz, questions: updated });
  };

  const addQuestion = () => {
    setQuiz({ ...quiz, questions: [...quiz.questions, { text: "", options: ["", "", "", ""], correctIndex: 0, marks: 1 }] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/quizzes", quiz);
      toast.success("Quiz Created Successfully");
      navigate("/instructor");
    } catch (err) {
      toast.error(err.response?.data?.message || "Quiz Creation Failed");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 px-6 py-8">
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Create Quiz</h1>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-6 space-y-4">
          <div>
            <label className="text-sm text-zinc-400 mb-1.5 block">Quiz Title</label>
            <input
              type="text"
              placeholder="Enter quiz title"
              className="w-full bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
              onChange={(e) => setQuiz({ ...quiz, title: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm text-zinc-400 mb-1.5 block">Description</label>
            <textarea
              placeholder="Enter quiz description"
              rows={3}
              className="w-full bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 transition resize-none"
              onChange={(e) => setQuiz({ ...quiz, description: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: "Time Limit (seconds)", field: "timeLimitSeconds", placeholder: "600" },
              { label: "Passing Score (%)", field: "passingScore", placeholder: "50" },
              { label: "Max Attempts", field: "maxAttempts", placeholder: "1" },
            ].map(({ label, field, placeholder }) => (
              <div key={field}>
                <label className="text-sm text-zinc-400 mb-1.5 block">{label}</label>
                <input
                  type="number"
                  placeholder={placeholder}
                  className="w-full bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
                  onChange={(e) => setQuiz({ ...quiz, [field]: Number(e.target.value) })}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-5">
          {quiz.questions.map((question, qIndex) => (
            <div key={qIndex} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
              <h2 className="text-white font-semibold mb-4">Question {qIndex + 1}</h2>
              <input
                type="text"
                placeholder="Enter question text"
                className="w-full bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 transition mb-4"
                onChange={(e) => handleQuestionChange(qIndex, "text", e.target.value)}
              />
              <div className="space-y-3 mb-4">
                {question.options.map((option, oIndex) => (
                  <input
                    key={oIndex}
                    type="text"
                    placeholder={`Option ${oIndex + 1}`}
                    className="w-full bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
                    onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                  />
                ))}
              </div>
              <div>
                <label className="text-sm text-zinc-400 mb-1.5 block">Correct Answer</label>
                <select
                  className="bg-zinc-800 border border-zinc-700 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
                  onChange={(e) => handleQuestionChange(qIndex, "correctIndex", Number(e.target.value))}
                >
                  <option value="0">Option 1</option>
                  <option value="1">Option 2</option>
                  <option value="2">Option 3</option>
                  <option value="3">Option 4</option>
                </select>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-4 mt-6">
          <button
            type="button"
            onClick={addQuestion}
            className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 transition-colors text-white px-5 py-2.5 rounded-xl text-sm font-semibold"
          >
            + Add Question
          </button>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-500 transition-colors text-white px-6 py-2.5 rounded-xl text-sm font-semibold"
          >
            Create Quiz
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateQuiz;