import React from "react";
import axios from "axios";

import {
  render,
  cleanup,
  waitForElement,
  fireEvent,
  getByText,
  queryByText,
  getByAltText,
  queryByAltText,
  getAllByTestId,
  getByPlaceholderText,
} from "@testing-library/react";

import Application from "components/Application";

afterEach(cleanup);

describe("Application", () => {
  it("changes the schedule when a new day is selected", async () => {
    const { getByText } = render(<Application />);

    await waitForElement(() => getByText("Monday"));

    fireEvent.click(getByText("Tuesday"));

    expect(getByText("Leopold Silvers")).toBeInTheDocument();
  });



  it("loads data, books an interview and reduces the spots remaining for the first day by 1", async () => {
    const { container } = render(<Application />);

    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments[0];

    fireEvent.click(getByAltText(appointment, "Add"));

    fireEvent.change(getByPlaceholderText(appointment, /Enter Student Name/i), {
      target: { value: "Lydia Miller-Jones" },
    });

    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));

    fireEvent.click(getByText(appointment, "Save"));

    expect(getByText(appointment, "Saving")).toBeInTheDocument();

    await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));

    const day = getAllByTestId(container, "day").find((day) =>
      queryByText(day, "Monday")
    );

    expect(queryByText(day, "no spots remaining")).toBeInTheDocument();
  });



  it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {
    // 1. Render the Application.
    const { container, debug } = render(<Application />);

    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));

    // Find the appointment for "Archie Cohen".
    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments.find((appt) =>
      queryByText(appt, "Archie Cohen")
    );

    // 3. Click the "Delete" button on the booked appointment.
    fireEvent.click(queryByAltText(appointment, "Delete"));

    // 4. Check that the confirmation message is shown.
    expect(
      getByText(
        appointment,
        "Are you sure you'd like to delete this appointment?"
      )
    ).toBeInTheDocument();

    // 5. Click the "Confirm" button on the confirmation.
    fireEvent.click(queryByText(appointment, "Confirm"));

    // 6. Check that the element with the text "Deleting" is displayed.
    expect(getByText(appointment, "Deleting")).toBeInTheDocument();

    // 7. Wait until the element with the "Add" button is displayed.
    await waitForElement(() => getByAltText(appointment, "Add"));

    expect(getByAltText(appointment, "Add"));

    // 8. Check that the DayListItem with the text "Monday" also has the text "2 spots remaining".
    const day = getAllByTestId(container, "day").find((day) =>
      queryByText(day, "Monday")
    );

    expect(getByText(day, "2 spots remaining")).toBeInTheDocument();

    debug();
  });



  // it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {
  //   // 1. Render the Application.
  //   const { container, debug } = render(<Application />);

  //   // 2. Wait until the text "Archie Cohen" is displayed.
  //   await waitForElement(() => getByText(container, "Lydia Miller-Jones"));

  //   // Find the appointment for "Lydia Miller-Jones".
  //   const appointments = getAllByTestId(container, "appointment");
  //   const appointment = appointments.find((appt) =>
  //     queryByText(appt, "Lydia Miller-Jones")
  //   );

  //   // 3. Click the "Edit" button on the booked appointment.
  //   fireEvent.click(queryByAltText(appointment, "Edit"));

  //   // 4. Edit student name
  //   fireEvent.change(getByPlaceholderText(appointment, /Enter Student Name/i), {
  //     target: { value: "Jackie" },
  //   });

  //   // 5. Select interviewer
  //   fireEvent.click(getByAltText(appointment, "Tori Malcolm"));

  //   // 6. Click the "Save" button on the confirmation.
  //   fireEvent.click(queryByText(appointment, "Save"));

  //   // 7. Check that the element with the text "Saving" is displayed.
  //   expect(getByText(appointment, "Saving")).toBeInTheDocument();

  //   // 8. Wait until the element with the "Add" button is displayed.
  //   await waitForElement(() => getByText(appointment, "Jackie"));

  //   const day = getAllByTestId(container, "day").find((day) =>
  //     queryByText(day, "Monday")
  //   );

  //   expect(queryByText(day, "1 spot remaining")).toBeInTheDocument();

  //   // debug();
  // });



  // it("shows the save error when failing to save an appointment", async () => {
  //   axios.put.mockRejectedValueOnce(new Error("Failed to save appointment"));

  //   const { container } = render(<Application />);

  //   await waitForElement(() => getByText(container, "Jackie"));

  //   const appointments = getAllByTestId(container, "appointment");
  //   const appointment = appointments.find((appt) =>
  //     queryByText(appt, "Jackie")
  //   );

  //   fireEvent.click(queryByAltText(appointment, "Edit"));

  //   fireEvent.change(getByPlaceholderText(appointment, /Enter Student Name/i), {
  //     target: { value: "Anne Jones" },
  //   });

  //   fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));

  //   fireEvent.click(queryByText(appointment, "Save"));

  //   await waitForElement(() =>
  //     getByText(appointment, "Could not save the appointment.")
  //   );
  // });



  //  it("shows the delete error when failing to delete an existing appointment", async () => {
  //    axios.delete.mockRejectedValueOnce(
  //      new Error("Failed to delete appointment")
  //    );

  //    const { container } = render(<Application />);

  //    await waitForElement(() => getByText(container, "Jackie"));

  //    const appointments = getAllByTestId(container, "appointment");
  //    const appointment = appointments.find((appt) =>
  //      queryByText(appt, "Jackie")
  //    );

  //    fireEvent.click(queryByAltText(appointment, "Delete"));

  //    expect(getByText(appointment, "Are you sure you'd like to delete this appointment?")).toBeInTheDocument();

  //   fireEvent.click(queryByText(appointment, "Confirm"));

  //    await waitForElement(() =>
  //      getByText(appointment, "Could not delete the appointment.")
  //    );
  //  });
});
