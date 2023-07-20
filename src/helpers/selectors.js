export function getAppointmentsForDay(state, day) {
  // Find the object in the state.days arr that matches day name
  const selectedDay = state.days.find((d) => d.name === day);

  if (!selectedDay || selectedDay.appointments.length === 0) {
    return [];
  }

  // Retrieve the appointments array,
  // the map method will create a new array containing the appointment objects
  return selectedDay.appointments.map((appointmentId) => {
    return state.appointments[appointmentId];
  });
};