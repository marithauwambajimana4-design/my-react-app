export default function CounterControls({ isRunning, onToggle, onReset }) {
  return (
    <>
      <button onClick={onToggle}>{isRunning ? "Stop" : "Start"}</button>
      <button onClick={onReset}>Reset</button>
    </>
  );
}
