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

    // Update state
    setState((prev) => ({ ...prev, days: updatedDays }));
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
      setState(newState);

      // Update the number of spots 
      updateSpots(newState);

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
      setState(newState);

      // Update the number of spots 
      updateSpots(newState);

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