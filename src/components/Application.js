import React, { useState, useEffect } from "react";
import axios from "axios";

import "components/Application.scss";

import DayList from "./DayList";
import Appointment from "./Appointment";

import {
  getAppointmentsForDay,
  getInterview,
  getInterviewersForDay,
} from "../helpers/selectors";

export default function Application() {
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

  // Get appointments for the currently selected day
  const appointments = getAppointmentsForDay(state, state.day);

  // Get interviewers for the currently selected day
  const interviewers = getInterviewersForDay(state, state.day);

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
    } catch (error) {
      console.log(error);
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
     } catch (error) {
       console.log(error);
     }
   };

  // Create the schedule by mapping each appointment to its corresponding interview
  const schedule = appointments.map((appointment) => {
    const interview = getInterview(state, appointment.interview);

    return (
      <Appointment
        key={appointment.id}
        id={appointment.id}
        time={appointment.time}
        interview={interview}
        interviewers={interviewers}
        bookInterview={bookInterview}
        cancelInterview={cancelInterview}
        studentName={interview !== null && interview.student}
      />
    );
  });

  return (
    <main className="layout">
      <section className="sidebar">
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <DayList days={state.days} value={state.day} onChange={setDay} />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">
        {schedule}
        <Appointment key="last" time="5pm" />
      </section>
    </main>
  );
};
