import { useReducer, useEffect } from "react";
import axios from "axios";

const SET_DAY = "SET_DAY";
const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
const SET_INTERVIEW = "SET_INTERVIEW";

// Updates the state based on dispatched actions
function reducer(state, action) {
  if (action.type === SET_DAY) {
    return { ...state, day: action.day };
  }

  if (action.type === SET_APPLICATION_DATA) {
    return {
      ...state,
      days: action.days,
      appointments: action.appointments,
      interviewers: action.interviewers,
    };
  }

  if (action.type === SET_INTERVIEW) {
    const interview = action.interview;

    const appointment = state.appointments[action.id];

    appointment.interview = interview;

    const appointments = {...state.appointments, [action.id]: appointment};

      return {
        ...state,
        appointments,
      };
  }

  return new Error(
    `Tried to reduce with unsupported action type: ${action.type}`
  );
}

export default function useApplicationData() {
  const [state, dispatch] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {},
  });

  // Change selected day
  const setDay = (day) => dispatch({ type: SET_DAY, day });

  // Make a connection to the WebSocket server using the useEffect method
  useEffect(() => {
    // Establish the WebSocket connection
    const newSocket = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);

    // Set up event handlers for WebSocket interactions
    // Send message from client to server
    newSocket.onopen = () => {
      newSocket.send("ping");

      console.log("WebSocket connection established.");
    };

    // Send message from server to client
    newSocket.onmessage = (event) => {
      // Handle WebSocket message here
      const data = JSON.parse(event.data);
      
      console.log(`Message Received: ${data}`);

      if (data.type === "SET_INTERVIEW") {
        // Update the state with the new interview data received from the server
        const { id, interview } = data;

        // Find the appointment with the given id
        const updatedAppointments = {
          ...state.appointments,
          [id]: {
            ...state.appointments[id],
            interview: interview ? { ...interview } : null,
          },
        };

        // Update the state with the updated appointment data
        dispatch({
          type: SET_APPLICATION_DATA,
          days: updateSpots({ ...state, appointments: updatedAppointments }),
          appointments: updatedAppointments,
          interviewers: { ...state.interviewers },
        });
      }
    };

   return () => {
     // Close the WebSocket connection when the component is unmounted
     newSocket.close();
     console.log("WebSocket connection closed.");
   };
  }, [state]);

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

  // Update the number of spots for each day
  const updateSpots = (state) => {
    const updatedDays = state.days.map((day) => {
      const spots = day.appointments.reduce((count, appointmentId) => {
        if (!state.appointments[appointmentId].interview) {
          return count + 1;
        }
        return count;
      }, 0);

      return { ...day, spots };
    });

    return updatedDays;
  };

  // Book interview
  const bookInterview = async (id, interview) => {
    // Create a cancel token source for the axios request
    const cancelTokenSource = axios.CancelToken.source();

    try {
      // Make PUT request
      await axios.put(
        `/api/appointments/${id}`,
        { interview },
        { cancelToken: cancelTokenSource.token }
      );

      // Update the state with the new interview data
      const appointment = {
        ...state.appointments[id],
        interview: { ...interview },
      };

      // Create new appointments objct that includes the updated
      // appointment object and set it as the new appointments state
      const appointments = {
        ...state.appointments,
        [id]: appointment,
      };

      // Save updated state in a variable so updateSpots have access to it
      const newState = { ...state, appointments };

      // Update state with new appointments
      dispatch({ type: SET_INTERVIEW, id, interview });

      // Update the number of spots
      dispatch({
        type: SET_APPLICATION_DATA,
        days: updateSpots(newState),
        appointments,
        interviewers: newState.interviewers,
      });

      return true;
    } catch (error) {
      console.log(error);

      return false;
    }
  };

  // Delete interview
  const cancelInterview = async (id) => {
    // Create a cancel token source for the axios request
    const cancelTokenSource = axios.CancelToken.source();

    try {
      // Send a DELETE request to the server to remove the interview data
      await axios.delete(`/api/appointments/${id}`, {
        cancelToken: cancelTokenSource.token,
      });

      // Update the local state to set the interview data to null
      const appointment = {
        ...state.appointments[id],
        interview: null,
      };

      // Create new appointments objct that includes the updated
      // appointment object and set it as the new appointments state
      const appointments = {
        ...state.appointments,
        [id]: appointment,
      };

      // Save updated state in a variable so updateSpots have access to it
      const newState = { ...state, appointments };

      // Update state with new appointments
      dispatch({ type: SET_INTERVIEW, id, interview: null });

      // Update the number of spots
      dispatch({
        type: SET_APPLICATION_DATA,
        days: updateSpots(newState),
        appointments,
        interviewers: newState.interviewers,
      });

      return true;
    } catch (error) {
      console.log(error);

      return false;
    }
  };

  return {
    state,
    setDay,
    bookInterview,
    cancelInterview,
  };
};