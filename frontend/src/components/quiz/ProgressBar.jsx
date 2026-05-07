const ProgressBar = ({ progress }) => {
  return (
    <div className="w-full bg-gray-300 h-3 rounded">
      <div
        className="bg-green-500 h-3 rounded"
        style={{
          width: `${progress}%`,
        }}
      ></div>
    </div>
  );
};

export default ProgressBar;