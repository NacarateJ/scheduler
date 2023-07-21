export default function getAppointmentsForDay(state, day) {
  // Find the object in the state.days arr that matches day name
  const selectedDay = state.days.find((d) => d.name === day);

  if (!selectedDay || selectedDay.appointments.length === 0) {
    return [];
  }

  // Retrieve the appointments array
  return selectedDay.appointments.map((appointmentId) => {
    // The map method will create a new array containing the appointment objects for that day
    return state.appointments[appointmentId];
  });
};