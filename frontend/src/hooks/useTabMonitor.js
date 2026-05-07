import { useEffect, useState } from "react";

const useTabMonitor = () => {
  const [violations, setViolations] = useState(0);

  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        setViolations((prev) => prev + 1);
      }
    };

    document.addEventListener(
      "visibilitychange",
      handleVisibility
    );

    return () => {
      document.removeEventListener(
        "visibilitychange",
        handleVisibility
      );
    };
  }, []);

  return violations;
};

export default useTabMonitor;