import { useState } from "react";

/**
 * Custom hook for managing visual modes and history.
 *
 * @param {any} initial The initial mode value.
 * @return {object} An object containing the current mode, transition function, and back function.
 */
export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  /**
   * Transition to a new visual mode.
   *
   * @param {any} newMode The new mode to transition to.
   * @param {boolean} replace If true, replaces the current mode in history.
   */
  const transition = (newMode, replace = false) => {
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

    setMode((prevMode) => newMode);
  };

  /**
   * Move back to the previous visual mode in history.
   */
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
    back,
  };
};