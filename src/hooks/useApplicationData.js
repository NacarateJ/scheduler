import { useReducer, useEffect, useRef } from "react";
import axios from "axios";

import reducer, {
  SET_DAY,
  SET_APPLICATION_DATA,
  SET_INTERVIEW,
} from "reducers/application";

/**
 * Custom hook for managing application data and interactions.
 *
 * This hook provides functions to manage application state and interactions related to the appointments and interviewers.
 *
 * @return {object} An object containing the application state and functions for managing it.
 */
export default function useApplicationData() {
  const [state, dispatch] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {},
  });

  /**
   * Set the currently selected day.
   *
   * @param {string} day - The day to set as the currently selected day.
   */
  const setDay = (day) => dispatch({ type: SET_DAY, day });

  // APIs for retrieving data
  const daysAPI = "/api/days";
  const appointmentsAPI = "/api/appointments";
  const interviewersAPI = "/api/interviewers";

  // Fetch initial data from APIs on component mount
  useEffect(() => {
    Promise.all([
      axios.get(daysAPI),
      axios.get(appointmentsAPI),
      axios.get(interviewersAPI),
    ]).then((all) => {
      const [daysResponse, appointmentsResponse, interviewersResponse] = all;

      // Update the application state with fetched data
      dispatch({
        type: SET_APPLICATION_DATA,
        days: daysResponse.data,
        appointments: appointmentsResponse.data,
        interviewers: interviewersResponse.data,
      });
    });
  }, []);

  // Ref to store the WebSocket instance
  const webSocketRef = useRef(null);

  // Establish a WebSocket connection and set up event handlers
  useEffect(() => {
    const newSocket = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);

    // Store the WebSocket instance in the ref
    webSocketRef.current = newSocket;

    // Event handler for WebSocket connection open
    newSocket.onopen = () => {
      newSocket.send("ping"); // Send a test message (from client to server)
    };

    // Event handler for incoming WebSocket messages
    newSocket.onmessage = (event) => {
      // Handle WebSocket message
      const data = JSON.parse(event.data);

      console.log(`Message Received: ${data}`); // Send message from server to client

      if (data.type === "SET_INTERVIEW") {
        const { id, interview } = data;

        // Update the state with new interview data from the server
        dispatch({
          type: SET_INTERVIEW,
          interview,
          id,
        });
      }
    };

    // Close the WebSocket connection when the component unmounts
    return () => {
      newSocket.close();
    };
  }, []);

  /**
   * Book an interview for a specific appointment.
   *
   * @param {number} id - The ID of the appointment to book.
   * @param {object} interview - The interview object to associate with the appointment.
   * @return {boolean} Returns true if the booking is successful, false otherwise.
   */
  const bookInterview = async (id, interview) => {
    try {
      // Make PUT request to update the appointment with the provided interview data in the backend
      await axios.put(`/api/appointments/${id}`, { interview });

      // Update the state with the booked interview
      dispatch({ type: SET_INTERVIEW, id, interview });

      return true; // Booking successful
    } catch (error) {
      // Log erros occurred during the API call or dispatching the action
      console.log(error);

      return false; // Booking failed
    }
  };

  /**
   * Cancel an existing interview for a specific appointment.
   *
   * @param {number} id - The ID of the appointment to cancel the interview for.
   * @return {boolean} Returns true if the cancellation is successful, false otherwise.
   */
  const cancelInterview = async (id) => {
    try {
      // Send a DELETE request to the server to remove the interview data associated with the given id
      await axios.delete(`/api/appointments/${id}`);

      // Update the state to remove the interview
      dispatch({ type: SET_INTERVIEW, id, interview: null });

      return true; // Cancellation successful
    } catch (error) {
      // Log erros occurred during the API call or dispatching the action
      console.log(error);

      return false; // Cancellation failed
    }
  };

  return {
    state,
    setDay,
    bookInterview,
    cancelInterview,
  };
}
