import React from "react";

import "components/Appointment/styles.scss";

import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import Form from "./Form";
import Status from "./Status";
import Confirm from "./Confirm";
import Error from "./Error";

import useVisualMode from "hooks/useVisualMode";


export default function Appointment({
  id,
  time,
  interview,
  interviewers,
  bookInterview,
  cancelInterview,
  studentName,
}) {
  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const SAVE = "SAVE";
  const DELETE = "DELETE";
  const CONFIRM = "CONFIRM";
  const EDIT = "EDIT";
  const ERROR_SAVE = "ERROR_SAVE";
  const ERROR_DELETE = "ERROR_DELETE";

  const { mode, transition, back } = useVisualMode(interview ? SHOW : EMPTY);

  const onSave = async (name, interviewer) => {
    // Check if both name and interviewer are provided
    if (!name || !interviewer) {
      alert("Please enter your name and select an interviewer.");
      return;
    }

    const interview = {
      student: name,
      interviewer,
    };

    transition(SAVE);

    const result = await bookInterview(id, interview);
    
    if (result) {
      transition(SHOW);
    } else {
      transition(ERROR_SAVE, true);
    }
  };

  const onDelete = async () => {
    transition(DELETE, true);

    const result = await cancelInterview(id);

    if (result) {
      transition(EMPTY);
    } else {
      transition(ERROR_DELETE, true);
    }
  };

  return (
    <article className="appointment">
      <Header time={time} />
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SHOW && (
        <Show
          student={interview.student}
          interviewer={interview.interviewer}
          showConfirmation={() => transition(CONFIRM)}
          onEdit={() => transition(EDIT)}
        />
      )}
      {mode === CREATE && (
        <Form interviewers={interviewers} onSave={onSave} onCancel={back} />
      )}
      {mode === EDIT && (
        <Form
          interviewers={interviewers}
          studentName={studentName}
          onSave={onSave}
          onCancel={back}
        />
      )}
      {mode === ERROR_SAVE && (
        <Error message="Could not save the appointment." onClose={back} />
      )}
      {mode === ERROR_DELETE && (
        <Error message="Could not delete the appointment." onClose={back} />
      )}
      {mode === SAVE && <Status message="Saving" />}
      {mode === DELETE && <Status message="Deleting" />}
      {mode === CONFIRM && (
        <Confirm
          message="Are you sure you'd like to delete this appointment?"
          onConfirm={onDelete}
          onCancel={back}
        />
      )}
    </article>
  );
};