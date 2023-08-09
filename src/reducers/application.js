import updateSpots from "helpers/updateSpots";

export default function reducer(state, action) {
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
    const appointment = {
      ...state.appointments[action.id],
      interview: action.interview,
    };

    const appointments = {
      ...state.appointments,
      [action.id]: appointment,
    };
    
    const days = updateSpots({ ...state, appointments });

    return {
      ...state,
      appointments,
      days,
    };
  }

  throw new Error(
    `Tried to reduce with unsupported action type: ${action.type}`
  );
}

export const SET_DAY = "SET_DAY";
export const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
export const SET_INTERVIEW = "SET_INTERVIEW";
