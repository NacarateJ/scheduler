/**
 * Updates the number of spots available for each day based on appointments.
 *
 * This function takes the current state of the application and calculates
 * the number of available spots for each day by iterating through the
 * appointments. It counts the appointments that do not have an interview
 * scheduled and updates the 'spots' property of each day accordingly.
 *
 * @param {Object} state The current state of the application.
 * @property {Array} state.days An array of day objects representing different days.
 * @property {Object} state.appointments An object containing appointment details.
 *
 * @return {Array} An array of day objects with updated spot counts.
 */
export default function updateSpots(state) {
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
}
