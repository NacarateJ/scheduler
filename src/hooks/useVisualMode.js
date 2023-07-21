import { useState } from "react";

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  const transition = (newMode, replace = false) => {
    // If replace is true, update the history to replace the current mode
    if (replace) {
      setHistory((prevHistory) => {
        const newHistory = [...prevHistory];
        newHistory[newHistory.length - 1] = newMode;
        return newHistory;
      });
    } else {
      // If replace is false, add the new mode to the history
      setHistory((prevHistory) => [...prevHistory, newMode]);
    }
    // Set the mode to the new mode
    setMode(newMode);
  };

  const back = () => {
    // Only allow going back if history has more than one element
    if (history.length > 1) {
      // Remove the last mode from the history array
      const newHistory = history.slice(0, -1);
      // Set the mode to the previous mode
      setMode(newHistory[newHistory.length - 1]);
      // Update the history state
      setHistory(newHistory);
    }
  };

  return {
    mode,
    transition,
    back
  };
};