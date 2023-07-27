import { useState, useEffect } from "react";
import axios from "axios";

export default function useApplicationData() {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {},
  });

  const setDay = (day) => setState({ ...state, day });

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

      setState((prev) => ({
        ...prev,
        days: daysResponse.data,
        appointments: appointmentsResponse.data,
        interviewers: interviewersResponse.data,
      }));
    });
  }, []);

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

      // Update state with new appointments
      setState({ ...state, appointments });

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

      // Update state with new appointments
      setState({ ...state, appointments });

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