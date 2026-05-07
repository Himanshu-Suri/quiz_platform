const QuestionPalette = ({
  questions,
  answers,
  currentQuestion,
  setCurrentQuestion,
}) => {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="font-bold mb-4">
        Question Palette
      </h3>

      <div className="flex flex-wrap gap-3">
        {questions.map((q, index) => (
          <button
            key={q._id}
            onClick={() =>
              setCurrentQuestion(index)
            }
            className={`w-10 h-10 rounded font-bold ${
              currentQuestion === index
                ? "bg-black text-white"
                : answers[q._id]
                ? "bg-green-500 text-white"
                : "bg-gray-300"
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuestionPalette;