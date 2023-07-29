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

      dispatch( {
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
    try {
      // Make PUT request
      await axios.put(`/api/appointments/${id}`, { interview });

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
      dispatch({type: SET_APPLICATION_DATA, days: updateSpots(newState), appointments, interviewers: newState.interviewers})

      return true;
    } catch (error) {
      console.log(error);

      return false;
    }
  };

  // Delete interview
  const cancelInterview = async (id) => {
    try {
      // Send a DELETE request to the server to remove the interview data
      await axios.delete(`/api/appointments/${id}`);

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
}