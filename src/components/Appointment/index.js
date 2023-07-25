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
}) {
  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const SAVING = "SAVING";
  const DELETING = "DELETING";
  const CONFIRMING = "CONFIRMING";

  const { mode, transition, back } = useVisualMode(interview ? SHOW : EMPTY);

  const save = async (name, interviewer) => {
    // Check if both name and interviewer are provided
    if (!name || !interviewer) {
      alert("Please enter your name and select an interviewer.");
      return;
    }

    const interview = {
      student: name,
      interviewer,
    };

    transition(SAVING);

    await bookInterview(id, interview);

    transition(SHOW);
  };

  const onDelete = async () => {
    transition(DELETING);

    try {
      await cancelInterview(id);
      transition(EMPTY)
    } catch (error) {
      console.log(error)
    }

  }

  return (
    <article className="appointment">
      <Header time={time} />
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SHOW && (
        <Show
          student={interview.student}
          interviewer={interview.interviewer}
          onDelete={() => transition(CONFIRMING)}
        />
      )}
      {mode === CREATE && (
        <Form interviewers={interviewers} onSave={save} onCancel={back} />
      )}
      {mode === SAVING && <Status message="Saving" />}
      {mode === CONFIRMING && (
        <Confirm
          message="Are you sure you'd like to delete this appointment?"
          onConfirm={onDelete}
          onCancel={back}
        />
      )}
      {mode === DELETING && <Status message="Deleting" />}
    </article>
  );
};