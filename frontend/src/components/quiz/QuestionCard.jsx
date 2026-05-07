const QuestionCard = ({
  question,
  selectedAnswer,
  handleAnswerSelect,
}) => {
  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-6">
        {question.question}
      </h2>

      <div className="space-y-4">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() =>
              handleAnswerSelect(
                question._id,
                option
              )
            }
            className={`w-full text-left p-4 border rounded ${
              selectedAnswer === option
                ? "bg-blue-500 text-white"
                : "bg-white hover:bg-gray-100"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuestionCard;