import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/student/Dashboard";
import QuizPage from "./pages/student/QuizPage";
import ResultPage from "./pages/student/ResultPage";
import Leaderboard from "./pages/student/Leaderboard";
import InstructorDashboard from "./pages/instructor/InstructorDashboard";
import CreateQuiz from "./pages/instructor/CreateQuiz";
import Analytics from "./pages/instructor/Analytics";

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/login" />;
  return children;
};

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<ProtectedRoute role="student"><Dashboard /></ProtectedRoute>} />
      <Route path="/quiz/:id" element={<ProtectedRoute role="student"><QuizPage /></ProtectedRoute>} />
      <Route path="/result" element={<ProtectedRoute role="student"><ResultPage /></ProtectedRoute>} />
      <Route path="/leaderboard/:id" element={<Leaderboard />} />
      <Route path="/instructor" element={<ProtectedRoute role="instructor"><InstructorDashboard /></ProtectedRoute>} />
      <Route path="/create-quiz" element={<ProtectedRoute role="instructor"><CreateQuiz /></ProtectedRoute>} />
      <Route path="/analytics/:id" element={<ProtectedRoute role="instructor"><Analytics /></ProtectedRoute>} />
    </Routes>
  );
}

export default App;