// Update the number of spots for each day
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
};
