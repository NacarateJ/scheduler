import reducer from "./application";

describe("Application Reducer", () => {
  it("thows an error with an unsupported type", () => {
    const state = {};
    const action = { type: null };

    expect(() => reducer(state, action)).toThrowError(
      /Tried to reduce with unsupported action type:/i
    );
  });
});