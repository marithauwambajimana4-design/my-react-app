import { useEffect, useState } from "react";
import CounterControls from "./ky";

export default function Counter() {
  const [count, setCount] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isRunning) {
      return;
    }

    const intervalId = setInterval(() => {
      setCount((currentCount) => currentCount + 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [isRunning]);

  return (
    <div>
      <h1>Counter</h1>
      <p>{count}</p>
      <CounterControls
        isRunning={isRunning}
        onToggle={() => setIsRunning((running) => !running)}
        onReset={() => {
          setIsRunning(false);
          setCount(0);
        }}
      />
    </div>
  );
}
