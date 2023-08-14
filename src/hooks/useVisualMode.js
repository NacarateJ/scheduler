import { useState } from "react";

/**
 * Custom hook for managing visual modes and history.
 *
 * @param {any} initial The initial mode value.
 * @return {object} An object containing the current mode, transition function, and back function.
 */
export default function useVisualMode(initial) {
  // Maintain a history array to track mode transitions
  const [history, setHistory] = useState([initial]);

  /**
   * Transition to a new visual mode.
   *
   * @param {any} newMode The new mode to transition to.
   * @param {boolean} replace If true, replaces the current mode in history.
   */
  const transition = (newMode, replace = false) => {
    setHistory((prevHistory) => {
      // Create a new history array based on the replace flag
      const newHistory = replace
        ? [...prevHistory.slice(0, -1), newMode]
        : [...prevHistory, newMode];
      return newHistory;
    });
  };

  /**
   * Move back to the previous visual mode in history.
   */
  const back = () => {
    // Only allow going back if history has more than one element
    if (history.length > 1) {
      // Remove the last element from the history array
      setHistory((prevHistory) => prevHistory.slice(0, -1));
    }
  };

  // Extract the current mode from the last element of the history array
  const mode = history[history.length - 1];

  return {
    mode,
    transition,
    back,
  };
};