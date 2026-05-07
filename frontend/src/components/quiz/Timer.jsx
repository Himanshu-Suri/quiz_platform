const Timer = ({ time }) => {
  const minutes = Math.floor(time / 60);

  const seconds = time % 60;

  return (
    <div className="bg-red-500 text-white px-4 py-2 rounded font-bold">
      {minutes}:
      {seconds.toString().padStart(2, "0")}
    </div>
  );
};

export default Timer;