/////////////////////////////////////////////////////////////////////////////////
/// getAppointmentsForDay
/////////////////////////////////////////////////////////////////////////////////

export function getAppointmentsForDay(state, day) {
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
}

/////////////////////////////////////////////////////////////////////////////////
/// getInterview
/////////////////////////////////////////////////////////////////////////////////

export function getInterview(state, interview) {
  // Check if the interview is not null and contains a valid interviewer ID
  if (interview && interview.interviewer) {
    // Extract the interviewer ID from the interview
    const interviewerId = interview.interviewer;

    // Get the interviewer's information from the state
    const interviewer = state.interviewers[interviewerId];

    // Return a new object (if interviewer exists) containing the interview data and interviewer's information
    if (interviewer) {
      return {
        student: interview.student,
        interviewer: {
          id: interviewer.id,
          name: interviewer.name,
          avatar: interviewer.avatar,
        },
      };
    }
  }
 
  // Return null if no interview is booked, interviewer data is missing, or the interview itself is null
  return null;
}
