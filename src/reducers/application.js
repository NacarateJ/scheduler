// Updates the state based on dispatched actions
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
    const interview = action.interview ? action.interview : null;

    const appointment = {
      ...state.appointments[action.id],
      interview: { ...interview },
    };

    const appointments = { ...state.appointments, [action.id]: appointment };

    return {
      ...state,
      appointments,
    };
  }

  throw new Error(
    `Tried to reduce with unsupported action type: ${action.type}`
  );
}

export const SET_DAY = "SET_DAY";
export const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
export const SET_INTERVIEW = "SET_INTERVIEW";
