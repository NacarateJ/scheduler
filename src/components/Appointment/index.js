import React from "react";

import "components/Appointment/styles.scss";

import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import Form from "./Form";
import Status from "./Status";
import Confirm from "./Confirm";

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

    try {
      await bookInterview(id, interview);
      transition(SHOW);
    } catch (error) {
      console.log(error);
    }
  };

  const onDelete = async () => {
    transition(DELETE);

    try {
      await cancelInterview(id);
      transition(EMPTY);
    } catch (error) {
      console.log(error);
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
      {mode === SAVE && <Status message="Saving" />}
      {mode === CONFIRM && (
        <Confirm
          message="Are you sure you'd like to delete this appointment?"
          onConfirm={onDelete}
          onCancel={back}
        />
      )}
      {mode === DELETE && <Status message="Deleting" />}
      {mode === EDIT && (
        <Form
          interviewers={interviewers}
          studentName={studentName}
          onSave={onSave}
          onCancel={back}
        />
      )}
    </article>
  );
};