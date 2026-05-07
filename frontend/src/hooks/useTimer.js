import { useEffect, useState } from "react";

const useTimer = (initialTime, onTimeUp) => {
  const [timeLeft, setTimeLeft] =
    useState(initialTime);

  // Reset timer when quiz loads
  useEffect(() => {
    setTimeLeft(initialTime);
  }, [initialTime]);

  useEffect(() => {
    if (!timeLeft || timeLeft <= 0) {
      if (timeLeft === 0) {
        onTimeUp();
      }

      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, onTimeUp]);

  return timeLeft;
};

export default useTimer;