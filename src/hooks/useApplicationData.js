import { useReducer, useEffect, useRef } from "react";
import axios from "axios";

import reducer, {
  SET_DAY,
  SET_APPLICATION_DATA,
  SET_INTERVIEW,
} from "reducers/application";

export default function useApplicationData() {
  const [state, dispatch] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {},
  });

  // Change selected day
  const setDay = (day) => dispatch({ type: SET_DAY, day });

  const daysAPI = "/api/days";
  const appointmentsAPI = "/api/appointments";
  const interviewersAPI = "/api/interviewers";

  useEffect(() => {
    Promise.all([
      axios.get(daysAPI),
      axios.get(appointmentsAPI),
      axios.get(interviewersAPI),
    ]).then((all) => {
      const [daysResponse, appointmentsResponse, interviewersResponse] = all;

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

  // Make a connection to the WebSocket server using the useEffect method
  useEffect(() => {
    // Establish the WebSocket connection
    const newSocket = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);

    // Store the WebSocket instance in the ref
    webSocketRef.current = newSocket;

    // Set up event handlers for WebSocket interactions
    // Send message from client to server
    newSocket.onopen = () => {
      newSocket.send("ping");
    };

    // Send message from server to client
    newSocket.onmessage = (event) => {
      // Handle WebSocket message
      const data = JSON.parse(event.data);

      console.log(`Message Received: ${data}`);

      if (data.type === "SET_INTERVIEW") {
        // Update the state with the new interview data received from the server
        const { id, interview } = data;
   
        dispatch({
          type: SET_INTERVIEW,
          interview,
          id,
        });
      }
    };

    return () => {
      // Close the WebSocket connection when the component is unmounted
      newSocket.close();
    };
  }, [state]);

  // Book interview
  const bookInterview = async (id, interview) => {
    try {
      // Make PUT request to update the appointment with the provided interview data in the backend
      await axios.put(`/api/appointments/${id}`, { interview });

      dispatch({ type: SET_INTERVIEW, id, interview });

      // Return true if the interview booking is successful
      return true;
    } catch (error) {
      // Log erros occurred during the API call or dispatching the action
      console.log(error);

      // Return false if the interview booking fails
      return false;
    }
  };

  // Delete interview
  const cancelInterview = async (id) => {
    try {
      // Send a DELETE request to the server to remove the interview data associated with the given id
      await axios.delete(`/api/appointments/${id}`);

      dispatch({ type: SET_INTERVIEW, id, interview: null });

      // Return true if the interview cancellation is successful
      return true;
    } catch (error) {
      // // Log erros occurred during the API call or dispatching the action
      console.log(error);

      // Return false if the interview cancellation fails
      return false;
    }
  };

  return {
    state,
    setDay,
    bookInterview,
    cancelInterview,
  };
}
