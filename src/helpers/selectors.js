/**
 * Retrieves an array of appointments for a given day.
 * 
 * @param {Object} state The application state containing appointments and days data.
 * @param {string} day The name of the day for which to retrieve appointments.
 * @return {Array} An array of appointment objects for the specified day.
 */
export function getAppointmentsForDay(state, day) {
  // Find the object in the state.days arr that matches day name
  const selectedDay = state.days.find((d) => d.name === day);

  if (!selectedDay || selectedDay.appointments.length === 0) {
    return [];
  }

  // Retrieve the appointments array
  return selectedDay.appointments.map((appointmentId) => {
    
    return state.appointments[appointmentId];
  });
}

/**
 * Retrieves the interview data along with interviewer's information if available.
 *
 * @param {Object} state The application state containing appointments, interviewers, and days data.
 * @param {Object} interview The interview object containing student and interviewer information.
 * @return {Object|null} An object containing interview data and interviewer's information, or null if no valid interview or interviewer found.
 */
export function getInterview(state, interview) {
  // Check if the interview is not null and contains a valid interviewer ID
  if (interview && interview.interviewer) {
    // Extract the interviewer ID from the interview
    const interviewerId = interview.interviewer;

    // Get the interviewer's information from the state
    const interviewer = state.interviewers[interviewerId];

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
 
  return null;
}

/**
 * Retrieves an array of interviewers for a given day.
 *
 * @param {Object} state The application state containing interviewers and days data.
 * @param {string} day The name of the day for which to retrieve interviewers.
 * @return {Array} An array of interviewer objects for the specified day.
 */
export function getInterviewersForDay(state, day) {
  // Find the object in the state.days arr that matches day name
  const selectedDay = state.days.find((d) => d.name === day);

  if (!selectedDay || selectedDay.interviewers.length === 0) {
    return [];
  }

  // Retrieve the interviewers array
  return selectedDay.interviewers.map((interviewerId) => {
    
    return state.interviewers[interviewerId];
  });
}
